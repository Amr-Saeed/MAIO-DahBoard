'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { apiClient, getImageUrl } from '@/lib/api';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

export default function DocumentsPage() {
    const { isAuthenticated, isLoading, logout } = useAuth();
    const router = useRouter();
    const params = useParams();
    const userId = params.id;

    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    // Document verification states
    const [documentStatuses, setDocumentStatuses] = useState({
        phdCertificate: null,
        medicalLicense: null,
        idProof: null
    });

    // PDF Modal state
    const [pdfModal, setPdfModal] = useState({
        isOpen: false,
        url: '',
        title: ''
    });

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
            const response = await apiClient.getUserById(userId);
            setUser(response.data);
            setError('');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingUser(false);
        }
    };

    const handleDocumentAction = (documentType, status) => {
        setDocumentStatuses(prev => ({
            ...prev,
            [documentType]: status
        }));
    };

    const openPdfModal = (url, title) => {
        setPdfModal({
            isOpen: true,
            url,
            title
        });
    };

    const closePdfModal = () => {
        setPdfModal({
            isOpen: false,
            url: '',
            title: ''
        });
    };

    const handleSubmitVerification = async () => {
        const allApproved = Object.values(documentStatuses).every(status => status === 'approved');
        const anyRejected = Object.values(documentStatuses).some(status => status === 'rejected');

        if (!allApproved && !anyRejected) {
            alert('Please review all documents before submitting');
            return;
        }

        const confirmMessage = allApproved
            ? 'Are you sure you want to approve all documents and verify this user?'
            : 'Are you sure you want to reject verification? Please provide a rejection reason.';

        if (!confirm(confirmMessage)) return;

        try {
            setActionLoading(true);

            if (allApproved) {
                await apiClient.updateVerificationStatus(userId, 'approved');
                alert('User verification approved successfully');
            } else {
                const rejectionReason = prompt('Enter rejection reason:');
                if (!rejectionReason) {
                    setActionLoading(false);
                    return;
                }
                await apiClient.updateVerificationStatus(userId, 'rejected', rejectionReason);
                alert('User verification rejected successfully');
            }

            router.push(`/users/${userId}`);
        } catch (err) {
            alert('Error updating verification: ' + err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const renderDocument = (title, documentPath, documentType) => {
        if (!documentPath) return null;

        console.log('🩺 Doctor Document Type:', documentType);
        console.log('📁 Doctor Document Path:', documentPath);
        const fullUrl = getImageUrl(documentPath);
        console.log('🌐 Doctor Full URL:', fullUrl);

        const isPDF = documentPath.toLowerCase().endsWith('.pdf');
        const status = documentStatuses[documentType];

        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>

                {/* Document Preview */}
                <div className="mb-4 bg-gray-100 dark:bg-gray-700 rounded-lg p-4 min-h-[300px] flex items-center justify-center">
                    {isPDF ? (
                        <div className="text-center">
                            <svg className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <p className="text-gray-600 dark:text-gray-400 mb-2">PDF Document</p>
                            <button
                                onClick={() => openPdfModal(fullUrl, title)}
                                className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                View PDF Document
                            </button>
                        </div>
                    ) : (
                        <img
                            src={fullUrl}
                            alt={title}
                            className="max-w-full max-h-[400px] object-contain rounded cursor-pointer"
                            onClick={() => openPdfModal(fullUrl, title)}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="16" fill="%23999"%3EImage not found%3C/text%3E%3C/svg%3E';
                            }}
                        />
                    )}
                </div>

                {/* Document Actions */}
                <div className="flex gap-2">
                    <button
                        onClick={() => handleDocumentAction(documentType, 'approved')}
                        disabled={status === 'approved'}
                        className={`flex-1 px-4 py-2 text-sm font-medium rounded-md ${status === 'approved'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900/30'
                            }`}
                    >
                        {status === 'approved' ? '✓ Approved' : 'Approve'}
                    </button>
                    <button
                        onClick={() => handleDocumentAction(documentType, 'rejected')}
                        disabled={status === 'rejected'}
                        className={`flex-1 px-4 py-2 text-sm font-medium rounded-md ${status === 'rejected'
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900/30'
                            }`}
                    >
                        {status === 'rejected' ? '✗ Rejected' : 'Reject'}
                    </button>
                </div>
            </div>
        );
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
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Document Verification</h1>
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
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-4">
                    <Link href={`/users/${userId}`} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                        ← Back to User Details
                    </Link>
                </div>

                {error && (
                    <div className="mb-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                {loadingUser ? (
                    <div className="text-center py-12">
                        <div className="text-gray-600 dark:text-gray-400">Loading documents...</div>
                    </div>
                ) : user?.doctorProfile ? (
                    <div className="space-y-6">
                        {/* User Info Header */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                {user.doctorProfile.firstName} {user.doctorProfile.lastName}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                {user.email} • {user.doctorProfile.specialization}
                            </p>
                        </div>

                        {/* Documents Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {renderDocument('PhD Certificate', user.doctorProfile.phdCertificate, 'phdCertificate')}
                            {renderDocument('Medical License', user.doctorProfile.medicalLicense, 'medicalLicense')}
                            {renderDocument('ID Proof', user.doctorProfile.idProof, 'idProof')}
                        </div>

                        {/* Submit Actions */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Submit Verification</h3>
                            <div className="flex gap-4">
                                <button
                                    onClick={handleSubmitVerification}
                                    disabled={actionLoading}
                                    className="px-6 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {actionLoading ? 'Submitting...' : 'Submit Verification Decision'}
                                </button>
                                <Link
                                    href={`/users/${userId}`}
                                    className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md"
                                >
                                    Cancel
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-600 dark:text-gray-400">No documents available for this user</div>
                    </div>
                )}
            </main>

            {/* PDF Modal */}
            {pdfModal.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
                    <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{pdfModal.title}</h3>
                            <button
                                onClick={closePdfModal}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-hidden">
                            <iframe
                                src={pdfModal.url}
                                className="w-full h-full"
                                title={pdfModal.title}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
