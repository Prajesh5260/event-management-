# Polished Events - Feature Walkthrough Guide

## 🎯 Visual User Journey

### 1. Landing Page (Homepage)
```
┌─────────────────────────────────────────┐
│  Polished [Login] [Sign Up]             │  ← Navigation Bar
├─────────────────────────────────────────┤
│                                         │
│   Welcome to Polished Events            │
│   Professional Event Management         │
│                                         │
│        [Browse Events] [Services]       │
├─────────────────────────────────────────┤
│  [Home] [About] [Services] [Gallery]    │  ← Footer
└─────────────────────────────────────────┘
```

### 2. Sign Up Page
```
┌─────────────────────────────────────────┐
│  Polished [Login] [Sign Up]             │
├─────────────────────────────────────────┤
│  Create Account                         │
│  Join us now! Already have account?     │
│  [Login]                                │
│                                         │
│  ⚠️ All fields are required            │ (Error message)
│                                         │
│  [First Name ________________]          │
│  [Last Name  ________________]          │
│  [Email      ________________]          │
│  [Password   ________________]          │
│  [Confirm    ________________]          │
│                                         │
│          [Create Account]               │
│                                         │
│  By registering...                      │
└─────────────────────────────────────────┘
```

### 3. After Sign Up Success
```
┌─────────────────────────────────────────┐
│  Polished [Book Now] [My Bookings]      │  ← Changed!
│            [Logout (John)]              │
├─────────────────────────────────────────┤
│  ✓ Account created successfully!        │
│    Redirecting to home...               │
│                                         │
│  (Auto-redirect in 1.5 seconds)        │
└─────────────────────────────────────────┘
```

### 4. Booking Page - Select Type
```
┌─────────────────────────────────────────┐
│  Polished [Book Now] [My Bookings]      │
│            [Logout (John)]              │
├─────────────────────────────────────────┤
│                                         │
│   Book Your Event or Service            │
│   Reserve your perfect celebration      │
│                                         │
│   Make a Booking                        │
│                                         │
│   What would you like to book?          │
│   [ 📅 Event ]  [ 🎁 Service ]  ← Select
│                                         │
│   Select an Event                       │
│   [ Wedding Planning ($5000)     ▼ ]   │
│                                         │
│   Quantity                              │
│   [ 1 ]↑↓                              │
│                                         │
│   Preferred Date                        │
│   [ 2024-12-25 ]                       │
│                                         │
│   Additional Notes                      │
│   [ Tell us about preferences... ]      │
│                                         │
│   Unit Price: $5000                    │
│   Quantity:   1                         │
│   ────────────────────────────────      │
│   Total Price: $5000                   │
│                                         │
│      [Complete Booking]                 │
│                                         │
│   ← Back to Events                      │
└─────────────────────────────────────────┘
```

### 5. My Bookings Page
```
┌─────────────────────────────────────────┐
│  Polished [Book Now] [My Bookings]      │
│            [Logout (John)]              │
├─────────────────────────────────────────┤
│                                         │
│   My Bookings                           │
│   Manage and track all your bookings    │
│                                         │
│   Booking Cards:                        │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ Event Booking      [✓ Confirmed] │  │
│  │ Wedding Planning                 │  │
│  │                                  │  │
│  │ Type:           Event            │  │
│  │ Quantity:       1                │  │
│  │ Preferred Date: Dec 25, 2024     │  │
│  │ Total Price:    $5000            │  │
│  │ Notes:          Please confirm   │  │
│  │ Booked On:      Jan 15, 2024     │  │
│  │                                  │  │
│  │     [Cancel Booking]             │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ Service Booking    [⏳ Pending]   │  │
│  │ Catering Service                 │  │
│  │                                  │  │
│  │ Type:           Service          │  │
│  │ Quantity:       1                │  │
│  │ Preferred Date: Jan 05, 2024     │  │
│  │ Total Price:    $1200            │  │
│  │ Booked On:      Jan 15, 2024     │  │
│  │                                  │  │
│  │     [Cancel Booking]             │  │
│  └──────────────────────────────────┘  │
│                                         │
│       ← Back to Home                    │
└─────────────────────────────────────────┘
```

### 6. After Canceling Booking
```
┌─────────────────────────────────────────┐
│  ✓ Booking cancelled successfully!      │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ Event Booking      [✕ Cancelled] │  │
│  │ Wedding Planning                 │  │
│  │  (No Cancel button - already done)  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

## 🔐 Login & Authentication Flow

### Login Page
```
┌─────────────────────────────────────────┐
│  Polished [Login] [Sign Up]             │
├─────────────────────────────────────────┤
│                                         │
│   Login                                 │
│   Don't have account? [Create Account]  │
│                                         │
│   [Email Address____________]           │
│   [Password    ____________]           │
│                                         │
│           [Login]                       │
│                                         │
│   Forgot Password?                      │
├─────────────────────────────────────────┤
│  [About] [Services] [Gallery] [Contact] │
└─────────────────────────────────────────┘
```

### After Login Success
```
Navigation updates from:
  [Login] [Sign Up]

To:
  [Book Now] [My Bookings] [Logout (John)]
```

### Logout
```
Click [Logout (John)]
    ↓
Clear localStorage (token, user)
    ↓
Update Navigation back to [Login] [Sign Up]
    ↓
Redirect to Home
```

---

## 📊 Data Flow Diagrams

### Signup Process
```
User Input Form
    ↓
Client-side Validation
    ├─ Required fields?
    ├─ Password 6+ chars?
    └─ Passwords match?
    ↓
POST /api/auth/register
    ├─ JSON with firstName, lastName, email, password
    ↓
Server Validation & Hash Password
    ↓
Create User in Database
    ↓
Generate JWT Token
    ↓
Return { token, user }
    ↓
Store in localStorage
    ↓
Update Navigation
    ↓
Redirect to Home
```

### Booking Process
```
User on Booking Page
    ↓
Select Type (Event or Service)
    ↓
Choose Item from Dropdown
    ├─ Fetched from GET /api/events
    └─ Fetched from GET /api/services
    ↓
Set Quantity & Date
    ↓
Optional Notes
    ↓
Real-time Price Calculation
    ├─ Item Price × Quantity
    ↓
Form Validation
    ├─ All required fields?
    ├─ Date selected?
    └─ Item selected?
    ↓
POST /api/bookings
    ├─ Include JWT token in header
    ├─ Send bookingType, eventId/serviceId, quantity, date
    ↓
Server Creates Booking
    ├─ Validate user owns booking
    ├─ Calculate totalPrice
    ├─ Set status to "Pending"
    ↓
Return { booking }
    ↓
Show Success Message
    ↓
Redirect to My Bookings
```

### View & Cancel Booking
```
User Clicks "My Bookings"
    ↓
Fetch GET /api/bookings/user/my-bookings
    ├─ Include JWT token
    ↓
Server Returns All User Bookings
    ├─ With Event/Service details
    ├─ Formatted dates
    ├─ Price details
    ↓
Display in Grid Layout
    ├─ Show all details
    ├─ Show status badges
    ├─ Show cancel button (if not cancelled)
    ↓
User Clicks [Cancel Booking]
    ├─ Show confirmation dialog
    ↓
DELETE /api/bookings/:id
    ├─ Include JWT token
    ├─ Verify ownership
    ↓
Update Booking Status to "Cancelled"
    ↓
Refresh Bookings List
    ↓
Show Success Message
```

---

## 🎨 Color & Status Reference

### Status Badges
```
⏳ Pending   → Yellow background  (#fff3cd)
✓ Confirmed → Green background   (#d4edda)
✕ Cancelled → Red background     (#f8d7da)
```

### Message Types
```
✓ Success  → Green border + checkmark
             Background: #efd
             Color: #1e8449

⚠ Error    → Red border + warning icon
             Background: #fee
             Color: #c0392b
```

### Color Palette
```
Primary Blue:    #0C1B33 (Used for text, borders, backgrounds)
Primary Beige:   #B2AA8E (Used for buttons, accents)
Light Beige:     #D4C8B8 (Used for hover states)
Background:      #F5F3F0 (Used for page backgrounds)
Very Light:      #E8DFCF (Used for subtle backgrounds)
```

---

## 📱 Mobile Responsive Behavior

### Mobile Navigation
```
Desktop: [Logo] [Nav Links] [Login] [Sign Up]
Mobile:  [Logo] [☰] → Toggles menu
           ↓
         [Nav Links]
         [Book Now]
         [My Bookings]
         [Logout]
```

### Mobile Booking Form
```
Desktop: Side-by-side inputs
Mobile:  Stacked vertically
```

### Mobile Bookings Grid
```
Desktop: 3 cards per row
Tablet:  2 cards per row
Mobile:  1 card per row
```

---

## 🔄 State Management

### User State (localStorage)
```javascript
localStorage {
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  user: {
    id: "uuid",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com"
  }
}
```

### Component State (React)
```
App.jsx
├── currentPage: 'home' | 'signup' | 'login' | 'booking' | etc.
└── Passed to all child components
    ├── Navigation
    │   ├── user: null | { firstName, lastName, email }
    │   └── mobileMenuOpen: boolean
    └── Pages
        ├── BookingPage
        │   ├── bookingType: 'Event' | 'Service'
        │   ├── selectedEvent/Service: id
        │   ├── quantity, preferredDate, notes
        │   ├── loading, error, success
        │   └── events/services: array
        └── MyBookingsPage
            ├── bookings: array
            ├── loading, error, success
            └── cancelingId: string | null
```

---

## 🛡️ Error Handling Examples

### Signup Errors
```
"First Name is required"
"Email already exists"
"Password must be at least 6 characters"
"Passwords do not match"
"Error creating account. Please try again."
```

### Login Errors
```
"Email and password are required"
"Invalid credentials"
"User not found"
"Error logging in. Please try again."
```

### Booking Errors
```
"Please login to make a booking"
"Please select a preferred date"
"Please select an event"
"Please select a service"
"Booking failed"
"Error creating booking. Please try again."
```

### Cancel Errors
```
"Are you sure you want to cancel this booking?"  (Confirmation)
"Booking cancelled successfully!"
"Failed to cancel booking"
"Error cancelling booking. Please try again."
```

---

## 📡 API Response Examples

### Successful Signup
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com"
  }
}
```

### Successful Booking Creation
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "eventId": "550e8400-e29b-41d4-a716-446655440002",
  "bookingType": "Event",
  "quantity": 2,
  "totalPrice": 10000,
  "preferredDate": "2024-12-25",
  "notes": "Please confirm",
  "status": "Pending",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### Successful Bookings Fetch
```json
{
  "bookings": [
    {
      "id": "...",
      "bookingType": "Event",
      "quantity": 1,
      "totalPrice": 5000,
      "status": "Confirmed",
      "Event": {
        "eventName": "Wedding Planning",
        "budget": 5000
      }
    },
    {
      "id": "...",
      "bookingType": "Service",
      "quantity": 1,
      "totalPrice": 1200,
      "status": "Pending",
      "Service": {
        "serviceName": "Catering",
        "category": "Catering",
        "price": 1200
      }
    }
  ]
}
```

---

## ✅ Validation Rules

### Signup Form
```
First Name:
  ✓ Required
  ✓ Min 1 character
  ✓ Max 50 characters

Last Name:
  ✓ Required
  ✓ Min 1 character
  ✓ Max 50 characters

Email:
  ✓ Required
  ✓ Valid email format
  ✓ Unique in database

Password:
  ✓ Required
  ✓ Min 6 characters
  ✓ Must match confirm password
  ✓ Hashed with bcryptjs
```

### Booking Form
```
Booking Type:
  ✓ Required
  ✓ Must be "Event" or "Service"

Event/Service:
  ✓ Required
  ✓ Must exist in database
  ✓ Must be active

Quantity:
  ✓ Required
  ✓ Min 1
  ✓ Max 100
  ✓ Must be integer

Preferred Date:
  ✓ Required
  ✓ Valid date format
  ✓ Should be future date

Notes:
  ✓ Optional
  ✓ Max 500 characters
```

---

## 🎯 Success Metrics

You can verify success by checking:

1. **Signup Works**: Create account → See success message → Logged in
2. **Login Works**: Login → See my name in navbar → Can book
3. **Booking Works**: Select event/service → Book → See in My Bookings
4. **Cancellation Works**: Click cancel → Confirm → Status changes
5. **Navigation Updates**: Logout → See Login button | Login → See Logout
6. **Styling Works**: No layout issues, colors consistent
7. **Responsive**: Works on mobile, tablet, desktop
8. **Performance**: No errors in browser console
9. **Data Persists**: Refresh page → Still logged in
10. **API Works**: All endpoints return correct responses

---

## 🚀 Quick Testing Script

```javascript
// Paste in browser console to test:

// 1. Check if logged in
console.log("User:", JSON.parse(localStorage.getItem('user')));
console.log("Token:", localStorage.getItem('token'));

// 2. Test API connection
fetch('http://localhost:5000/api/events')
  .then(r => r.json())
  .then(d => console.log("Events:", d));

// 3. Check navigation
console.log("Current page:", currentPage);
```

---

**This guide provides a complete visual and technical reference for all features!**

Use it to understand flows, test features, or troubleshoot issues.
