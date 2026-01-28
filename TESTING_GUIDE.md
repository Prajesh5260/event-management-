# Polished Events - Complete Testing Guide

## 🧪 Pre-Testing Checklist

Before running tests, ensure:
- [ ] Backend is running (`npm run dev` in backend folder)
- [ ] Frontend is running (`npm run dev` in frontend folder)
- [ ] PostgreSQL is running and accessible
- [ ] `.env` file in backend has correct credentials
- [ ] Browser console is open (F12 → Console tab)
- [ ] Backend logs are visible

---

## 🚀 Test Suite 1: Authentication

### Test 1.1 - Signup with Valid Data
**Steps:**
1. Navigate to frontend (http://localhost:5173)
2. Click "Sign Up" button
3. Fill form with:
   - First Name: `John`
   - Last Name: `Doe`
   - Email: `john.doe@example.com`
   - Password: `SecurePass123`
   - Confirm Password: `SecurePass123`
4. Click "Create Account"

**Expected Results:**
- ✅ No error message appears
- ✅ Success message appears: "Account created successfully!"
- ✅ Page redirects to home in 1.5 seconds
- ✅ Navigation shows: "Book Now", "My Bookings", "Logout (John)"
- ✅ Browser console shows no errors

**Database Check:**
```sql
SELECT * FROM "Users" WHERE email = 'john.doe@example.com';
-- Should show: User with hashed password, firstName='John', lastName='Doe'
```

---

### Test 1.2 - Signup with Mismatched Passwords
**Steps:**
1. Click "Sign Up" again
2. Fill form with:
   - First Name: `Jane`
   - Last Name: `Smith`
   - Email: `jane.smith@example.com`
   - Password: `SecurePass123`
   - Confirm Password: `DifferentPass456`
3. Click "Create Account"

**Expected Results:**
- ✅ Error message appears: "Passwords do not match"
- ✅ Form remains open (not submitted)
- ✅ No user created in database

---

### Test 1.3 - Signup with Short Password
**Steps:**
1. Click "Sign Up"
2. Fill form with:
   - First Name: `Bob`
   - Last Name: `Jones`
   - Email: `bob@example.com`
   - Password: `Pass1`
   - Confirm Password: `Pass1`
3. Click "Create Account"

**Expected Results:**
- ✅ Error message appears: "Password must be at least 6 characters"
- ✅ Form remains open

---

### Test 1.4 - Signup with Duplicate Email
**Steps:**
1. Click "Sign Up"
2. Fill form with same email as Test 1.1: `john.doe@example.com`
3. Fill other fields
4. Click "Create Account"

**Expected Results:**
- ✅ Error message appears: "Email already exists" or similar
- ✅ No new user created

---

### Test 1.5 - Signup with Missing Fields
**Steps:**
1. Click "Sign Up"
2. Leave all fields empty
3. Click "Create Account"

**Expected Results:**
- ✅ Browser validation prevents submission (HTML5 required attribute)
- OR
- ✅ Error message: "All fields are required"

---

### Test 1.6 - Login with Valid Credentials
**Steps:**
1. Click "Logout (John)" to logout first
2. Verify navbar shows "Login" and "Sign Up" buttons
3. Click "Login" button
4. Fill form:
   - Email: `john.doe@example.com`
   - Password: `SecurePass123`
5. Click "Login"

**Expected Results:**
- ✅ No error message
- ✅ Success message: "Login successful!"
- ✅ Redirects to home
- ✅ Navbar shows: "Book Now", "My Bookings", "Logout (John)"
- ✅ Token stored in localStorage

**Verification:**
```javascript
// In browser console:
console.log(localStorage.getItem('token')); // Shows JWT token
console.log(JSON.parse(localStorage.getItem('user'))); // Shows user object
```

---

### Test 1.7 - Login with Wrong Password
**Steps:**
1. Click "Logout (John)"
2. Click "Login"
3. Fill form:
   - Email: `john.doe@example.com`
   - Password: `WrongPassword123`
4. Click "Login"

**Expected Results:**
- ✅ Error message appears: "Invalid credentials" or similar
- ✅ Form remains open
- ✅ No redirect
- ✅ localStorage remains unchanged (no token stored)

---

### Test 1.8 - Login with Non-existent Email
**Steps:**
1. Click "Login"
2. Fill form:
   - Email: `nonexistent@example.com`
   - Password: `AnyPassword123`
3. Click "Login"

**Expected Results:**
- ✅ Error message appears
- ✅ No redirect

---

### Test 1.9 - Logout Functionality
**Steps:**
1. Ensure logged in (Show "Logout (John)" in navbar)
2. Click "Logout (John)" button

**Expected Results:**
- ✅ localStorage cleared (token and user removed)
- ✅ Navigation updates to show "Login" and "Sign Up"
- ✅ currentPage changes to 'home'
- ✅ Page displays homepage

**Verification:**
```javascript
// In browser console:
console.log(localStorage.getItem('token')); // Should be null
console.log(localStorage.getItem('user')); // Should be null
```

---

### Test 1.10 - Navigation Links for Auth
**Steps:**
1. When logged out: Click "Sign Up" link in login page
2. Verify it goes to signup
3. When signed up: Click "Login" link in signup page (if visible)
4. Verify navigation works

**Expected Results:**
- ✅ Both links work correctly
- ✅ Pages load without errors

---

## 🎁 Test Suite 2: Booking - Events

### Test 2.1 - Book Event with Valid Data
**Prerequisites:** Must be logged in

**Steps:**
1. Click "Book Now" in navbar
2. Verify "Event" button is selected (default)
3. Select event from dropdown: Any event (e.g., "Wedding Planning")
4. Set Quantity: `2`
5. Select Preferred Date: `2024-12-25` (or any future date)
6. Add Notes: `Please prepare for 100 guests`
7. Review price summary (should show: Unit Price × 2)
8. Click "Complete Booking"

**Expected Results:**
- ✅ No error message appears
- ✅ Success message: "Booking created successfully!"
- ✅ Redirects to "My Bookings" page after 1.5 seconds
- ✅ New booking appears in the grid
- ✅ Booking shows:
  - Status: "⏳ Pending"
  - Type: "Event"
  - Event name
  - Quantity: 2
  - Date: Dec 25, 2024
  - Calculated price

**Database Check:**
```sql
SELECT * FROM "Bookings" 
WHERE "userId" = (SELECT id FROM "Users" WHERE email = 'john.doe@example.com')
ORDER BY "createdAt" DESC LIMIT 1;
-- Should show: New booking with status='Pending'
```

---

### Test 2.2 - Book Event Without Selecting Event
**Steps:**
1. Click "Book Now"
2. Keep "Event" selected
3. Leave event dropdown empty (default "-- Choose an event --")
4. Set Quantity: 1
5. Select date
6. Click "Complete Booking"

**Expected Results:**
- ✅ Error message: "Please select an event"
- ✅ Form remains open
- ✅ No booking created

---

### Test 2.3 - Book Event Without Selecting Date
**Steps:**
1. Click "Book Now"
2. Select "Event"
3. Choose an event
4. Set Quantity
5. Leave date empty
6. Click "Complete Booking"

**Expected Results:**
- ✅ Error message: "Please select a preferred date"
- ✅ Form remains open

---

### Test 2.4 - Price Calculation for Event Booking
**Steps:**
1. Click "Book Now"
2. Select Event with budget: $5000
3. Set Quantity: `3`
4. Observe price summary

**Expected Results:**
- ✅ Price Summary shows:
  - Unit Price: $5000
  - Quantity: 3
  - Total Price: $15000

---

### Test 2.5 - Multiple Event Bookings
**Steps:**
1. Complete Test 2.1 (Book event with John)
2. Book a different event with different quantity
3. Go to "My Bookings"

**Expected Results:**
- ✅ Both bookings appear in grid
- ✅ Each shows correct details
- ✅ Each has unique ID in database

---

## 🎪 Test Suite 3: Booking - Services

### Test 3.1 - Book Service with Valid Data
**Prerequisites:** Must be logged in

**Steps:**
1. Click "Book Now"
2. Click "🎁 Service" button to switch type
3. Select service from dropdown: e.g., "Catering"
4. Set Quantity: `1`
5. Select Preferred Date
6. Click "Complete Booking"

**Expected Results:**
- ✅ Success message appears
- ✅ Redirects to "My Bookings"
- ✅ New service booking appears with:
  - Status: "⏳ Pending"
  - Type: "Service"
  - Service name: "Catering"
  - Price: Service price

**Database Check:**
```sql
SELECT * FROM "Bookings" 
WHERE "bookingType" = 'Service'
AND "serviceId" IS NOT NULL;
-- Should show service bookings
```

---

### Test 3.2 - Book Multiple Services
**Steps:**
1. Book Catering service
2. Go back to "Book Now"
3. Book Photography service
4. Check "My Bookings"

**Expected Results:**
- ✅ Both service bookings appear
- ✅ Different services shown with correct names

---

### Test 3.3 - Service Price Calculation
**Steps:**
1. Select service with price: $1200
2. Set Quantity: `2`
3. Check price summary

**Expected Results:**
- ✅ Total Price shows: $1200 × 2 = $2400

---

### Test 3.4 - Book Event and Service in Same Account
**Steps:**
1. Book an event (Test 2.1)
2. Book a service (Test 3.1)
3. Go to "My Bookings"

**Expected Results:**
- ✅ Both bookings appear in grid
- ✅ One shows "Event Booking", other shows "Service Booking"
- ✅ Correct details for each

---

## 📋 Test Suite 4: My Bookings Page

### Test 4.1 - View All Bookings
**Prerequisites:** Have at least 1 booking

**Steps:**
1. Click "My Bookings" in navbar
2. Observe all bookings displayed

**Expected Results:**
- ✅ Page loads with "My Bookings" heading
- ✅ All user bookings displayed in grid
- ✅ Each booking shows:
  - Booking type (Event/Service)
  - Name of event/service
  - Status badge (color-coded)
  - Type, Quantity, Date, Price, Booked On
  - Cancel button (if not already cancelled)

---

### Test 4.2 - Booking Status Display
**Steps:**
1. View "My Bookings"
2. Observe status badges

**Expected Results:**
- ✅ Pending bookings show: "⏳ Pending" (yellow background)
- ✅ Confirmed bookings show: "✓ Confirmed" (green background)
- ✅ Cancelled bookings show: "✕ Cancelled" (red background)

---

### Test 4.3 - Cancel Booking
**Steps:**
1. Go to "My Bookings"
2. Find a "Pending" booking
3. Click "Cancel Booking" button
4. Confirm in dialog: "Are you sure..."

**Expected Results:**
- ✅ Dialog appears asking for confirmation
- ✅ If confirmed:
  - Button shows "Cancelling..."
  - Booking status changes to "✕ Cancelled"
  - Success message: "Booking cancelled successfully!"
  - Cancel button disappears (or disabled)
- ✅ If cancelled (click No):
  - Dialog closes
  - Nothing changes
  - Booking remains active

**Database Check:**
```sql
SELECT * FROM "Bookings" WHERE "id" = 'booking_id';
-- status should be 'Cancelled'
```

---

### Test 4.4 - Cannot Cancel Already Cancelled Booking
**Steps:**
1. Cancel a booking (Test 4.3)
2. Refresh page
3. Look at cancelled booking

**Expected Results:**
- ✅ Cancelled booking has no "Cancel Booking" button
- ✅ Status shows "✕ Cancelled"

---

### Test 4.5 - Empty Bookings State
**Steps:**
1. Create new account
2. Navigate to "My Bookings" without booking anything
3. Observe page

**Expected Results:**
- ✅ Page shows: "No bookings yet"
- ✅ Shows message: "Start planning your event..."
- ✅ Shows [Make a Booking] button
- ✅ Clicking button goes to booking page

---

### Test 4.6 - Booking Details Display
**Steps:**
1. Book event with notes: "Please confirm date"
2. Go to "My Bookings"
3. Find booking and check all details

**Expected Results:**
- ✅ All fields visible:
  - Type: Event
  - Name: Correct event name
  - Quantity: Correct number
  - Preferred Date: Correct date formatted
  - Total Price: Correct price with $ symbol
  - Notes: "Please confirm date" (if provided)
  - Booked On: Today's date

---

### Test 4.7 - Logout from My Bookings
**Steps:**
1. Go to "My Bookings"
2. Click "Logout (John)"

**Expected Results:**
- ✅ Logged out successfully
- ✅ Redirected to home
- ✅ Cannot access "My Bookings" without logging in

---

## 🔐 Test Suite 5: Permission & Authorization

### Test 5.1 - Unauthorized Booking Access
**Steps:**
1. Logout from account
2. Try to access booking page directly (clear localStorage first):
   ```javascript
   localStorage.removeItem('token');
   localStorage.removeItem('user');
   ```
3. Click "Book Now"

**Expected Results:**
- ✅ Get error: "Please login to make a booking"
- ✅ Auto-redirect to login page after 1.5 seconds

---

### Test 5.2 - Cannot View Others' Bookings
**Steps:**
1. Create Account A and book event
2. Create Account B
3. Try to access Account A's bookings as Account B via API:
   ```bash
   curl -H "Authorization: Bearer TOKEN_B" \
     http://localhost:5000/api/bookings/BOOKING_A_ID
   ```

**Expected Results:**
- ✅ GET returns booking details (endpoint allows viewing)
- ✅ PUT/DELETE should fail with "Unauthorized" (owner check)

---

### Test 5.3 - Cannot Cancel Others' Bookings
**Steps:**
1. Create Account A, book event, get booking ID
2. Create Account B
3. Try to cancel Account A's booking as Account B:
   ```bash
   curl -X DELETE -H "Authorization: Bearer TOKEN_B" \
     http://localhost:5000/api/bookings/BOOKING_A_ID
   ```

**Expected Results:**
- ✅ Request fails with 403 Forbidden or similar
- ✅ Booking status remains unchanged in database

---

## 🎨 Test Suite 6: UI/UX & Styling

### Test 6.1 - Error Message Styling
**Steps:**
1. Try signup with mismatched passwords
2. Observe error message styling

**Expected Results:**
- ✅ Error message appears with:
  - Red background (#fee)
  - Red left border
  - Red text (#c0392b)
  - Warning icon (⚠)

---

### Test 6.2 - Success Message Styling
**Steps:**
1. Successfully signup or login
2. Observe success message

**Expected Results:**
- ✅ Success message shows:
  - Green background (#efd)
  - Green left border
  - Green text (#1e8449)
  - Checkmark icon (✓)

---

### Test 6.3 - Loading States
**Steps:**
1. On signup form, click "Create Account"
2. Quickly check button before success/error

**Expected Results:**
- ✅ Button text changes to "Creating Account..."
- ✅ Button appears disabled (opacity reduced)
- ✅ Changes back after API response

---

### Test 6.4 - Form Focus States
**Steps:**
1. Go to signup form
2. Click on an input field

**Expected Results:**
- ✅ Input gets focus:
  - Border color changes to #B2AA8E
  - Background becomes white
  - Blue shadow appears

---

### Test 6.5 - Button Hover States
**Steps:**
1. Hover over "Create Account" button

**Expected Results:**
- ✅ Button changes:
  - Slightly raised (translateY)
  - Shadow increases
  - Color slightly lighter

---

### Test 6.6 - Responsive Design - Desktop
**Steps:**
1. Open frontend on desktop (1920x1080 or larger)
2. Navigate all pages

**Expected Results:**
- ✅ Proper layout and spacing
- ✅ No text overflow
- ✅ Buttons properly sized
- ✅ Forms readable

---

### Test 6.7 - Responsive Design - Tablet
**Steps:**
1. Open frontend on tablet (768x1024)
2. Test navigation and booking

**Expected Results:**
- ✅ Mobile menu works
- ✅ Grid adapts to 1-2 columns
- ✅ Inputs stack vertically
- ✅ Readable and usable

---

### Test 6.8 - Responsive Design - Mobile
**Steps:**
1. Open frontend on mobile (375x667)
2. Test signup, booking, and view bookings

**Expected Results:**
- ✅ Mobile menu toggle works
- ✅ Single column layout
- ✅ Touch-friendly buttons
- ✅ Forms easy to fill on small screen

---

## 🔧 Test Suite 7: API & Backend

### Test 7.1 - API Endpoint Verification
**Steps:**
Use curl to test each endpoint:

```bash
# 1. Signup
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@test.com","password":"Pass123"}'

# 2. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Pass123"}'

# 3. Get events (use token from login)
curl -X GET http://localhost:5000/api/events \
  -H "Authorization: Bearer TOKEN"

# 4. Create booking
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"bookingType":"Event","eventId":"EVENT_ID","quantity":1,"preferredDate":"2024-12-25","notes":"Test"}'
```

**Expected Results:**
- ✅ All endpoints return valid JSON
- ✅ Correct HTTP status codes (200, 201, 400, 401, etc.)
- ✅ Error messages are descriptive

---

### Test 7.2 - Token Validation
**Steps:**
1. Try API call without token:
```bash
curl -X GET http://localhost:5000/api/bookings/user/my-bookings
```

2. Try with invalid token:
```bash
curl -X GET http://localhost:5000/api/bookings/user/my-bookings \
  -H "Authorization: Bearer INVALID_TOKEN"
```

**Expected Results:**
- ✅ First request returns 401 Unauthorized
- ✅ Second request returns 401 Unauthorized
- ✅ Error message: "Token required" or "Invalid token"

---

### Test 7.3 - Database Integration
**Steps:**
1. Create booking via UI
2. Check database:
```sql
SELECT * FROM "Bookings" ORDER BY "createdAt" DESC LIMIT 1;
```

**Expected Results:**
- ✅ New booking appears in database
- ✅ All fields populated correctly
- ✅ Status is "Pending"
- ✅ Timestamps are current

---

## 📊 Test Suite 8: Data Validation

### Test 8.1 - Email Format Validation
**Steps:**
1. Try signup with invalid emails:
   - `notanemail`
   - `test@`
   - `@example.com`

**Expected Results:**
- ✅ Browser HTML5 validation prevents submission
- OR
- ✅ Server validation returns error

---

### Test 8.2 - Quantity Range Validation
**Steps:**
1. Book event and try quantity values:
   - `0` (should not allow)
   - `101` (if max is 100)
   - `abc` (should not allow)

**Expected Results:**
- ✅ Form prevents invalid entries
- ✅ Error if submitted with invalid data

---

### Test 8.3 - Date Validation
**Steps:**
1. Try to select past date for booking

**Expected Results:**
- ✅ Form should either:
  - Disable past dates in date picker
  - Accept but warn user
  - Accept with server-side warning

---

## 🔄 Test Suite 9: State Management & Persistence

### Test 9.1 - Token Persistence
**Steps:**
1. Login to account
2. Refresh page (F5)
3. Observe if still logged in

**Expected Results:**
- ✅ Still logged in after refresh
- ✅ Navigation shows "Logout (John)"
- ✅ localStorage still has token and user

---

### Test 9.2 - Multi-Tab Synchronization
**Steps:**
1. Login in Tab A
2. Open same URL in Tab B
3. Logout in Tab A
4. Refresh Tab B

**Expected Results:**
- ✅ Tab B shows logout (may need refresh)
- ✅ Both tabs in sync

---

### Test 9.3 - Page Refresh During Booking
**Steps:**
1. Start filling booking form
2. Refresh page mid-way

**Expected Results:**
- ✅ Form resets (expected behavior)
- ✅ Still logged in (token persists)

---

## 🚨 Test Suite 10: Error Handling & Edge Cases

### Test 10.1 - Network Error During Signup
**Steps:**
1. Open DevTools (F12)
2. Go to Network tab
3. Set throttling to "Offline"
4. Try to signup

**Expected Results:**
- ✅ Error message: "Error creating account. Please try again."
- ✅ Form remains open for retry

---

### Test 10.2 - Backend Offline
**Steps:**
1. Stop backend server (npm run dev terminal, Ctrl+C)
2. Try to book event

**Expected Results:**
- ✅ Error message appears
- ✅ No infinite loading
- ✅ User can retry when backend is back

---

### Test 10.3 - Database Offline
**Steps:**
1. Shutdown PostgreSQL
2. Try to signup

**Expected Results:**
- ✅ Backend error (check logs)
- ✅ User sees error message
- ✅ Frontend doesn't crash

---

### Test 10.4 - Concurrent Bookings
**Steps:**
1. Open two browser tabs, both logged in
2. Book in Tab A
3. Book in Tab B simultaneously

**Expected Results:**
- ✅ Both bookings create successfully
- ✅ No data corruption
- ✅ Both appear in My Bookings

---

## ✅ Final Verification Checklist

**Before marking complete, verify ALL of:**

### Authentication (10/10)
- [ ] Signup with valid data works
- [ ] Signup validation prevents invalid data
- [ ] Login with correct credentials works
- [ ] Login prevents wrong credentials
- [ ] Logout clears localStorage
- [ ] Navigation updates on auth state
- [ ] Can't book without logging in
- [ ] Tokens persist on page refresh
- [ ] Tokens prevent unauthorized access
- [ ] Error messages display correctly

### Booking (8/8)
- [ ] Can book events
- [ ] Can book services
- [ ] Price calculates correctly
- [ ] Bookings save to database
- [ ] Bookings display in My Bookings
- [ ] Can cancel bookings
- [ ] Cancelled bookings show correct status
- [ ] Multiple bookings work simultaneously

### UI/UX (6/6)
- [ ] Error messages styled correctly
- [ ] Success messages styled correctly
- [ ] Loading states work
- [ ] Form inputs have proper focus states
- [ ] Responsive on mobile, tablet, desktop
- [ ] No console errors

### API (4/4)
- [ ] Auth endpoints work
- [ ] Booking endpoints work
- [ ] Token validation works
- [ ] Database stores data correctly

### Edge Cases (3/3)
- [ ] Network errors handled gracefully
- [ ] Backend offline handled gracefully
- [ ] Concurrent operations work correctly

---

**TOTAL TESTS: 100+**

**Run this guide methodically to ensure complete quality assurance!**

All tests should pass for the project to be considered production-ready.
