# API Test Examples

## Quick Start Testing

### 1. Register a New User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid-here",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-26T10:00:00Z"
  }
}
```

### 2. Login User

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Get User Profile (Authenticated)

```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Create an Event

```bash
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Wedding Reception",
    "description": "Beautiful outdoor wedding reception",
    "eventType": "Wedding",
    "location": "Central Park, NYC",
    "eventDate": "2024-06-15",
    "startTime": "18:00",
    "endTime": "23:00",
    "guestCount": 150,
    "budget": 50000,
    "imageUrl": "https://example.com/image.jpg"
  }'
```

### 5. Get All Events

```bash
curl -X GET "http://localhost:5000/api/events?status=Upcoming&eventType=Wedding"
```

### 6. Get User's Events

```bash
curl -X GET http://localhost:5000/api/events/user/my-events \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 7. Get All Services

```bash
curl -X GET "http://localhost:5000/api/services?category=Photography&sortBy=rating"
```

### 8. Update User Profile

```bash
curl -X PUT http://localhost:5000/api/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "firstName": "Jane",
    "lastName": "Doe",
    "phone": "+1234567890",
    "bio": "Event planning professional"
  }'
```

## Using Postman

### Step 1: Create Environment Variable
1. Click "Settings" → "Manage Environments"
2. Create new environment with variable:
   - `base_url` = `http://localhost:5000`
   - `token` = (will be populated after login)

### Step 2: Register Request
```
POST {{base_url}}/api/auth/register
Body (JSON):
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}

In Tests tab:
pm.environment.set("token", pm.response.json().token);
```

### Step 3: Login Request
```
POST {{base_url}}/api/auth/login
Body (JSON):
{
  "email": "john@example.com",
  "password": "password123"
}

In Tests tab:
pm.environment.set("token", pm.response.json().token);
```

### Step 4: Get Profile (Authenticated)
```
GET {{base_url}}/api/users/profile

Headers:
Authorization: Bearer {{token}}
```

## Using REST Client (VS Code)

Create a file `api-test.http`:

```http
### Variables
@baseUrl = http://localhost:5000
@token = 

### Register User
POST {{baseUrl}}/api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}

### Login User
POST {{baseUrl}}/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

### Get Profile (Authenticated)
GET {{baseUrl}}/api/users/profile
Authorization: Bearer {{token}}

### Create Event
POST {{baseUrl}}/api/events
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "title": "Wedding Reception",
  "description": "Beautiful outdoor wedding",
  "eventType": "Wedding",
  "location": "Central Park, NYC",
  "eventDate": "2024-06-15",
  "startTime": "18:00",
  "endTime": "23:00",
  "guestCount": 150,
  "budget": 50000
}

### Get All Events
GET {{baseUrl}}/api/events

### Get User Events
GET {{baseUrl}}/api/events/user/my-events
Authorization: Bearer {{token}}

### Get All Services
GET {{baseUrl}}/api/services

### Get Services by Category
GET {{baseUrl}}/api/services?category=Photography&sortBy=rating

### Health Check
GET {{baseUrl}}/api/health
```

## Database Setup

### Create Database in PostgreSQL

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE polished_events;

-- Connect to the database
\c polished_events

-- Tables will be auto-created by Sequelize on first run
```

## Environment Variables Explanation

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | development or production |
| `PORT` | Server port (default: 5000) |
| `DB_HOST` | PostgreSQL host |
| `DB_PORT` | PostgreSQL port |
| `DB_NAME` | Database name |
| `DB_USER` | PostgreSQL username |
| `DB_PASSWORD` | PostgreSQL password |
| `JWT_SECRET` | Secret key for JWT signing |
| `JWT_EXPIRY` | Token expiration time (e.g., 7d) |

## Common Issues & Solutions

### Issue: "Cannot connect to database"
- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database exists

### Issue: "JWT token not found"
- Make sure you're including `Authorization: Bearer <token>` header
- Ensure token hasn't expired

### Issue: "Port 5000 already in use"
- Change `PORT` in `.env` to a different number
- Or kill the process using port 5000

### Issue: "CORS error"
- Ensure frontend is making requests to correct backend URL
- Check CORS is enabled in server.js

## Success Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 204 | No Content - Deleted successfully |
| 400 | Bad Request - Invalid data |
| 401 | Unauthorized - Missing/invalid token |
| 403 | Forbidden - Not authorized |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 500 | Server Error - Internal error |

## Next Steps

1. Start PostgreSQL
2. Create `.env` file with your database credentials
3. Run `npm install` to install dependencies
4. Run `npm run dev` to start the server
5. Use the API examples above to test endpoints
6. Connect your frontend to the API
