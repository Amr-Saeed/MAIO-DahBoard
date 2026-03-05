# Supabase Authentication Integration

This project uses **Supabase** for authentication (sign up and sign in) instead of a custom backend.

## Configuration

### Environment Variables

The Supabase credentials are stored in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://kqlcjtwmnrbexspxatiy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Files Structure

- **`lib/supabase.js`** - Supabase client initialization
- **`store/slices/authSlice.js`** - Redux auth slice with Supabase integration
- **`app/login/page.js`** - Login page using Supabase auth
- **`app/signup/page.js`** - Signup page using Supabase auth

## Features

### Sign Up

- Creates user account in Supabase
- Sends email verification automatically
- Stores user metadata (firstName, lastName, phoneNumber)
- Redirects to login after successful registration

### Sign In

- Authenticates with email and password
- Stores session in localStorage
- Manages authentication state with Redux
- Provides persistent login sessions

### Sign Out

- Clears Supabase session
- Clears local storage
- Resets Redux auth state
- Redirects to login page

## Usage

### Sign Up New User

```javascript
import { useDispatch } from "react-redux";
import { signupUser } from "@/store/slices/authSlice";

const dispatch = useDispatch();

const handleSignup = async () => {
  const result = await dispatch(
    signupUser(email, password, {
      firstName: "John",
      lastName: "Doe",
      phoneNumber: "1234567890",
    }),
  );

  if (result.success) {
    // Registration successful
  }
};
```

### Sign In User

```javascript
import { useDispatch } from "react-redux";
import { loginUser } from "@/store/slices/authSlice";

const dispatch = useDispatch();

const handleLogin = async () => {
  const result = await dispatch(loginUser(email, password));

  if (result.success) {
    // Login successful
  }
};
```

### Check Authentication

```javascript
import { useAuth } from "@/hooks/useAuth";

const { isAuthenticated, user, isLoading } = useAuth();
```

### Sign Out

```javascript
import { useAuth } from "@/hooks/useAuth";

const { logout } = useAuth();

const handleLogout = () => {
  logout();
};
```

## Supabase Dashboard

**Project URL**: https://kqlcjtwmnrbexspxatiy.supabase.co

### Managing Users

1. Go to Supabase Dashboard
2. Navigate to Authentication > Users
3. View all registered users
4. Manually verify users if needed
5. Delete or suspend users

### Email Templates

Supabase automatically sends:

- Email verification on sign up
- Password reset emails
- Email change confirmation

You can customize these templates in:
**Authentication > Email Templates**

## Security Notes

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Use environment variables** for all sensitive data
3. **Enable RLS policies** in Supabase for database security
4. **Configure email settings** properly in Supabase dashboard

## API Endpoints Still Using Custom Backend

The following features still use the custom backend API (`maio-backend.onrender.com`):

- Dashboard metrics
- User management (fetching user lists, details)
- Appointments management
- Document management

**Authentication is handled by Supabase**, but all other data operations use the existing backend.

## Troubleshooting

### "Invalid login credentials"

- Check if user email is verified
- Verify email/password are correct
- Check Supabase dashboard for user status

### "User already registered"

- Email already exists in Supabase
- Try password reset instead
- Check Supabase dashboard

### Session not persisting

- Check if localStorage is enabled
- Verify Supabase session configuration
- Check browser console for errors

### Email not received

- Check spam folder
- Verify email settings in Supabase
- Check Supabase logs in dashboard

## Next Steps

To fully integrate Supabase:

1. **Enable Row Level Security (RLS)** on database tables
2. **Configure email provider** (SMTP settings)
3. **Set up custom email templates**
4. **Add social auth providers** (Google, GitHub, etc.)
5. **Implement password reset flow**
6. **Add multi-factor authentication**

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers)
- [Next.js + Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
