# 🎬 Cinema Management - Admin Panel

Admin dashboard for cinema management built with **Next.js 16** and **React 19**.

## 🚀 Tech Stack

- **Framework**: Next.js 16.1.6 (App Router)
- **React**: 19.2.3
- **TypeScript**: 5.x
- **Styling**: Tailwind CSS 4.x
- **Linting**: ESLint 9.x
- **Build Tool**: Turbopack

## 📋 Admin Features

### Dashboard:

- 📊 Analytics and statistics
- 📈 Revenue reports
- 👥 User management
- 🎬 Movie management
- 🏢 Cinema management
- 🎫 Booking management
- 💰 Payment tracking
- 🔔 Notification system

### Movie Management:

- ➕ Add/Edit/Delete movies
- 🖼️ Upload posters and trailers
- 📝 Manage descriptions and metadata
- ⭐ View ratings and reviews
- 🎭 Manage genres and categories

### Cinema Management:

- 🏢 Add/Edit/Delete cinemas
- 🪑 Manage seats and layouts
- 🎬 Configure screens
- 💰 Set pricing rules

### Showtime Management:

- 📅 Schedule showtimes
- ⏰ Manage time slots
- 🎫 Set ticket availability
- 💵 Dynamic pricing

### User Management:

- 👤 View all users
- 🔒 Manage roles and permissions
- 📊 User activity logs
- 🚫 Ban/Unban users

### Booking Management:

- 🎫 View all bookings
- ✅ Confirm/Cancel bookings
- 💳 Refund processing
- 📊 Booking analytics

## 🛠️ Getting Started

### Prerequisites:

- Node.js >= 20.0.0
- npm >= 10.0.0

### Installation:

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Development Server:

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

## 📁 Project Structure

```
fe-admin/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   │   ├── login/
│   │   └── layout.tsx
│   ├── (dashboard)/       # Dashboard routes
│   │   ├── dashboard/     # Main dashboard
│   │   ├── movies/        # Movie management
│   │   ├── cinemas/       # Cinema management
│   │   ├── showtimes/     # Showtime management
│   │   ├── bookings/      # Booking management
│   │   ├── users/         # User management
│   │   ├── payments/      # Payment management
│   │   └── layout.tsx     # Dashboard layout
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # UI components (buttons, inputs, etc.)
│   ├── dashboard/        # Dashboard-specific components
│   ├── charts/           # Chart components
│   ├── tables/           # Data table components
│   └── forms/            # Form components
├── lib/                   # Utilities and helpers
│   ├── api/              # API client
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   └── validations/      # Form validations
├── types/                 # TypeScript type definitions
├── public/                # Static assets
└── package.json
```

## 🔌 API Integration

### Backend API:

- **Base URL**: `http://localhost:9080` (via APISIX Gateway)
- **Admin Endpoints**:
  - Auth: `/api/auth/*`
  - Movies: `/api/admin/movies/*`
  - Cinemas: `/api/admin/cinemas/*`
  - Showtimes: `/api/admin/showtimes/*`
  - Bookings: `/api/admin/bookings/*`
  - Users: `/api/admin/users/*`
  - Analytics: `/api/admin/analytics/*`

### Environment Variables:

Create `.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:9080
NEXT_PUBLIC_WS_URL=ws://localhost:9080

# Admin Configuration
NEXT_PUBLIC_ADMIN_ROLE=ADMIN
NEXT_PUBLIC_ITEMS_PER_PAGE=20

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
```

## 🎨 UI Components

### Dashboard Layout:

```tsx
// Example dashboard layout
export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <Header />
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
```

### Data Table:

```tsx
// Example data table
<DataTable
  columns={movieColumns}
  data={movies}
  onEdit={handleEdit}
  onDelete={handleDelete}
  searchable
  filterable
  pagination
/>
```

## 🔐 Authentication & Authorization

### Admin Roles:

- **SUPER_ADMIN**: Full access
- **ADMIN**: Manage content and users
- **MANAGER**: Manage bookings and showtimes
- **STAFF**: View-only access

### Protected Routes:

```tsx
import { withAuth } from "@/lib/auth";

export default withAuth(AdminPage, {
  requiredRole: "ADMIN",
});
```

## 📊 Dashboard Widgets

### Analytics Cards:

- 💰 Total Revenue
- 🎫 Total Bookings
- 👥 Active Users
- 🎬 Total Movies

### Charts:

- 📈 Revenue Trend (Line Chart)
- 🎫 Bookings by Movie (Bar Chart)
- 🏢 Bookings by Cinema (Pie Chart)
- 📅 Daily Bookings (Area Chart)

## 🎨 Styling

### Tailwind CSS 4.x with Custom Theme:

```tsx
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9ff",
          500: "#0ea5e9",
          900: "#0c4a6e",
        },
        admin: {
          sidebar: "#1e293b",
          header: "#0f172a",
        },
      },
    },
  },
};
```

## 📱 Responsive Design

- **Desktop-first**: Optimized for admin work
- **Tablet support**: Responsive tables and forms
- **Mobile**: Basic viewing capabilities

## 🚀 Deployment

### Vercel:

```bash
vercel --prod
```

### Docker:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

## 📊 Performance

- **Lighthouse Score**: 90+
- **First Contentful Paint**: < 2s
- **Time to Interactive**: < 3.5s
- **Bundle Size**: Optimized with code splitting

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

## 📝 Scripts

| Script           | Description                          |
| ---------------- | ------------------------------------ |
| `npm run dev`    | Start development server (port 3001) |
| `npm run build`  | Build for production                 |
| `npm start`      | Start production server              |
| `npm run lint`   | Run ESLint                           |
| `npm run format` | Format code with Prettier            |

## 🔒 Security

- ✅ Role-based access control (RBAC)
- ✅ JWT authentication
- ✅ CSRF protection
- ✅ XSS prevention
- ✅ SQL injection prevention
- ✅ Rate limiting
- ✅ Audit logs

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/admin-feature`)
3. Commit changes (`git commit -m 'Add admin feature'`)
4. Push to branch (`git push origin feature/admin-feature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 👥 Team

- **Admin Team**: Dashboard & Management Features
- **Backend Team**: API & Services
- **DevOps Team**: Infrastructure & Deployment

## 🔗 Links

- **Backend API**: [http://localhost:9080](http://localhost:9080)
- **User Frontend**: [http://localhost:3000](http://localhost:3000)
- **API Documentation**: [http://localhost:9080/docs](http://localhost:9080/docs)
- **Kafka UI**: [http://localhost:18082](http://localhost:18082)
- **Redis Insight**: [http://localhost:5544](http://localhost:5544)

---

Built with ❤️ using Next.js 16 and React 19
