# 🏗️ Frontend Architecture & Routing Design

## 📋 **Tổng quan**

Dự án Cinema Management có **2 frontend applications** độc lập:

1. **User Frontend** (`/fe`) - Dành cho khách hàng đặt vé
2. **Admin Frontend** (`/fe-admin`) - Dành cho quản trị viên

---

## 🎯 **Tech Stack Decision**

### ✅ **Tailwind CSS + shadcn/ui** (RECOMMENDED)

**Lý do chọn:**

- ✅ **Lightweight**: Bundle size nhỏ (~50KB vs 300KB+ của MUI)
- ✅ **Customizable**: 100% control over design
- ✅ **Modern**: Xu hướng 2026, được nhiều công ty lớn sử dụng
- ✅ **Accessible**: shadcn/ui built on Radix UI (ARIA compliant)
- ✅ **Developer Experience**: Tailwind IntelliSense, fast development
- ✅ **No vendor lock-in**: Bạn sở hữu code, không phụ thuộc npm package

**So sánh:**

```
Tailwind + shadcn/ui  vs  Material-UI  vs  Ant Design
─────────────────────────────────────────────────────
Bundle: ~50KB         vs  ~300KB      vs  ~250KB
Customize: ⭐⭐⭐⭐⭐    vs  ⭐⭐         vs  ⭐⭐
Speed: ⭐⭐⭐⭐⭐        vs  ⭐⭐⭐        vs  ⭐⭐⭐
Modern: ⭐⭐⭐⭐⭐       vs  ⭐⭐⭐        vs  ⭐⭐⭐
```

---

## 🗺️ **Routing Architecture**

### **User Frontend** (`/fe`)

```
┌─────────────────────────────────────────────────────┐
│                   User Frontend                     │
│                  (localhost:3000)                   │
└─────────────────────────────────────────────────────┘

📁 app/
├── (auth)/                    # Auth Layout Group
│   ├── layout.tsx            # Centered layout, no header/footer
│   ├── login/
│   │   └── page.tsx          # ✅ /login
│   ├── register/
│   │   └── page.tsx          # 🔲 /register
│   └── forgot-password/
│       └── page.tsx          # 🔲 /forgot-password
│
├── (main)/                    # Main Layout Group
│   ├── layout.tsx            # Header + Footer layout
│   ├── page.tsx              # ✅ / (Home)
│   │
│   ├── movies/               # Movies Section
│   │   ├── page.tsx          # 🔲 /movies (Grid view)
│   │   ├── [id]/
│   │   │   └── page.tsx      # 🔲 /movies/[id] (Detail)
│   │   └── now-showing/
│   │       └── page.tsx      # 🔲 /movies/now-showing
│   │
│   ├── booking/              # Booking Flow
│   │   ├── [movieId]/
│   │   │   ├── page.tsx      # 🔲 /booking/[movieId]
│   │   │   └── seats/
│   │   │       └── page.tsx  # 🔲 /booking/[movieId]/seats
│   │   └── checkout/
│   │       └── page.tsx      # 🔲 /booking/checkout
│   │
│   ├── profile/              # User Profile
│   │   ├── layout.tsx        # Sidebar layout
│   │   ├── page.tsx          # 🔲 /profile
│   │   ├── bookings/
│   │   │   └── page.tsx      # 🔲 /profile/bookings
│   │   └── settings/
│   │       └── page.tsx      # 🔲 /profile/settings
│   │
│   └── payment/              # Payment
│       ├── success/
│       │   └── page.tsx      # 🔲 /payment/success
│       └── failed/
│           └── page.tsx      # 🔲 /payment/failed
│
├── layout.tsx                 # Root layout
├── globals.css               # Global styles
└── error.tsx                 # Error boundary

Legend: ✅ Done | 🔲 TODO
```

### **Admin Frontend** (`/fe-admin`)

```
┌─────────────────────────────────────────────────────┐
│                  Admin Frontend                     │
│                  (localhost:3001)                   │
└─────────────────────────────────────────────────────┘

📁 app/
├── page.tsx                   # ✅ / (Admin Login)
│
├── (dashboard)/              # Dashboard Layout Group
│   ├── layout.tsx            # ✅ Sidebar + Topbar
│   ├── page.tsx              # ✅ /dashboard (Overview)
│   │
│   ├── movies/               # Movie Management
│   │   ├── page.tsx          # 🔲 /dashboard/movies (Table)
│   │   ├── create/
│   │   │   └── page.tsx      # 🔲 /dashboard/movies/create
│   │   └── [id]/
│   │       ├── page.tsx      # 🔲 /dashboard/movies/[id]
│   │       └── edit/
│   │           └── page.tsx  # 🔲 /dashboard/movies/[id]/edit
│   │
│   ├── cinemas/              # Cinema Management
│   │   ├── page.tsx          # 🔲 /dashboard/cinemas
│   │   ├── create/
│   │   │   └── page.tsx      # 🔲 /dashboard/cinemas/create
│   │   └── [id]/
│   │       ├── page.tsx      # 🔲 /dashboard/cinemas/[id]
│   │       ├── edit/
│   │       │   └── page.tsx  # 🔲 /dashboard/cinemas/[id]/edit
│   │       └── halls/        # Cinema Halls
│   │           └── page.tsx  # 🔲 /dashboard/cinemas/[id]/halls
│   │
│   ├── showtimes/            # Showtime Management
│   │   ├── page.tsx          # 🔲 /dashboard/showtimes
│   │   └── create/
│   │       └── page.tsx      # 🔲 /dashboard/showtimes/create
│   │
│   ├── bookings/             # Booking Management
│   │   ├── page.tsx          # 🔲 /dashboard/bookings
│   │   └── [id]/
│   │       └── page.tsx      # 🔲 /dashboard/bookings/[id]
│   │
│   ├── users/                # User Management
│   │   ├── page.tsx          # 🔲 /dashboard/users
│   │   └── [id]/
│   │       └── page.tsx      # 🔲 /dashboard/users/[id]
│   │
│   ├── analytics/            # Analytics & Reports
│   │   ├── page.tsx          # 🔲 /dashboard/analytics
│   │   ├── revenue/
│   │   │   └── page.tsx      # 🔲 /dashboard/analytics/revenue
│   │   └── bookings/
│   │       └── page.tsx      # 🔲 /dashboard/analytics/bookings
│   │
│   └── settings/             # Settings
│       ├── page.tsx          # 🔲 /dashboard/settings
│       ├── general/
│       │   └── page.tsx      # 🔲 /dashboard/settings/general
│       └── notifications/
│           └── page.tsx      # 🔲 /dashboard/settings/notifications
│
└── layout.tsx                # Root layout
```

---

## 🎨 **Layout Strategy**

### **User Frontend Layouts**

#### 1. **Root Layout** (`app/layout.tsx`)

```tsx
- Inter font
- Vietnamese locale
- SEO metadata
- Global styles
```

#### 2. **Auth Layout** (`app/(auth)/layout.tsx`)

```tsx
- Centered content
- No header/footer
- Gradient background
- Full-screen
```

#### 3. **Main Layout** (`app/(main)/layout.tsx`)

```tsx
- Header (sticky)
- Main content (flex-1)
- Footer
- Container max-width
```

#### 4. **Profile Layout** (`app/(main)/profile/layout.tsx`)

```tsx
- Sidebar navigation
- Main content area
- Breadcrumbs
```

### **Admin Frontend Layouts**

#### 1. **Root Layout** (`app/layout.tsx`)

```tsx
- Inter font
- Admin metadata
- Global styles
```

#### 2. **Dashboard Layout** (`app/(dashboard)/layout.tsx`)

```tsx
- Sidebar (collapsible)
- Topbar (search, notifications)
- Main content (scrollable)
- Flex layout
```

---

## 🔐 **Authentication Flow**

### **User Frontend**

```
1. User visits /login
2. Enter email/password OR click Google OAuth
3. POST /api/auth/login
4. Receive JWT tokens
5. Store in httpOnly cookies
6. Redirect to / or intended page
7. Header shows user avatar + name
```

### **Admin Frontend**

```
1. Admin visits / (login page)
2. Enter admin credentials
3. POST /api/admin/auth/login
4. Receive admin JWT tokens
5. Store in httpOnly cookies
6. Redirect to /dashboard
7. Sidebar shows admin info
```

---

## 📡 **API Integration**

### **Base URLs**

```typescript
// User Frontend
NEXT_PUBLIC_API_URL=http://localhost:9080

// Admin Frontend
NEXT_PUBLIC_API_URL=http://localhost:9080
NEXT_PUBLIC_ADMIN_API_URL=http://localhost:9080/admin
```

### **API Client Structure**

```typescript
// lib/api/client.ts
import axios from 'axios'

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Send cookies
})

// Interceptors for auth tokens
apiClient.interceptors.request.use(...)
apiClient.interceptors.response.use(...)
```

### **API Endpoints Mapping**

```typescript
// User Frontend
/api/auth/*       → Backend: /api/auth/*
/api/movies/*     → Backend: /api/movies/*
/api/bookings/*   → Backend: /api/bookings/*
/api/payments/*   → Backend: /api/payments/*

// Admin Frontend
/api/admin/movies/*    → Backend: /api/admin/movies/*
/api/admin/cinemas/*   → Backend: /api/admin/cinemas/*
/api/admin/users/*     → Backend: /api/admin/users/*
```

---

## 🎯 **Component Architecture**

### **User Frontend**

```
components/
├── layouts/
│   ├── Header.tsx           # Navigation, auth buttons
│   ├── Footer.tsx           # Links, social media
│   └── ProfileSidebar.tsx   # Profile navigation
│
├── features/
│   ├── movies/
│   │   ├── MovieCard.tsx
│   │   ├── MovieGrid.tsx
│   │   ├── MovieDetail.tsx
│   │   └── MovieFilter.tsx
│   │
│   ├── booking/
│   │   ├── SeatMap.tsx
│   │   ├── ShowtimeSelector.tsx
│   │   └── BookingSummary.tsx
│   │
│   └── payment/
│       ├── PaymentForm.tsx
│       └── PaymentMethods.tsx
│
└── ui/                      # shadcn/ui components
    ├── button.tsx
    ├── card.tsx
    ├── input.tsx
    └── ...
```

### **Admin Frontend**

```
components/
├── layouts/
│   ├── Sidebar.tsx          # Navigation menu
│   ├── Topbar.tsx           # Search, notifications
│   └── DashboardLayout.tsx  # Combined layout
│
├── features/
│   ├── movies/
│   │   ├── MovieForm.tsx
│   │   ├── MovieTable.tsx
│   │   └── MovieUpload.tsx  # Bulk upload
│   │
│   ├── cinemas/
│   │   ├── CinemaForm.tsx
│   │   └── HallEditor.tsx   # Seat layout editor
│   │
│   ├── analytics/
│   │   ├── RevenueChart.tsx
│   │   └── BookingStats.tsx
│   │
│   └── upload/
│       ├── FileUploader.tsx # Drag & drop
│       ├── BulkImport.tsx   # CSV/Excel
│       └── ImageUploader.tsx
│
└── ui/
    ├── data-table.tsx       # Reusable table
    ├── file-upload.tsx
    └── ...
```

---

## 🚀 **Performance Optimization**

### **Next.js Features**

- ✅ **App Router**: Server Components by default
- ✅ **Turbopack**: Fast bundling
- ✅ **Image Optimization**: `next/image`
- ✅ **Font Optimization**: `next/font`
- ✅ **Code Splitting**: Automatic
- ✅ **Lazy Loading**: Dynamic imports

### **Tailwind CSS**

- ✅ **PurgeCSS**: Remove unused styles
- ✅ **JIT Mode**: On-demand compilation
- ✅ **Minification**: Production builds

### **React Query** (TODO)

- ✅ **Caching**: Reduce API calls
- ✅ **Prefetching**: Faster navigation
- ✅ **Optimistic Updates**: Better UX

---

## 📱 **Responsive Design**

### **Breakpoints**

```css
sm: 640px   /* Tablet portrait */
md: 768px   /* Tablet landscape */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

### **Mobile-First Approach**

```tsx
// Default: Mobile
<div className="p-4 md:p-6 lg:p-8">

// Responsive Grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
```

---

## 🎨 **Design System**

### **Colors**

```typescript
// User Frontend
primary: Purple-Pink gradient
secondary: Gray tones
accent: Yellow (ratings, highlights)

// Admin Frontend
primary: Blue-Cyan gradient
secondary: Gray tones
accent: Green (success states)
```

### **Typography**

```css
font-family: Inter (Google Fonts)
h1: 3xl-6xl, bold
h2: 2xl-3xl, bold
h3: xl-2xl, semibold
body: base, normal
small: sm-xs, normal
```

### **Spacing**

```css
xs: 0.5rem (8px)
sm: 0.75rem (12px)
md: 1rem (16px)
lg: 1.5rem (24px)
xl: 2rem (32px)
```

---

## 🔒 **Security Best Practices**

1. ✅ **HttpOnly Cookies**: Store JWT tokens
2. ✅ **CSRF Protection**: NextAuth.js built-in
3. ✅ **Input Validation**: Zod schemas
4. ✅ **XSS Prevention**: React auto-escaping
5. ✅ **HTTPS Only**: Production environment
6. ✅ **Rate Limiting**: API Gateway (APISIX)

---

## 📊 **State Management**

### **Client State**

```typescript
// Zustand stores
authStore.ts; // User auth state
bookingStore.ts; // Booking flow state
cartStore.ts; // Shopping cart
```

### **Server State**

```typescript
// React Query
useMovies(); // Fetch movies
useBookings(); // Fetch bookings
useUser(); // Fetch user profile
```

---

## 🧪 **Testing Strategy** (TODO)

```
Unit Tests:      Jest + React Testing Library
Integration:     Playwright
E2E:             Cypress
Coverage:        80%+ target
```

---

## 📦 **Deployment**

### **Vercel** (Recommended)

```bash
# User Frontend
vercel --prod
# URL: cinema-user.vercel.app

# Admin Frontend
vercel --prod
# URL: cinema-admin.vercel.app
```

### **Docker**

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 🎯 **Summary**

### ✅ **Đã hoàn thành**

- [x] Tech stack decision (Tailwind + shadcn/ui)
- [x] Routing architecture design
- [x] Layout strategy
- [x] Base components (Button, Card, Input)
- [x] User Home page
- [x] User Login page
- [x] Admin Dashboard page
- [x] Admin Login page
- [x] Responsive design
- [x] Color system
- [x] Typography system

### 🔲 **Cần làm tiếp**

- [ ] Complete all routes
- [ ] API integration
- [ ] Authentication (NextAuth.js)
- [ ] State management (Zustand + React Query)
- [ ] Form handling (React Hook Form + Zod)
- [ ] File upload
- [ ] Data tables
- [ ] Charts & analytics
- [ ] Testing
- [ ] Deployment

---

**Architecture by**: Antigravity AI  
**Date**: 2026-02-06  
**Status**: ✅ Foundation complete, ready for feature development
