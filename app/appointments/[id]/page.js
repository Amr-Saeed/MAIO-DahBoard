'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, useParams } from 'next/navigation';
import { apiClient, getImageUrl } from '@/lib/api';
import Link from 'next/link';
import UserImage from '@/components/UserImage';
import ThemeToggle from '@/components/ThemeToggle';

export default function AppointmentDetailPage() {
    const { isAuthenticated, isLoading, logout } = useAuth();
    const router = useRouter();
    const params = useParams();
    const appointmentId = params.id;

    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, isLoading, router]);

    useEffect(() => {
        if (isAuthenticated && appointmentId) {
            loadAppointment();
        }
    }, [isAuthenticated, appointmentId]);

    const loadAppointment = async () => {
        try {
            setLoading(true);
            console.log('🔍 Fetching appointment by ID:', appointmentId);
            const response = await apiClient.getAppointmentById(appointmentId);
            console.log('📦 Appointment Data:', response);
            setAppointment(response.data);
            setError('');
        } catch (err) {
            console.error('❌ Error loading appointment:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (time) => {
        if (!time) return 'N/A';
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    const getStatusBadgeClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed':
            case 'approved':
                return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
            case 'scheduled':
                return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
            case 'completed':
                return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
            case 'cancelled':
                return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
            case 'pending':
                return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
            default:
                return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
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
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Appointment Details</h1>
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
                    <Link href="/appointments" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                        ← Back to Appointments
                    </Link>
                </div>

                {error && (
                    <div className="mb-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-12">
                        <div className="text-gray-600 dark:text-gray-400">Loading appointment details...</div>
                    </div>
                ) : appointment ? (
                    <div className="space-y-6">
                        {/* Appointment Overview */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                                        Appointment Overview
                                    </h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        ID: {appointment._id}
                                    </p>
                                </div>
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(appointment.status)}`}>
                                    {appointment.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InfoField
                                    label="Appointment Date"
                                    value={formatDate(appointment.appointmentDate)}
                                />
                                <InfoField
                                    label="Time Slot"
                                    value={`${formatTime(appointment.startTime)} - ${formatTime(appointment.endTime)}`}
                                />
                                <InfoField
                                    label="Created At"
                                    value={new Date(appointment.createdAt).toLocaleString()}
                                />
                                <InfoField
                                    label="Last Updated"
                                    value={new Date(appointment.updatedAt).toLocaleString()}
                                />
                            </div>
                        </div>

                        {/* Patient Information */}
                        {appointment.patient && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Patient Information</h2>
                                    <Link
                                        href={`/users/${appointment.patient.userId}`}
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                                    >
                                        View Full Profile
                                    </Link>
                                </div>

                                <div className="flex items-start gap-6">
                                    <UserImage
                                        src={appointment.patient.profilePicture}
                                        alt={appointment.patient.fullName}
                                        width={100}
                                        height={100}
                                        className="rounded-full object-cover"
                                    />
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InfoField label="Full Name" value={appointment.patient.fullName} />
                                        <InfoField label="Email" value={appointment.patient.email} />
                                        <InfoField label="Age" value={appointment.patient.age} />
                                        <InfoField label="Gender" value={appointment.patient.gender} />
                                        <InfoField label="Emergency Contact" value={appointment.patient.emergencyContactNumber} />
                                        <InfoField label="Account Status" value={appointment.patient.status} />
                                        <InfoField label="Verification Status" value={appointment.patient.verificationStatus} />
                                        {appointment.patient.reasonForSeeingDoctor && (
                                            <div className="md:col-span-2">
                                                <InfoField label="Reason for Seeing Doctor" value={appointment.patient.reasonForSeeingDoctor} />
                                            </div>
                                        )}
                                        {appointment.patient.currentMedications && (
                                            <div className="md:col-span-2">
                                                <InfoField label="Current Medications" value={appointment.patient.currentMedications} />
                                            </div>
                                        )}
                                        {appointment.patient.drugAllergies && (
                                            <div className="md:col-span-2">
                                                <InfoField label="Drug Allergies" value={appointment.patient.drugAllergies} />
                                            </div>
                                        )}
                                        {appointment.patient.illnesses && appointment.patient.illnesses.length > 0 && (
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Illnesses</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {appointment.patient.illnesses.map((illness, index) => (
                                                        <span key={index} className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full">
                                                            {illness}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Doctor Information */}
                        {appointment.doctor && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Doctor Information</h2>
                                    <Link
                                        href={`/users/${appointment.doctor.userId}`}
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                                    >
                                        View Full Profile
                                    </Link>
                                </div>

                                <div className="flex items-start gap-6">
                                    <UserImage
                                        src={appointment.doctor.profilePicture}
                                        alt={appointment.doctor.fullName}
                                        width={100}
                                        height={100}
                                        className="rounded-full object-cover"
                                    />
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InfoField label="Full Name" value={appointment.doctor.fullName} />
                                        <InfoField label="Email" value={appointment.doctor.email} />
                                        <InfoField label="Specialization" value={appointment.doctor.specialization} />
                                        <InfoField label="Years of Experience" value={appointment.doctor.yearsOfExperience} />
                                        <InfoField label="Rate Per Session" value={`$${appointment.doctor.ratePerSession}`} />
                                        <InfoField label="Account Status" value={appointment.doctor.status} />
                                        <InfoField label="Verification Status" value={appointment.doctor.verificationStatus} />
                                        {appointment.doctor.clinicAddress && (
                                            <div className="md:col-span-2">
                                                <InfoField label="Clinic Address" value={appointment.doctor.clinicAddress} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Appointment Details */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Appointment Details</h2>
                            <div className="space-y-4">
                                <InfoField
                                    label="Reason for Visit"
                                    value={appointment.reasonForVisit}
                                />
                                {appointment.notes && (
                                    <InfoField
                                        label="Notes"
                                        value={appointment.notes}
                                    />
                                )}
                                {appointment.cancelledBy && (
                                    <>
                                        <InfoField
                                            label="Cancelled By"
                                            value={appointment.cancelledBy}
                                        />
                                        {appointment.cancellationReason && (
                                            <InfoField
                                                label="Cancellation Reason"
                                                value={appointment.cancellationReason}
                                            />
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
                        <p className="text-gray-500 dark:text-gray-400">Appointment not found</p>
                    </div>
                )}
            </main>
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
