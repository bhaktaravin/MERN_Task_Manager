# Task Manager API - Back4App Integration

## Base URL
`http://localhost:5000/api`

## Dual Backend Support

Your Task Manager now supports **two backends**:
1. **MongoDB** (original) - `/api/tasks`
2. **Back4App Parse Server** - `/api/parse/tasks`

---

## Back4App Parse Server Endpoints

### 1. Get All Tasks from Back4App
**GET** `/parse/tasks`

**Query Parameters:**
- `completed` (boolean): Filter by completion status
- `priority` (string): Filter by priority (low, medium, high, urgent)
- `archived` (boolean): Filter by archived status (default: false)
- `sortBy` (string): Field to sort by (default: createdAt)
- `order` (string): Sort order - asc or desc (default: desc)
- `page` (number): Page number for pagination (default: 1)
- `limit` (number): Items per page (default: 50)

**Example:**
```bash
GET /api/parse/tasks?priority=high&completed=false
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "source": "Back4App Parse Server"
}
```

### 2. Get Task Statistics from Back4App
**GET** `/parse/tasks/stats`

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 25,
    "completed": 10,
    "pending": 15,
    "overdue": 3,
    "completionRate": 40
  },
  "source": "Back4App Parse Server"
}
```

### 3. Create Task in Back4App
**POST** `/parse/tasks`

**Request Body:**
```json
{
  "title": "Complete project proposal",
  "description": "Finalize and submit the Q1 project proposal",
  "priority": "high",
  "dueDate": "2025-12-15T10:00:00Z",
  "tags": ["work", "urgent"],
  "subtasks": [
    {
      "title": "Research competitors",
      "completed": false
    }
  ]
}
```

### 4. Update Task in Back4App
**PUT** `/parse/tasks/:id`

**Request Body:**
```json
{
  "title": "Updated title",
  "completed": true,
  "priority": "medium"
}
```

### 5. Delete Task from Back4App
**DELETE** `/parse/tasks/:id`

---

## MongoDB Endpoints (Original)

### Get All Tasks from MongoDB
**GET** `/tasks`

### Get Task Statistics from MongoDB
**GET** `/tasks/stats`

### Create Task in MongoDB
**POST** `/tasks`

### Update Task in MongoDB
**PUT** `/tasks/:id`

### Delete Task from MongoDB
**DELETE** `/tasks/:id`

---

## Setup Instructions

### 1. Install Parse SDK
```bash
npm install parse
```

### 2. Environment Variables
Already configured in `.env`:
```
BACK4APP_APP_ID=TqBlWgxw9F9LcvMvKWK3Zcm3LDZNKPr0YTE9YWqX
BACK4APP_MASTER_KEY=qSgqgPzPZnVGOG6SHLYd65g9VS9X7V0IB0eAEZGC
BACK4APP_SERVER_URL=https://parseapi.back4app.com
```

### 3. Start Server
```bash
npm start
```

---

## Usage Recommendations

**Use MongoDB when:**
- You need complex queries with aggregations
- You want full control over database schema
- Local development and testing

**Use Back4App Parse Server when:**
- You need cloud-hosted backend instantly
- You want built-in user authentication (future feature)
- You need real-time subscriptions
- You want automatic REST API without writing code
- You need file storage capabilities

---

## Next Steps

1. **Install Parse SDK:** `npm install parse`
2. **Test MongoDB routes:** `GET http://localhost:5000/api/tasks`
3. **Test Back4App routes:** `GET http://localhost:5000/api/parse/tasks`
4. **Choose your backend** or use both simultaneously!

---

## Benefits of Back4App Integration

✅ **Cloud-hosted database** - No MongoDB Atlas required
✅ **Automatic scaling** - Handles traffic spikes
✅ **Built-in dashboard** - View and manage data visually
✅ **Real-time queries** - Subscribe to live data changes
✅ **File storage** - Upload and serve files easily
✅ **User authentication** - Ready-to-use auth system
✅ **Push notifications** - Mobile app integration
