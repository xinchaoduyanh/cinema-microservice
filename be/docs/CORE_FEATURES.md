# 🎯 Cinema Management - Core Features Specification

## 📋 Table of Contents
- [User Features](#user-features)
- [Admin Features](#admin-features)
- [Staff Features](#staff-features)
- [API Endpoints Summary](#api-endpoints-summary)
- [User Flows](#user-flows)
- [Business Rules](#business-rules)

---

## 👤 User Features

### **1. Authentication & Registration**

#### **1.1 Email Registration**
```
Flow:
1. User enters email, password, name
2. System validates email format & password strength
3. System sends verification email
4. User clicks verification link
5. Account activated

Validation Rules:
- Email: Valid format, unique
- Password: Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
- Name: Min 2 chars, max 50 chars
```

#### **1.2 Social Login (Google/Facebook)**
```
Flow:
1. User clicks "Login with Google/Facebook"
2. OAuth redirect to provider
3. User authorizes
4. System receives user info
5. Auto-create account if new user
6. Login successful

Data Retrieved:
- Email
- Name
- Avatar
- Provider ID
```

#### **1.3 Login**
```
Endpoints:
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "Password123!"
}

Response:
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "url",
    "role": "customer"
  }
}
```

#### **1.4 Forgot Password**
```
Flow:
1. User enters email
2. System sends reset link (valid 1 hour)
3. User clicks link
4. User enters new password
5. Password updated
6. Auto logout all sessions
```

---

### **2. Movie Browsing**

#### **2.1 Home Page**
```
Sections:
1. Now Showing (Carousel)
2. Coming Soon
3. Top Rated
4. Trending This Week
5. Recommended for You (based on history)

Filters:
- Genre
- Age Rating
- Language
- Release Date
```

#### **2.2 Movie Detail Page**
```
Information Displayed:
- Title, Original Title
- Poster, Trailer
- Duration, Release Date
- Genre, Director, Cast
- Rating (IMDb, User Rating)
- Age Rating
- Synopsis
- Reviews & Comments
- Showtimes (by cinema & date)

Actions:
- Play Trailer
- Add to Favorites
- Share
- Write Review
- Book Tickets
```

#### **2.3 Movie Search**
```
Search By:
- Title
- Actor
- Director
- Genre

Sort By:
- Relevance
- Rating (High to Low)
- Release Date (Newest)
- Popularity

Filters:
- Now Showing / Coming Soon
- Genre (multiple)
- Age Rating
- Language
- Duration Range
```

---

### **3. Cinema & Showtime Selection**

#### **3.1 Cinema Selection**
```
Display:
- List of cinemas showing selected movie
- Distance from user location
- Available showtimes
- Facilities (Parking, Restaurant, etc)

Sort By:
- Distance
- Name
- Number of showtimes

Filter By:
- City
- District
- Screen Type (2D, 3D, IMAX, 4DX)
```

#### **3.2 Showtime Selection**
```
Display:
- Date selector (next 7 days)
- Time slots grouped by cinema
- Screen type indicator
- Available seats count
- Price range

Information:
- Start time
- End time (calculated)
- Screen type
- Language
- Subtitle
- Available seats
```

---

### **4. Seat Selection**

#### **4.1 Seat Map**
```
Display:
- Interactive seat map
- Screen position indicator
- Seat types (Standard, VIP, Couple)
- Seat status (Available, Selected, Taken)
- Price per seat type

Features:
- Click to select/deselect
- Multi-seat selection
- Auto-lock selected seats (15 min)
- Real-time seat updates (WebSocket)

Seat Types:
- Standard: Regular seat
- VIP: Premium seat (more space)
- Couple: Double seat for 2 people

Seat Status Colors:
- Green: Available
- Yellow: Your selection
- Gray: Taken
- Red: Locked by others
```

#### **4.2 Seat Locking Mechanism**
```
Rules:
- Lock duration: 15 minutes
- Auto-release if not confirmed
- Show countdown timer
- Warning at 5 min, 2 min, 1 min
- Can extend lock once (5 min)

Technical:
- Use Redis for lock management
- WebSocket for real-time updates
- Optimistic locking for conflicts
```

---

### **5. Food & Beverage Selection**

#### **5.1 F&B Menu**
```
Categories:
- Popcorn
- Drinks
- Snacks
- Combos

Display:
- Item name, image
- Description
- Price
- Availability

Features:
- Add to cart
- Quantity selector
- Combo deals (auto-apply best price)
- Dietary info (Vegan, Gluten-free, etc)
```

#### **5.2 Combo Deals**
```
Example Combos:
1. Couple Combo: 2 Popcorn + 2 Drinks (Save 20%)
2. Family Combo: 3 Popcorn + 4 Drinks + 2 Snacks (Save 30%)
3. Solo Combo: 1 Popcorn + 1 Drink (Save 10%)

Auto-suggest:
- Based on number of seats selected
- Show savings amount
```

---

### **6. Voucher & Promotion**

#### **6.1 Apply Voucher**
```
Input:
- Voucher code

Validation:
- Code exists
- Not expired
- Not fully used
- User eligible
- Min purchase met

Types:
- Percentage discount (max cap)
- Fixed amount discount
- Free item
- Buy 1 Get 1

Display:
- Discount amount
- Final price
- Savings
```

#### **6.2 Available Promotions**
```
Display:
- Active promotions
- User's vouchers
- Loyalty points balance
- Membership benefits

Promotion Types:
- Flash Sale (time-limited)
- Early Bird (morning shows)
- Happy Hour (weekday afternoon)
- Weekend Special
- Student Discount
- Senior Discount
```

---

### **7. Payment**

#### **7.1 Payment Methods**
```
Options:
1. VNPay
2. MoMo
3. ZaloPay
4. Credit/Debit Card
5. Pay at Counter

Flow:
1. Select payment method
2. Review order summary
3. Redirect to payment gateway
4. Complete payment
5. Return to confirmation page
```

#### **7.2 Order Summary**
```
Display:
- Movie title, showtime
- Cinema, theater
- Seats (with prices)
- F&B items (with prices)
- Subtotal
- Discount
- Total amount

Actions:
- Edit seats
- Edit F&B
- Apply voucher
- Proceed to payment
```

#### **7.3 Payment Confirmation**
```
Success Page:
- Booking ID
- QR Code
- E-ticket (downloadable PDF)
- Booking details
- Payment info
- Cancellation policy

Actions:
- Download ticket
- Add to calendar
- Share
- View in My Bookings
```

---

### **8. Booking Management**

#### **8.1 My Bookings**
```
Tabs:
- Upcoming
- Past
- Cancelled

Display per Booking:
- Movie poster
- Title, showtime
- Cinema, theater, seats
- Booking ID
- QR Code
- Status
- Total amount

Actions:
- View details
- Download ticket
- Cancel (if allowed)
- Write review (after showtime)
```

#### **8.2 Booking Details**
```
Information:
- Full booking info
- Payment details
- QR Code (for entry)
- Cancellation policy
- Contact support

Actions:
- Download PDF ticket
- Add to Apple Wallet / Google Pay
- Cancel booking
- Request invoice
```

#### **8.3 Booking Cancellation**
```
Rules:
- Can cancel up to 2 hours before showtime
- Refund: 90% if > 24h, 70% if > 12h, 50% if > 2h
- No refund if < 2h
- Refund to original payment method
- Process time: 5-7 business days

Flow:
1. Click Cancel
2. Confirm cancellation
3. Select reason
4. Submit
5. Refund initiated
6. Email confirmation
```

---

### **9. User Profile**

#### **9.1 Profile Information**
```
Fields:
- Avatar
- Full Name
- Email (verified)
- Phone (verified)
- Date of Birth
- Gender
- Address

Actions:
- Update info
- Change password
- Verify phone
- Upload avatar
```

#### **9.2 Loyalty Program**
```
Display:
- Current tier (Bronze/Silver/Gold/Platinum)
- Points balance
- Points to next tier
- Tier benefits
- Points history
- Expiring points

Earning Rules:
- 1 point per 1,000 VND spent
- Bonus points on birthday month (2x)
- Referral bonus (500 points)

Redemption:
- 100 points = 10,000 VND discount
- Free popcorn (500 points)
- Free ticket (2,000 points)

Tiers:
- Bronze: 0-999 points (0% discount)
- Silver: 1,000-4,999 points (5% discount)
- Gold: 5,000-9,999 points (10% discount)
- Platinum: 10,000+ points (15% discount)
```

#### **9.3 Preferences**
```
Settings:
- Favorite genres
- Favorite cinemas
- Notification preferences
  - Email notifications
  - SMS notifications
  - Push notifications
- Language
- Newsletter subscription
```

---

### **10. Reviews & Ratings**

#### **10.1 Write Review**
```
Fields:
- Rating (1-5 stars)
- Title
- Comment (min 10 chars)
- Spoiler warning checkbox

Rules:
- Can only review after watching
- One review per movie per user
- Can edit/delete own review
```

#### **10.2 View Reviews**
```
Display:
- User name, avatar
- Rating
- Review title & text
- Date
- Helpful count

Features:
- Sort by: Most Recent, Highest Rated, Most Helpful
- Filter by: Rating (5★, 4★, etc)
- Mark as helpful
- Report inappropriate
```

---

## 👨‍💼 Admin Features

### **1. Dashboard**
```
Widgets:
- Today's Revenue
- Total Bookings (Today/Week/Month)
- Occupancy Rate
- Top Movies
- Top Cinemas
- Recent Transactions
- System Health

Charts:
- Revenue Trend (Line chart)
- Bookings by Movie (Bar chart)
- Occupancy by Cinema (Pie chart)
- User Growth (Area chart)
```

---

### **2. Movie Management**

#### **2.1 Movie List**
```
Display:
- Poster thumbnail
- Title
- Release date
- Status (Coming/Showing/Ended)
- Total bookings
- Revenue

Actions:
- Add new movie
- Edit movie
- Delete movie
- View details
- Manage showtimes

Filters:
- Status
- Genre
- Release date range
- Search by title
```

#### **2.2 Add/Edit Movie**
```
Form Fields:
- Title, Original Title
- Description
- Duration (minutes)
- Release Date, End Date
- Country, Language
- Director
- Cast (multi-select)
- Genre (multi-select)
- Age Rating
- Poster (upload)
- Trailer URL
- Status

Validation:
- All required fields
- Valid URLs
- Valid dates
- Image size < 5MB
```

---

### **3. Cinema Management**

#### **3.1 Cinema List**
```
Display:
- Name
- City, District
- Number of theaters
- Total capacity
- Status
- Actions

Actions:
- Add cinema
- Edit cinema
- Manage theaters
- View details
```

#### **3.2 Add/Edit Cinema**
```
Form Fields:
- Name
- Address
- City, District
- Latitude, Longitude
- Phone
- Facilities (checkboxes)
- Status

Theater Management:
- Add theater
- Edit theater
- Configure seat layout
- Set screen type
```

#### **3.3 Seat Layout Configuration**
```
Features:
- Visual seat map editor
- Drag & drop seats
- Set seat type (Standard/VIP/Couple)
- Mark broken seats
- Set row & number
- Preview layout

Templates:
- Small (50 seats)
- Medium (100 seats)
- Large (200 seats)
- IMAX (300 seats)
```

---

### **4. Showtime Management**

#### **4.1 Create Showtime**
```
Form:
- Select Movie
- Select Cinema
- Select Theater
- Select Date
- Select Time
- Set Base Price
- Set Seat Pricing (by type)
- Status

Validation:
- No overlapping showtimes in same theater
- Min 30 min gap between shows
- Theater available
- Movie active
```

#### **4.2 Bulk Showtime Creation**
```
Features:
- Select movie
- Select multiple cinemas
- Select date range
- Select time slots
- Auto-generate showtimes
- Preview before confirm
```

#### **4.3 Showtime Pricing**
```
Pricing Rules:
- Base price by time slot
  - Morning (before 12pm): -20%
  - Afternoon (12pm-5pm): Standard
  - Evening (after 5pm): +20%
  - Weekend: +30%
  - Holiday: +50%

Seat Type Pricing:
- Standard: Base price
- VIP: Base price + 50%
- Couple: Base price × 2 + 20%
```

---

### **5. Booking Management**

#### **5.1 Booking List**
```
Display:
- Booking ID
- User name
- Movie title
- Showtime
- Seats
- Amount
- Status
- Payment status

Filters:
- Date range
- Status
- Payment status
- Cinema
- Movie
- Search by ID/User

Actions:
- View details
- Cancel booking
- Refund
- Export
```

#### **5.2 Booking Details**
```
Information:
- Full booking info
- User info
- Payment info
- Seats & F&B
- Timeline (created, paid, confirmed, etc)

Actions:
- Cancel & refund
- Resend confirmation
- Print ticket
- Contact user
```

---

### **6. F&B Management**

#### **6.1 Menu Management**
```
Actions:
- Add item
- Edit item
- Delete item
- Update stock
- Set availability

Item Fields:
- Name
- Description
- Category
- Price
- Image
- Stock quantity
- Min stock alert
```

#### **6.2 Combo Management**
```
Create Combo:
- Name
- Description
- Select items (with quantity)
- Set combo price
- Calculate discount
- Set validity period
```

---

### **7. Promotion Management**

#### **7.1 Voucher Management**
```
Create Voucher:
- Code (auto-generate or custom)
- Type (Percentage/Fixed/Free Item)
- Value
- Min purchase
- Max discount
- Start/End date
- Usage limit
- Applicable for (Movie/F&B/Both)

Bulk Generation:
- Generate 100 unique codes
- Same rules for all
- Export to CSV
```

#### **7.2 Flash Sale**
```
Create Flash Sale:
- Name
- Description
- Discount percentage
- Start/End time
- Applicable movies/cinemas
- Max bookings
```

---

### **8. User Management**

#### **8.1 User List**
```
Display:
- Name, Email
- Phone
- Registration date
- Total bookings
- Total spent
- Loyalty tier
- Status

Actions:
- View details
- Edit user
- Suspend/Activate
- Reset password
- View bookings
```

#### **8.2 User Details**
```
Tabs:
- Profile Info
- Booking History
- Payment History
- Loyalty Points
- Reviews
- Activity Log
```

---

### **9. Reports & Analytics**

#### **9.1 Revenue Reports**
```
Reports:
- Daily Revenue
- Monthly Revenue
- Revenue by Movie
- Revenue by Cinema
- Revenue by Payment Method

Export:
- PDF
- Excel
- CSV
```

#### **9.2 Booking Reports**
```
Reports:
- Bookings by Date
- Bookings by Movie
- Bookings by Cinema
- Cancellation Rate
- Occupancy Rate

Charts:
- Trend analysis
- Comparison charts
```

#### **9.3 Customer Analytics**
```
Metrics:
- New users
- Active users
- Retention rate
- Average booking value
- Lifetime value

Segments:
- By age group
- By location
- By loyalty tier
- By booking frequency
```

---

## 👨‍💼 Staff Features

### **1. Ticket Validation**
```
Features:
- Scan QR code
- Validate booking
- Check-in customer
- Print physical ticket (if needed)

Validation Checks:
- Booking exists
- Payment confirmed
- Not already used
- Correct showtime
- Correct cinema
```

### **2. F&B Order Management**
```
Features:
- View pending orders
- Prepare order
- Mark as ready
- Mark as delivered
- Handle issues
```

### **3. Customer Support**
```
Features:
- Search booking
- View booking details
- Cancel booking
- Process refund
- Resend confirmation
- Update customer info
```

---

## 📡 API Endpoints Summary

### **Authentication**
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh-token
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
POST   /api/auth/verify-email
GET    /api/auth/google
GET    /api/auth/facebook
```

### **Movies**
```
GET    /api/movies
GET    /api/movies/:id
GET    /api/movies/now-showing
GET    /api/movies/coming-soon
GET    /api/movies/trending
GET    /api/movies/:id/showtimes
GET    /api/movies/:id/reviews
POST   /api/movies/:id/reviews
POST   /api/movies (Admin)
PUT    /api/movies/:id (Admin)
DELETE /api/movies/:id (Admin)
```

### **Cinemas**
```
GET    /api/cinemas
GET    /api/cinemas/:id
GET    /api/cinemas/nearby
GET    /api/cinemas/:id/theaters
POST   /api/cinemas (Admin)
PUT    /api/cinemas/:id (Admin)
```

### **Showtimes**
```
GET    /api/showtimes
GET    /api/showtimes/:id
GET    /api/showtimes/:id/available-seats
POST   /api/showtimes (Admin)
PUT    /api/showtimes/:id (Admin)
DELETE /api/showtimes/:id (Admin)
```

### **Bookings**
```
POST   /api/bookings/lock-seats
POST   /api/bookings
GET    /api/bookings/:id
PUT    /api/bookings/:id/cancel
GET    /api/bookings/my-bookings
POST   /api/bookings/:id/validate (Staff)
```

### **Payments**
```
POST   /api/payments/create
POST   /api/payments/verify
POST   /api/payments/:id/refund
GET    /api/payments/history
POST   /api/payments/webhook/vnpay
POST   /api/payments/webhook/momo
```

### **F&B**
```
GET    /api/fnb/items
GET    /api/fnb/combos
POST   /api/fnb/items (Admin)
PUT    /api/fnb/items/:id (Admin)
```

### **Promotions**
```
GET    /api/promotions/vouchers
POST   /api/promotions/validate-voucher
GET    /api/promotions/my-vouchers
POST   /api/promotions/vouchers (Admin)
```

### **Users**
```
GET    /api/users/me
PUT    /api/users/me
POST   /api/users/avatar
GET    /api/users/booking-history
GET    /api/users/loyalty-points
```

---

## 🔄 User Flows

### **Complete Booking Flow**
```
1. Browse movies → Select movie
2. View showtimes → Select showtime
3. Select seats → Lock seats (15 min)
4. Select F&B (optional)
5. Apply voucher (optional)
6. Review order
7. Select payment method
8. Complete payment
9. Receive confirmation
10. Download ticket
```

### **Cancellation Flow**
```
1. Go to My Bookings
2. Select booking
3. Click Cancel
4. Confirm cancellation
5. Select reason
6. Submit
7. Refund initiated
8. Receive confirmation
```

---

## 📜 Business Rules

### **Booking Rules**
- ✅ Min 1 seat, max 10 seats per booking
- ✅ Seat lock duration: 15 minutes
- ✅ Can extend lock once (5 min)
- ✅ Auto-release if payment not completed
- ✅ Cannot book past showtimes
- ✅ Cannot book if < 30 min to showtime

### **Cancellation Rules**
- ✅ Can cancel up to 2 hours before showtime
- ✅ Refund based on time before showtime:
  - > 24h: 90% refund
  - > 12h: 70% refund
  - > 2h: 50% refund
  - < 2h: No refund
- ✅ Refund to original payment method
- ✅ Process time: 5-7 business days

### **Loyalty Points Rules**
- ✅ Earn: 1 point per 1,000 VND
- ✅ Birthday month: 2x points
- ✅ Referral: 500 points
- ✅ Points expire after 12 months
- ✅ Redeem: 100 points = 10,000 VND

### **Pricing Rules**
- ✅ Dynamic pricing by time slot
- ✅ Weekend surcharge: +30%
- ✅ Holiday surcharge: +50%
- ✅ VIP seat: +50%
- ✅ Couple seat: 2x + 20%

---

**Created:** 2026-02-04  
**Version:** 1.0  
**Status:** Final
