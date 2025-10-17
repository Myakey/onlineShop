// src/services/authService.js
import axios from "axios";


const rootURL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const authApi = axios.create({
  baseURL: `${rootURL}/auth`,
  headers: { "Content-Type": "application/json" },
});
const api = authApi;

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const authService = {
  /** LOGIN */
  async login(credentials) {
    const { data } = await api.post("/login", credentials);
    return data;
  },

  /** REGISTER */
  async register(userData) {
    const { data } = await api.post("/register", userData);
    return data;
  },

  /** GET PROFILE */
  async getProfile() {
    const { data } = await api.get("/profile");
    return data;
  },

  /** UPDATE PROFILE */
  async updateProfile(profileData) {
    const { data } = await api.put("/profile", profileData);
    return data;
  },

  /** LOGOUT */
  async logout() {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await api.post("/logout", { refreshToken });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
  },

  /** AUTH HELPERS */
  isAuthenticated() {
    return !!(localStorage.getItem("accessToken") && localStorage.getItem("user"));
  },

  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  isAdmin() {
    const user = this.getCurrentUser();
    return user && user.type === "admin";
  },

  /** REFRESH TOKEN */
  async refreshToken() {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("No refresh token available!");

    try {
      const { data } = await axios.post(`${rootURL}/auth/refresh-token`, { refreshToken });
      localStorage.setItem("accessToken", data.accessToken);
      return data.accessToken;
    } catch (error) {
      this.logout();
      throw error;
    }
  },

  /** EMAIL VERIFICATION */
  async verifyEmail(data) {
    const res = await axios.post(`${rootURL}/auth/verify-email`, data);
    return res.data;
  },

  async resendOTP(data) {
    const res = await axios.post(`${rootURL}/auth/resend-otp`, data);
    return res.data;
  },

  /** ADDRESS MANAGEMENT */
  async getAddresses() {
    const { data } = await api.get("/addresses");
    return data;
  },

  async addAddress(addressData) {
    const { data } = await api.post("/addresses", addressData);
    return data;
  },

  async updateAddress(addressId, addressData) {
    const { data } = await api.put(`/addresses/${addressId}`, addressData);
    return data;
  },

  async deleteAddress(addressId) {
    const { data } = await api.delete(`/addresses/${addressId}`);
    return data;
  },

  /** LOCATION DATA */
  async getProvinces() {
    const { data } = await axios.get(`${rootURL}/auth/provinces`);
    return data;
  },

  async getCities(provinceId) {
    const { data } = await axios.get(`${rootURL}/auth/provinces/${provinceId}/cities`);
    return data;
  },

  async getDistricts(cityId) {
    const { data } = await axios.get(`${rootURL}/auth/cities/${cityId}/districts`);
    return data;
  },

  /** PROFILE IMAGE UPLOAD */
  async uploadProfileImage(formData) {
    const { data } = await api.post("/upload-profile-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  /** TOKEN VALIDATION */
  async validateToken() {
    try {
      const { data } = await api.get("/profile");
      return { valid: true, user: data.user };
    } catch (error) {
      if ([401, 403].includes(error.response?.status)) {
        return { valid: false, user: null };
      }
      throw error;
    }
  },
};

export default authService;
