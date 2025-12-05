# Authentication & Authorization Guide

## Overview
JWT-based authentication with access and refresh tokens, password hashing with bcrypt, and role-based authorization.

---

## Setup

### 1. Install Dependencies
```bash
npm install bcryptjs jsonwebtoken
```

### 2. Environment Variables
Already configured in `.env`:
```
ACCESS_TOKEN_SECRET=your-super-secret-access-token-key-change-this-in-production-12345
REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key-change-this-in-production-67890
```

**⚠️ IMPORTANT:** Change these secrets in production!

---

## Authentication Endpoints

### 1. Register New User
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123"
}
```

**Password Requirements:**
- Minimum 6 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "67521abc...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "isActive": true,
      "createdAt": "2025-12-05T20:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Login
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:** Same as register

### 3. Refresh Access Token
**POST** `/api/auth/refresh-token`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 4. Logout
**POST** `/api/auth/logout`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## User Profile Endpoints

### 5. Get Profile
**GET** `/api/auth/profile`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "67521abc...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "avatar": null,
    "isActive": true,
    "createdAt": "2025-12-05T20:00:00.000Z",
    "lastLogin": "2025-12-05T20:15:00.000Z"
  }
}
```

### 6. Update Profile
**PUT** `/api/auth/profile`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "avatar": "https://example.com/avatar.jpg"
}
```

### 7. Change Password
**PUT** `/api/auth/change-password`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
  "currentPassword": "SecurePass123",
  "newPassword": "NewSecurePass456",
  "confirmPassword": "NewSecurePass456"
}
```

---

## Admin Endpoints

### 8. Get All Users (Admin Only)
**GET** `/api/auth/users`

**Headers:**
```
Authorization: Bearer <adminAccessToken>
```

**Query Parameters:**
- `role` (optional): Filter by role (user, admin)
- `isActive` (optional): Filter by active status
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

### 9. Update User Role (Admin Only)
**PUT** `/api/auth/users/:userId/role`

**Headers:**
```
Authorization: Bearer <adminAccessToken>
```

**Request Body:**
```json
{
  "role": "admin"
}
```

### 10. Deactivate User (Admin Only)
**PUT** `/api/auth/users/:userId/deactivate`

**Headers:**
```
Authorization: Bearer <adminAccessToken>
```

---

## Using Authentication with Tasks

All task endpoints now require authentication:

### Create Task (Protected)
**POST** `/api/tasks`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
  "title": "My Task",
  "description": "Task description",
  "priority": "high"
}
```

**Note:** Tasks are automatically associated with the authenticated user.

### Get Tasks (Protected)
**GET** `/api/tasks`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Note:** Only returns tasks belonging to the authenticated user.

---

## Token Management

### Access Token
- **Lifespan:** 15 minutes
- **Purpose:** Authenticate API requests
- **Storage:** Store in memory (not localStorage for security)

### Refresh Token
- **Lifespan:** 7 days
- **Purpose:** Get new access tokens
- **Storage:** Secure httpOnly cookie (recommended) or secure storage

### Token Refresh Flow
1. Access token expires (after 15 minutes)
2. Client sends refresh token to `/api/auth/refresh-token`
3. Server validates refresh token
4. Server issues new access token
5. Client uses new access token for API requests

---

## Authorization Levels

### User Role (default)
- Create, read, update, delete own tasks
- View own profile
- Update own profile
- Change own password

### Admin Role
- All user permissions
- View all users
- Update user roles
- Deactivate users

---

## Security Features

✅ **Password Hashing** - bcrypt with salt rounds
✅ **JWT Tokens** - Signed with secret keys
✅ **Token Expiration** - Short-lived access tokens
✅ **Refresh Tokens** - Stored securely in database
✅ **Password Validation** - Strong password requirements
✅ **Role-Based Access Control** - User and Admin roles
✅ **User Ownership** - Tasks are user-specific
✅ **Account Deactivation** - Soft delete for users

---

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "No token provided. Please authenticate."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied. Required role: admin"
}
```

### 400 Validation Error
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "password",
      "message": "Password must be at least 6 characters"
    }
  ]
}
```

---

## Testing with Postman/Thunder Client

1. **Register a user** → Save `accessToken` and `refreshToken`
2. **Add Authorization header:** `Bearer <accessToken>`
3. **Make authenticated requests** to task endpoints
4. **When token expires:** Use `/api/auth/refresh-token`

---

## Next Steps

- Implement password reset via email
- Add OAuth providers (Google, GitHub)
- Implement two-factor authentication
- Add rate limiting to prevent brute force
- Set up email verification for new users
