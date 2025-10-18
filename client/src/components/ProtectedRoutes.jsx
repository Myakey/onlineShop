// src/hooks/useAuthGuard.js
import { useEffect, useState } from "react";
import authService from "../services/authService";
import { Navigate, Outlet } from "react-router-dom";

// ✅ 1. Protected Route - SECURE VERSION
export function ProtectedRoute({ children }) {
  const [authState, setAuthState] = useState({ 
    isAuthenticated: false, 
    isLoading: true 
  });

  useEffect(() => {
    (async () => {
      try {
        const localAuth = authService.isAuthenticated();
        if (!localAuth) {
          return setAuthState({ isAuthenticated: false, isLoading: false });
        }

        const { valid, user } = await authService.validateToken();
        
        if (valid) {
          // ✅ validateToken now returns sanitized data automatically
          localStorage.setItem("user", JSON.stringify(user));
          setAuthState({ isAuthenticated: true, isLoading: false });
        } else {
          authService.logout();
          setAuthState({ isAuthenticated: false, isLoading: false });
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        authService.logout();
        setAuthState({ isAuthenticated: false, isLoading: false });
      }
    })();
  }, []);

  if (authState.isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!authState.isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view this page.</p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return <Outlet />;
}

// ✅ 2. Admin Route - SECURE VERSION
export function AdminRoute({ children }) {
  const [state, setState] = useState({ 
    isAuthorized: false, 
    isLoading: true 
  });

  useEffect(() => {
    (async () => {
      try {
        const localAuth = authService.isAuthenticated();
        if (!localAuth) {
          return setState({ isAuthorized: false, isLoading: false });
        }

        const { valid, user } = await authService.validateToken();
        
        if (valid && user?.type === "admin") {
          // ✅ validateToken now returns sanitized data automatically
          localStorage.setItem("user", JSON.stringify(user));
          setState({ isAuthorized: true, isLoading: false });
        } else {
          if (!valid) authService.logout();
          setState({ isAuthorized: false, isLoading: false });
        }
      } catch (err) {
        console.error("Admin auth check failed:", err);
        authService.logout();
        setState({ isAuthorized: false, isLoading: false });
      }
    })();
  }, []);

  if (state.isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!state.isAuthorized) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Admin Access Required</h2>
          <p className="text-gray-600 mb-6">You don't have permission to view this page.</p>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return children;
}

// ✅ 3. useAuth Hook - SECURE VERSION
export function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        if (authService.isAuthenticated()) {
          const { valid, user } = await authService.validateToken();
          setUser(valid ? user : null);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth validation failed:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.type === "admin",
    isBuyer: user?.type === "buyer",
  };
}

// ✅ 4. NEW: Hook to fetch full user profile (with addresses, phone, etc.)
export function useUserProfile() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await authService.getProfile();
      // ⚠️ Keep this data in React state ONLY, not localStorage
      setProfile(data.user);
    } catch (err) {
      console.error('Profile fetch failed:', err);
      setError(err.message);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authService.isAuthenticated()) {
      fetchProfile();
    } else {
      setIsLoading(false);
    }
  }, []);

  return {
    profile,
    isLoading,
    error,
    refetch: fetchProfile,
  };
}

// ✅ 5. NEW: Hook to fetch user addresses when needed
export function useUserAddresses() {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAddresses = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await authService.getAddresses();
      // ⚠️ Keep addresses in React state ONLY, not localStorage
      setAddresses(data);
    } catch (err) {
      console.error('Addresses fetch failed:', err);
      setError(err.message);
      setAddresses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addAddress = async (addressData) => {
    try {
      await authService.addAddress(addressData);
      await fetchAddresses(); // Refresh list
    } catch (err) {
      throw err;
    }
  };

  const updateAddress = async (addressId, addressData) => {
    try {
      await authService.updateAddress(addressId, addressData);
      await fetchAddresses(); // Refresh list
    } catch (err) {
      throw err;
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      await authService.deleteAddress(addressId);
      await fetchAddresses(); // Refresh list
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    if (authService.isAuthenticated()) {
      fetchAddresses();
    } else {
      setIsLoading(false);
    }
  }, []);

  return {
    addresses,
    isLoading,
    error,
    refetch: fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
  };
}
