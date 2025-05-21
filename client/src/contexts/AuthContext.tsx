import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "../types";
import API from "../utils/axios";
import { SERVER_URL } from "../utils/constants";

interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (email: string, password: string) => Promise<void>;
	signup: (userData: any) => Promise<void>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const initializeAuth = async () => {
			try {
				const res = await API.get(`${SERVER_URL}/current-user`, {
					withCredentials: true,
				});
				if (res.status != 200) {
					throw new Error("Failed to refresh token");
				}
			} catch (err) {
				console.warn("Session refresh failed", err);
				logout(); // Ensure session is clean if refresh fails
			} finally {
				setIsLoading(false);
			}
		};

		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			setUser(JSON.parse(storedUser));
		}

		initializeAuth();
	}, []);

	const login = async (email: string, password: string) => {
		setIsLoading(true);
		try {
			const response = await API.post(`${SERVER_URL}/users/login`, {
				email,
				password,
			});
			if (response.status != 200) {
				return Promise.reject(new Error("Invalid credentials"));
			}
			const user = response.data.data?.user;
			await localStorage.setItem("user", JSON.stringify(user));
			setUser(user);
		} finally {
			setIsLoading(false);
		}
	};

	const signup = async (userData: any) => {
		setIsLoading(true);
		try {
			const formData = new FormData();
			for (const key in userData) {
				formData.append(key, userData[key]);
			}
			const response = await API.post(
				`${SERVER_URL}/users/register`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
			if (response.status != 201) {
				return Promise.reject(new Error("User registration failed"));
			}
			const user = response.data.user;
			await localStorage.setItem("user", JSON.stringify(user));
			setUser(user);
		} finally {
			setIsLoading(false);
		}
	};

	const logout = async () => {
		try {
			const response = await API.post(`${SERVER_URL}/users/logout`, {
				withCredentials: true,
			});
			if (response.status != 200) {
				return Promise.reject(new Error("Logout failed"));
			}
			localStorage.removeItem("user");
			setUser(null);
		} catch (error) {
			console.log("Error while logging out", error);
		}
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated: !!user,
				isLoading,
				login,
				signup,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
