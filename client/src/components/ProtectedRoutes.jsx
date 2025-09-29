import { useEffect, useState } from 'react';
import authService from '../services/authService';

// 1. PROTECTED ROUTE WRAPPER - Use this to protect entire pages/routes
export function ProtectedRoute({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                if (!authService.isAuthenticated()) {
                    setIsAuthenticated(false);
                    setIsLoading(false);
                    return;
                }

                const validation = await authService.validateToken();
                
                if (validation.valid) {
                    setIsAuthenticated(true);
                    localStorage.setItem('user', JSON.stringify(validation.user));
                } else {
                    setIsAuthenticated(false);
                    authService.logout();
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                setIsAuthenticated(false);
                authService.logout();
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-100">
                <div className="text-center bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
                    <p className="text-gray-600 mb-6">You need to be logged in to view this page.</p>
                    <button
                        onClick={() => window.location.href = '/login'}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return children;
}

// 2. ADMIN-ONLY ROUTE WRAPPER - Use this to protect admin-only pages
export function AdminRoute({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAdminAuth = async () => {
            try {
                if (!authService.isAuthenticated()) {
                    setIsAuthorized(false);
                    setIsLoading(false);
                    return;
                }

                const validation = await authService.validateToken();
                
                if (validation.valid && validation.user.type === 'admin') {
                    setIsAuthorized(true);
                    localStorage.setItem('user', JSON.stringify(validation.user));
                } else {
                    setIsAuthorized(false);
                    if (!validation.valid) {
                        authService.logout();
                    }
                }
            } catch (error) {
                console.error('Admin auth check failed:', error);
                setIsAuthorized(false);
                authService.logout();
            } finally {
                setIsLoading(false);
            }
        };

        checkAdminAuth();
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!authService.isAuthenticated()) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-100">
                <div className="text-center bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
                    <p className="text-gray-600 mb-6">You need to be logged in to view this page.</p>
                    <button
                        onClick={() => window.location.href = '/login'}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    if (!isAuthorized) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-100">
                <div className="text-center bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Admin Access Required</h2>
                    <p className="text-gray-600 mb-6">You don't have permission to view this page.</p>
                    <button
                        onClick={() => window.location.href = '/dashboard'}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return children;
}

// 3. CUSTOM HOOK - Use this inside components to get user data and auth state
export function useAuth() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const validateAuth = async () => {
            try {
                if (authService.isAuthenticated()) {
                    const validation = await authService.validateToken();
                    setUser(validation.valid ? validation.user : null);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Auth validation failed:', error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        validateAuth();
    }, []);

    return { 
        user, 
        isLoading, 
        isAuthenticated: !!user,
        isAdmin: user?.type === 'admin'
    };
}