import axios from 'axios';
import Cookies from 'js-cookie';
import { redirect } from 'react-router-dom';

const apiUrl = "/choreo-apis/awbo/backend/rest-api-be2/v1.0";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || apiUrl,
    withCredentials: true, 
    headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(
    (config) => {
        const accessToken = Cookies.get("access_token");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            Cookies.remove("access_token", { path: "/", domain: ".typingclub.tech" });
            Cookies.remove("refresh_token", { path: "/", domain: ".typingclub.tech" });            
            redirect("/login");
        }
        return Promise.reject(error);
    }
);

export default api;
