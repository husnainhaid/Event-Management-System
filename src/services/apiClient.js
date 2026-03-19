import axios from "axios";
import { STORAGE_KEYS } from "../utils/constants";


const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
    timeout: 12000,
    headers: {
        "Content-Type": "application/json",
    },
});


apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);