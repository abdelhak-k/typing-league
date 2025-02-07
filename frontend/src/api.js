import axios from 'axios';
import Cookies from 'js-cookie';
import refreshToken from './scripts/refreshToken';

const apiUrl = "/choreo-apis/awbo/backend/rest-api-be2/v1.0";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : apiUrl,
    withCredentials: true, 
    headers: {
        'Content-Type': 'application/json'
    }});

api.interceptors.request.use(
    (config) => {
        const accessToken = Cookies.get("access_token");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        } else {
            console.warn("No access token found in cookies");
        }

        const googleAccessToken = Cookies.get("google_access_token");
        if (googleAccessToken) {
            config.headers["X-Google-Access-Token"] = googleAccessToken;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
  
        try {
          const newAccessToken = await refreshToken();
          Cookies.set("access_token", newAccessToken, { secure: true, sameSite: "None" });
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }
  
      return Promise.reject(error);
    }
  );

export default api;
