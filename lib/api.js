import axios from "axios";

const backendURL = process.env.NEXT_PUBLIC_API_URL || "https://gr8gsgrw-5000.euw.devtunnels.ms";
const PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://gr8gsgrw-5000.euw.devtunnels.ms";

// Helper function to get full image URL
export function getImageUrl(imagePath) {
    if (!imagePath) return null;
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    // Remove leading slash if present to avoid double slashes
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    // Replace backslashes with forward slashes for proper URL formatting
    const urlPath = cleanPath.replace(/\\/g, '/');
    return `${PUBLIC_BASE_URL}/${urlPath}`;
}

// Create axios instance
const axiosClient = axios.create({
    baseURL: backendURL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Helper function to get token from localStorage
function getToken() {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('adminToken');
    }
    return null;
}

// Add request interceptor to attach token
axiosClient.interceptors.request.use(
    (config) => {
        const token = getToken();

        console.log('🔑 Request interceptor - Token:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
        console.log('📡 Request URL:', config.url);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for better error handling
axiosClient.interceptors.response.use(
    (response) => {
        return response.data; // Return only data
    },
    (error) => {
        const errorMessage = error.response?.data?.message || error.message || 'Request failed';
        console.error('API Error:', errorMessage);
        return Promise.reject(new Error(errorMessage));
    }
);

// API client wrapper
class ApiClient {
    constructor() {
        this.token = null;
    }

    setToken(token) {
        console.log('💾 Setting token:', token ? `${token.substring(0, 20)}...` : 'NULL');
        this.token = token;
        if (typeof window !== 'undefined') {
            localStorage.setItem('adminToken', token);
            console.log('✅ Token saved to localStorage');
        }
    }

    getToken() {
        if (!this.token && typeof window !== 'undefined') {
            this.token = localStorage.getItem('adminToken');
            console.log('📖 Getting token from localStorage:', this.token ? `${this.token.substring(0, 20)}...` : 'NO TOKEN');
        }
        return this.token;
    }

    clearToken() {
        this.token = null;
        if (typeof window !== 'undefined') {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUserId');
        }
    }

    // Auth endpoints
    async login(email, password) {
        console.log('🔐 Login attempt for:', email);
        const response = await axiosClient.post('/api/admin/login', { email, password });

        console.log('📥 Full Login response:', JSON.stringify(response, null, 2));

        // Backend returns: { accessToken: "...", data: { userId: "..." } }
        const token = response.accessToken;
        const adminUserId = response.data?.userId;

        console.log('🎟️ Extracted token:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
        console.log('👤 Admin User ID:', adminUserId);

        if (token) {
            this.setToken(token);
            if (typeof window !== 'undefined' && adminUserId) {
                localStorage.setItem('adminUserId', adminUserId);
            }
        } else {
            console.error('❌ No token found in login response!');
            console.error('Response keys:', Object.keys(response));
        }

        return response;
    }

    async register(userData) {
        return axiosClient.post('/api/admin/register', userData);
    }

    // Dashboard endpoint
    async getDashboardMetrics() {
        return axiosClient.get('/api/admin/dashboard/metrics');
    }

    // Users endpoints
    async getUsers(params = {}) {
        return axiosClient.get('/api/admin/users', { params });
    }

    async getPendingUsers(params = {}) {
        return axiosClient.get('/api/admin/users/pending', { params });
    }

    async getUserById(userId) {
        return axiosClient.get(`/api/admin/users/${userId}`);
    }

    async updateVerificationStatus(userId, verificationStatus, rejectionReason = null) {
        const body = { verificationStatus };
        if (rejectionReason) {
            body.rejectionReason = rejectionReason;
        }
        return axiosClient.patch(`/api/admin/users/${userId}/verification`, body);
    }

    async updateUserStatus(userId, status) {
        return axiosClient.patch(`/api/admin/users/${userId}/status`, { status });
    }

    async deleteUser(userId) {
        return axiosClient.delete(`/api/admin/users/${userId}`);
    }

    // Appointments endpoints
    async getAppointments(params = {}) {
        return axiosClient.get('/api/admin/appointments', { params });
    }

    async getAppointmentById(appointmentId) {
        // Try to fetch single appointment first
        try {
            return await axiosClient.get(`/api/admin/appointments/${appointmentId}`);
        } catch (err) {
            // If single endpoint doesn't exist, fetch all and filter
            console.log('Single appointment endpoint not available, fetching from list...');
            const response = await axiosClient.get('/api/admin/appointments', {
                params: { limit: 1000 }
            });
            const appointment = response.data?.find(apt => apt._id === appointmentId);
            if (!appointment) {
                throw new Error('Appointment not found');
            }
            return { data: appointment };
        }
    }
}

export const apiClient = new ApiClient();
