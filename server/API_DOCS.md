# Task Manager API Documentation

## Base URL
`http://localhost:5000/api`

## Endpoints

### 1. Get All Tasks
**GET** `/tasks`

**Query Parameters:**
- `completed` (boolean): Filter by completion status
- `priority` (string): Filter by priority (low, medium, high, urgent)
- `archived` (boolean): Filter by archived status (default: false)
- `tags` (string): Comma-separated tags to filter by
- `sortBy` (string): Field to sort by (default: createdAt)
- `order` (string): Sort order - asc or desc (default: desc)
- `page` (number): Page number for pagination (default: 1)
- `limit` (number): Items per page (default: 50)

**Example:**
```
GET /tasks?completed=false&priority=high&sortBy=dueDate&order=asc&page=1&limit=10
```

### 2. Get Task Statistics
**GET** `/tasks/stats`

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 25,
    "completed": 10,
    "pending": 15,
    "overdue": 3,
    "completionRate": 40,
    "byPriority": {
      "low": 5,
      "medium": 10,
      "high": 8,
      "urgent": 2
    }
  }
}
```

### 3. Create Task
**POST** `/tasks`

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
    },
    {
      "title": "Draft proposal",
      "completed": true
    }
  ]
}
```

**Validation Rules:**
- `title` (required): 3-100 characters
- `description` (optional): max 500 characters
- `priority` (optional): low, medium, high, or urgent (default: medium)
- `dueDate` (optional): ISO date string, must be in future
- `tags` (optional): Array of strings, max 20 chars each
- `subtasks` (optional): Array with title (required, max 100 chars)

### 4. Update Task
**PUT** `/tasks/:id`

**Request Body:** (all fields optional)
```json
{
  "title": "Updated title",
  "completed": true,
  "priority": "medium",
  "archived": false
}
```

### 5. Delete Task
**DELETE** `/tasks/:id`

**Response:**
```json
{
  "success": true,
  "message": "Task deleted successfully",
  "data": { ... }
}
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "title",
      "message": "Title must be at least 3 characters"
    }
  ]
}
```

## Task Model Fields

- `title` (string, required): Task title
- `description` (string): Detailed description
- `completed` (boolean): Completion status
- `priority` (string): low, medium, high, urgent
- `dueDate` (date): When task is due
- `tags` (array): Category tags
- `subtasks` (array): List of subtasks with title and completed status
- `archived` (boolean): Archive status
- `createdAt` (date): Auto-generated creation timestamp
- `updatedAt` (date): Auto-generated update timestamp
- `isOverdue` (virtual): Computed field indicating if task is overdue

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Server Error
