import axios from "axios";
import authService from "../services/authService";

const rootURL = import.meta.env.VITE_API_URL;

// Main API client (for /api routes)
const api = axios.create({
  baseURL: `${rootURL}/api`,
  headers: { "Content-Type": "application/json" },
});

// Auth client (for /auth routes)
export const authApi = axios.create({
  baseURL: `${rootURL}/auth`,
  headers: { "Content-Type": "application/json" },
});

// Token interceptors (same as before)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Token refresh handler
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const { data } = await authApi.post("/refresh-token", { refreshToken });
          localStorage.setItem("accessToken", data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(originalRequest);
        }
      } catch (err) {
        authService.logout?.();
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
