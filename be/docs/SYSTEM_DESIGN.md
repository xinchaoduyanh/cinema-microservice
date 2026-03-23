# 🎬 Cinema Management System - System Design

## 📋 Table of Contents
- [Overview](#overview)
- [Business Requirements](#business-requirements)
- [System Architecture](#system-architecture)
- [Microservices Design](#microservices-design)
- [Saga Pattern Implementation](#saga-pattern-implementation)
- [Database Design](#database-design)
- [API Gateway & Routing](#api-gateway--routing)
- [Event-Driven Architecture](#event-driven-architecture)
- [Technology Stack](#technology-stack)

---

## 🎯 Overview

**Cinema Management System** là một hệ thống quản lý rạp chiếu phim toàn diện, được xây dựng theo kiến trúc **Microservices** với các pattern hiện đại:
- ✅ **Saga Pattern** (Orchestration & Choreography)
- ✅ **Event-Driven Architecture**
- ✅ **CQRS** (Command Query Responsibility Segregation)
- ✅ **API Gateway Pattern**
- ✅ **Database per Service**
- ✅ **Circuit Breaker Pattern**

---

## 📊 Business Requirements

### **Core Features**

#### 1. **User Management** 👥
- Đăng ký/Đăng nhập (Email, Google, Facebook)
- Quản lý profile
- Lịch sử đặt vé
- Điểm thưởng (Loyalty points)
- Vai trò: Customer, Staff, Manager, Admin

#### 2. **Movie Management** 🎬
- Quản lý phim (CRUD)
- Thể loại, diễn viên, đạo diễn
- Trailer, poster, rating
- Lịch chiếu phim
- Phim đang chiếu / Sắp chiếu

#### 3. **Cinema Management** 🏢
- Quản lý chuỗi rạp
- Quản lý phòng chiếu
- Sơ đồ ghế ngồi
- Loại ghế (Standard, VIP, Couple)
- Thiết bị (2D, 3D, IMAX, 4DX)

#### 4. **Showtime Management** 📅
- Tạo lịch chiếu
- Quản lý suất chiếu
- Giá vé theo suất/loại ghế
- Khuyến mãi theo thời gian

#### 5. **Booking & Ticketing** 🎫
- Chọn phim, rạp, suất chiếu
- Chọn ghế (real-time seat locking)
- Giữ ghế tạm thời (15 phút)
- Xác nhận đặt vé
- Hủy vé (theo chính sách)

#### 6. **Payment** 💳
- Thanh toán online (VNPay, MoMo, ZaloPay)
- Thanh toán tại quầy
- Hoàn tiền
- Lịch sử giao dịch

#### 7. **Food & Beverage** 🍿
- Menu đồ ăn/nước uống
- Combo khuyến mãi
- Đặt trước khi booking
- Quản lý kho

#### 8. **Promotion & Voucher** 🎁
- Mã giảm giá
- Voucher
- Flash sale
- Điểm tích lũy
- Membership tiers

#### 9. **Notification** 🔔
- Email confirmation
- SMS reminder
- Push notification (Mobile)
- Thông báo phim mới
- Thông báo khuyến mãi

#### 10. **Reporting & Analytics** 📈
- Doanh thu theo ngày/tháng/năm
- Top phim bán chạy
- Tỷ lệ lấp đầy ghế
- Phân tích khách hàng
- Báo cáo tồn kho F&B

---

## 🏗️ System Architecture

### **High-Level Architecture**

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ Web App  │  │ Mobile   │  │  Admin   │  │  Staff   │        │
│  │ (React)  │  │  (RN)    │  │  Portal  │  │  Portal  │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
└─────────────────────────────────────────────────────────────────┘
                              ↓ HTTPS
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                 Custom API Gateway Layer                  │   │
│  │  • Routing  • Auth  • Rate Limiting  • Load Balancing   │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↓ HTTP/TCP
┌─────────────────────────────────────────────────────────────────┐
│                    MICROSERVICES LAYER                           │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │   Auth   │  │   User   │  │  Movie   │  │  Cinema  │       │
│  │ Service  │  │ Service  │  │ Service  │  │ Service  │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ Showtime │  │ Booking  │  │ Payment  │  │   F&B    │       │
│  │ Service  │  │ Service  │  │ Service  │  │ Service  │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │Promotion │  │Notification│ │Analytics │  │  Saga    │       │
│  │ Service  │  │  Service  │  │ Service  │  │Orchestr. │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    EVENT BUS (Kafka)                             │
│  • Booking Events  • Payment Events  • Notification Events      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                  │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐       │
│  │Auth DB │ │User DB │ │Movie DB│ │Cinema  │ │Booking │       │
│  │(PG)    │ │(PG)    │ │(PG)    │ │DB (PG) │ │DB (PG) │       │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘       │
│                                                                  │
│  ┌────────┐ ┌────────┐              ┌────────────────┐         │
│  │Redis   │ │S3      │              │ Elasticsearch  │         │
│  │(Cache) │ │(Media) │              │ (Search)       │         │
│  └────────┘ └────────┘              └────────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Microservices Design

### **1. Auth Service** 🔐
**Responsibility:** Authentication & Authorization

**Features:**
- JWT token generation/validation
- OAuth2 (Google, Facebook)
- Refresh token rotation
- Session management
- Role-based access control (RBAC)

**Tech Stack:**
- NestJS + Passport
- JWT + Redis (token blacklist)
- PostgreSQL (user credentials)

**APIs:**
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

---

### **2. User Service** 👤
**Responsibility:** User profile & preferences management

**Features:**
- User profile CRUD
- Avatar upload
- Booking history
- Loyalty points
- Favorite movies/cinemas
- Notification preferences

**Database Schema:**
```typescript
User {
  id: UUID
  email: string
  firstName: string
  lastName: string
  phone: string
  avatar: string
  dateOfBirth: Date
  gender: enum
  loyaltyPoints: number
  membershipTier: enum (Bronze, Silver, Gold, Platinum)
  createdAt: Date
  updatedAt: Date
}

UserPreference {
  userId: UUID
  favoriteGenres: string[]
  favoriteCinemas: UUID[]
  emailNotification: boolean
  smsNotification: boolean
  pushNotification: boolean
}
```

**APIs:**
```
GET    /api/users/me
PUT    /api/users/me
POST   /api/users/avatar
GET    /api/users/booking-history
GET    /api/users/loyalty-points
PUT    /api/users/preferences
```

---

### **3. Movie Service** 🎬
**Responsibility:** Movie catalog management

**Features:**
- Movie CRUD
- Genre, Actor, Director management
- Movie search & filter
- Rating & reviews
- Trending movies
- Upcoming movies

**Database Schema:**
```typescript
Movie {
  id: UUID
  title: string
  originalTitle: string
  description: string
  duration: number (minutes)
  releaseDate: Date
  endDate: Date
  country: string
  language: string
  director: string
  cast: string[]
  posterUrl: string
  trailerUrl: string
  rating: number
  ageRating: enum (P, K, T13, T16, T18, C)
  status: enum (Coming, Showing, Ended)
  createdAt: Date
  updatedAt: Date
}

Genre {
  id: UUID
  name: string
  slug: string
}

MovieGenre {
  movieId: UUID
  genreId: UUID
}

Review {
  id: UUID
  movieId: UUID
  userId: UUID
  rating: number (1-5)
  comment: string
  createdAt: Date
}
```

**APIs:**
```
GET    /api/movies
GET    /api/movies/:id
POST   /api/movies (Admin)
PUT    /api/movies/:id (Admin)
DELETE /api/movies/:id (Admin)
GET    /api/movies/now-showing
GET    /api/movies/coming-soon
GET    /api/movies/trending
GET    /api/movies/:id/reviews
POST   /api/movies/:id/reviews
GET    /api/genres
```

---

### **4. Cinema Service** 🏢
**Responsibility:** Cinema & theater management

**Features:**
- Cinema chain management
- Theater/room management
- Seat layout configuration
- Equipment types (2D, 3D, IMAX)
- Location-based search

**Database Schema:**
```typescript
Cinema {
  id: UUID
  name: string
  address: string
  city: string
  district: string
  latitude: number
  longitude: number
  phone: string
  facilities: string[] (Parking, Restaurant, etc)
  status: enum (Active, Inactive)
  createdAt: Date
}

Theater {
  id: UUID
  cinemaId: UUID
  name: string (Theater 1, Theater 2)
  capacity: number
  screenType: enum (2D, 3D, IMAX, 4DX)
  soundSystem: enum (Dolby, DTS)
  status: enum (Active, Maintenance, Inactive)
}

Seat {
  id: UUID
  theaterId: UUID
  row: string (A, B, C)
  number: number (1, 2, 3)
  type: enum (Standard, VIP, Couple)
  status: enum (Available, Broken, Reserved)
}
```

**APIs:**
```
GET    /api/cinemas
GET    /api/cinemas/:id
GET    /api/cinemas/nearby?lat=&lng=
GET    /api/cinemas/:id/theaters
GET    /api/theaters/:id/seats
POST   /api/cinemas (Admin)
PUT    /api/cinemas/:id (Admin)
POST   /api/theaters (Admin)
PUT    /api/seats/:id (Admin)
```

---

### **5. Showtime Service** 📅
**Responsibility:** Movie scheduling & pricing

**Features:**
- Showtime scheduling
- Dynamic pricing
- Time-based pricing (morning, afternoon, evening)
- Special pricing (holidays, weekends)
- Seat availability checking

**Database Schema:**
```typescript
Showtime {
  id: UUID
  movieId: UUID
  theaterId: UUID
  startTime: DateTime
  endTime: DateTime
  basePrice: number
  status: enum (Scheduled, Ongoing, Completed, Cancelled)
  createdAt: Date
}

SeatPricing {
  id: UUID
  showtimeId: UUID
  seatType: enum (Standard, VIP, Couple)
  price: number
}

ShowtimeSeat {
  id: UUID
  showtimeId: UUID
  seatId: UUID
  status: enum (Available, Locked, Booked)
  lockedUntil: DateTime (null if not locked)
  lockedBy: UUID (userId)
}
```

**APIs:**
```
GET    /api/showtimes?movieId=&cinemaId=&date=
GET    /api/showtimes/:id
GET    /api/showtimes/:id/available-seats
POST   /api/showtimes (Admin)
PUT    /api/showtimes/:id (Admin)
DELETE /api/showtimes/:id (Admin)
```

---

### **6. Booking Service** 🎫
**Responsibility:** Ticket booking & seat reservation

**Features:**
- Seat selection & locking (15 min timeout)
- Booking creation
- Booking cancellation
- QR code generation
- Booking validation

**Database Schema:**
```typescript
Booking {
  id: UUID
  userId: UUID
  showtimeId: UUID
  totalAmount: number
  discount: number
  finalAmount: number
  status: enum (Pending, Confirmed, Cancelled, Completed)
  paymentStatus: enum (Pending, Paid, Refunded)
  qrCode: string
  expiresAt: DateTime (for pending bookings)
  createdAt: Date
  updatedAt: Date
}

BookingSeat {
  id: UUID
  bookingId: UUID
  seatId: UUID
  price: number
}

BookingFnB {
  id: UUID
  bookingId: UUID
  itemId: UUID
  quantity: number
  price: number
}
```

**APIs:**
```
POST   /api/bookings/lock-seats
POST   /api/bookings
GET    /api/bookings/:id
PUT    /api/bookings/:id/cancel
GET    /api/bookings/my-bookings
POST   /api/bookings/:id/validate (Staff)
```

---

### **7. Payment Service** 💳
**Responsibility:** Payment processing & reconciliation

**Features:**
- Multiple payment gateways (VNPay, MoMo, ZaloPay)
- Payment verification
- Refund processing
- Transaction history
- Payment retry mechanism

**Database Schema:**
```typescript
Payment {
  id: UUID
  bookingId: UUID
  userId: UUID
  amount: number
  method: enum (VNPay, MoMo, ZaloPay, Cash, Card)
  status: enum (Pending, Success, Failed, Refunded)
  transactionId: string (from gateway)
  gatewayResponse: JSON
  createdAt: Date
  updatedAt: Date
}

Refund {
  id: UUID
  paymentId: UUID
  amount: number
  reason: string
  status: enum (Pending, Approved, Rejected, Completed)
  processedAt: Date
}
```

**APIs:**
```
POST   /api/payments/create
POST   /api/payments/verify
POST   /api/payments/:id/refund
GET    /api/payments/history
POST   /api/payments/webhook/vnpay
POST   /api/payments/webhook/momo
```

---

### **8. F&B Service** 🍿
**Responsibility:** Food & Beverage management

**Features:**
- Menu management
- Combo deals
- Inventory tracking
- Order management

**Database Schema:**
```typescript
FnBItem {
  id: UUID
  name: string
  description: string
  category: enum (Food, Drink, Combo)
  price: number
  imageUrl: string
  isAvailable: boolean
  stock: number
}

FnBCombo {
  id: UUID
  name: string
  description: string
  price: number
  discount: number
  items: { itemId: UUID, quantity: number }[]
}
```

**APIs:**
```
GET    /api/fnb/items
GET    /api/fnb/combos
POST   /api/fnb/items (Admin)
PUT    /api/fnb/items/:id (Admin)
PUT    /api/fnb/items/:id/stock (Staff)
```

---

### **9. Promotion Service** 🎁
**Responsibility:** Promotions, vouchers & loyalty

**Features:**
- Voucher creation & management
- Discount code validation
- Flash sale
- Loyalty points calculation
- Membership tier management

**Database Schema:**
```typescript
Voucher {
  id: UUID
  code: string
  type: enum (Percentage, FixedAmount, FreeItem)
  value: number
  minPurchase: number
  maxDiscount: number
  startDate: DateTime
  endDate: DateTime
  usageLimit: number
  usedCount: number
  applicableFor: enum (All, Movie, FnB, Both)
  status: enum (Active, Inactive, Expired)
}

UserVoucher {
  id: UUID
  userId: UUID
  voucherId: UUID
  isUsed: boolean
  usedAt: DateTime
}

LoyaltyTransaction {
  id: UUID
  userId: UUID
  points: number
  type: enum (Earn, Redeem)
  bookingId: UUID
  createdAt: Date
}
```

**APIs:**
```
GET    /api/promotions/vouchers
POST   /api/promotions/validate-voucher
GET    /api/promotions/my-vouchers
POST   /api/promotions/vouchers (Admin)
GET    /api/promotions/loyalty-points
POST   /api/promotions/redeem-points
```

---

### **10. Notification Service** 🔔
**Responsibility:** Multi-channel notifications

**Features:**
- Email notifications (AWS SES / SMTP)
- SMS notifications
- Push notifications (Firebase)
- Notification templates
- Notification history

**Database Schema:**
```typescript
Notification {
  id: UUID
  userId: UUID
  type: enum (Email, SMS, Push)
  channel: enum (Booking, Payment, Promotion, System)
  title: string
  message: string
  data: JSON
  status: enum (Pending, Sent, Failed)
  sentAt: DateTime
  createdAt: Date
}

NotificationTemplate {
  id: UUID
  name: string
  type: enum (Email, SMS, Push)
  subject: string
  body: string
  variables: string[]
}
```

**APIs:**
```
GET    /api/notifications
PUT    /api/notifications/:id/read
POST   /api/notifications/send (Internal)
```

---

### **11. Analytics Service** 📈
**Responsibility:** Business intelligence & reporting

**Features:**
- Revenue reports
- Occupancy rate
- Popular movies
- Customer analytics
- Real-time dashboard

**APIs:**
```
GET    /api/analytics/revenue?from=&to=
GET    /api/analytics/top-movies
GET    /api/analytics/occupancy-rate
GET    /api/analytics/customer-insights
GET    /api/analytics/fnb-sales
```

---

### **12. Saga Orchestrator Service** 🎭
**Responsibility:** Distributed transaction coordination

**Features:**
- Booking saga orchestration
- Compensation handling
- Saga state management
- Retry mechanism

**Saga Flows:** (See next section)

---

## 🔄 Saga Pattern Implementation

### **Booking Saga Flow** (Orchestration Pattern)

```
┌─────────────────────────────────────────────────────────────────┐
│                    BOOKING SAGA ORCHESTRATOR                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 1: LOCK SEATS (Showtime Service)                          │
│  ├─ Success → Continue                                           │
│  └─ Failure → End (Seats not available)                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 2: VALIDATE VOUCHER (Promotion Service)                   │
│  ├─ Success → Continue                                           │
│  └─ Failure → Compensate: Unlock Seats                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 3: CREATE BOOKING (Booking Service)                       │
│  ├─ Success → Continue                                           │
│  └─ Failure → Compensate: Unlock Seats, Release Voucher         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 4: PROCESS PAYMENT (Payment Service)                      │
│  ├─ Success → Continue                                           │
│  └─ Failure → Compensate: Cancel Booking, Unlock Seats          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 5: CONFIRM BOOKING (Booking Service)                      │
│  ├─ Success → Continue                                           │
│  └─ Failure → Compensate: Refund, Cancel Booking                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 6: UPDATE LOYALTY POINTS (Promotion Service)              │
│  ├─ Success → Continue                                           │
│  └─ Failure → Log error (non-critical)                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  Step 7: SEND NOTIFICATIONS (Notification Service)              │
│  ├─ Email confirmation                                           │
│  ├─ SMS reminder                                                 │
│  └─ Push notification                                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                        ✅ SAGA COMPLETED
```

### **Saga State Machine**

```typescript
enum SagaState {
  STARTED = 'STARTED',
  SEATS_LOCKED = 'SEATS_LOCKED',
  VOUCHER_VALIDATED = 'VOUCHER_VALIDATED',
  BOOKING_CREATED = 'BOOKING_CREATED',
  PAYMENT_PROCESSED = 'PAYMENT_PROCESSED',
  BOOKING_CONFIRMED = 'BOOKING_CONFIRMED',
  POINTS_UPDATED = 'POINTS_UPDATED',
  NOTIFICATIONS_SENT = 'NOTIFICATIONS_SENT',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  COMPENSATING = 'COMPENSATING',
  COMPENSATED = 'COMPENSATED',
}

interface SagaInstance {
  id: UUID;
  type: 'BOOKING' | 'CANCELLATION' | 'REFUND';
  state: SagaState;
  data: {
    userId: UUID;
    showtimeId: UUID;
    seatIds: UUID[];
    voucherCode?: string;
    bookingId?: UUID;
    paymentId?: UUID;
  };
  steps: SagaStep[];
  createdAt: Date;
  updatedAt: Date;
}

interface SagaStep {
  name: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'COMPENSATED';
  service: string;
  request: any;
  response: any;
  error?: string;
  timestamp: Date;
}
```

### **Compensation Actions**

```typescript
const compensationMap = {
  SEATS_LOCKED: async () => {
    await showtimeService.unlockSeats(sagaData.seatIds);
  },
  
  VOUCHER_VALIDATED: async () => {
    await promotionService.releaseVoucher(sagaData.voucherCode);
  },
  
  BOOKING_CREATED: async () => {
    await bookingService.cancelBooking(sagaData.bookingId);
  },
  
  PAYMENT_PROCESSED: async () => {
    await paymentService.refund(sagaData.paymentId);
  },
};
```

---

## 🗄️ Database Design

### **Database Strategy**
- ✅ **Database per Service** (Microservices pattern)
- ✅ **PostgreSQL** for transactional data
- ✅ **Redis** for caching & session
- ✅ **Elasticsearch** for search
- ✅ **S3** for media storage

### **Database List**

| Service | Database | Purpose |
|---------|----------|---------|
| Auth | `auth_db` | User credentials, tokens |
| User | `user_db` | User profiles, preferences |
| Movie | `movie_db` | Movies, genres, reviews |
| Cinema | `cinema_db` | Cinemas, theaters, seats |
| Showtime | `showtime_db` | Showtimes, pricing |
| Booking | `booking_db` | Bookings, tickets |
| Payment | `payment_db` | Payments, refunds |
| F&B | `fnb_db` | Menu, inventory |
| Promotion | `promotion_db` | Vouchers, loyalty |
| Notification | `notification_db` | Notifications |
| Analytics | `analytics_db` | Reports, metrics |
| Saga | `saga_db` | Saga instances, steps |

---

## 🌐 API Gateway & Routing

### **Gateway Route Strategy**

The API gateway listens on port `9080` and forwards requests to internal services using service-specific prefixes:

- `/auth-service/*` -> `auth-service:3300`
- `/user-service/*` -> `user-service:3301`
- `/movie-service/*` -> `movie-service:3302`
- `/notification-service/*` -> `notification-service:3303`
- `/cinema-service/*` -> `cinema-service:3304`
- `/booking-service/*` -> `booking-service:3305`

Cross-cutting concerns such as authentication, rate limiting, and request logging are handled in the gateway application instead of an external gateway product.

---

## 📡 Event-Driven Architecture

### **Kafka Topics**

```typescript
// Booking Events
TOPIC: booking.created
TOPIC: booking.confirmed
TOPIC: booking.cancelled

// Payment Events
TOPIC: payment.initiated
TOPIC: payment.success
TOPIC: payment.failed
TOPIC: payment.refunded

// Notification Events
TOPIC: notification.email
TOPIC: notification.sms
TOPIC: notification.push

// Saga Events
TOPIC: saga.started
TOPIC: saga.step.completed
TOPIC: saga.step.failed
TOPIC: saga.compensating
TOPIC: saga.completed

// Analytics Events
TOPIC: analytics.booking
TOPIC: analytics.revenue
```

### **Event Schema Example**

```typescript
interface BookingCreatedEvent {
  eventId: UUID;
  eventType: 'booking.created';
  timestamp: Date;
  version: '1.0';
  data: {
    bookingId: UUID;
    userId: UUID;
    showtimeId: UUID;
    seats: UUID[];
    totalAmount: number;
  };
  metadata: {
    correlationId: UUID;
    causationId: UUID;
  };
}
```

---

## 🛠️ Technology Stack

### **Backend**
- **Framework:** NestJS 11
- **Language:** TypeScript 5.7
- **Runtime:** Node.js 22
- **Package Manager:** pnpm 10
- **Monorepo:** Turborepo

### **Database**
- **Primary:** PostgreSQL 16
- **ORM:** MikroORM 6
- **Cache:** Redis 8
- **Search:** Elasticsearch 8
- **Storage:** AWS S3 / MinIO

### **Message Queue**
- **Event Bus:** Apache Kafka 4
- **Queue:** BullMQ (Redis-based)

### **API Gateway**
- **Primary:** Custom NestJS API Gateway
- **Port:** 9080

### **Authentication**
- **Strategy:** JWT + OAuth2
- **Library:** Passport.js

### **Payment Gateways**
- VNPay
- MoMo
- ZaloPay

### **Notification**
- **Email:** AWS SES / SMTP
- **SMS:** Twilio / SMSAPI
- **Push:** Firebase Cloud Messaging

### **DevOps**
- **Containerization:** Docker + Docker Compose
- **CI/CD:** GitHub Actions
- **Monitoring:** Prometheus + Grafana
- **Logging:** Winston + ELK Stack
- **Tracing:** Jaeger

---

## 📝 Next Steps

1. ✅ **Phase 1:** Setup existing services (Auth, User, Notification)
2. 🔄 **Phase 2:** Implement core services (Movie, Cinema, Showtime)
3. 🔄 **Phase 3:** Implement booking flow with Saga
4. 🔄 **Phase 4:** Add Payment integration
5. 🔄 **Phase 5:** Add F&B & Promotion services
6. 🔄 **Phase 6:** Analytics & Reporting
7. 🔄 **Phase 7:** Performance optimization & scaling

---

**Created:** 2026-02-04  
**Version:** 1.0  
**Status:** Draft
