# Backend Setup Guide

## Complete Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn
- Git

### Step 1: Install PostgreSQL

#### On Windows
1. Download from https://www.postgresql.org/download/windows/
2. Run the installer
3. Remember your password for the `postgres` user
4. Keep the default port 5432

#### On macOS
```bash
brew install postgresql
brew services start postgresql
```

#### On Linux
```bash
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start
```

### Step 2: Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE polished_events;

# View databases
\l

# Exit
\q
```

Or use pgAdmin GUI for easier database management.

### Step 3: Clone Project & Install Dependencies

```bash
# Navigate to backend directory
cd backend

# Install all dependencies
npm install

# Or with yarn
yarn install
```

### Step 4: Configure Environment Variables

Create `.env` file in backend directory:

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgres://postgres:your_password@localhost:5432/polished_events
DB_HOST=localhost
DB_PORT=5432
DB_NAME=polished_events
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRY=7d
```

Replace `your_password` with your PostgreSQL password.

### Step 5: Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

You should see:
```
✓ Database connected successfully
✓ Database models synced
✓ Server running on http://localhost:5000
```

### Step 6: Test the API

#### Quick Health Check
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-26T10:00:00Z"
}
```

#### Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### Step 7: Connect Frontend

In your frontend (React), create an API configuration file:

```javascript
// frontend/src/config/api.js
const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
  baseURL: API_BASE_URL,
  endpoints: {
    auth: {
      register: `${API_BASE_URL}/auth/register`,
      login: `${API_BASE_URL}/auth/login`,
    },
    users: {
      profile: `${API_BASE_URL}/users/profile`,
      changePassword: `${API_BASE_URL}/users/change-password`,
    },
    events: {
      list: `${API_BASE_URL}/events`,
      myEvents: `${API_BASE_URL}/events/user/my-events`,
      detail: (id) => `${API_BASE_URL}/events/${id}`,
    },
    services: {
      list: `${API_BASE_URL}/services`,
      detail: (id) => `${API_BASE_URL}/services/${id}`,
      categories: `${API_BASE_URL}/services/categories/list`,
    },
  },
};

// Helper function for API calls
export const fetchAPI = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.message);
  }

  return data;
};
```

Use in components:
```javascript
import { api, fetchAPI } from '../config/api';

// Login example
const handleLogin = async (email, password) => {
  try {
    const data = await fetchAPI(api.endpoints.auth.login, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  } catch (error) {
    console.error('Login error:', error.message);
  }
};
```

## Docker Setup (Optional)

### Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

### Create docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: polished_events
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  api:
    build: .
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: development
      DATABASE_URL: postgres://postgres:password@postgres:5432/polished_events
      DB_HOST: postgres
      DB_USER: postgres
      DB_PASSWORD: password
      DB_NAME: polished_events
      JWT_SECRET: your_jwt_secret
    depends_on:
      - postgres
    volumes:
      - .:/app
      - /app/node_modules

volumes:
  postgres_data:
```

### Run with Docker

```bash
docker-compose up
```

## Troubleshooting

### Port 5000 Already in Use

```bash
# On Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# On macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### Database Connection Error

1. Check PostgreSQL is running
2. Verify credentials in `.env`
3. Check database exists: `psql -U postgres -l`
4. Test connection: `psql -U postgres -d polished_events`

### CORS Error

Ensure backend has CORS enabled (already done in server.js).
Check frontend is calling correct backend URL.

### JWT Token Error

- Token might be expired (re-login)
- Check Authorization header format: `Bearer <token>`
- Verify JWT_SECRET is same in .env

### "Cannot find module" Error

```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

## Database Management

### Using pgAdmin GUI

1. Install pgAdmin (https://www.pgadmin.org/)
2. Connect to PostgreSQL server
3. View/manage databases visually

### Using CLI

```bash
# Connect to database
psql -U postgres -d polished_events

# View tables
\dt

# View table structure
\d "Users"

# Exit
\q
```

## Backup & Restore

### Backup Database

```bash
pg_dump -U postgres -d polished_events > backup.sql
```

### Restore Database

```bash
psql -U postgres -d polished_events < backup.sql
```

## Performance Tips

1. Use appropriate database indexes
2. Implement pagination for large data sets
3. Cache frequently accessed data
4. Monitor database queries
5. Use connection pooling (already configured)

## Security Checklist

- [ ] Change JWT_SECRET in production
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS in production
- [ ] Implement rate limiting
- [ ] Validate all user inputs
- [ ] Use strong passwords
- [ ] Keep dependencies updated
- [ ] Use CORS carefully
- [ ] Implement proper authentication
- [ ] Log security events

## Next Steps

1. ✅ Backend setup complete
2. → Connect frontend to API
3. → Implement additional features
4. → Add more validation
5. → Setup production deployment
6. → Add automated tests
7. → Setup CI/CD pipeline

## Support Resources

- Express.js: https://expressjs.com
- Sequelize: https://sequelize.org
- PostgreSQL: https://www.postgresql.org/docs
- JWT: https://jwt.io
- Node.js: https://nodejs.org/en/docs

