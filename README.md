# 🏥 Medical Admin Dashboard

# ⚠️ **IMPORTANT DISCLAIMER**

**This project was originally developed to work with a custom backend API and real medical data. The current version has been adapted to use DummyJSON (https://dummyjson.com) as a mock data source for demonstration purposes.**

**⚠️ Due to this change, you may notice:**
- Some UI fields expecting specific data structures from the real backend
- Certain features that reference medical documents or complex user profiles may display placeholder data
- API response structures that have been adapted from the original backend format
- Mock data patterns (e.g., user IDs divisible by 7 = pending verification) instead of real verification workflows

**For production use, this application should be reconnected to a proper backend API with real data validation, security measures, and proper medical data handling practices.**

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Implementation Approach](#implementation-approach)
- [Features](#features)
- [Setup Instructions](#setup-instructions)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

A comprehensive admin dashboard for managing medical appointments, user verifications, and healthcare provider profiles. The application provides a complete interface for administrators to oversee doctors, patients, appointments, and verification processes.

**Key Capabilities:**
- User authentication and session management
- Dashboard with real-time metrics and analytics
- User management (doctors and patients) with advanced filtering
- Appointment scheduling and tracking
- Verification workflow for pending user accounts
- PDF and Excel export functionality
- Dark mode support with theme persistence
- Responsive design for all devices

---

## 🚀 Tech Stack

### Frontend Framework
- **Next.js 16.0.7** - React framework with App Router and Turbopack
- **React 19.2.0** - UI library with latest features

### State Management & Data
- **Redux Toolkit 2.11.2** - Global state management
- **Axios 1.13.2** - HTTP client for API requests
- **DummyJSON API** - Mock data source (https://dummyjson.com)

### Authentication
- **Supabase 2.98.0** - Authentication and user management

### Styling & UI
- **Tailwind CSS v4** - Utility-first CSS framework
- **Custom Dark Mode** - Theme toggle with localStorage persistence
- **Recharts 3.6.0** - Interactive charts and data visualization

### Export & Reports
- **jsPDF 4.2.0** - PDF generation
- **jspdf-autotable 5.0.7** - Table formatting for PDFs
- **xlsx 0.18.5** - Excel file generation

---

## 💡 Implementation Approach

### Architecture Overview

This application follows a **hybrid architecture** combining Supabase for authentication and DummyJSON for demonstration data:

#### 1. **Authentication Layer (Supabase)**
- Uses Supabase Auth for secure user authentication
- Session management handled through Redux Toolkit
- Protected routes with authentication guards
- Persistent login sessions across page refreshes

#### 2. **Data Layer (DummyJSON API)**
- Fetches user and appointment data from DummyJSON public API
- Data transformation layer to adapt DummyJSON format to medical dashboard structure
- Mock verification status logic (ID-based patterns for demo purposes)
- Client-side filtering and pagination for filtered results

#### 3. **State Management Strategy**
- Redux Toolkit with slices for modular state organization
- Authentication state in `authSlice.js`
- Persistent auth state using localStorage
- React hooks (`useAuth`) for easy component access

#### 4. **Component Architecture**
- Server components by default for better performance
- Client components marked with `'use client'` for interactivity
- Reusable components (`ThemeToggle`, `UserImage`)
- Context providers for theme management

#### 5. **Data Flow**
```
User Action → Component → API Client → DummyJSON/Supabase → Response Transform → State Update → UI Render
```

#### 6. **Key Design Decisions**

**Separation of Concerns:**
- Authentication: Supabase (real user accounts)
- Data Display: DummyJSON (mock data for demonstration)
- This allows testing the UI without a full backend

**Mock Data Patterns:**
- User IDs divisible by 3 = Doctors
- User IDs divisible by 7 = Pending verification
- User IDs divisible by 11 = Rejected verification
- All other users = Verified patients

**Client-Side Filtering:**
- Fetches larger datasets from DummyJSON
- Applies filters (role, status, verification) in JavaScript
- Implements pagination after filtering for realistic behavior

**Export Functionality:**
- jsPDF for professional PDF reports
- xlsx for Excel spreadsheets
- Data mapping to handle both DummyJSON and real backend formats

---

## ✨ Features

### ✅ Authentication (Supabase)
- **Sign Up**: Email/password registration with user metadata
- **Sign In**: Secure authentication with session management
- **Sign Out**: Complete session cleanup
- **Protected Routes**: Automatic redirect to login for unauthenticated users
- **Session Persistence**: Stay logged in across browser sessions

### ✅ Dashboard Metrics
- Total users, doctors, patients, and appointments
- Verification status breakdown (pending, approved, rejected)
- Interactive charts with Recharts
- Real-time data updates
- Dark mode compatible visualizations

### ✅ User Management
- **All Users Page**: Complete user directory with advanced filtering
  - Filter by role (doctor/patient)
  - Filter by account status (active/inactive/suspended)
  - Filter by verification status (pending/verified/rejected)
  - Search by name or email
  - Sortable columns
  - Pagination controls
  
- **Pending Verification Page**: Dedicated view for users awaiting approval
  - Filter pending users by role
  - Quick access to user details
  - Approve/Reject actions
  
- **User Detail Page**: Comprehensive user profile
  - Basic information and profile picture
  - Role-specific data (doctor specializations, patient medical history)
  - Verification status management
  - Approve/Reject verification buttons for pending users
  - Update account status (suspend, activate)
  - Soft delete functionality
  - View medical documents and certificates

### ✅ Appointment Management
- Complete appointment listing
- Appointment details with patient and doctor information
- Filter by status, date, doctor, patient
- Export appointments to PDF/Excel

### ✅ Export Functionality
- **PDF Export**: Professional reports with tables and formatting
- **Excel Export**: Spreadsheet format for data analysis
- Export users or appointments with full details

### ✅ Theme Support
- Light and dark mode toggle
- Theme persistence using localStorage
- Smooth transitions between themes
- Optimized for readability in both modes

---

## 🛠️ Setup Instructions

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Git** for version control
- A **Supabase account** (free tier available at https://supabase.com)

### Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd dashboard
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

### Step 3: Set Up Supabase

1. Go to https://supabase.com and create a new project
2. Once your project is created, go to **Project Settings → API**
3. Copy your **Project URL** and **anon/public key**
4. Create a `.env.local` file in the root directory

### Step 4: Configure Environment Variables

Create a `.env.local` file in the root directory with the following:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Important:** Replace the placeholder values with your actual Supabase credentials.

### Step 5: Run the Development Server

```bash
npm run dev
# or
yarn dev
```

The application will start on http://localhost:3000

### Step 6: Create a Test Account

1. Navigate to http://localhost:3000/signup
2. Register with an email and password
3. You'll be automatically logged in and redirected to the dashboard

### Step 7: Access the Dashboard

- **Login Page**: http://localhost:3000/login
- **Dashboard**: http://localhost:3000/dashboard
- **All Users**: http://localhost:3000/users
- **Pending Verification**: http://localhost:3000/users/pending
- **Appointments**: http://localhost:3000/appointments

---

## 📁 Project Structure

```
dashboard/
├── app/                          # Next.js App Router
│   ├── login/                    # Login page
│   │   └── page.js
│   ├── signup/                   # Signup page
│   │   └── page.js
│   ├── dashboard/                # Main dashboard
│   │   └── page.js
│   ├── users/                    # User management
│   │   ├── page.js              # All users list
│   │   ├── pending/             # Pending verification users
│   │   │   └── page.js
│   │   └── [id]/                # User detail pages
│   │       ├── page.js
│   │       ├── documents/
│   │       │   └── page.js
│   │       └── medical-documents/
│   │           └── page.js
│   ├── appointments/             # Appointment management
│   │   ├── page.js
│   │   └── [id]/
│   │       └── page.js
│   ├── layout.js                # Root layout with providers
│   ├── page.js                  # Home/redirect page
│   └── globals.css              # Global styles
│
├── components/                   # Reusable components
│   ├── ThemeToggle.js           # Dark mode toggle
│   └── UserImage.js             # User avatar component
│
├── contexts/                     # React contexts
│   ├── AuthContext.js           # Authentication context
│   └── ThemeContext.js          # Theme context
│
├── hooks/                        # Custom React hooks
│   └── useAuth.js               # Authentication hook
│
├── lib/                          # Library code
│   ├── api.js                   # API client (DummyJSON + Supabase)
│   └── supabase.js              # Supabase client configuration
│
├── store/                        # Redux store
│   ├── index.js                 # Store configuration
│   └── slices/
│       └── authSlice.js         # Authentication slice
│
├── utils/                        # Utility functions
│   ├── exportPDF.js             # PDF export functionality
│   └── exportExcel.js           # Excel export functionality
│
├── public/                       # Static assets
├── .env.local                   # Environment variables (create this)
├── package.json                 # Dependencies
├── next.config.mjs              # Next.js configuration
├── tailwind.config.js           # Tailwind CSS configuration
└── README.md                    # This file
```

---

## 📡 API Documentation

### API Client Architecture

The application uses a hybrid API approach:

**Authentication APIs (Supabase):**
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Authenticate user
- `POST /auth/logout` - End session
- `GET /auth/user` - Get current user

**Data APIs (DummyJSON):**
- `GET https://dummyjson.com/users` - Fetch users
- `GET https://dummyjson.com/users/:id` - Fetch user by ID
- `GET https://dummyjson.com/products` - Fetch appointments (mapped from products)

### Data Transformation Layer

Located in `lib/api.js`, this layer:
- Transforms DummyJSON responses to match expected medical dashboard format
- Adds mock verification status based on ID patterns
- Maps product data to appointment structure
- Implements client-side filtering and pagination

### Key API Methods

#### `getDashboardMetrics()`
Returns overview statistics:
```javascript
{
  data: {
    totals: { users, doctors, patients, appointments },
    verification: { pending, approved, rejected },
    appointments: { total, upcoming, completed, cancelled }
  }
}
```

#### `getUsers(params)`
Fetches and filters users:
```javascript
// Parameters
{
  page: 1,
  limit: 10,
  role: 'doctor' | 'patient',
  status: 'active' | 'inactive' | 'suspended',
  verificationStatus: 'pending' | 'verified' | 'rejected',
  search: 'search term'
}

// Response
{
  data: [...users],
  pagination: { total, page, limit, pages }
}
```

#### `getUserById(userId)`
Returns complete user profile:
```javascript
{
  data: {
    _id, email, firstName, lastName, role,
    verificationStatus, status,
    doctorProfile: { ... },  // If role is doctor
    patientProfile: { ... }  // If role is patient
  }
}
```

#### `getAppointments(params)`
Fetches appointments with filtering:
```javascript
{
  data: [...appointments],
  pagination: { total, page, limit, pages }
}
```

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration (Required for Authentication)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: For production deployment
# NEXT_PUBLIC_API_URL=https://your-backend-api.com
```

**Security Notes:**
- Never commit `.env.local` to version control
- Keep your Supabase anon key secure
- For production, use environment-specific variables
- Rotate keys regularly

---

## 🐛 Troubleshooting

### Common Issues and Solutions

#### 1. "Module not found" errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 2. Port already in use
```bash
# Kill the process using port 3000
# On Windows PowerShell:
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force

# On Mac/Linux:
lsof -ti:3000 | xargs kill -9

# Or use a different port:
npm run dev -- -p 3001
```

#### 3. Supabase connection errors
- Verify your `.env.local` file exists and has correct credentials
- Check that your Supabase project is active
- Ensure you're using the correct Project URL and anon key
- Try creating a new Supabase project if issues persist

#### 4. Next.js lock file error
```bash
# Remove the lock file and .next directory
Remove-Item -Path ".next" -Recurse -Force
npm run dev
```

#### 5. Dark mode not persisting
- Clear your browser's localStorage
- Check browser console for errors
- Ensure JavaScript is enabled

#### 6. PDF export not working
```bash
# Reinstall jsPDF dependencies
npm uninstall jspdf jspdf-autotable
npm install jspdf@4.2.0 jspdf-autotable@5.0.7
```

#### 7. Users not showing on pending page
- This is expected behavior with mock data
- Only users with IDs divisible by 7 have "pending" status
- Try navigating to `/users/7`, `/users/14`, `/users/21`, etc.

#### 8. API data not loading
- Check browser console for network errors
- DummyJSON might be rate-limiting requests
- Try refreshing the page after a few seconds
- Check your internet connection

---

## 🚀 Building for Production

### Build the Application

```bash
npm run build
```

### Run Production Server Locally

```bash
npm start
```

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Add environment variables in Vercel dashboard
5. Deploy

### Deploy to Other Platforms

The application can be deployed to any platform that supports Next.js:
- **Netlify**: Use Next.js build plugin
- **AWS Amplify**: Connect your Git repository
- **Docker**: Use the included Dockerfile

---

## 📝 Additional Notes

### Mock Data Patterns

Since the application uses DummyJSON for demonstration:

- **User IDs divisible by 3**: Assigned as Doctors
- **User IDs divisible by 7**: Pending verification status
- **User IDs divisible by 11**: Rejected verification status
- **User IDs divisible by 5**: Inactive account status
- All other users are active, verified patients

### Connecting to a Real Backend

To connect this frontend to a real backend:

1. Update `lib/api.js` to point to your backend URL
2. Remove the DummyJSON transformation logic
3. Ensure your backend returns data in the expected format
4. Add proper error handling and authentication headers
5. Implement real API endpoints for user management and verification

### Future Enhancements

Recommended improvements for production:
- Add real-time notifications for new verification requests
- Implement email notifications for user actions
- Add audit logs for admin actions
- Implement role-based access control (RBAC)
- Add data validation and sanitization
- Implement proper error boundaries
- Add loading skeletons for better UX
- Add unit and integration tests

---

## 📄 License

This project is for educational and demonstration purposes.

---

## 👥 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Review existing documentation
- Check troubleshooting section above

---

**Made with ❤️ using Next.js and React**

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
