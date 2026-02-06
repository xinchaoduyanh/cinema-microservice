This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
fe/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── (main)/            # Main application routes
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # UI components
│   ├── features/         # Feature-specific components
│   └── layouts/          # Layout components
├── lib/                   # Utilities and helpers
│   ├── api/              # API client
│   ├── hooks/            # Custom React hooks
│   └── utils/            # Utility functions
├── types/                 # TypeScript type definitions
├── public/                # Static assets
└── package.json

```

## 🔌 API Integration

### Backend API:

- **Base URL**: `http://localhost:9080` (via APISIX Gateway)
- **Services**:
  - Auth Service: `/api/auth/*`
  - User Service: `/api/users/*`
  - Movie Service: `/api/movies/*`
  - Booking Service: `/api/bookings/*`
  - Payment Service: `/api/payments/*`

### Environment Variables:

Create `.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:9080
NEXT_PUBLIC_WS_URL=ws://localhost:9080

# Authentication
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id

# Feature Flags
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
NEXT_PUBLIC_ENABLE_DARK_MODE=true
```

## 🎨 Styling

### Tailwind CSS 4.x:

```tsx
// Example component
export default function MovieCard({ movie }) {
  return (
    <div className="rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <img
        src={movie.poster}
        alt={movie.title}
        className="w-full h-64 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-bold">{movie.title}</h3>
        <p className="text-gray-600">{movie.description}</p>
      </div>
    </div>
  );
}
```

## 🔐 Authentication

### Supported Methods:

- Email/Password
- Google OAuth
- (Future: Facebook, Apple)

### Example:

```tsx
import { signIn } from "@/lib/auth";

async function handleLogin(email: string, password: string) {
  const { user, tokens } = await signIn({ email, password });
  // Store tokens and redirect
}
```

## 📱 Responsive Design

### Breakpoints:

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🚀 Deployment

### Vercel (Recommended):

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📊 Performance

- **Lighthouse Score**: 95+
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Bundle Size**: Optimized with Turbopack

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

| Script           | Description                             |
| ---------------- | --------------------------------------- |
| `npm run dev`    | Start development server with Turbopack |
| `npm run build`  | Build for production                    |
| `npm start`      | Start production server                 |
| `npm run lint`   | Run ESLint                              |
| `npm run format` | Format code with Prettier               |

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 👥 Team

- **Frontend Team**: User Experience & Interface
- **Backend Team**: API & Services
- **DevOps Team**: Infrastructure & Deployment

## 🔗 Links

- **Backend API**: [http://localhost:9080](http://localhost:9080)
- **Admin Panel**: [http://localhost:3001](http://localhost:3001)
- **API Documentation**: [http://localhost:9080/docs](http://localhost:9080/docs)

---

Built with ❤️ using Next.js 16 and React 19
