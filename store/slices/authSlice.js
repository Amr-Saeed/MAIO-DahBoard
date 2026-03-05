import { createSlice } from '@reduxjs/toolkit';
import { supabase } from '@/lib/supabase';

const initialState = {
    isAuthenticated: false,
    isLoading: true,
    user: null,
    adminUserId: null,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        loginSuccess: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.adminUserId = action.payload.user?.id;
            state.isLoading = false;
            state.error = null;
        },
        loginFailure: (state, action) => {
            state.isAuthenticated = false;
            state.user = null;
            state.adminUserId = null;
            state.isLoading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.adminUserId = null;
            state.isLoading = false;
            state.error = null;
        },
        setAuthenticated: (state, action) => {
            state.isAuthenticated = action.payload.isAuthenticated;
            state.user = action.payload.user;
            state.adminUserId = action.payload.user?.id;
            state.isLoading = false;
        },
    },
});

export const { setLoading, loginSuccess, loginFailure, logout, setAuthenticated } = authSlice.actions;

// Thunk actions
export const checkAuth = () => async (dispatch) => {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (session?.user) {
            dispatch(setAuthenticated({
                isAuthenticated: true,
                user: session.user
            }));
        } else {
            dispatch(setAuthenticated({
                isAuthenticated: false,
                user: null
            }));
        }
    } catch (error) {
        console.error('Auth check error:', error);
        dispatch(setAuthenticated({
            isAuthenticated: false,
            user: null
        }));
    }
};

export const loginUser = (email, password) => async (dispatch) => {
    try {
        dispatch(setLoading(true));

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;

        if (data.user) {
            // Store session in localStorage for persistence
            if (typeof window !== 'undefined') {
                localStorage.setItem('supabase.auth.token', JSON.stringify(data.session));
            }

            dispatch(loginSuccess({ user: data.user }));
            return { success: true };
        } else {
            throw new Error('Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        dispatch(loginFailure(error.message));
        return { success: false, error: error.message };
    }
};

export const signupUser = (email, password, metadata = {}) => async (dispatch) => {
    try {
        dispatch(setLoading(true));

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: metadata
            }
        });

        if (error) throw error;

        dispatch(setLoading(false));
        return {
            success: true,
            message: 'Registration successful! Please check your email to verify your account.',
            data: data
        };
    } catch (error) {
        console.error('Signup error:', error);
        dispatch(setLoading(false));
        return { success: false, error: error.message };
    }
};

export const logoutUser = () => async (dispatch) => {
    try {
        await supabase.auth.signOut();

        if (typeof window !== 'undefined') {
            localStorage.removeItem('supabase.auth.token');
        }

        dispatch(logout());
    } catch (error) {
        console.error('Logout error:', error);
        dispatch(logout());
    }
};

export default authSlice.reducer;
