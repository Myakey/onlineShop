import { createContext, useContext, useEffect, useState } from "react";
import authService from "../services/authService";
import { useLocation } from "react-router-dom";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // ✅ SECURITY FIX: Separate minimal user data from full profile data
  const [user, setUser] = useState(null); // Minimal safe data (for UI like navbar)
  const [fullProfile, setFullProfile] = useState(null); // Full profile data (fetched on demand)
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  // Load minimal user data on mount/location change
const loadMinimalUserData = async () => {
  setLoading(true);
  try {
    // ✅ Skip if no access token found
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      localStorage.removeItem("user");
      setLoading(false);
      return; // 🚫 Stop here
    }

    // ✅ Only run validation if token exists
    const { valid, user: userData } = await authService.validateToken();

    if (valid && userData) {
      const safeUser = {
        id: userData.id,
        username: userData.username,
        type: userData.type,
        firstName: userData.firstName,
        lastName: userData.lastName,
        emailVerified: userData.emailVerified,
        profileImageUrl: userData.profileImageUrl,
      };

      setUser(safeUser);
      setIsAuthenticated(true);
      setIsAdmin(userData.type === "admin");
      localStorage.setItem("user", JSON.stringify(safeUser));
    } else {
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      localStorage.removeItem("user");
    }
  } catch (error) {
    console.error("Failed to validate token:", error);
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    localStorage.removeItem("user");
  } finally {
    setLoading(false);
  }
};

  // ✅ NEW: Fetch full profile data (with email, phone, addresses) when needed
  const loadFullProfile = async () => {
    try {
      const response = await authService.getProfile();
      const profileData = response.user;
      
      // ⚠️ Store full profile in React state ONLY (not localStorage)
      setFullProfile(profileData);
      
      return profileData;
    } catch (error) {
      console.error("Failed to load full profile:", error);
      throw error;
    }
  };

  // Run on mount and location change
  useEffect(() => {
    // Only reload if we don't have user data
    if (!user) {
      loadMinimalUserData();
    }
  }, [location]);

  // Initial load
  useEffect(() => {
    loadMinimalUserData();
  }, []);

  // Logout handler
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setFullProfile(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  };

  // ✅ Secure login handler
  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      
      // authService.login already stores sanitized data
      // Just reload the minimal user data
      await loadMinimalUserData();
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  // ✅ Secure register handler
  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      
      // authService.register already stores sanitized data
      await loadMinimalUserData();
      
      return response;
    } catch (error) {
      throw error;
    }
  };

  // ✅ Update user context after profile changes
  const updateUserContext = async () => {
    await loadMinimalUserData();
  };

  return (
    <UserContext.Provider
      value={{
        // Minimal user data (always available, safe for UI)
        user,
        isAdmin,
        loading,
        isAuthenticated,
        
        // Full profile data (fetched on demand, not in localStorage)
        fullProfile,
        loadFullProfile,
        
        // Actions
        setUser,
        login,
        register,
        logout,
        updateUserContext, // Call this after updating profile/image
        refreshToken: authService.refreshToken,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
};