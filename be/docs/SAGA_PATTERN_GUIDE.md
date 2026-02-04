# 🎭 Saga Pattern Implementation Guide

## 📋 Table of Contents
- [What is Saga Pattern?](#what-is-saga-pattern)
- [Why Use Saga?](#why-use-saga)
- [Saga Types](#saga-types)
- [Implementation Strategy](#implementation-strategy)
- [Booking Saga Example](#booking-saga-example)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)

---

## 🎯 What is Saga Pattern?

**Saga Pattern** là một design pattern để quản lý **distributed transactions** trong microservices architecture. Thay vì sử dụng traditional 2PC (Two-Phase Commit), Saga chia transaction thành nhiều **local transactions** nhỏ, mỗi transaction được thực hiện bởi một service riêng biệt.

### **Key Concepts:**
- ✅ **Local Transaction:** Mỗi service thực hiện transaction riêng
- ✅ **Compensation:** Rollback bằng cách thực hiện compensating transaction
- ✅ **Eventual Consistency:** Dữ liệu sẽ consistent sau một khoảng thời gian
- ✅ **Idempotency:** Mỗi step có thể retry an toàn

---

## 🤔 Why Use Saga?

### **Problems with Distributed Transactions:**
```
❌ 2PC (Two-Phase Commit):
   - Blocking protocol
   - Single point of failure
   - Not suitable for microservices
   - Poor performance

❌ Without Saga:
   - Data inconsistency
   - Partial failures
   - Manual rollback
   - Complex error handling
```

### **Benefits of Saga:**
```
✅ Non-blocking
✅ High availability
✅ Scalability
✅ Automatic compensation
✅ Clear failure handling
✅ Audit trail
```

---

## 🔄 Saga Types

### **1. Choreography Saga** (Event-Driven)

```
┌──────────────┐      Event      ┌──────────────┐
│   Service A  │ ──────────────→ │   Service B  │
└──────────────┘                 └──────────────┘
                                        │
                                        │ Event
                                        ▼
                                 ┌──────────────┐
                                 │   Service C  │
                                 └──────────────┘
```

**Pros:**
- ✅ Loose coupling
- ✅ No central coordinator
- ✅ Simple for small flows

**Cons:**
- ❌ Hard to track saga state
- ❌ Cyclic dependencies risk
- ❌ Complex debugging

**Use Case:** Simple flows (2-3 services)

---

### **2. Orchestration Saga** (Command-Driven)

```
                    ┌──────────────────┐
                    │  Saga            │
                    │  Orchestrator    │
                    └──────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Service A   │    │  Service B   │    │  Service C   │
└──────────────┘    └──────────────┘    └──────────────┘
```

**Pros:**
- ✅ Centralized control
- ✅ Easy to track state
- ✅ Clear flow visualization
- ✅ Easy to add new steps

**Cons:**
- ❌ Orchestrator is SPOF
- ❌ Tight coupling to orchestrator

**Use Case:** Complex flows (4+ services) - **RECOMMENDED for Cinema System**

---

## 🏗️ Implementation Strategy

### **Architecture Components**

```typescript
// 1. Saga Orchestrator Service
@Injectable()
export class SagaOrchestrator {
  async executeBookingSaga(data: BookingSagaData): Promise<SagaResult> {
    const saga = await this.createSaga('BOOKING', data);
    
    try {
      // Execute steps sequentially
      await this.lockSeats(saga);
      await this.validateVoucher(saga);
      await this.createBooking(saga);
      await this.processPayment(saga);
      await this.confirmBooking(saga);
      await this.updateLoyaltyPoints(saga);
      await this.sendNotifications(saga);
      
      return this.completeSaga(saga);
    } catch (error) {
      return this.compensateSaga(saga, error);
    }
  }
}

// 2. Saga State Manager
@Injectable()
export class SagaStateManager {
  async createSaga(type: SagaType, data: any): Promise<Saga> {
    return this.sagaRepository.create({
      type,
      state: SagaState.STARTED,
      data,
      steps: [],
    });
  }
  
  async updateSagaState(sagaId: string, state: SagaState): Promise<void> {
    await this.sagaRepository.update(sagaId, { state });
  }
  
  async addStep(sagaId: string, step: SagaStep): Promise<void> {
    await this.sagaStepRepository.create({ sagaId, ...step });
  }
}

// 3. Compensation Handler
@Injectable()
export class CompensationHandler {
  private compensations = new Map<string, CompensationFn>();
  
  register(stepName: string, compensationFn: CompensationFn): void {
    this.compensations.set(stepName, compensationFn);
  }
  
  async compensate(saga: Saga): Promise<void> {
    // Reverse order compensation
    const completedSteps = saga.steps
      .filter(s => s.status === 'SUCCESS')
      .reverse();
    
    for (const step of completedSteps) {
      const compensationFn = this.compensations.get(step.name);
      if (compensationFn) {
        await compensationFn(step.request);
      }
    }
  }
}
```

---

## 🎫 Booking Saga Example

### **Complete Implementation**

```typescript
// saga-orchestrator/booking-saga.orchestrator.ts

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

@Injectable()
export class BookingSagaOrchestrator {
  private readonly logger = new Logger(BookingSagaOrchestrator.name);

  constructor(
    @InjectRepository(Saga)
    private sagaRepository: EntityRepository<Saga>,
    
    @InjectRepository(SagaStep)
    private sagaStepRepository: EntityRepository<SagaStep>,
    
    private showtimeClient: ShowtimeServiceClient,
    private promotionClient: PromotionServiceClient,
    private bookingClient: BookingServiceClient,
    private paymentClient: PaymentServiceClient,
    private notificationClient: NotificationServiceClient,
    
    private compensationHandler: CompensationHandler,
  ) {
    this.registerCompensations();
  }

  /**
   * Main Saga Execution
   */
  async executeBookingSaga(request: CreateBookingRequest): Promise<BookingSagaResult> {
    // 1. Create Saga Instance
    const saga = await this.createSagaInstance(request);
    
    try {
      // 2. Execute Steps
      const lockSeatsResult = await this.step1_LockSeats(saga, request);
      const voucherResult = await this.step2_ValidateVoucher(saga, request);
      const bookingResult = await this.step3_CreateBooking(saga, request, lockSeatsResult, voucherResult);
      const paymentResult = await this.step4_ProcessPayment(saga, bookingResult);
      await this.step5_ConfirmBooking(saga, bookingResult, paymentResult);
      await this.step6_UpdateLoyaltyPoints(saga, bookingResult);
      await this.step7_SendNotifications(saga, bookingResult);
      
      // 3. Complete Saga
      return await this.completeSaga(saga, bookingResult);
      
    } catch (error) {
      // 4. Compensate on Failure
      return await this.compensateSaga(saga, error);
    }
  }

  /**
   * Step 1: Lock Seats
   */
  private async step1_LockSeats(
    saga: Saga,
    request: CreateBookingRequest,
  ): Promise<LockSeatsResult> {
    const stepName = 'LOCK_SEATS';
    this.logger.log(`[${saga.id}] Executing ${stepName}`);
    
    try {
      const result = await this.showtimeClient.lockSeats({
        showtimeId: request.showtimeId,
        seatIds: request.seatIds,
        userId: request.userId,
        lockDuration: 15 * 60 * 1000, // 15 minutes
      });
      
      await this.recordStepSuccess(saga, stepName, request, result);
      return result;
      
    } catch (error) {
      await this.recordStepFailure(saga, stepName, request, error);
      throw new SagaStepFailedException(stepName, error);
    }
  }

  /**
   * Step 2: Validate Voucher (Optional)
   */
  private async step2_ValidateVoucher(
    saga: Saga,
    request: CreateBookingRequest,
  ): Promise<VoucherValidationResult | null> {
    if (!request.voucherCode) {
      return null;
    }
    
    const stepName = 'VALIDATE_VOUCHER';
    this.logger.log(`[${saga.id}] Executing ${stepName}`);
    
    try {
      const result = await this.promotionClient.validateVoucher({
        code: request.voucherCode,
        userId: request.userId,
        amount: request.totalAmount,
      });
      
      await this.recordStepSuccess(saga, stepName, request, result);
      return result;
      
    } catch (error) {
      await this.recordStepFailure(saga, stepName, request, error);
      throw new SagaStepFailedException(stepName, error);
    }
  }

  /**
   * Step 3: Create Booking
   */
  private async step3_CreateBooking(
    saga: Saga,
    request: CreateBookingRequest,
    lockSeatsResult: LockSeatsResult,
    voucherResult: VoucherValidationResult | null,
  ): Promise<BookingResult> {
    const stepName = 'CREATE_BOOKING';
    this.logger.log(`[${saga.id}] Executing ${stepName}`);
    
    try {
      const discount = voucherResult?.discountAmount || 0;
      const finalAmount = request.totalAmount - discount;
      
      const result = await this.bookingClient.createBooking({
        userId: request.userId,
        showtimeId: request.showtimeId,
        seatIds: request.seatIds,
        fnbItems: request.fnbItems,
        totalAmount: request.totalAmount,
        discount,
        finalAmount,
        voucherCode: request.voucherCode,
        status: BookingStatus.PENDING,
      });
      
      await this.recordStepSuccess(saga, stepName, request, result);
      return result;
      
    } catch (error) {
      await this.recordStepFailure(saga, stepName, request, error);
      throw new SagaStepFailedException(stepName, error);
    }
  }

  /**
   * Step 4: Process Payment
   */
  private async step4_ProcessPayment(
    saga: Saga,
    bookingResult: BookingResult,
  ): Promise<PaymentResult> {
    const stepName = 'PROCESS_PAYMENT';
    this.logger.log(`[${saga.id}] Executing ${stepName}`);
    
    try {
      const result = await this.paymentClient.createPayment({
        bookingId: bookingResult.id,
        userId: bookingResult.userId,
        amount: bookingResult.finalAmount,
        method: bookingResult.paymentMethod,
        returnUrl: process.env.PAYMENT_RETURN_URL,
      });
      
      await this.recordStepSuccess(saga, stepName, bookingResult, result);
      return result;
      
    } catch (error) {
      await this.recordStepFailure(saga, stepName, bookingResult, error);
      throw new SagaStepFailedException(stepName, error);
    }
  }

  /**
   * Step 5: Confirm Booking
   */
  private async step5_ConfirmBooking(
    saga: Saga,
    bookingResult: BookingResult,
    paymentResult: PaymentResult,
  ): Promise<void> {
    const stepName = 'CONFIRM_BOOKING';
    this.logger.log(`[${saga.id}] Executing ${stepName}`);
    
    try {
      await this.bookingClient.confirmBooking({
        bookingId: bookingResult.id,
        paymentId: paymentResult.id,
        status: BookingStatus.CONFIRMED,
      });
      
      await this.recordStepSuccess(saga, stepName, bookingResult, { confirmed: true });
      
    } catch (error) {
      await this.recordStepFailure(saga, stepName, bookingResult, error);
      throw new SagaStepFailedException(stepName, error);
    }
  }

  /**
   * Step 6: Update Loyalty Points (Non-Critical)
   */
  private async step6_UpdateLoyaltyPoints(
    saga: Saga,
    bookingResult: BookingResult,
  ): Promise<void> {
    const stepName = 'UPDATE_LOYALTY_POINTS';
    this.logger.log(`[${saga.id}] Executing ${stepName}`);
    
    try {
      const points = Math.floor(bookingResult.finalAmount / 1000); // 1 point per 1000 VND
      
      await this.promotionClient.addLoyaltyPoints({
        userId: bookingResult.userId,
        points,
        bookingId: bookingResult.id,
      });
      
      await this.recordStepSuccess(saga, stepName, bookingResult, { points });
      
    } catch (error) {
      // Non-critical step - just log error
      this.logger.warn(`[${saga.id}] ${stepName} failed (non-critical):`, error);
      await this.recordStepFailure(saga, stepName, bookingResult, error);
    }
  }

  /**
   * Step 7: Send Notifications (Non-Critical)
   */
  private async step7_SendNotifications(
    saga: Saga,
    bookingResult: BookingResult,
  ): Promise<void> {
    const stepName = 'SEND_NOTIFICATIONS';
    this.logger.log(`[${saga.id}] Executing ${stepName}`);
    
    try {
      await Promise.all([
        // Email
        this.notificationClient.sendEmail({
          to: bookingResult.userEmail,
          template: 'booking-confirmation',
          data: bookingResult,
        }),
        
        // SMS
        this.notificationClient.sendSMS({
          to: bookingResult.userPhone,
          message: `Booking confirmed! ID: ${bookingResult.id}`,
        }),
        
        // Push Notification
        this.notificationClient.sendPush({
          userId: bookingResult.userId,
          title: 'Booking Confirmed',
          body: `Your booking for ${bookingResult.movieTitle} is confirmed!`,
        }),
      ]);
      
      await this.recordStepSuccess(saga, stepName, bookingResult, { sent: true });
      
    } catch (error) {
      // Non-critical step - just log error
      this.logger.warn(`[${saga.id}] ${stepName} failed (non-critical):`, error);
      await this.recordStepFailure(saga, stepName, bookingResult, error);
    }
  }

  /**
   * Register Compensation Functions
   */
  private registerCompensations(): void {
    // Compensate: Unlock Seats
    this.compensationHandler.register('LOCK_SEATS', async (request) => {
      await this.showtimeClient.unlockSeats({
        showtimeId: request.showtimeId,
        seatIds: request.seatIds,
      });
    });
    
    // Compensate: Release Voucher
    this.compensationHandler.register('VALIDATE_VOUCHER', async (request) => {
      if (request.voucherCode) {
        await this.promotionClient.releaseVoucher({
          code: request.voucherCode,
          userId: request.userId,
        });
      }
    });
    
    // Compensate: Cancel Booking
    this.compensationHandler.register('CREATE_BOOKING', async (result) => {
      await this.bookingClient.cancelBooking({
        bookingId: result.id,
        reason: 'Saga compensation',
      });
    });
    
    // Compensate: Refund Payment
    this.compensationHandler.register('PROCESS_PAYMENT', async (result) => {
      await this.paymentClient.refund({
        paymentId: result.id,
        amount: result.amount,
        reason: 'Saga compensation',
      });
    });
  }

  /**
   * Compensate Saga on Failure
   */
  private async compensateSaga(saga: Saga, error: Error): Promise<BookingSagaResult> {
    this.logger.error(`[${saga.id}] Saga failed, starting compensation:`, error);
    
    await this.updateSagaState(saga, SagaState.COMPENSATING);
    
    try {
      await this.compensationHandler.compensate(saga);
      await this.updateSagaState(saga, SagaState.COMPENSATED);
      
      return {
        success: false,
        sagaId: saga.id,
        error: error.message,
        state: SagaState.COMPENSATED,
      };
      
    } catch (compensationError) {
      this.logger.error(`[${saga.id}] Compensation failed:`, compensationError);
      await this.updateSagaState(saga, SagaState.FAILED);
      
      return {
        success: false,
        sagaId: saga.id,
        error: error.message,
        compensationError: compensationError.message,
        state: SagaState.FAILED,
      };
    }
  }

  /**
   * Complete Saga Successfully
   */
  private async completeSaga(saga: Saga, bookingResult: BookingResult): Promise<BookingSagaResult> {
    await this.updateSagaState(saga, SagaState.COMPLETED);
    
    return {
      success: true,
      sagaId: saga.id,
      bookingId: bookingResult.id,
      state: SagaState.COMPLETED,
    };
  }

  // Helper methods...
  private async createSagaInstance(request: CreateBookingRequest): Promise<Saga> {
    const saga = this.sagaRepository.create({
      type: SagaType.BOOKING,
      state: SagaState.STARTED,
      data: request,
    });
    
    await this.sagaRepository.persistAndFlush(saga);
    return saga;
  }

  private async updateSagaState(saga: Saga, state: SagaState): Promise<void> {
    saga.state = state;
    saga.updatedAt = new Date();
    await this.sagaRepository.flush();
  }

  private async recordStepSuccess(saga: Saga, stepName: string, request: any, response: any): Promise<void> {
    const step = this.sagaStepRepository.create({
      saga,
      name: stepName,
      status: StepStatus.SUCCESS,
      request,
      response,
    });
    
    await this.sagaStepRepository.persistAndFlush(step);
  }

  private async recordStepFailure(saga: Saga, stepName: string, request: any, error: Error): Promise<void> {
    const step = this.sagaStepRepository.create({
      saga,
      name: stepName,
      status: StepStatus.FAILED,
      request,
      error: error.message,
    });
    
    await this.sagaStepRepository.persistAndFlush(step);
  }
}
```

---

## 🚨 Error Handling

### **Retry Strategy**

```typescript
@Injectable()
export class RetryHandler {
  async executeWithRetry<T>(
    fn: () => Promise<T>,
    options: RetryOptions = {},
  ): Promise<T> {
    const {
      maxRetries = 3,
      retryDelay = 1000,
      backoffMultiplier = 2,
    } = options;
    
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        
        if (attempt < maxRetries) {
          const delay = retryDelay * Math.pow(backoffMultiplier, attempt - 1);
          await this.sleep(delay);
        }
      }
    }
    
    throw lastError;
  }
  
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### **Idempotency**

```typescript
@Injectable()
export class IdempotencyHandler {
  constructor(private redis: Redis) {}
  
  async execute<T>(
    idempotencyKey: string,
    fn: () => Promise<T>,
    ttl: number = 86400, // 24 hours
  ): Promise<T> {
    // Check if already executed
    const cached = await this.redis.get(idempotencyKey);
    if (cached) {
      return JSON.parse(cached);
    }
    
    // Execute and cache result
    const result = await fn();
    await this.redis.setex(idempotencyKey, ttl, JSON.stringify(result));
    
    return result;
  }
}
```

---

## ✅ Best Practices

### **1. Design Principles**
- ✅ Keep steps **atomic** and **idempotent**
- ✅ Use **timeout** for each step
- ✅ Implement **retry** with exponential backoff
- ✅ Log **every step** for debugging
- ✅ Use **correlation ID** for tracing

### **2. Compensation Rules**
- ✅ Compensate in **reverse order**
- ✅ Make compensation **idempotent**
- ✅ Handle **partial compensation** failures
- ✅ Don't compensate **non-critical** steps

### **3. State Management**
- ✅ Persist saga state to database
- ✅ Use **state machine** pattern
- ✅ Track **all transitions**
- ✅ Enable **saga recovery** after crash

### **4. Monitoring**
- ✅ Track saga **success rate**
- ✅ Monitor **compensation rate**
- ✅ Alert on **stuck sagas**
- ✅ Dashboard for **saga visualization**

### **5. Testing**
- ✅ Test **happy path**
- ✅ Test **each failure scenario**
- ✅ Test **compensation logic**
- ✅ Test **concurrent sagas**
- ✅ Test **saga recovery**

---

## 📊 Monitoring Dashboard

```typescript
interface SagaMetrics {
  totalSagas: number;
  successRate: number;
  compensationRate: number;
  averageDuration: number;
  stuckSagas: number;
  failuresByStep: Record<string, number>;
}

@Injectable()
export class SagaMetricsService {
  async getMetrics(timeRange: TimeRange): Promise<SagaMetrics> {
    const sagas = await this.sagaRepository.find({
      createdAt: { $gte: timeRange.from, $lte: timeRange.to },
    });
    
    return {
      totalSagas: sagas.length,
      successRate: this.calculateSuccessRate(sagas),
      compensationRate: this.calculateCompensationRate(sagas),
      averageDuration: this.calculateAverageDuration(sagas),
      stuckSagas: this.countStuckSagas(sagas),
      failuresByStep: this.groupFailuresByStep(sagas),
    };
  }
}
```

---

**Created:** 2026-02-04  
**Version:** 1.0  
**Author:** Cinema Management Team
