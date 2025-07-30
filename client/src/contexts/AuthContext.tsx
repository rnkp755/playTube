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
				// Check if we have user data in localStorage first
				const storedUser = localStorage.getItem("user");
				if (storedUser) {
					try {
						const parsedUser = JSON.parse(storedUser);
						setUser(parsedUser);
					} catch (parseError) {
						console.warn(
							"Invalid user data in localStorage, clearing..."
						);
						localStorage.removeItem("user");
					}
				}

				// Use the new auth-status endpoint that doesn't trigger infinite loops
				const res = await API.get(`/users/auth-status`, {
					withCredentials: true,
				});

				if (res.status === 200) {
					const { user: currentUser, isAuthenticated } =
						res.data.data;
					if (isAuthenticated && currentUser) {
						setUser(currentUser);
						localStorage.setItem(
							"user",
							JSON.stringify(currentUser)
						);
					} else {
						// User is not authenticated
						localStorage.removeItem("user");
						setUser(null);
					}
				}
			} catch (err) {
				console.warn("Session check failed", err);
				// Clear any stale data but don't show error to user
				localStorage.removeItem("user");
				setUser(null);
			} finally {
				setIsLoading(false);
			}
		};

		initializeAuth();
	}, []);

	const login = async (email: string, password: string) => {
		setIsLoading(true);
		try {
			const response = await API.post(`/users/login`, {
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
			const response = await API.post(`/users/register`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
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
			// Only call server logout if user is currently authenticated
			if (user) {
				const response = await API.post(
					`/users/logout`,
					{},
					{
						withCredentials: true,
					}
				);
				if (response.status != 200) {
					console.warn(
						"Logout API call failed, but clearing local state"
					);
				}
			}
		} catch (error) {
			console.log("Error while logging out", error);
			// Even if logout fails on server, clear local state
		} finally {
			// Always clear local state regardless of server response
			localStorage.removeItem("user");
			setUser(null);
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
