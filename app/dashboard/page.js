'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';

export default function DashboardPage() {
    const { isAuthenticated, isLoading, logout } = useAuth();
    const router = useRouter();
    const [metrics, setMetrics] = useState(null);
    const [loadingMetrics, setLoadingMetrics] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, isLoading, router]);

    useEffect(() => {
        if (isAuthenticated) {
            loadMetrics();
        }
    }, [isAuthenticated]);

    const loadMetrics = async () => {
        try {
            setLoadingMetrics(true);
            const response = await apiClient.getDashboardMetrics();
            setMetrics(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingMetrics(false);
        }
    };

    if (isLoading || !isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
                <div className="text-gray-600 dark:text-gray-400">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
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
                            className="border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 px-1 py-4 text-sm font-medium"
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
                {error && (
                    <div className="mb-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                {loadingMetrics ? (
                    <div className="text-center py-12">
                        <div className="text-gray-600 dark:text-gray-400">Loading metrics...</div>
                    </div>
                ) : metrics ? (
                    <>
                        {/* Total Metrics */}
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Total Counts</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                <MetricCard title="Total Users" value={metrics.totals?.users || 0} color="blue" />
                                <MetricCard title="Doctors" value={metrics.totals?.doctors || 0} color="green" />
                                <MetricCard title="Patients" value={metrics.totals?.patients || 0} color="purple" />
                                <MetricCard title="Admins" value={metrics.totals?.admins || 0} color="orange" />
                                <MetricCard title="Appointments" value={metrics.totals?.appointments || 0} color="pink" />
                            </div>
                        </div>

                        {/* Verification Breakdown */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Verification Status</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <MetricCard
                                    title="Pending Verification"
                                    value={metrics.verification?.pending || 0}
                                    color="yellow"
                                />
                                <MetricCard
                                    title="Approved"
                                    value={metrics.verification?.approved || 0}
                                    color="green"
                                />
                                <MetricCard
                                    title="Rejected"
                                    value={metrics.verification?.rejected || 0}
                                    color="red"
                                />
                            </div>
                        </div>
                    </>
                ) : null}
            </main>
        </div>
    );
}

function MetricCard({ title, value, color }) {
    const colorClasses = {
        blue: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
        green: 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
        purple: 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800',
        orange: 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800',
        pink: 'bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 border-pink-200 dark:border-pink-800',
        yellow: 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
        red: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
    };

    return (
        <div className={`${colorClasses[color]} border rounded-lg p-6`}>
            <div className="text-sm font-medium mb-1">{title}</div>
            <div className="text-3xl font-bold">{value}</div>
        </div>
    );
}
