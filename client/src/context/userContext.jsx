import { createContext, useContext, useEffect, useState } from "react";
import authService from "../services/authService"; // adjust path
import { useLocation } from "react-router-dom";

const UserContext = createContext();



export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  // Load profile and check authentication
  const loadProfileData = async () => {
    setLoading(true);
    try {
      // First, validate token & user
      const { valid, user } = await authService.validateToken();

      if (valid && user) {
        setUser(user);
        setIsAuthenticated(true);

        // cache user in localStorage (optional)
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  };

  // Run on mount
  useEffect(() => {
    loadProfileData();
  }, [location]);

  // Logout handler
  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loading,
        isAuthenticated,
        login: authService.login,
        register: authService.register,
        logout,
        refreshToken: authService.refreshToken,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

