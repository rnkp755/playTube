import axios from "axios";
import { SERVER_URL } from "./constants";

// Create the Axios instance
const API = axios.create({
	baseURL: SERVER_URL,
	withCredentials: true, // Crucial for sending HttpOnly cookies
});

// OPTIONAL: Intercept 401 errors and auto-retry using refresh cookie
API.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		// If token expired and we haven't already retried
		if (
			error.response?.status === 401 &&
			!originalRequest._retry &&
			!originalRequest.url.includes("/users/refresh-access-token")
		) {
			originalRequest._retry = true;

			try {
				// Attempt to refresh token using cookie
				await axios.get(`${SERVER_URL}/users/refresh-access-token`, {
					withCredentials: true,
				});

				// Retry the original request
				return API(originalRequest);
			} catch (refreshError) {
				console.error("Refresh token failed", refreshError);
				// Optionally redirect to login or clear session here
			}
		}

		return Promise.reject(error);
	}
);

export default API;
