# Admin Dashboard - API Implementation

This is a complete admin dashboard built with Next.js that implements all the APIs from the Admin API documentation.

## Features Implemented

### ✅ Authentication

- **Login Form** - POST `/api/admin/login`
  - Email and password authentication
  - Token storage in localStorage
  - Automatic redirect to dashboard on successful login

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

Update the API base URL in `lib/api.js`:

```javascript
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";
```

Or set the environment variable:

```bash
NEXT_PUBLIC_API_URL=http://localhost:9000
```

## Running the Application

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

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
