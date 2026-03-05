'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, useParams } from 'next/navigation';
import { apiClient, getImageUrl } from '@/lib/api';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

export default function MedicalDocumentsPage() {
    const { isAuthenticated, isLoading, logout } = useAuth();
    const router = useRouter();
    const params = useParams();
    const userId = params.id;

    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);
    const [error, setError] = useState('');

    // Document Modal state
    const [documentModal, setDocumentModal] = useState({
        isOpen: false,
        url: '',
        title: '',
        type: ''
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

    const openDocumentModal = (url, title, type) => {
        setDocumentModal({
            isOpen: true,
            url,
            title,
            type
        });
    };

    const closeDocumentModal = () => {
        setDocumentModal({
            isOpen: false,
            url: '',
            title: '',
            type: ''
        });
    };

    const renderDocument = (document, index) => {
        console.log('📄 Document object:', document);

        if (!document) return null;

        // Handle different possible property names for the file path
        const documentPath = document.filePath || document.path || document.url || document.file;

        if (!documentPath) {
            console.warn('⚠️ No file path found in document:', document);
            return null;
        }

        console.log('🔗 Document path:', documentPath);
        const fullUrl = getImageUrl(documentPath);
        console.log('🌐 Full URL:', fullUrl);

        const isPDF = documentPath.toLowerCase().endsWith('.pdf');
        const documentType = document.documentType || document.type || 'Medical Document';
        const uploadDate = document.uploadedAt || document.createdAt ?
            new Date(document.uploadedAt || document.createdAt).toLocaleDateString() : 'N/A';

        return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{documentType}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Uploaded: {uploadDate}</p>
                    </div>
                    {document.verified && (
                        <span className="px-2 py-1 text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full">
                            Verified
                        </span>
                    )}
                </div>

                {/* Document Preview */}
                <div className="mb-4 bg-gray-100 dark:bg-gray-700 rounded-lg p-4 min-h-[300px] flex items-center justify-center">
                    {isPDF ? (
                        <div className="text-center">
                            <svg className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <p className="text-gray-600 dark:text-gray-400 mb-2">PDF Document</p>
                            <button
                                onClick={() => openDocumentModal(fullUrl, documentType, 'pdf')}
                                className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                View Document
                            </button>
                        </div>
                    ) : (
                        <img
                            src={fullUrl}
                            alt={documentType}
                            className="max-w-full max-h-[400px] object-contain rounded cursor-pointer"
                            onClick={() => openDocumentModal(fullUrl, documentType, 'image')}
                            onLoad={() => console.log('✅ Image loaded successfully:', fullUrl)}
                            onError={(e) => {
                                console.error('❌ Image failed to load:', fullUrl);
                                console.error('Error event:', e);
                                e.target.onerror = null;
                                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect width="200" height="200" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="16" fill="%23999"%3EImage not found%3C/text%3E%3C/svg%3E';
                            }}
                        />
                    )}
                </div>

                {/* Document Info */}
                {document.description && (
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Description</label>
                        <p className="text-sm text-gray-900 dark:text-white">{document.description}</p>
                    </div>
                )}
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
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Medical Documents</h1>
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
                ) : user?.patientProfile ? (
                    <div className="space-y-6">
                        {/* Patient Info Header */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                {user.patientProfile.firstName} {user.patientProfile.lastName}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                {user.email} • Patient • Age: {user.patientProfile.age}
                            </p>
                            {user.patientProfile.medicalDocuments && user.patientProfile.medicalDocuments.length > 0 && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                    Total Documents: {user.patientProfile.medicalDocuments.length}
                                </p>
                            )}
                        </div>

                        {/* Documents Grid */}
                        {user.patientProfile.medicalDocuments && user.patientProfile.medicalDocuments.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                {user.patientProfile.medicalDocuments.map((doc, index) => renderDocument(doc, index))}
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
                                <svg className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Medical Documents</h3>
                                <p className="text-gray-500 dark:text-gray-400">This patient hasn't uploaded any medical documents yet.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-600 dark:text-gray-400">No patient profile available for this user</div>
                    </div>
                )}
            </main>

            {/* Document Modal */}
            {documentModal.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
                    <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{documentModal.title}</h3>
                            <button
                                onClick={closeDocumentModal}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-hidden">
                            {documentModal.type === 'pdf' ? (
                                <iframe
                                    src={documentModal.url}
                                    className="w-full h-full"
                                    title={documentModal.title}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center p-4 overflow-auto">
                                    <img
                                        src={documentModal.url}
                                        alt={documentModal.title}
                                        className="max-w-full max-h-full object-contain"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
