import axios from "axios";
import { API_TIMEOUT, API_URL } from "../config";
import { useUserStore } from "../store/userStore";

const api = axios.create({
    baseURL: API_URL,
    timeout: API_TIMEOUT,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add bearer token
api.interceptors.request.use(
    (config) => {
        const bearerToken = useUserStore.getState().bearerToken;
        if (bearerToken) {
            if (config.headers) {
                config.headers['Authorization'] = bearerToken;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add interceptor error
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.data?.error) {
            alert(error.response.data.error);
        }
        return Promise.reject(error);
    }
);

export default api;