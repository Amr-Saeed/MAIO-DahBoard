'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { apiClient, getImageUrl } from '@/lib/api';
import Link from 'next/link';
import UserImage from '@/components/UserImage';
import ThemeToggle from '@/components/ThemeToggle';

export default function UserDetailPage() {
    const { isAuthenticated, isLoading, logout } = useAuth();
    const router = useRouter();
    const params = useParams();
    const userId = params.id;

    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    // Modal states
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    // Toast states
    const [toast, setToast] = useState({ show: false, message: '', type: '' });

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    };

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, isLoading, router]);

    useEffect(() => {
        if (isAuthenticated && userId) {
            loadUser();
        }
    }, [isAuthenticated, userId]);

    const loadUser = async () => {
        try {
            setLoadingUser(true);
            console.log('🔍 Fetching user by ID:', userId);
            const response = await apiClient.getUserById(userId);
            console.log('📦 Full API Response:', response);
            console.log('👤 User Data:', response.data);
            setUser(response.data);
            setError('');
        } catch (err) {
            console.error('❌ Error loading user:', err);
            setError(err.message);
        } finally {
            setLoadingUser(false);
        }
    };

    const handleApproveVerification = async () => {
        try {
            setActionLoading(true);
            await apiClient.updateVerificationStatus(userId, 'approved');
            await loadUser();
            setShowApproveModal(false);
            showToast('User approved successfully', 'success');
        } catch (err) {
            showToast('Error approving user: ' + err.message, 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const handleRejectVerification = async () => {
        if (!rejectionReason.trim()) {
            showToast('Please provide a rejection reason', 'error');
            return;
        }

        try {
            setActionLoading(true);
            await apiClient.updateVerificationStatus(userId, 'rejected', rejectionReason);
            await loadUser();
            setShowRejectModal(false);
            setRejectionReason('');
            showToast('User rejected successfully', 'success');
        } catch (err) {
            showToast('Error rejecting user: ' + err.message, 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdateStatus = async (newStatus) => {
        if (!confirm(`Are you sure you want to set status to ${newStatus}?`)) return;

        try {
            setActionLoading(true);
            await apiClient.updateUserStatus(userId, newStatus);
            await loadUser();
            alert('User status updated successfully');
        } catch (err) {
            alert('Error updating status: ' + err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteUser = async () => {
        if (!confirm('Are you sure you want to soft delete this user? This will mark the user as deleted and suspend their account.')) return;

        try {
            setActionLoading(true);
            await apiClient.deleteUser(userId);
            alert('User deleted successfully');
            router.push('/users');
        } catch (err) {
            alert('Error deleting user: ' + err.message);
            setActionLoading(false);
        }
    };

    if (isLoading || !isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
                <div className="text-gray-600 dark:text-gray-400">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Details</h1>
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <button
                            onClick={logout}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Navigation */}
            <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex space-x-8">
                        <Link
                            href="/dashboard"
                            className="border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 px-1 py-4 text-sm font-medium"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/users"
                            className="border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 px-1 py-4 text-sm font-medium"
                        >
                            All Users
                        </Link>
                        <Link
                            href="/users/pending"
                            className="border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 px-1 py-4 text-sm font-medium"
                        >
                            Pending Verification
                        </Link>
                        <Link
                            href="/appointments"
                            className="border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 px-1 py-4 text-sm font-medium"
                        >
                            Appointments
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-4">
                    <Link href="/users" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                        ← Back to Users
                    </Link>
                </div>

                {error && (
                    <div className="mb-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                {loadingUser ? (
                    <div className="text-center py-12">
                        <div className="text-gray-600 dark:text-gray-400">Loading user details...</div>
                    </div>
                ) : user ? (
                    <div className="space-y-6">
                        {/* Basic Information */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>
                            <div className="flex items-start gap-6 mb-6">
                                {/* Profile Image */}
                                <UserImage
                                    src={user.profilePicture || user.avatar || user.image}
                                    alt={`${user.firstName} ${user.lastName}`}
                                    width={100}
                                    height={100}
                                    className="rounded-full object-cover"
                                />
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoField label="Email" value={user.email} />
                                    <InfoField label="Phone" value={
                                        user.doctorProfile?.phoneNumber ||
                                        user.patientProfile?.emergencyContactNumber ||
                                        'N/A'
                                    } />
                                    <InfoField label="First Name" value={
                                        user.doctorProfile?.firstName ||
                                        user.patientProfile?.firstName ||
                                        'N/A'
                                    } />
                                    <InfoField label="Last Name" value={
                                        user.doctorProfile?.lastName ||
                                        user.patientProfile?.lastName ||
                                        'N/A'
                                    } />
                                    <InfoField label="Role" value={user.role} />
                                    <InfoField label="Profile Completion" value={`${user.profileCompletion}%`} />
                                </div>
                            </div>
                        </div>

                        {/* Status Information */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Status Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Account Status</label>
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active' || user.status === 'approved'
                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                            : user.status === 'suspended'
                                                ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                                                : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                                            }`}
                                    >
                                        {user.status}
                                    </span>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Verification Status</label>
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.verificationStatus === 'approved'
                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                            : user.verificationStatus === 'rejected'
                                                ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                                                : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                                            }`}
                                    >
                                        {user.verificationStatus}
                                    </span>
                                </div>
                                {user.verifiedAt && <InfoField label="Verified At" value={new Date(user.verifiedAt).toLocaleString()} />}
                                {user.verifiedBy && <InfoField label="Verified By" value={user.verifiedBy} />}
                                {user.rejectionReason && (
                                    <div className="md:col-span-2">
                                        <InfoField label="Rejection Reason" value={user.rejectionReason} />
                                    </div>
                                )}
                                <InfoField label="Deleted" value={user.isDeleted ? 'Yes' : 'No'} />
                            </div>
                        </div>

                        {/* Role-Specific Information */}
                        {user.doctorProfile && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Doctor Profile</h2>
                                    {(user.doctorProfile.phdCertificate || user.doctorProfile.medicalLicense || user.doctorProfile.idProof) && (
                                        <Link
                                            href={`/users/${userId}/documents`}
                                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                                        >
                                            View Documents
                                        </Link>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoField label="First Name" value={user.doctorProfile.firstName} />
                                    <InfoField label="Last Name" value={user.doctorProfile.lastName} />
                                    <InfoField label="Phone Number" value={user.doctorProfile.phoneNumber} />
                                    <InfoField label="Gender" value={user.doctorProfile.gender} />
                                    <InfoField label="Specialization" value={user.doctorProfile.specialization} />
                                    {user.doctorProfile.otherSpecialization && (
                                        <InfoField label="Other Specialization" value={user.doctorProfile.otherSpecialization} />
                                    )}
                                    <InfoField label="Years of Experience" value={user.doctorProfile.yearsOfExperience} />
                                    <InfoField label="Rate Per Session" value={`$${user.doctorProfile.ratePerSession}`} />
                                    <InfoField label="Rating" value={`${user.doctorProfile.rating} / 5`} />
                                    <InfoField label="Total Reviews" value={user.doctorProfile.totalReviews} />
                                    <InfoField label="Total Patients" value={user.totalPatients} />
                                    {user.doctorProfile.clinicAddress && (
                                        <div className="md:col-span-2">
                                            <InfoField label="Clinic Address" value={user.doctorProfile.clinicAddress} />
                                        </div>
                                    )}
                                    {user.doctorProfile.bio && (
                                        <div className="md:col-span-2">
                                            <InfoField label="Bio" value={user.doctorProfile.bio} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {user.patientProfile && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Patient Profile</h2>
                                    {user.patientProfile.medicalDocuments && user.patientProfile.medicalDocuments.length > 0 && (
                                        <Link
                                            href={`/users/${userId}/medical-documents`}
                                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                                        >
                                            View Medical Documents
                                        </Link>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoField label="First Name" value={user.patientProfile.firstName} />
                                    <InfoField label="Last Name" value={user.patientProfile.lastName} />
                                    <InfoField label="Gender" value={user.patientProfile.gender} />
                                    <InfoField label="Age" value={user.patientProfile.age} />
                                    <InfoField label="Emergency Contact" value={user.patientProfile.emergencyContactNumber} />
                                    <InfoField label="Smoking Status" value={user.patientProfile.smoking} />
                                    <InfoField label="Current Medications" value={user.patientProfile.currentMedications} />
                                    <InfoField label="Drug Allergies" value={user.patientProfile.drugAllergies} />
                                    <InfoField label="Operations" value={user.patientProfile.operations} />
                                    {user.patientProfile.otherIllness && (
                                        <InfoField label="Other Illness" value={user.patientProfile.otherIllness} />
                                    )}
                                    {user.patientProfile.reasonForSeeingDoctor && (
                                        <div className="md:col-span-2">
                                            <InfoField label="Reason for Seeing Doctor" value={user.patientProfile.reasonForSeeingDoctor} />
                                        </div>
                                    )}
                                    {user.patientProfile.assignedDoctors && user.patientProfile.assignedDoctors.length > 0 && (
                                        <div className="md:col-span-2">
                                            <InfoField label="Assigned Doctors" value={`${user.patientProfile.assignedDoctors.length} doctor(s) assigned`} />
                                        </div>
                                    )}
                                    {user.patientProfile.illnesses && user.patientProfile.illnesses.length > 0 && (
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Illnesses</label>
                                            <div className="flex flex-wrap gap-2">
                                                {user.patientProfile.illnesses.map((illness, index) => (
                                                    <span key={index} className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full">
                                                        {illness}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {user.patientProfile.medicalHistory && (
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Medical History</label>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                                                {user.patientProfile.medicalHistory.chronicDiseases && user.patientProfile.medicalHistory.chronicDiseases.length > 0 && (
                                                    <div>
                                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Chronic Diseases:</span>
                                                        <div className="mt-1 flex flex-wrap gap-1">
                                                            {user.patientProfile.medicalHistory.chronicDiseases.map((disease, index) => (
                                                                <span key={index} className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded">
                                                                    {disease}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                {user.patientProfile.medicalHistory.allergies && user.patientProfile.medicalHistory.allergies.length > 0 && (
                                                    <div>
                                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Allergies:</span>
                                                        <div className="mt-1 flex flex-wrap gap-1">
                                                            {user.patientProfile.medicalHistory.allergies.map((allergy, index) => (
                                                                <span key={index} className="px-2 py-1 text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded">
                                                                    {allergy}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Actions</h2>
                            <div className="space-y-4">
                                {/* Verification Actions */}
                                {user.verificationStatus === 'pending' && (
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => setShowApproveModal(true)}
                                            disabled={actionLoading}
                                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Approve Verification
                                        </button>
                                        <button
                                            onClick={() => setShowRejectModal(true)}
                                            disabled={actionLoading}
                                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Reject Verification
                                        </button>
                                    </div>
                                )}

                                {/* Status Actions */}
                                <div className="flex flex-wrap gap-2">
                                    <h3 className="w-full text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Update Status:</h3>
                                    {user.status !== 'active' && (
                                        <button
                                            onClick={() => handleUpdateStatus('active')}
                                            disabled={actionLoading}
                                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Set Active
                                        </button>
                                    )}
                                    {user.status !== 'suspended' && (
                                        <button
                                            onClick={() => handleUpdateStatus('suspended')}
                                            disabled={actionLoading}
                                            className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Suspend
                                        </button>
                                    )}
                                    {user.status !== 'pending' && (
                                        <button
                                            onClick={() => handleUpdateStatus('pending')}
                                            disabled={actionLoading}
                                            className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Set Pending
                                        </button>
                                    )}
                                </div>

                                {/* Delete Action */}
                                {!user.isDeleted && (
                                    <div>
                                        <button
                                            onClick={handleDeleteUser}
                                            disabled={actionLoading}
                                            className="px-4 py-2 text-sm font-medium text-white bg-red-700 hover:bg-red-800 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Soft Delete User
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : null}
            </main>

            {/* Toast Notification */}
            {toast.show && (
                <div className="fixed top-4 right-4 z-50 animate-slide-in">
                    <div className={`px-6 py-4 rounded-lg shadow-lg ${toast.type === 'success'
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                        }`}>
                        <div className="flex items-center gap-2">
                            {toast.type === 'success' ? (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            )}
                            <p className="font-medium">{toast.message}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Approve Modal */}
            {showApproveModal && (
                <div className="fixed inset-0 bg-gray-600 dark:bg-gray-900 bg-opacity-50 dark:bg-opacity-70 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border border-gray-300 dark:border-gray-700 w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
                        <div className="mt-3">
                            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white text-center mb-4">Approve User Verification</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
                                Are you sure you want to approve this user? This action will grant them full access.
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleApproveVerification}
                                    disabled={actionLoading}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {actionLoading ? 'Processing...' : 'Approve'}
                                </button>
                                <button
                                    onClick={() => setShowApproveModal(false)}
                                    disabled={actionLoading}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-gray-600 dark:bg-gray-900 bg-opacity-50 dark:bg-opacity-70 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border border-gray-300 dark:border-gray-700 w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Reject Verification</h3>
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Enter rejection reason..."
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={handleRejectVerification}
                                    disabled={actionLoading}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Reject
                                </button>
                                <button
                                    onClick={() => {
                                        setShowRejectModal(false);
                                        setRejectionReason('');
                                    }}
                                    disabled={actionLoading}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function InfoField({ label, value }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</label>
            <div className="text-sm text-gray-900 dark:text-white">{value !== null && value !== undefined && value !== '' ? value : 'N/A'}</div>
        </div>
    );
}
