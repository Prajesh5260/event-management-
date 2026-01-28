# Polished Events - Backend API

A complete REST API backend for the Polished Events application built with Express.js and PostgreSQL.

## Features

✅ **User Authentication** - Register and login with JWT
✅ **User Management** - Profile management, password changes
✅ **Event Management** - Create, read, update, delete events
✅ **Service Catalog** - Browse event services with filtering
✅ **PostgreSQL Database** - Persistent data storage with Sequelize ORM
✅ **JWT Authorization** - Secure API endpoints
✅ **Error Handling** - Comprehensive error management
✅ **CORS Support** - Cross-origin requests enabled

## Tech Stack

- **Express.js** - Web framework
- **Sequelize** - ORM for PostgreSQL
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin support
- **Nodemon** - Development server

## Installation

### 1. Clone and Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup PostgreSQL Database

```sql
-- Create database
CREATE DATABASE polished_events;

-- Create user (optional)
CREATE USER postgres WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE polished_events TO postgres;
```

### 3. Configure Environment Variables

Create a `.env` file in the backend directory:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgres://postgres:password@localhost:5432/polished_events
DB_HOST=localhost
DB_PORT=5432
DB_NAME=polished_events
DB_USER=postgres
DB_PASSWORD=password
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRY=7d
```

### 4. Run the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Returns JWT token to use in Authorization header.

### User Routes (`/api/users`)

#### Get Profile (Protected)
```
GET /api/users/profile
Authorization: Bearer <token>
```

#### Update Profile (Protected)
```
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Doe",
  "phone": "+1234567890",
  "bio": "Event planning professional",
  "profileImage": "url_to_image"
}
```

#### Change Password (Protected)
```
PUT /api/users/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

#### Delete Account (Protected)
```
DELETE /api/users/account
Authorization: Bearer <token>
```

#### Get All Users
```
GET /api/users/all
```

### Event Routes (`/api/events`)

#### Create Event (Protected)
```
POST /api/events
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Wedding Reception",
  "description": "Beautiful outdoor wedding",
  "eventType": "Wedding",
  "location": "Central Park, NYC",
  "eventDate": "2024-06-15",
  "startTime": "18:00",
  "endTime": "23:00",
  "guestCount": 150,
  "budget": 50000,
  "imageUrl": "url_to_image"
}
```

#### Get All Events
```
GET /api/events
Query Parameters:
  - status: Upcoming|Completed|Cancelled
  - eventType: Wedding|Birthday|Anniversary|Corporate|Other
```

#### Get User's Events (Protected)
```
GET /api/events/user/my-events
Authorization: Bearer <token>
```

#### Get Event by ID
```
GET /api/events/:id
```

#### Update Event (Protected)
```
PUT /api/events/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description",
  "status": "Completed"
}
```

#### Delete Event (Protected)
```
DELETE /api/events/:id
Authorization: Bearer <token>
```

### Service Routes (`/api/services`)

#### Create Service (Protected)
```
POST /api/services
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Premium Photography",
  "description": "Professional photography services",
  "category": "Photography",
  "price": 2000,
  "imageUrl": "url_to_image"
}
```

#### Get All Services
```
GET /api/services
Query Parameters:
  - category: Catering|Decoration|Photography|Music|Venue|Planning
  - sortBy: price-low|price-high|rating
```

#### Get Service Categories
```
GET /api/services/categories/list
```

#### Get Service by ID
```
GET /api/services/:id
```

#### Update Service (Protected)
```
PUT /api/services/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "price": 2500,
  "rating": 4.8,
  "reviews": 45
}
```

#### Delete Service (Protected)
```
DELETE /api/services/:id
Authorization: Bearer <token>
```

### Health Check

```
GET /api/health
```

## Database Models

### User
- id (UUID, primary key)
- firstName (string)
- lastName (string)
- email (string, unique)
- password (hashed)
- phone (string, optional)
- profileImage (string, optional)
- bio (text, optional)
- isActive (boolean)
- emailVerified (boolean)
- createdAt (timestamp)
- updatedAt (timestamp)

### Event
- id (UUID, primary key)
- title (string)
- description (text)
- eventType (enum: Wedding, Birthday, Anniversary, Corporate, Other)
- location (string)
- eventDate (date)
- startTime (time, optional)
- endTime (time, optional)
- guestCount (integer, optional)
- budget (decimal, optional)
- imageUrl (string, optional)
- status (enum: Upcoming, Completed, Cancelled)
- userId (UUID, foreign key)
- createdAt (timestamp)
- updatedAt (timestamp)

### Service
- id (UUID, primary key)
- name (string)
- description (text)
- category (enum: Catering, Decoration, Photography, Music, Venue, Planning)
- price (decimal)
- imageUrl (string, optional)
- rating (decimal 0-5)
- reviews (integer)
- isActive (boolean)
- createdAt (timestamp)
- updatedAt (timestamp)

## Error Handling

All endpoints return standard JSON responses:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": {}
}
```

## Security

- Passwords are hashed using bcryptjs
- JWT tokens for authentication and authorization
- CORS enabled for frontend communication
- Input validation on all endpoints
- Environment variables for sensitive data

## Development

### Project Structure

```
backend/
├── config/
│   └── database.js          # Database configuration
├── middleware/
│   ├── auth.js              # JWT authentication
│   └── errorHandler.js      # Error handling
├── models/
│   ├── User.js              # User model
│   ├── Event.js             # Event model
│   └── Service.js           # Service model
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── users.js             # User routes
│   ├── events.js            # Event routes
│   └── services.js          # Service routes
├── .env                     # Environment variables
├── server.js                # Main server file
└── package.json             # Dependencies
```

## Testing Endpoints

Use tools like:
- Postman
- Insomnia
- Thunder Client
- VS Code REST Client

## Future Enhancements

- Email verification
- Password reset functionality
- Role-based access control (RBAC)
- Booking/Reservation system
- Payment integration
- Reviews and ratings
- File upload for images
- Real-time notifications
- Analytics dashboard

## License

ISC

## Support

For issues and questions, please create an issue in the repository.
