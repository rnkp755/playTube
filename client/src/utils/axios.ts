import axios from "axios";
import { SERVER_URL } from "./constants";

// Create the Axios instance
const API = axios.create({
	baseURL: SERVER_URL,
	withCredentials: true, // Crucial for sending HttpOnly cookies
});

// Add response interceptor to handle token refresh automatically
API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                await API.post('/users/refresh-access-token', {}, {
                    withCredentials: true
                });
                
                // Retry the original request
                return API(originalRequest);
            } catch (refreshError) {
                // Refresh failed, redirect to login
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);

export default API;
