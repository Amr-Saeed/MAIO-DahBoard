'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [adminUserId, setAdminUserId] = useState(null);
    const router = useRouter();

    useEffect(() => {
        // Check if user is authenticated on mount
        const checkAuth = async () => {
            const token = apiClient.getToken();
            const userId = typeof window !== 'undefined' ? localStorage.getItem('adminUserId') : null;

            if (token) {
                try {
                    // Validate token by fetching dashboard metrics
                    await apiClient.getDashboardMetrics();
                    setIsAuthenticated(true);
                    setAdminUserId(userId);
                } catch (error) {
                    // Token is invalid, clear it
                    apiClient.clearToken();
                    setIsAuthenticated(false);
                    setAdminUserId(null);
                }
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await apiClient.login(email, password);
            setIsAuthenticated(true);
            setAdminUserId(response.adminUserId);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        apiClient.clearToken();
        setIsAuthenticated(false);
        setAdminUserId(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, adminUserId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
