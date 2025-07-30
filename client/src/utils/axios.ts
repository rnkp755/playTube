import axios from "axios";
import { SERVER_URL } from "./constants";

// Create the Axios instance
const API = axios.create({
	baseURL: SERVER_URL,
	withCredentials: true, // Crucial for sending HttpOnly cookies
});

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
	failedQueue.forEach(({ resolve, reject }) => {
		if (error) {
			reject(error);
		} else {
			resolve(token);
		}
	});

	failedQueue = [];
};

// Add response interceptor to handle token refresh automatically
API.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			if (isRefreshing) {
				// If already refreshing, queue this request
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				})
					.then(() => {
						return API(originalRequest);
					})
					.catch((err) => {
						return Promise.reject(err);
					});
			}

			originalRequest._retry = true;
			isRefreshing = true;

			try {
				const refreshResponse = await API.post(
					"/users/refresh-access-token",
					{},
					{
						withCredentials: true,
					}
				);

				// Only retry if refresh was successful
				if (refreshResponse.status === 200) {
					processQueue(null, "token");
					return API(originalRequest);
				}
			} catch (refreshError) {
				processQueue(refreshError, null);

				// Refresh failed, clear any stored user data
				localStorage.removeItem("user");

				// Only redirect if we're not already on auth pages
				if (
					!window.location.pathname.includes("/login") &&
					!window.location.pathname.includes("/signup")
				) {
					window.location.href = "/login";
				}
				return Promise.reject(refreshError);
			} finally {
				isRefreshing = false;
			}
		}

		return Promise.reject(error);
	}
);

export default API;
