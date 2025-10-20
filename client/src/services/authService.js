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

// ✅ SECURITY FIX: Helper to sanitize user data before storing
const sanitizeUserData = (user) => {
  return {
    id: user.id,
    username: user.username,
    type: user.type,
    firstName: user.firstName,
    lastName: user.lastName,
    emailVerified: user.emailVerified,
    profileImageUrl: user.profileImageUrl
    // ❌ Explicitly exclude sensitive data:
    // - addresses
    // - phoneNumber
    // - email
    // - profileImageUrl (can be fetched when needed)
  };
};

const authService = {
  /** LOGIN - SECURE VERSION */
  async login(credentials) {
    const { data } = await api.post("/login", credentials);
    
    // Store tokens
    if (data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
    }
    if (data.refreshToken) {
      localStorage.setItem("refreshToken", data.refreshToken);
    }
    
    // ✅ SECURITY FIX: Only store sanitized user data
    if (data.user) {
      const safeUser = sanitizeUserData(data.user);
      localStorage.setItem("user", JSON.stringify(safeUser));
    }
    
    return data;
  },

  /** REGISTER - SECURE VERSION */
  async register(userData) {
    const { data } = await api.post("/register", userData);
    
    // Store tokens if provided after registration
    if (data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
    }
    if (data.refreshToken) {
      localStorage.setItem("refreshToken", data.refreshToken);
    }
    
    // ✅ SECURITY FIX: Only store sanitized user data
    if (data.user) {
      const safeUser = sanitizeUserData(data.user);
      localStorage.setItem("user", JSON.stringify(safeUser));
    }
    
    return data;
  },

  /** GET PROFILE - Returns full profile data (use in React state only) */
  async getProfile() {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      // 🚫 Skip API call if not logged in
      console.warn("Skipping profile fetch — user not logged in.");
      return null;
    }

    try {
      const { data } = await api.get("/profile");
      return data;
    } catch (error) {
      if (error.response?.status === 401) {
        console.warn("Access token invalid or expired.");
      } else {
        console.error("Error fetching profile:", error);
      }
      return null;
    }
  },

  /** UPDATE PROFILE - SECURE VERSION */
  async updateProfile(profileData) {
    const { data } = await api.put("/profile", profileData);
    
    // ✅ SECURITY FIX: Update localStorage with sanitized data only
    if (data.user) {
      const safeUser = sanitizeUserData(data.user);
      localStorage.setItem("user", JSON.stringify(safeUser));
    }
    
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
    return !!localStorage.getItem("accessToken");
  },

  getToken() {
    return localStorage.getItem("accessToken");
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

  /** ADDRESS MANAGEMENT - Fetch on demand, don't store in localStorage */
  async getAddresses() {
    const { data } = await api.get("/addresses");
    // ⚠️ Use this data in React state, NOT localStorage
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

  /** PROFILE IMAGE UPLOAD - SECURE VERSION */
  async uploadProfileImage(formData) {
    const { data } = await api.post("/upload-profile-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    
    // ✅ SECURITY FIX: Update localStorage with sanitized data
    if (data.user) {
      const safeUser = sanitizeUserData(data.user);
      localStorage.setItem("user", JSON.stringify(safeUser));
    }
    
    return data;
  },

  /** TOKEN VALIDATION - SECURE VERSION */
  async validateToken() {
    try {
      const { data } = await api.get("/profile");
      
      // ✅ SECURITY FIX: Return sanitized user data
      const safeUser = data.user ? sanitizeUserData(data.user) : null;
      
      return { valid: true, user: safeUser };
    } catch (error) {
      if ([401, 403].includes(error.response?.status)) {
        return { valid: false, user: null };
      }
      throw error;
    }
  },
};

export default authService;
