'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth, logoutUser } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';

export function useAuth() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { isAuthenticated, isLoading, adminUserId, error } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isLoading) {
            dispatch(checkAuth());
        }
    }, [dispatch, isLoading]);

    const logout = () => {
        dispatch(logoutUser());
        router.push('/login');
    };

    return {
        isAuthenticated,
        isLoading,
        adminUserId,
        error,
        logout,
    };
}
