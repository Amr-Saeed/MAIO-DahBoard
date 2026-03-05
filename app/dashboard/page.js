'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

                        {/* Charts Section */}
                        <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* User Types Bar Chart */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Distribution</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={[
                                        { name: 'Doctors', count: metrics.totals?.doctors || 0, fill: '#10b981' },
                                        { name: 'Patients', count: metrics.totals?.patients || 0, fill: '#a855f7' },
                                        { name: 'Admins', count: metrics.totals?.admins || 0, fill: '#f97316' },
                                    ]}>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-600" />
                                        <XAxis dataKey="name" className="text-gray-600 dark:text-gray-400" />
                                        <YAxis className="text-gray-600 dark:text-gray-400" />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgb(31 41 55)',
                                                border: '1px solid rgb(55 65 81)',
                                                borderRadius: '0.375rem',
                                                color: 'white'
                                            }}
                                        />
                                        <Bar dataKey="count" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Verification Status Pie Chart */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Verification Status</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { name: 'Pending', value: metrics.verification?.pending || 0 },
                                                { name: 'Approved', value: metrics.verification?.approved || 0 },
                                                { name: 'Rejected', value: metrics.verification?.rejected || 0 },
                                            ]}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={(props) => {
                                                const { cx, cy, midAngle, outerRadius, percent, index } = props;
                                                const RADIAN = Math.PI / 180;
                                                const offsetAngle = percent === 0 ? index * 15 : 0;
                                                const innerRadius = outerRadius;
                                                const outerLabelRadius = outerRadius + 30;

                                                const x1 = cx + innerRadius * Math.cos(-midAngle * RADIAN);
                                                const y1 = cy + innerRadius * Math.sin(-midAngle * RADIAN);
                                                const x2 = cx + outerLabelRadius * Math.cos(-midAngle * RADIAN + offsetAngle * RADIAN);
                                                const y2 = cy + outerLabelRadius * Math.sin(-midAngle * RADIAN + offsetAngle * RADIAN);

                                                return (
                                                    <line
                                                        x1={x1}
                                                        y1={y1}
                                                        x2={x2}
                                                        y2={y2}
                                                        stroke="#666"
                                                        strokeWidth={1}
                                                    />
                                                );
                                            }}
                                            label={({ cx, cy, midAngle, outerRadius, name, percent, index }) => {
                                                const RADIAN = Math.PI / 180;
                                                // Add offset based on index to prevent overlap when values are 0
                                                const offsetAngle = percent === 0 ? index * 15 : 0;
                                                const radius = outerRadius + 30;
                                                const x = cx + radius * Math.cos(-midAngle * RADIAN + offsetAngle * RADIAN);
                                                const y = cy + radius * Math.sin(-midAngle * RADIAN + offsetAngle * RADIAN);

                                                // Set color based on name
                                                const colors = {
                                                    'Pending': '#eab308',
                                                    'Approved': '#10b981',
                                                    'Rejected': '#ef4444'
                                                };

                                                return (
                                                    <text
                                                        x={x}
                                                        y={y}
                                                        fill={colors[name]}
                                                        textAnchor={x > cx ? 'start' : 'end'}
                                                        dominantBaseline="central"
                                                        style={{ fontWeight: 500 }}
                                                    >
                                                        {`${name}: ${(percent * 100).toFixed(0)}%`}
                                                    </text>
                                                );
                                            }}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            <Cell fill="#eab308" />
                                            <Cell fill="#10b981" />
                                            <Cell fill="#ef4444" />
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgb(31 41 55)',
                                                border: '1px solid rgb(55 65 81)',
                                                borderRadius: '0.375rem',
                                                color: 'white'
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Comparison Chart */}
                        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Overview Comparison</h3>
                            <ResponsiveContainer width="100%" height={350}>
                                <LineChart data={[
                                    {
                                        category: 'Users',
                                        Doctors: metrics.totals?.doctors || 0,
                                        Patients: metrics.totals?.patients || 0,
                                        Admins: metrics.totals?.admins || 0,
                                    },
                                    {
                                        category: 'Verification',
                                        Pending: metrics.verification?.pending || 0,
                                        Approved: metrics.verification?.approved || 0,
                                        Rejected: metrics.verification?.rejected || 0,
                                    },
                                ]}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-600" />
                                    <XAxis dataKey="category" className="text-gray-600 dark:text-gray-400" />
                                    <YAxis className="text-gray-600 dark:text-gray-400" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgb(31 41 55)',
                                            border: '1px solid rgb(55 65 81)',
                                            borderRadius: '0.375rem',
                                            color: 'white'
                                        }}
                                    />
                                    <Legend />
                                    <Line type="monotone" dataKey="Doctors" stroke="#10b981" strokeWidth={2} />
                                    <Line type="monotone" dataKey="Patients" stroke="#a855f7" strokeWidth={2} />
                                    <Line type="monotone" dataKey="Admins" stroke="#f97316" strokeWidth={2} />
                                    <Line type="monotone" dataKey="Pending" stroke="#eab308" strokeWidth={2} />
                                    <Line type="monotone" dataKey="Approved" stroke="#3b82f6" strokeWidth={2} />
                                    <Line type="monotone" dataKey="Rejected" stroke="#ef4444" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Verification Breakdown Cards */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Verification Status Details</h2>
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
