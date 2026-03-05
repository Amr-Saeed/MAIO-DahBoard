import axios from "axios";

// Use DummyJSON as fake API
const backendURL = "https://dummyjson.com";
const PUBLIC_BASE_URL = "https://dummyjson.com";

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

// API client wrapper for data operations (not auth)
class ApiClient {
    // Dashboard endpoint
    async getDashboardMetrics() {
        // Fetch data from DummyJSON and calculate metrics
        const usersResponse = await axiosClient.get('/users?limit=0');
        const productsResponse = await axiosClient.get('/products?limit=0');

        const totalUsers = usersResponse.total || 0;
        const totalDoctors = Math.floor(totalUsers * 0.3);
        const totalPatients = totalUsers - totalDoctors;
        const totalAppointments = productsResponse.total || 0;
        const pendingVerifications = Math.floor(totalUsers * 0.05);

        return {
            data: {
                totals: {
                    users: totalUsers,
                    doctors: totalDoctors,
                    patients: totalPatients,
                    admins: 0,
                    appointments: totalAppointments
                },
                verification: {
                    pending: pendingVerifications,
                    approved: totalUsers - pendingVerifications,
                    rejected: 0
                },
                appointments: {
                    active: Math.floor(totalAppointments * 0.2),
                    completed: Math.floor(totalAppointments * 0.7),
                    cancelled: Math.floor(totalAppointments * 0.1)
                },
                revenue: {
                    thisMonth: 45600,
                    lastMonth: 38200
                },
                stats: {
                    newUsersThisWeek: 12,
                    appointmentsThisWeek: 47
                }
            }
        };
    }

    // Users endpoints
    async getUsers(params = {}) {
        const page = parseInt(params.page) || 1;
        const limit = parseInt(params.limit) || 10;
        const skip = (page - 1) * limit;

        // When filtering by verificationStatus, fetch more users to ensure we have enough results
        const fetchLimit = params.verificationStatus || params.status ? 100 : limit;
        const response = await axiosClient.get(`/users?limit=${fetchLimit}&skip=${skip}`);

        // Transform DummyJSON users to match our structure
        let users = response.users.map(user => ({
            _id: user.id.toString(),
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            role: user.id % 3 === 0 ? 'doctor' : 'patient',
            phone: user.phone,
            specialization: user.id % 3 === 0 ? ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics'][user.id % 4] : undefined,
            status: user.id % 5 === 0 ? 'inactive' : 'active',
            verificationStatus: user.id % 7 === 0 ? 'pending' : user.id % 11 === 0 ? 'rejected' : 'verified',
            profileImage: user.image,
            createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
            lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
        }));

        // Apply filters if provided
        if (params.verificationStatus) {
            users = users.filter(u => u.verificationStatus === params.verificationStatus);
        }
        if (params.status) {
            users = users.filter(u => u.status === params.status);
        }
        if (params.role) {
            users = users.filter(u => u.role === params.role);
        }
        if (params.search) {
            const searchLower = params.search.toLowerCase();
            users = users.filter(u => 
                u.name.toLowerCase().includes(searchLower) || 
                u.email.toLowerCase().includes(searchLower)
            );
        }

        // Apply pagination after filtering
        const totalFiltered = users.length;
        const startIndex = (page - 1) * limit;
        const paginatedUsers = users.slice(startIndex, startIndex + limit);

        return {
            data: paginatedUsers,
            pagination: {
                total: totalFiltered,
                page,
                limit,
                pages: Math.ceil(totalFiltered / limit)
            }
        };
    }

    async getPendingUsers(params = {}) {
        // Fetch all users and filter pending ones
        const response = await this.getUsers({ ...params, limit: 100 });
        const pendingUsers = response.data.filter(u => u.verificationStatus === 'pending');

        return {
            data: pendingUsers,
            pagination: {
                total: pendingUsers.length,
                page: 1,
                limit: params.limit || 10,
                pages: Math.ceil(pendingUsers.length / (params.limit || 10))
            }
        };
    }

    async getUserById(userId) {
        const response = await axiosClient.get(`/users/${userId}`);

        const isDoctor = response.id % 3 === 0;
        const verificationStatus = response.id % 7 === 0 ? 'pending' : response.id % 11 === 0 ? 'rejected' : 'verified';

        // Transform to our structure
        const user = {
            _id: response.id.toString(),
            firstName: response.firstName,
            lastName: response.lastName,
            name: `${response.firstName} ${response.lastName}`,
            email: response.email,
            role: isDoctor ? 'doctor' : 'patient',
            phone: response.phone,
            specialization: isDoctor ? ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics'][response.id % 4] : undefined,
            status: response.id % 5 === 0 ? 'inactive' : 'active',
            verificationStatus: verificationStatus,
            profileImage: response.image,
            profilePicture: response.image,
            image: response.image,
            avatar: response.image,
            address: response.address?.address || '',
            dateOfBirth: response.birthDate,
            gender: response.gender,
            bloodGroup: response.bloodGroup,
            age: response.age,
            profileCompletion: 85,
            isDeleted: false,
            createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
            lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            documents: isDoctor ? [
                {
                    _id: `doc${response.id}`,
                    type: 'medical_license',
                    fileName: 'medical_license.pdf',
                    status: response.id % 7 === 0 ? 'pending' : 'verified',
                    uploadedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
                }
            ] : []
        };

        // Add role-specific profile
        if (isDoctor) {
            user.doctorProfile = {
                firstName: response.firstName,
                lastName: response.lastName,
                phoneNumber: response.phone,
                gender: response.gender,
                specialization: user.specialization,
                yearsOfExperience: 5 + (response.id % 15),
                ratePerSession: 100 + (response.id * 10),
                rating: 4 + (response.id % 2),
                totalReviews: 10 + (response.id % 100),
                bio: `Experienced ${user.specialization} specialist`,
                clinicAddress: response.address?.address || 'Not provided'
            };
            user.totalPatients = 50 + (response.id % 200);
        } else {
            user.patientProfile = {
                firstName: response.firstName,
                lastName: response.lastName,
                gender: response.gender,
                age: response.age,
                emergencyContactNumber: response.phone,
                smoking: 'No',
                currentMedications: 'None',
                drugAllergies: 'None',
                operations: 'None'
            };
        }

        return { data: user };
    }

    async updateVerificationStatus(userId, verificationStatus, rejectionReason = null) {
        // DummyJSON doesn't support real updates, but we'll simulate it
        const response = await axiosClient.put(`/users/${userId}`, {
            verificationStatus
        });

        return {
            message: 'Verification status updated successfully',
            data: response
        };
    }

    async updateUserStatus(userId, status) {
        // Simulate update
        const response = await axiosClient.put(`/users/${userId}`, { status });

        return {
            message: 'User status updated successfully',
            data: response
        };
    }

    async deleteUser(userId) {
        // Simulate delete
        await axiosClient.delete(`/users/${userId}`);
        return { message: 'User deleted successfully' };
    }

    // Appointments endpoints
    async getAppointments(params = {}) {
        const page = parseInt(params.page) || 1;
        const limit = parseInt(params.limit) || 10;
        const skip = (page - 1) * limit;

        // Use products as appointments
        const response = await axiosClient.get(`/products?limit=${limit}&skip=${skip}`);

        // Transform products to appointments
        const appointments = response.products.map((product, index) => {
            const patientId = (product.id * 2) % 100 || 1;
            const doctorId = (product.id * 3) % 100 || 2;

            return {
                _id: `apt${product.id}`,
                patient: {
                    _id: patientId.toString(),
                    name: `Patient ${patientId}`,
                    email: `patient${patientId}@email.com`,
                    phone: `+123456${String(patientId).padStart(4, '0')}`
                },
                doctor: {
                    _id: doctorId.toString(),
                    name: `Dr. ${product.brand || 'Smith'}`,
                    email: `doctor${doctorId}@hospital.com`,
                    specialization: product.category || 'General'
                },
                date: new Date(Date.now() + (product.id * 24 * 60 * 60 * 1000)).toISOString(),
                time: `${9 + (product.id % 8)}:00 AM`,
                status: ['scheduled', 'completed', 'cancelled'][product.id % 3],
                type: ['consultation', 'follow-up', 'surgery'][product.id % 3],
                reason: product.title.substring(0, 50),
                duration: [30, 45, 60, 90][product.id % 4],
                notes: product.description.substring(0, 100),
                createdAt: new Date(Date.now() - product.id * 24 * 60 * 60 * 1000).toISOString()
            };
        });

        return {
            data: appointments,
            pagination: {
                total: response.total,
                page,
                limit,
                pages: Math.ceil(response.total / limit)
            }
        };
    }

    async getAppointmentById(appointmentId) {
        // Extract product ID from appointment ID
        const productId = appointmentId.replace('apt', '');
        const response = await axiosClient.get(`/products/${productId}`);

        const patientId = (response.id * 2) % 100 || 1;
        const doctorId = (response.id * 3) % 100 || 2;

        const appointment = {
            _id: `apt${response.id}`,
            patient: {
                _id: patientId.toString(),
                name: `Patient ${patientId}`,
                email: `patient${patientId}@email.com`,
                phone: `+123456${String(patientId).padStart(4, '0')}`
            },
            doctor: {
                _id: doctorId.toString(),
                name: `Dr. ${response.brand || 'Smith'}`,
                email: `doctor${doctorId}@hospital.com`,
                specialization: response.category || 'General'
            },
            date: new Date(Date.now() + (response.id * 24 * 60 * 60 * 1000)).toISOString(),
            time: `${9 + (response.id % 8)}:00 AM`,
            status: ['scheduled', 'completed', 'cancelled'][response.id % 3],
            type: ['consultation', 'follow-up', 'surgery'][response.id % 3],
            reason: response.title,
            duration: [30, 45, 60, 90][response.id % 4],
            notes: response.description,
            createdAt: new Date(Date.now() - response.id * 24 * 60 * 60 * 1000).toISOString()
        };

        return { data: appointment };
    }
}

export const apiClient = new ApiClient();
