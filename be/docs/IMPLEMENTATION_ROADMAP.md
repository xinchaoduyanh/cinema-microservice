# 🚀 Implementation Roadmap - Cinema Management System

## 📋 Overview

**Strategy:** Build core features first, add security & optimization later

**Timeline:** 12 weeks (3 months)

**Team:** Backend developers focusing on microservices

---

## 🎯 PHASE 1: Foundation & Core Services (Week 1-4)

### **Week 1: Project Setup & Infrastructure**

#### **Tasks:**
```
✅ Setup monorepo structure (already done)
✅ Configure Docker & Docker Compose
✅ Setup PostgreSQL databases (per service)
✅ Setup Redis
✅ Setup Apache APISIX
✅ Configure environment variables
✅ Setup shared libraries (@app/common, @app/core)
```

#### **Deliverables:**
- [ ] All services can start via `pnpm dev`
- [ ] Databases are accessible
- [ ] API Gateway routes configured
- [ ] Swagger documentation available

---

### **Week 2: Movie Service**

#### **Features:**
```
1. Movie CRUD
2. Genre management
3. Movie search & filter
4. Movie status (Coming, Showing, Ended)
```

#### **Database Schema:**
```typescript
// Movie Entity
@Entity()
export class Movie {
  @PrimaryKey()
  id: string = uuid();

  @Property()
  title: string;

  @Property()
  originalTitle: string;

  @Property({ type: 'text' })
  description: string;

  @Property()
  duration: number; // minutes

  @Property()
  releaseDate: Date;

  @Property({ nullable: true })
  endDate?: Date;

  @Property()
  country: string;

  @Property()
  language: string;

  @Property()
  director: string;

  @Property({ type: 'array' })
  cast: string[];

  @Property({ nullable: true })
  posterUrl?: string;

  @Property({ nullable: true })
  trailerUrl?: string;

  @Property({ default: 0 })
  rating: number;

  @Enum(() => AgeRating)
  ageRating: AgeRating;

  @Enum(() => MovieStatus)
  status: MovieStatus;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}

// Genre Entity
@Entity()
export class Genre {
  @PrimaryKey()
  id: string = uuid();

  @Property()
  name: string;

  @Property()
  slug: string;
}

// MovieGenre (Many-to-Many)
@Entity()
export class MovieGenre {
  @PrimaryKey()
  id: string = uuid();

  @ManyToOne(() => Movie)
  movie: Movie;

  @ManyToOne(() => Genre)
  genre: Genre;
}
```

#### **APIs:**
```
GET    /api/movies
GET    /api/movies/:id
POST   /api/movies (Admin)
PUT    /api/movies/:id (Admin)
DELETE /api/movies/:id (Admin)
GET    /api/movies/now-showing
GET    /api/movies/coming-soon
GET    /api/genres
POST   /api/genres (Admin)
```

#### **Deliverables:**
- [ ] Movie CRUD working
- [ ] Genre management working
- [ ] Search & filter working
- [ ] Swagger docs updated
- [ ] Unit tests (basic)

---

### **Week 3: Cinema Service**

#### **Features:**
```
1. Cinema CRUD
2. Theater/Room management
3. Seat layout configuration
4. Location-based search
```

#### **Database Schema:**
```typescript
// Cinema Entity
@Entity()
export class Cinema {
  @PrimaryKey()
  id: string = uuid();

  @Property()
  name: string;

  @Property()
  address: string;

  @Property()
  city: string;

  @Property()
  district: string;

  @Property({ type: 'decimal' })
  latitude: number;

  @Property({ type: 'decimal' })
  longitude: number;

  @Property()
  phone: string;

  @Property({ type: 'array' })
  facilities: string[];

  @Enum(() => CinemaStatus)
  status: CinemaStatus;

  @Property()
  createdAt: Date = new Date();
}

// Theater Entity
@Entity()
export class Theater {
  @PrimaryKey()
  id: string = uuid();

  @ManyToOne(() => Cinema)
  cinema: Cinema;

  @Property()
  name: string;

  @Property()
  capacity: number;

  @Enum(() => ScreenType)
  screenType: ScreenType;

  @Enum(() => SoundSystem)
  soundSystem: SoundSystem;

  @Enum(() => TheaterStatus)
  status: TheaterStatus;
}

// Seat Entity
@Entity()
export class Seat {
  @PrimaryKey()
  id: string = uuid();

  @ManyToOne(() => Theater)
  theater: Theater;

  @Property()
  row: string;

  @Property()
  number: number;

  @Enum(() => SeatType)
  type: SeatType;

  @Enum(() => SeatStatus)
  status: SeatStatus;
}
```

#### **APIs:**
```
GET    /api/cinemas
GET    /api/cinemas/:id
POST   /api/cinemas (Admin)
PUT    /api/cinemas/:id (Admin)
GET    /api/cinemas/nearby?lat=&lng=
GET    /api/cinemas/:id/theaters
GET    /api/theaters/:id/seats
POST   /api/theaters (Admin)
POST   /api/seats/bulk (Admin)
```

#### **Deliverables:**
- [ ] Cinema CRUD working
- [ ] Theater management working
- [ ] Seat layout creation working
- [ ] Location search working
- [ ] Swagger docs updated

---

### **Week 4: Showtime Service**

#### **Features:**
```
1. Showtime scheduling
2. Seat pricing by type
3. Available seats checking
4. Showtime search & filter
```

#### **Database Schema:**
```typescript
// Showtime Entity
@Entity()
export class Showtime {
  @PrimaryKey()
  id: string = uuid();

  @Property()
  movieId: string; // Reference to Movie service

  @ManyToOne(() => Theater)
  theater: Theater;

  @Property()
  startTime: Date;

  @Property()
  endTime: Date;

  @Property({ type: 'decimal' })
  basePrice: number;

  @Enum(() => ShowtimeStatus)
  status: ShowtimeStatus;

  @Property()
  createdAt: Date = new Date();
}

// SeatPricing Entity
@Entity()
export class SeatPricing {
  @PrimaryKey()
  id: string = uuid();

  @ManyToOne(() => Showtime)
  showtime: Showtime;

  @Enum(() => SeatType)
  seatType: SeatType;

  @Property({ type: 'decimal' })
  price: number;
}

// ShowtimeSeat Entity (Seat availability per showtime)
@Entity()
export class ShowtimeSeat {
  @PrimaryKey()
  id: string = uuid();

  @ManyToOne(() => Showtime)
  showtime: Showtime;

  @Property()
  seatId: string; // Reference to Seat

  @Enum(() => ShowtimeSeatStatus)
  status: ShowtimeSeatStatus; // Available, Locked, Booked

  @Property({ nullable: true })
  lockedUntil?: Date;

  @Property({ nullable: true })
  lockedBy?: string; // Session ID or User ID
}
```

#### **APIs:**
```
GET    /api/showtimes?movieId=&cinemaId=&date=
GET    /api/showtimes/:id
GET    /api/showtimes/:id/available-seats
POST   /api/showtimes (Admin)
PUT    /api/showtimes/:id (Admin)
DELETE /api/showtimes/:id (Admin)
```

#### **Deliverables:**
- [ ] Showtime CRUD working
- [ ] Seat pricing working
- [ ] Available seats query working
- [ ] Search & filter working
- [ ] Swagger docs updated

---

## 🎫 PHASE 2: Booking Flow (Week 5-8)

### **Week 5: Booking Service - Part 1 (Seat Lock)**

#### **Features:**
```
1. Seat selection
2. Seat locking (Redis)
3. Lock expiration
4. Lock release
```

#### **Implementation:**
```typescript
// Seat Lock Service
@Injectable()
export class SeatLockService {
  constructor(private redis: Redis) {}

  async lockSeats(dto: LockSeatsDto): Promise<LockResult> {
    const { sessionId, showtimeId, seatIds } = dto;
    
    // 1. Check if seats are available
    const seats = await this.showtimeService.getSeats(showtimeId, seatIds);
    const unavailable = seats.filter(s => s.status !== 'Available');
    
    if (unavailable.length > 0) {
      throw new ConflictException('Some seats are not available');
    }
    
    // 2. Lock seats in Redis
    const lockDuration = 10 * 60 * 1000; // 10 minutes
    const lockKey = `lock:${showtimeId}:${seatIds.join(',')}`;
    const lockValue = JSON.stringify({
      sessionId,
      seatIds,
      lockedAt: Date.now(),
      expiresAt: Date.now() + lockDuration,
    });
    
    const locked = await this.redis.set(
      lockKey,
      lockValue,
      'NX', // Only set if not exists
      'PX', // Expire in milliseconds
      lockDuration
    );
    
    if (!locked) {
      throw new ConflictException('Seats are already locked');
    }
    
    // 3. Update seat status in database
    await this.showtimeService.updateSeatStatus(
      showtimeId,
      seatIds,
      'Locked',
      sessionId,
      new Date(Date.now() + lockDuration)
    );
    
    return {
      locked: true,
      expiresAt: new Date(Date.now() + lockDuration),
      sessionId,
    };
  }

  async unlockSeats(sessionId: string, showtimeId: string, seatIds: string[]): Promise<void> {
    const lockKey = `lock:${showtimeId}:${seatIds.join(',')}`;
    
    // 1. Delete lock from Redis
    await this.redis.del(lockKey);
    
    // 2. Update seat status in database
    await this.showtimeService.updateSeatStatus(
      showtimeId,
      seatIds,
      'Available',
      null,
      null
    );
  }

  async extendLock(sessionId: string, showtimeId: string, seatIds: string[]): Promise<LockResult> {
    const lockKey = `lock:${showtimeId}:${seatIds.join(',')}`;
    
    // Check if lock exists and belongs to this session
    const lockData = await this.redis.get(lockKey);
    if (!lockData) {
      throw new NotFoundException('Lock not found');
    }
    
    const lock = JSON.parse(lockData);
    if (lock.sessionId !== sessionId) {
      throw new ForbiddenException('Lock belongs to another session');
    }
    
    // Extend by 5 minutes
    const extension = 5 * 60 * 1000;
    await this.redis.pexpire(lockKey, extension);
    
    return {
      locked: true,
      expiresAt: new Date(Date.now() + extension),
      sessionId,
    };
  }
}
```

#### **APIs:**
```
POST   /api/bookings/lock-seats
DELETE /api/bookings/unlock-seats
PUT    /api/bookings/extend-lock
```

#### **Deliverables:**
- [ ] Seat locking working
- [ ] Lock expiration working
- [ ] Lock release working
- [ ] Lock extension working

---

### **Week 6: Booking Service - Part 2 (Create Booking)**

#### **Features:**
```
1. Create booking
2. Guest checkout
3. Booking validation
4. QR code generation
```

#### **Database Schema:**
```typescript
// Booking Entity
@Entity()
export class Booking {
  @PrimaryKey()
  id: string = uuid();

  @Property({ nullable: true })
  userId?: string; // Null for guest

  @Property()
  showtimeId: string;

  @Property()
  email: string;

  @Property()
  name: string;

  @Property({ nullable: true })
  phone?: string;

  @Property({ type: 'decimal' })
  totalAmount: number;

  @Property({ type: 'decimal', default: 0 })
  discount: number;

  @Property({ type: 'decimal' })
  finalAmount: number;

  @Enum(() => BookingStatus)
  status: BookingStatus;

  @Enum(() => PaymentStatus)
  paymentStatus: PaymentStatus;

  @Property({ nullable: true })
  qrCode?: string;

  @Property({ nullable: true })
  expiresAt?: Date; // For pending bookings

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}

// BookingSeat Entity
@Entity()
export class BookingSeat {
  @PrimaryKey()
  id: string = uuid();

  @ManyToOne(() => Booking)
  booking: Booking;

  @Property()
  seatId: string;

  @Property({ type: 'decimal' })
  price: number;
}
```

#### **APIs:**
```
POST   /api/bookings
GET    /api/bookings/:id
GET    /api/bookings/my-bookings
PUT    /api/bookings/:id/cancel
```

#### **Implementation:**
```typescript
@Injectable()
export class BookingService {
  async createBooking(dto: CreateBookingDto): Promise<Booking> {
    // 1. Validate lock exists
    const lockKey = `lock:${dto.showtimeId}:${dto.seatIds.join(',')}`;
    const lockData = await this.redis.get(lockKey);
    
    if (!lockData) {
      throw new BadRequestException('Seats are not locked');
    }
    
    const lock = JSON.parse(lockData);
    if (lock.sessionId !== dto.sessionId) {
      throw new ForbiddenException('Lock belongs to another session');
    }
    
    // 2. Calculate pricing
    const pricing = await this.calculatePricing(dto.showtimeId, dto.seatIds);
    
    // 3. Create booking
    const booking = this.bookingRepository.create({
      userId: dto.userId,
      showtimeId: dto.showtimeId,
      email: dto.email,
      name: dto.name,
      phone: dto.phone,
      totalAmount: pricing.total,
      discount: dto.discount || 0,
      finalAmount: pricing.total - (dto.discount || 0),
      status: BookingStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 min to pay
    });
    
    await this.bookingRepository.persistAndFlush(booking);
    
    // 4. Create booking seats
    for (const seatId of dto.seatIds) {
      const price = pricing.seats.find(s => s.seatId === seatId).price;
      const bookingSeat = this.bookingSeatRepository.create({
        booking,
        seatId,
        price,
      });
      await this.bookingSeatRepository.persistAndFlush(bookingSeat);
    }
    
    // 5. Generate QR code
    booking.qrCode = await this.generateQRCode(booking.id);
    await this.bookingRepository.flush();
    
    return booking;
  }
}
```

#### **Deliverables:**
- [ ] Create booking working
- [ ] Guest checkout working
- [ ] QR code generation working
- [ ] Booking validation working

---

### **Week 7: Payment Service**

#### **Features:**
```
1. Payment gateway integration (VNPay)
2. Payment verification
3. Payment callback handling
4. Refund processing
```

#### **Database Schema:**
```typescript
// Payment Entity
@Entity()
export class Payment {
  @PrimaryKey()
  id: string = uuid();

  @Property()
  bookingId: string;

  @Property({ nullable: true })
  userId?: string;

  @Property({ type: 'decimal' })
  amount: number;

  @Enum(() => PaymentMethod)
  method: PaymentMethod;

  @Enum(() => PaymentStatus)
  status: PaymentStatus;

  @Property({ nullable: true })
  transactionId?: string;

  @Property({ type: 'json', nullable: true })
  gatewayResponse?: any;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
```

#### **APIs:**
```
POST   /api/payments/create
POST   /api/payments/verify
POST   /api/payments/:id/refund
GET    /api/payments/history
POST   /api/payments/webhook/vnpay
```

#### **Deliverables:**
- [ ] VNPay integration working
- [ ] Payment verification working
- [ ] Webhook handling working
- [ ] Refund processing working

---

### **Week 8: Booking Saga Orchestrator**

#### **Features:**
```
1. Saga orchestration for booking flow
2. Compensation handling
3. Saga state management
```

#### **Booking Saga Flow:**
```typescript
@Injectable()
export class BookingSagaOrchestrator {
  async executeBookingSaga(request: CreateBookingRequest): Promise<SagaResult> {
    const saga = await this.createSaga('BOOKING', request);
    
    try {
      // Step 1: Validate seat lock
      await this.validateSeatLock(saga, request);
      
      // Step 2: Create booking
      const booking = await this.createBooking(saga, request);
      
      // Step 3: Process payment
      const payment = await this.processPayment(saga, booking);
      
      // Step 4: Confirm booking
      await this.confirmBooking(saga, booking, payment);
      
      // Step 5: Send notifications
      await this.sendNotifications(saga, booking);
      
      return { success: true, bookingId: booking.id };
      
    } catch (error) {
      return await this.compensateSaga(saga, error);
    }
  }
}
```

#### **Deliverables:**
- [ ] Saga orchestration working
- [ ] Compensation working
- [ ] State management working
- [ ] Error handling working

---

## 🍿 PHASE 3: Additional Features (Week 9-10)

### **Week 9: F&B Service**

#### **Features:**
```
1. Menu management
2. Combo deals
3. Add to booking
```

#### **Database Schema:**
```typescript
@Entity()
export class FnBItem {
  @PrimaryKey()
  id: string = uuid();

  @Property()
  name: string;

  @Property({ type: 'text' })
  description: string;

  @Enum(() => FnBCategory)
  category: FnBCategory;

  @Property({ type: 'decimal' })
  price: number;

  @Property({ nullable: true })
  imageUrl?: string;

  @Property({ default: true })
  isAvailable: boolean;

  @Property({ default: 0 })
  stock: number;
}

@Entity()
export class BookingFnB {
  @PrimaryKey()
  id: string = uuid();

  @ManyToOne(() => Booking)
  booking: Booking;

  @ManyToOne(() => FnBItem)
  item: FnBItem;

  @Property()
  quantity: number;

  @Property({ type: 'decimal' })
  price: number;
}
```

#### **Deliverables:**
- [ ] Menu CRUD working
- [ ] Add F&B to booking working
- [ ] Stock management working

---

### **Week 10: Promotion Service**

#### **Features:**
```
1. Voucher management
2. Voucher validation
3. Loyalty points (basic)
```

#### **Database Schema:**
```typescript
@Entity()
export class Voucher {
  @PrimaryKey()
  id: string = uuid();

  @Property()
  code: string;

  @Enum(() => VoucherType)
  type: VoucherType;

  @Property({ type: 'decimal' })
  value: number;

  @Property({ type: 'decimal', default: 0 })
  minPurchase: number;

  @Property({ type: 'decimal', nullable: true })
  maxDiscount?: number;

  @Property()
  startDate: Date;

  @Property()
  endDate: Date;

  @Property({ default: 0 })
  usageLimit: number;

  @Property({ default: 0 })
  usedCount: number;

  @Enum(() => VoucherStatus)
  status: VoucherStatus;
}
```

#### **Deliverables:**
- [ ] Voucher CRUD working
- [ ] Voucher validation working
- [ ] Apply voucher to booking working

---

## 🎨 PHASE 4: Polish & Testing (Week 11-12)

### **Week 11: Integration & Testing**

#### **Tasks:**
```
✅ End-to-end testing
✅ Integration testing between services
✅ Fix bugs
✅ Performance testing
✅ Load testing (basic)
```

#### **Deliverables:**
- [ ] All services integrated
- [ ] E2E tests passing
- [ ] No critical bugs
- [ ] Performance acceptable

---

### **Week 12: Documentation & Deployment**

#### **Tasks:**
```
✅ API documentation (Swagger)
✅ README updates
✅ Deployment guide
✅ Environment setup guide
✅ Demo data seeding
```

#### **Deliverables:**
- [ ] Complete API docs
- [ ] Deployment ready
- [ ] Demo environment working
- [ ] Handover documentation

---

## 📊 **MILESTONE CHECKLIST**

### **Phase 1 Complete (Week 4):**
- [ ] Movie service working
- [ ] Cinema service working
- [ ] Showtime service working
- [ ] All APIs documented

### **Phase 2 Complete (Week 8):**
- [ ] Booking flow working end-to-end
- [ ] Payment integration working
- [ ] Saga pattern implemented
- [ ] Guest checkout working

### **Phase 3 Complete (Week 10):**
- [ ] F&B service working
- [ ] Promotion service working
- [ ] All features integrated

### **Phase 4 Complete (Week 12):**
- [ ] All tests passing
- [ ] Documentation complete
- [ ] Ready for production

---

## 🔄 **AFTER PHASE 4: Security & Optimization**

### **Phase 5: Security (Week 13-14)**
```
✅ IP rate limiting
✅ Email verification
✅ Device fingerprinting
✅ CAPTCHA integration
✅ Fraud detection
```

### **Phase 6: Optimization (Week 15-16)**
```
✅ Caching strategy
✅ Database indexing
✅ Query optimization
✅ Load balancing
✅ Monitoring & alerts
```

---

## 🎯 **SUCCESS CRITERIA**

### **MVP (Week 12):**
```
✅ User can browse movies
✅ User can select showtime
✅ User can select seats
✅ User can checkout as guest
✅ User can pay via VNPay
✅ User receives booking confirmation
✅ User can view booking details
✅ User can cancel booking
```

### **Performance:**
```
✅ API response time < 500ms (p95)
✅ Seat lock < 100ms
✅ Booking creation < 1s
✅ Payment redirect < 2s
```

### **Reliability:**
```
✅ 99% uptime
✅ No data loss
✅ Graceful error handling
✅ Proper logging
```

---

**Created:** 2026-02-04  
**Version:** 1.0  
**Status:** Implementation Plan
