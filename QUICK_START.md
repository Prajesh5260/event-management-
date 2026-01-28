# Quick Start Guide - Polished Events

## Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (running with the credentials in `.env`)
- npm or yarn

## Setup Instructions

### 1. Backend Setup
```bash
cd backend
npm install  # Already done - 89 packages installed
npm run dev  # Start the backend server on port 5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install  # Install dependencies
npm run dev  # Start the frontend development server
```

The frontend will typically start on `http://localhost:5173` or `http://localhost:3000`

## Testing the Features

### Test 1: Sign Up
1. Open the frontend in your browser
2. Click "Sign Up" button in the navigation
3. Fill in the form:
   - **First Name**: John
   - **Last Name**: Doe
   - **Email**: john.doe@example.com
   - **Password**: Password123
   - **Confirm Password**: Password123
4. Click "Create Account"
5. You should see a success message and redirect to home page
6. The navbar should now show: "Book Now", "My Bookings", "Logout (John)"

### Test 2: Log Out and Log In
1. Click "Logout (John)" button
2. The navbar should revert to "Login" and "Sign Up" buttons
3. Click "Login"
4. Enter the email and password from Test 1
5. Click "Login"
6. You should be logged back in

### Test 3: Book an Event
1. Make sure you're logged in
2. Click "Book Now" in the navbar
3. Select "Event" (should be default)
4. In the "Select an Event" dropdown, choose an event (e.g., "Wedding Planning")
5. Set Quantity to 2
6. Select a Preferred Date (any future date)
7. Add Notes (optional): "Please confirm the date"
8. Review the Price Summary
9. Click "Complete Booking"
10. You should be redirected to "My Bookings" with the new booking visible

### Test 4: Book a Service
1. Click "Book Now" again
2. Select "Service" button
3. In the "Select a Service" dropdown, choose a service (e.g., "Catering")
4. Set Quantity to 1
5. Select a Preferred Date
6. Click "Complete Booking"
7. The new service booking should appear in "My Bookings"

### Test 5: View and Cancel Bookings
1. Click "My Bookings" in the navbar
2. You should see all your bookings:
   - Event bookings and Service bookings
   - Booking status (Pending, Confirmed, Cancelled)
   - Price, date, and other details
3. Click "Cancel Booking" on any active booking
4. Confirm the cancellation
5. The booking status should change to "Cancelled"

## API Testing with Curl

### Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "password": "Password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane.smith@example.com",
    "password": "Password123"
  }'
```

### Create a Booking (replace TOKEN with actual JWT token)
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "bookingType": "Event",
    "eventId": "UUID_OF_EVENT",
    "quantity": 1,
    "preferredDate": "2024-12-25",
    "notes": "Please confirm availability"
  }'
```

### Get My Bookings (replace TOKEN with actual JWT token)
```bash
curl -X GET http://localhost:5000/api/bookings/user/my-bookings \
  -H "Authorization: Bearer TOKEN"
```

### Cancel a Booking (replace TOKEN and BOOKING_ID)
```bash
curl -X DELETE http://localhost:5000/api/bookings/BOOKING_ID \
  -H "Authorization: Bearer TOKEN"
```

## Troubleshooting

### Backend Won't Start
- **Error**: `EADDRINUSE: address already in use :::5000`
  - Solution: Port 5000 is already in use. Kill the process or use a different port.
  
- **Error**: `password authentication failed for user "postgres"`
  - Solution: Check the `.env` file and ensure `DB_PASSWORD` is correct

### Frontend Can't Connect to Backend
- **Error**: `Failed to fetch` or CORS errors
  - Solution: Make sure backend is running on `http://localhost:5000`
  - Check the `API_BASE_URL` in components matches your backend URL

### Bookings Not Showing
- **Issue**: "No bookings yet" message
  - Solution: Create a new booking by clicking "Book Now"

### Login/Signup Not Working
- **Issue**: Form submission does nothing
  - Solution: 
    - Check browser console for errors
    - Ensure backend is running
    - Verify email is not already registered

## Database Verification

### Connect to PostgreSQL
```bash
psql -U postgres -d polished_events_db
```

### Check Tables
```sql
\dt  -- List all tables
SELECT * FROM "Users";  -- Check users
SELECT * FROM "Bookings";  -- Check bookings
SELECT * FROM "Events";  -- Check events
SELECT * FROM "Services";  -- Check services
```

## Project Structure

```
Polished Events/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Event.js
│   │   ├── Service.js
│   │   └── Booking.js (NEW)
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── events.js
│   │   ├── services.js
│   │   └── bookings.js (NEW)
│   ├── middleware/
│   ├── config/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Homepage.jsx
│   │   │   ├── AboutPage.jsx
│   │   │   ├── ServicesPage.jsx
│   │   │   ├── GalleryPage.jsx
│   │   │   ├── ContactPage.jsx
│   │   │   ├── EventPage.jsx
│   │   │   ├── EventDetailsPage.jsx
│   │   │   ├── login.jsx
│   │   │   ├── signup.jsx
│   │   │   ├── BookingPage.jsx (NEW)
│   │   │   └── MyBookingsPage.jsx (NEW)
│   │   ├── components/
│   │   │   ├── Navigation.jsx
│   │   │   └── Footer.jsx
│   │   ├── styles/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
└── IMPLEMENTATION_STATUS.md (NEW)
```

## Support

For issues or questions:
1. Check the console in browser DevTools (F12)
2. Check backend logs in terminal
3. Verify `.env` file has correct credentials
4. Ensure both backend and frontend are running
5. Clear browser cache if needed (Ctrl+Shift+Del)

---

**Last Updated**: $(date)
**Status**: ✅ Complete and Ready for Testing
