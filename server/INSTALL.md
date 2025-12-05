# Installation Instructions

## Required Packages

Close the `package.json` file in VS Code, then run:

```bash
npm install bcryptjs jsonwebtoken
```

## What Was Implemented

### ✅ Authentication System
- User registration with validation
- Login with JWT tokens
- Access tokens (15 min expiry)
- Refresh tokens (7 day expiry)
- Logout functionality
- Password hashing with bcrypt

### ✅ Authorization System
- Role-based access control (user, admin)
- Protected routes with middleware
- User ownership verification
- Admin-only endpoints

### ✅ User Management
- User profile management
- Password change functionality
- Account deactivation
- User listing (admin)
- Role management (admin)

### ✅ Security Features
- JWT token validation
- Password strength requirements
- Secure token storage
- User-specific task access
- Active account verification

## Files Created

**Models:**
- `model/user.js` - User schema with bcrypt

**Controllers:**
- `controllers/authController.js` - Auth logic

**Middleware:**
- `middleware/auth.js` - Authentication & authorization
- `middleware/authValidation.js` - Input validation

**Routes:**
- `routes/authRoutes.js` - Auth endpoints

**Utils:**
- `utils/jwt.js` - JWT token generation/verification

**Documentation:**
- `AUTHENTICATION.md` - Complete auth guide

## Files Modified

- `model/tasks.js` - Added user ownership
- `controllers/taskController.js` - User-specific tasks
- `routes/route.js` - Added authentication requirement
- `index.js` - Added auth routes
- `.env` - Added JWT secrets

## Start Server

After installing packages:

```bash
npm start
```

## API Endpoints

**Public:**
- POST `/api/auth/register`
- POST `/api/auth/login`
- POST `/api/auth/refresh-token`

**Protected (require auth token):**
- POST `/api/auth/logout`
- GET `/api/auth/profile`
- PUT `/api/auth/profile`
- PUT `/api/auth/change-password`
- GET/POST/PUT/DELETE `/api/tasks/*`

**Admin Only:**
- GET `/api/auth/users`
- PUT `/api/auth/users/:userId/role`
- PUT `/api/auth/users/:userId/deactivate`

## Testing

1. Register: `POST /api/auth/register`
2. Copy the `accessToken` from response
3. Use in header: `Authorization: Bearer <token>`
4. Create tasks with authenticated requests

See `AUTHENTICATION.md` for detailed examples!
