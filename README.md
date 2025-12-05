# Task Manager Backend API

MERN Stack Task Manager with JWT Authentication, MongoDB, and Back4App Parse Server integration.

## Features

- ✅ JWT Authentication (Access & Refresh Tokens)
- ✅ User Management with Role-Based Access Control
- ✅ Task Management with Advanced Features
- ✅ MongoDB Integration
- ✅ Back4App Parse Server Integration
- ✅ Input Validation & Error Handling
- ✅ Docker Support

## Environment Variables

Set these environment variables in your deployment platform:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Server
PORT=5000

# JWT Secrets
ACCESS_TOKEN_SECRET=your-access-token-secret
REFRESH_TOKEN_SECRET=your-refresh-token-secret

# Back4App (Optional)
BACK4APP_APP_ID=your_app_id
BACK4APP_MASTER_KEY=your_master_key
BACK4APP_REST_KEY=your_rest_key
BACK4APP_JAVASCRIPT_KEY=your_javascript_key
BACK4APP_SERVER_URL=https://parseapi.back4app.com
```

## Deploy to Back4App

### Prerequisites
1. Back4App account
2. GitHub repository connected to Back4App

### Deployment Steps

1. **Create a new app in Back4App**
   - Go to Back4App Dashboard
   - Click "Create New App"
   - Connect your GitHub repository
   - Select the `backend` branch

2. **Configure Environment Variables**
   - Go to App Settings → Environment Variables
   - Add all required environment variables listed above
   - **IMPORTANT:** Set your MongoDB URI (from MongoDB Atlas or similar)

3. **Deploy**
   - Back4App will automatically deploy from the backend branch
   - Monitor the deployment logs for any errors

### MongoDB Atlas Setup (if needed)

1. Create a cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user
3. Whitelist IP: `0.0.0.0/0` (allows connections from anywhere)
4. Get your connection string
5. Add it to Back4App environment variables as `MONGODB_URI`

## Local Development

```bash
# Install dependencies
npm install

# Create .env file with required variables
cp .env.example .env

# Start server
npm start

# Development mode with auto-reload
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Tasks (Protected)
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/stats` - Get task statistics
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Parse Server (Optional)
- `GET /api/parse/tasks` - Get tasks from Back4App
- `POST /api/parse/tasks` - Create task in Back4App
- `PUT /api/parse/tasks/:id` - Update task in Back4App
- `DELETE /api/parse/tasks/:id` - Delete task from Back4App

## Documentation

- [API Documentation](./API_DOCS.md)
- [Authentication Guide](./AUTHENTICATION.md)
- [Back4App Integration](./BACK4APP_INTEGRATION.md)
- [Installation Guide](./INSTALL.md)

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- express-validator
- Parse SDK (Back4App)
- Docker

## License

ISC
