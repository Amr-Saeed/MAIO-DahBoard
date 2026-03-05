# Admin Dashboard - Full-Stack Next.js Application

This is a complete admin dashboard built with Next.js featuring **Supabase Authentication**, Redux Toolkit state management, PDF/Excel export, and Docker containerization.

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Authentication**: Supabase Auth
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS v4 with Dark Mode
- **Charts**: Recharts
- **Export**: jsPDF, xlsx
- **Containerization**: Docker

## Features Implemented

### ✅ Authentication (Supabase)

- **Sign Up** - Supabase Auth
  - Email and password registration
  - Email verification
  - User metadata storage (firstName, lastName, phoneNumber)
- **Sign In** - Supabase Auth
  - Email and password authentication
  - Session management with Redux
  - Persistent login sessions
  - Automatic redirect to dashboard

- **Sign Out**
  - Clears Supabase session
  - Resets Redux state
  - Redirects to login

📖 **See [SUPABASE.md](SUPABASE.md) for detailed Supabase integration guide**

### ✅ Dashboard Metrics

- **Dashboard Page** - GET `/api/admin/dashboard/metrics`
  - Total counts (users, doctors, patients, admins, appointments)
  - Verification status breakdown (pending, approved, rejected)

### ✅ User Management

- **All Users List** - GET `/api/admin/users`
  - Pagination support (page, limit)
  - Role filter (doctor, patient, admin)
  - Status filter (pending, active, suspended)
  - Verification status filter (pending, approved, rejected)
  - Search functionality (by name, email)
  - Sorting (by createdAt, lastLogin, email)
  - Sort order (asc/desc)

- **Pending Users** - GET `/api/admin/users/pending`
  - Shows only users with pending verification
  - Role filter
  - Pagination support

- **User Details** - GET `/api/admin/users/:id`
  - Complete user information
  - Profile completion percentage
  - Role-specific profiles (doctor/patient)
  - All verification and status details

### ✅ User Actions

- **Approve Verification** - PATCH `/api/admin/users/:id/verification`
  - One-click approval
  - Sets verificationStatus to "approved"

- **Reject Verification** - PATCH `/api/admin/users/:id/verification`
  - Rejection with reason
  - Sets verificationStatus to "rejected"
  - Stores rejection reason

- **Update Status** - PATCH `/api/admin/users/:id/status`
  - Set status to: active, suspended, or pending
  - Confirmation dialogs for safety

- **Soft Delete** - DELETE `/api/admin/users/:id`
  - Marks user as deleted
  - Sets isDeleted flag
  - Confirmation dialog

## Configuration

### Environment Variables

Create a `.env.local` file with:

```env
# Backend API for data operations
NEXT_PUBLIC_API_URL=https://maio-backend.onrender.com
NEXT_PUBLIC_BASE_URL=https://maio-backend.onrender.com

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://kqlcjtwmnrbexspxatiy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Running the Application

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the dashboard.

### Docker Deployment

```bash
# Using docker-compose (recommended)
docker-compose up -d

# Or build and run manually
docker build -t admin-dashboard .
docker run -p 3000:3000 admin-dashboard
```

📖 **See [DOCKER.md](DOCKER.md) for detailed Docker deployment guide**

## Features Overview

### 🔐 Authentication

- Supabase email/password authentication
- Redux Toolkit state management
- Protected routes with automatic redirects
- Session persistence

### 📊 Dashboard

- User metrics and analytics
- Interactive charts (Bar, Pie, Line)
- Responsive design with dark mode

### 👥 User Management

- List all users with advanced filters
- Pending verification queue
- User details and profile viewing
- Document management

### 📅 Appointments

- View and manage appointments
- Filtering by status and date range
- Appointment details with patient/doctor info

### 📤 Export Features

- **PDF Export** - Generate formatted PDF reports
- **Excel Export** - Download data in .xlsx format
- Available for users and appointments tables

### 🐳 Docker Support

- Multi-stage optimized builds
- Production-ready configuration
- Easy deployment with docker-compose

## Navigation

- `/` - Redirects to login or dashboard
- `/login` - Admin login form
- `/dashboard` - Dashboard with metrics
- `/users` - All users with filters and search
- `/users/pending` - Pending verification users
- `/users/[id]` - User details with actions

## Removed Features

**No features were removed.** All the APIs mentioned in the documentation have been implemented:

1. ✅ POST `/api/admin/login` - Login
2. ✅ GET `/api/admin/dashboard/metrics` - Dashboard metrics
3. ✅ GET `/api/admin/users` - List users with filters
4. ✅ GET `/api/admin/users/pending` - Pending users
5. ✅ GET `/api/admin/users/:id` - User details
6. ✅ PATCH `/api/admin/users/:id/verification` - Approve/reject verification
7. ✅ PATCH `/api/admin/users/:id/status` - Update user status
8. ✅ DELETE `/api/admin/users/:id` - Soft delete user

**Note:** The registration endpoint (POST `/api/admin/register`) is available in the API client but not exposed in the UI as it's typically a one-time setup operation.

## API Client

All API calls are centralized in `lib/api.js` with:

- Automatic token management
- Request/response error handling
- Clean method interfaces for all endpoints

# MAIO-DahBoard
