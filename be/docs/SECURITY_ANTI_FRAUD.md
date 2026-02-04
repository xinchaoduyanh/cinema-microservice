# 🛡️ Guest Checkout Security & Anti-Fraud Strategy

## ⚠️ THREAT ANALYSIS - Các Kiểu Tấn Công

### **Attack Scenario 1: Seat Squatting (Chiếm chỗ ảo)**
```
Kịch bản:
1. Attacker tạo nhiều guest checkout
2. Lock tất cả ghế của suất chiếu hot
3. Không thanh toán → Ghế bị lock 15 phút
4. Khách thật không đặt được
5. Lặp lại liên tục → DOS attack

Impact:
❌ Khách hàng thật không đặt được vé
❌ Mất doanh thu
❌ Trải nghiệm người dùng tệ
❌ Uy tín bị ảnh hưởng
```

### **Attack Scenario 2: Scalper Bots (Bot mua vé)**
```
Kịch bản:
1. Bot tự động đặt vé cho phim hot
2. Mua hết vé trong vài giây
3. Bán lại với giá cao

Impact:
❌ Khách thật không mua được
❌ Giá vé bị thổi lên
❌ Trải nghiệm tệ
```

### **Attack Scenario 3: Fake Bookings (Đặt vé giả)**
```
Kịch bản:
1. Tạo nhiều booking với email/phone giả
2. Không thanh toán
3. Spam hệ thống

Impact:
❌ Database bị spam
❌ Email/SMS service bị lạm dụng
❌ Chi phí tăng
```

---

## 🔐 COMPREHENSIVE SECURITY SOLUTION

### **Layer 1: Phone Verification (REQUIRED)**

#### **Quy trình bắt buộc:**
```typescript
┌─────────────────────────────────────────────────────────┐
│  GUEST CHECKOUT FLOW (SECURED)                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Step 1: Select seats                                   │
│  ↓                                                       │
│  Step 2: Enter phone number ✅ REQUIRED                 │
│  ↓                                                       │
│  Step 3: Verify OTP ✅ REQUIRED                         │
│  │  - Send OTP to phone                                 │
│  │  - User enters OTP                                   │
│  │  - Verify OTP (60 seconds timeout)                  │
│  │  - Max 3 attempts                                    │
│  ↓                                                       │
│  Step 4: Phone verified → Lock seats (15 min)          │
│  ↓                                                       │
│  Step 5: Enter email, name                             │
│  ↓                                                       │
│  Step 6: Payment (must complete in 15 min)             │
│  ↓                                                       │
│  Step 7: Confirmation                                   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

#### **Implementation:**
```typescript
// Step 1: Request OTP
@Post('bookings/request-otp')
async requestOTP(@Body() dto: RequestOTPDto) {
  const { phone, showtimeId, seatIds } = dto;
  
  // 1. Validate phone format
  if (!isValidPhoneNumber(phone)) {
    throw new BadRequestException('Invalid phone number');
  }
  
  // 2. Check rate limiting (per phone)
  const otpCount = await this.redis.get(`otp:count:${phone}`);
  if (otpCount && parseInt(otpCount) >= 5) {
    throw new TooManyRequestsException('Too many OTP requests. Try again in 1 hour');
  }
  
  // 3. Check if phone is blacklisted
  const isBlacklisted = await this.checkPhoneBlacklist(phone);
  if (isBlacklisted) {
    throw new ForbiddenException('Phone number is blocked');
  }
  
  // 4. Generate OTP
  const otp = generateOTP(6); // 6 digits
  
  // 5. Store OTP in Redis (60 seconds TTL)
  await this.redis.setex(`otp:${phone}`, 60, otp);
  
  // 6. Increment OTP count
  await this.redis.incr(`otp:count:${phone}`);
  await this.redis.expire(`otp:count:${phone}`, 3600); // 1 hour
  
  // 7. Send SMS
  await this.smsService.send(phone, `Your OTP: ${otp}. Valid for 60 seconds.`);
  
  return {
    message: 'OTP sent successfully',
    expiresIn: 60,
  };
}

// Step 2: Verify OTP & Lock Seats
@Post('bookings/verify-otp')
async verifyOTPAndLockSeats(@Body() dto: VerifyOTPDto) {
  const { phone, otp, showtimeId, seatIds } = dto;
  
  // 1. Verify OTP
  const storedOTP = await this.redis.get(`otp:${phone}`);
  if (!storedOTP || storedOTP !== otp) {
    // Track failed attempts
    await this.redis.incr(`otp:failed:${phone}`);
    const failedCount = await this.redis.get(`otp:failed:${phone}`);
    
    if (parseInt(failedCount) >= 3) {
      // Block phone for 1 hour after 3 failed attempts
      await this.redis.setex(`otp:blocked:${phone}`, 3600, '1');
      throw new ForbiddenException('Too many failed attempts. Blocked for 1 hour');
    }
    
    throw new BadRequestException('Invalid OTP');
  }
  
  // 2. Delete OTP (one-time use)
  await this.redis.del(`otp:${phone}`);
  
  // 3. Create temporary session
  const sessionId = generateUUID();
  await this.redis.setex(`session:${sessionId}`, 900, JSON.stringify({
    phone,
    verified: true,
    showtimeId,
    seatIds,
  }));
  
  // 4. Lock seats (15 minutes)
  const lockResult = await this.showtimeService.lockSeats({
    sessionId,
    phone,
    showtimeId,
    seatIds,
    lockDuration: 15 * 60 * 1000, // 15 minutes
  });
  
  return {
    sessionId,
    lockExpiresAt: lockResult.expiresAt,
    message: 'Seats locked successfully',
  };
}
```

---

### **Layer 2: Rate Limiting (Multi-Level)**

#### **2.1 IP-based Rate Limiting**
```typescript
// Limit requests per IP
@Injectable()
export class IPRateLimitGuard implements CanActivate {
  constructor(private redis: Redis) {}
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip;
    
    // Limits:
    // - Max 10 OTP requests per IP per hour
    // - Max 5 seat locks per IP per hour
    // - Max 20 API calls per IP per minute
    
    const key = `rate:ip:${ip}`;
    const count = await this.redis.incr(key);
    
    if (count === 1) {
      await this.redis.expire(key, 3600); // 1 hour
    }
    
    if (count > 10) {
      throw new TooManyRequestsException('Rate limit exceeded');
    }
    
    return true;
  }
}
```

#### **2.2 Phone-based Rate Limiting**
```typescript
// Limit bookings per phone number
const limits = {
  // Max 3 OTP requests per phone per hour
  otpPerHour: 3,
  
  // Max 2 seat locks per phone per hour
  locksPerHour: 2,
  
  // Max 5 bookings per phone per day
  bookingsPerDay: 5,
  
  // Max 1 booking per phone per showtime
  bookingsPerShowtime: 1,
};

async function checkPhoneRateLimit(phone: string, action: string) {
  const key = `rate:phone:${action}:${phone}`;
  const count = await redis.incr(key);
  
  if (count === 1) {
    const ttl = action === 'booking' ? 86400 : 3600;
    await redis.expire(key, ttl);
  }
  
  const limit = limits[`${action}PerHour`] || limits[`${action}PerDay`];
  
  if (count > limit) {
    throw new TooManyRequestsException(`Too many ${action}s`);
  }
}
```

#### **2.3 Device Fingerprinting**
```typescript
// Track unique devices
import Fingerprint from '@fingerprintjs/fingerprintjs';

@Injectable()
export class DeviceFingerprintService {
  async getDeviceFingerprint(request: Request): Promise<string> {
    // Combine multiple factors
    const factors = [
      request.headers['user-agent'],
      request.headers['accept-language'],
      request.headers['accept-encoding'],
      request.ip,
    ];
    
    return crypto
      .createHash('sha256')
      .update(factors.join('|'))
      .digest('hex');
  }
  
  async checkDeviceLimit(fingerprint: string): Promise<boolean> {
    const key = `rate:device:${fingerprint}`;
    const count = await this.redis.incr(key);
    
    if (count === 1) {
      await this.redis.expire(key, 3600); // 1 hour
    }
    
    // Max 3 seat locks per device per hour
    return count <= 3;
  }
}
```

---

### **Layer 3: Seat Lock Strategy (Advanced)**

#### **3.1 Progressive Lock Duration**
```typescript
interface SeatLockStrategy {
  // First-time user: 15 minutes
  firstTime: 15 * 60 * 1000;
  
  // Verified phone: 15 minutes
  verifiedPhone: 15 * 60 * 1000;
  
  // Registered user: 20 minutes
  registeredUser: 20 * 60 * 1000;
  
  // VIP member: 30 minutes
  vipMember: 30 * 60 * 1000;
}

async function calculateLockDuration(user: User | null, phone: string): Promise<number> {
  if (user?.membershipTier === 'PLATINUM') {
    return 30 * 60 * 1000;
  }
  
  if (user) {
    return 20 * 60 * 1000;
  }
  
  // Check if phone has successful booking history
  const hasHistory = await this.hasSuccessfulBooking(phone);
  if (hasHistory) {
    return 15 * 60 * 1000;
  }
  
  // New user: shorter lock
  return 10 * 60 * 1000;
}
```

#### **3.2 Smart Lock Release**
```typescript
// Release locks early if user abandons
@Injectable()
export class SmartLockService {
  async monitorLockActivity(lockId: string) {
    // Track user activity
    const lastActivity = await this.redis.get(`lock:activity:${lockId}`);
    const now = Date.now();
    
    // If no activity for 5 minutes, release lock early
    if (lastActivity && now - parseInt(lastActivity) > 5 * 60 * 1000) {
      await this.releaseLock(lockId);
      this.logger.log(`Lock ${lockId} released due to inactivity`);
    }
  }
  
  async trackActivity(lockId: string) {
    await this.redis.set(`lock:activity:${lockId}`, Date.now().toString());
  }
}
```

#### **3.3 Lock Queue System**
```typescript
// If seats are locked, allow users to join queue
interface SeatQueue {
  showtimeId: string;
  seatIds: string[];
  queue: {
    phone: string;
    joinedAt: Date;
    notified: boolean;
  }[];
}

async function joinSeatQueue(showtimeId: string, seatIds: string[], phone: string) {
  const queueKey = `queue:${showtimeId}:${seatIds.join(',')}`;
  
  await this.redis.rpush(queueKey, JSON.stringify({
    phone,
    joinedAt: new Date(),
    notified: false,
  }));
  
  return {
    position: await this.redis.llen(queueKey),
    estimatedWait: 15, // minutes
  };
}

// When lock is released, notify next in queue
async function notifyNextInQueue(showtimeId: string, seatIds: string[]) {
  const queueKey = `queue:${showtimeId}:${seatIds.join(',')}`;
  const next = await this.redis.lpop(queueKey);
  
  if (next) {
    const user = JSON.parse(next);
    await this.smsService.send(
      user.phone,
      `Seats are now available! Book now: ${bookingUrl}`
    );
  }
}
```

---

### **Layer 4: Bot Detection**

#### **4.1 CAPTCHA Integration**
```typescript
// Require CAPTCHA for suspicious activity
@Injectable()
export class CaptchaService {
  async verifyCaptcha(token: string): Promise<boolean> {
    // Use Google reCAPTCHA v3
    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        secret: process.env.RECAPTCHA_SECRET,
        response: token,
      }
    );
    
    // Score: 0.0 (bot) to 1.0 (human)
    return response.data.success && response.data.score > 0.5;
  }
  
  async requireCaptcha(phone: string, ip: string): Promise<boolean> {
    // Require CAPTCHA if:
    // 1. Multiple failed OTP attempts
    // 2. High request rate from IP
    // 3. Phone number flagged
    
    const failedOTP = await this.redis.get(`otp:failed:${phone}`);
    const ipRequests = await this.redis.get(`rate:ip:${ip}`);
    
    return (
      (failedOTP && parseInt(failedOTP) >= 2) ||
      (ipRequests && parseInt(ipRequests) >= 5)
    );
  }
}

// API endpoint
@Post('bookings/request-otp')
async requestOTP(@Body() dto: RequestOTPDto) {
  const { phone, captchaToken } = dto;
  
  // Check if CAPTCHA is required
  const needsCaptcha = await this.captchaService.requireCaptcha(
    phone,
    request.ip
  );
  
  if (needsCaptcha) {
    if (!captchaToken) {
      throw new BadRequestException('CAPTCHA required');
    }
    
    const isValid = await this.captchaService.verifyCaptcha(captchaToken);
    if (!isValid) {
      throw new BadRequestException('Invalid CAPTCHA');
    }
  }
  
  // Continue with OTP...
}
```

#### **4.2 Behavioral Analysis**
```typescript
@Injectable()
export class BehaviorAnalysisService {
  async analyzeBehavior(sessionId: string): Promise<RiskScore> {
    const events = await this.getSessionEvents(sessionId);
    
    let riskScore = 0;
    
    // 1. Too fast (bot-like behavior)
    const duration = events[events.length - 1].timestamp - events[0].timestamp;
    if (duration < 5000) { // Less than 5 seconds
      riskScore += 50;
    }
    
    // 2. No mouse movement (headless browser)
    const hasMouseEvents = events.some(e => e.type === 'mousemove');
    if (!hasMouseEvents) {
      riskScore += 30;
    }
    
    // 3. Unusual patterns
    const clickSpeed = this.calculateClickSpeed(events);
    if (clickSpeed > 10) { // More than 10 clicks per second
      riskScore += 40;
    }
    
    // 4. Multiple tabs (suspicious)
    const tabCount = await this.getActiveTabCount(sessionId);
    if (tabCount > 3) {
      riskScore += 20;
    }
    
    return {
      score: riskScore,
      level: riskScore > 70 ? 'HIGH' : riskScore > 40 ? 'MEDIUM' : 'LOW',
    };
  }
}
```

---

### **Layer 5: Payment Verification**

#### **5.1 Payment Hold Strategy**
```typescript
// For high-risk bookings, hold payment verification
async function processPayment(booking: Booking, riskScore: RiskScore) {
  if (riskScore.level === 'HIGH') {
    // Require additional verification
    return {
      status: 'PENDING_VERIFICATION',
      message: 'Payment is being verified. You will receive confirmation within 30 minutes.',
      actions: [
        'Verify phone number',
        'Provide ID document',
      ],
    };
  }
  
  // Normal flow
  return await this.paymentGateway.process(booking);
}
```

#### **5.2 Fraud Detection**
```typescript
@Injectable()
export class FraudDetectionService {
  async checkFraud(booking: BookingData): Promise<FraudCheck> {
    const signals = [];
    
    // 1. Check if phone/email is in fraud database
    const isKnownFraud = await this.checkFraudDatabase(
      booking.phone,
      booking.email
    );
    if (isKnownFraud) {
      signals.push('KNOWN_FRAUD');
    }
    
    // 2. Check velocity (too many bookings)
    const recentBookings = await this.getRecentBookings(booking.phone);
    if (recentBookings.length > 5) {
      signals.push('HIGH_VELOCITY');
    }
    
    // 3. Check if using VPN/Proxy
    const isVPN = await this.checkVPN(booking.ip);
    if (isVPN) {
      signals.push('VPN_DETECTED');
    }
    
    // 4. Check payment method reputation
    const paymentRisk = await this.checkPaymentRisk(booking.paymentMethod);
    if (paymentRisk === 'HIGH') {
      signals.push('RISKY_PAYMENT');
    }
    
    return {
      isFraud: signals.length >= 2,
      signals,
      action: signals.length >= 2 ? 'BLOCK' : signals.length === 1 ? 'REVIEW' : 'ALLOW',
    };
  }
}
```

---

### **Layer 6: Blacklist & Whitelist**

#### **6.1 Dynamic Blacklist**
```typescript
@Injectable()
export class BlacklistService {
  async addToBlacklist(
    identifier: string,
    type: 'phone' | 'email' | 'ip' | 'device',
    reason: string,
    duration: number = 86400 * 30 // 30 days
  ) {
    const key = `blacklist:${type}:${identifier}`;
    await this.redis.setex(key, duration, JSON.stringify({
      reason,
      addedAt: new Date(),
      expiresAt: new Date(Date.now() + duration * 1000),
    }));
    
    // Also add to permanent database
    await this.blacklistRepository.create({
      identifier,
      type,
      reason,
      expiresAt: new Date(Date.now() + duration * 1000),
    });
  }
  
  async checkBlacklist(identifier: string, type: string): Promise<boolean> {
    const key = `blacklist:${type}:${identifier}`;
    return await this.redis.exists(key) === 1;
  }
  
  // Auto-blacklist after suspicious activity
  async autoBlacklist(phone: string) {
    const violations = await this.getViolations(phone);
    
    if (violations.length >= 3) {
      await this.addToBlacklist(
        phone,
        'phone',
        `Auto-blacklisted: ${violations.length} violations`,
        86400 * 7 // 7 days
      );
    }
  }
}
```

#### **6.2 Whitelist for Trusted Users**
```typescript
// Trusted users get relaxed limits
async function checkWhitelist(phone: string): Promise<boolean> {
  // Criteria for whitelist:
  // 1. 5+ successful bookings
  // 2. No violations
  // 3. Member for 30+ days
  
  const user = await this.userRepository.findOne({ phone });
  
  if (!user) return false;
  
  const bookingCount = await this.bookingRepository.count({
    userId: user.id,
    status: 'COMPLETED',
  });
  
  const violations = await this.getViolations(phone);
  const accountAge = Date.now() - user.createdAt.getTime();
  
  return (
    bookingCount >= 5 &&
    violations.length === 0 &&
    accountAge > 30 * 86400 * 1000
  );
}
```

---

## 🎯 RECOMMENDED SECURITY FLOW

### **Complete Secured Guest Checkout:**

```typescript
┌─────────────────────────────────────────────────────────────┐
│  SECURED GUEST CHECKOUT FLOW                                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. User selects seats                                       │
│     ↓                                                        │
│  2. Check IP rate limit ✅                                   │
│     ↓                                                        │
│  3. Enter phone number ✅ REQUIRED                           │
│     ↓                                                        │
│  4. Check phone rate limit ✅                                │
│     ↓                                                        │
│  5. Check blacklist ✅                                       │
│     ↓                                                        │
│  6. CAPTCHA (if suspicious) ✅                               │
│     ↓                                                        │
│  7. Send OTP ✅                                              │
│     ↓                                                        │
│  8. Verify OTP (60s timeout, 3 attempts) ✅                  │
│     ↓                                                        │
│  9. Phone verified → Lock seats (10-15 min) ✅               │
│     ↓                                                        │
│  10. Track user behavior ✅                                  │
│     ↓                                                        │
│  11. Enter email, name                                       │
│     ↓                                                        │
│  12. Review order                                            │
│     ↓                                                        │
│  13. Payment (fraud check) ✅                                │
│     ↓                                                        │
│  14. Payment verification ✅                                 │
│     ↓                                                        │
│  15. Booking confirmed                                       │
│     ↓                                                        │
│  16. Auto-create account ✅                                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 SECURITY METRICS

### **Monitor These:**

```typescript
interface SecurityMetrics {
  // Rate limiting
  blockedIPs: number;
  blockedPhones: number;
  
  // OTP
  otpSent: number;
  otpFailed: number;
  otpSuccess: number;
  
  // Seat locks
  totalLocks: number;
  expiredLocks: number;
  convertedLocks: number; // Paid
  
  // Fraud
  fraudAttempts: number;
  blockedBookings: number;
  
  // CAPTCHA
  captchaRequired: number;
  captchaFailed: number;
  
  // Blacklist
  blacklistedUsers: number;
  blacklistHits: number;
}
```

---

## ✅ FINAL RECOMMENDATION

### **YES - Require Phone Verification:**

```
✅ Phone number REQUIRED
✅ OTP verification REQUIRED
✅ Rate limiting REQUIRED
✅ CAPTCHA for suspicious activity
✅ Behavioral analysis
✅ Fraud detection
✅ Blacklist management

Flow:
1. Select seats
2. Enter phone → Send OTP
3. Verify OTP → Lock seats (15 min)
4. Enter email, name
5. Payment
6. Confirmation
```

### **Security Layers:**

```
Layer 1: Phone OTP ✅ (Prevents fake accounts)
Layer 2: Rate Limiting ✅ (Prevents spam)
Layer 3: Smart Lock ✅ (Prevents seat squatting)
Layer 4: Bot Detection ✅ (Prevents automation)
Layer 5: Fraud Check ✅ (Prevents fraud)
Layer 6: Blacklist ✅ (Blocks bad actors)
```

### **Benefits:**

```
✅ Prevents seat squatting attacks
✅ Prevents bot attacks
✅ Prevents fake bookings
✅ Real phone = Real user
✅ Can contact user
✅ Can blacklist bad actors
✅ Better fraud prevention
✅ Still user-friendly (just OTP)
```

---

**Kết luận:** 
- ✅ **BẮT BUỘC** phone verification với OTP
- ✅ Multi-layer security
- ✅ Vẫn giữ UX tốt (chỉ thêm 1 bước OTP)
- ✅ Chống được tất cả các kiểu tấn công

**Created:** 2026-02-04  
**Version:** 1.0  
**Status:** Critical Security Requirements
