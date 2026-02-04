# 🔄 Kafka Migration Plan: TCP → Kafka

## 📋 Overview

**Objective:** Migrate from TCP-based inter-service communication to Kafka event-driven architecture.

**Timeline:** 2-3 weeks (phased approach)

**Benefits:**
- ✅ Better scalability
- ✅ Event sourcing for Saga Pattern
- ✅ Improved reliability & monitoring
- ✅ Loose coupling between services

---

## 🎯 Migration Strategy

### **Phase 1: Setup Kafka Infrastructure** (Week 1)

#### **Step 1.1: Enable Kafka in Docker Compose**

Uncomment Kafka services in `docker-compose.yml`:

```yaml
# Lines 73-114 - Remove comments
kafka:
  container_name: nest_turbo_kafka
  extends:
    file: .docker/compose/kafka/kafka.yml
    service: kafka
  networks:
    - nest-turbo-network
  volumes:
    - ${PWD}/.docker/volumes/kafka_data:/var/lib/kafka/data
  ports:
    - '9082:9092'
    - '9086:9094'
  environment:
    KAFKA_CLUSTER_ID: '4b92c42d627c44e995f33f6756857945'
    KAFKA_NODE_ID: 1
    KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
    KAFKA_PROCESS_ROLES: broker,controller
    KAFKA_CONTROLLER_LISTENER_NAMES: CONTROLLER
    KAFKA_CONTROLLER_QUORUM_VOTERS: 1@kafka:9093
    KAFKA_LISTENERS: PLAINTEXT://:9092,CONTROLLER://:9093,OUTSIDE://:9094
    KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092,OUTSIDE://localhost:9086
    KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT,OUTSIDE:PLAINTEXT
    KAFKA_AUTO_CREATE_TOPICS_ENABLE: 'true'
    KAFKAJS_NO_PARTITIONER_WARNING: 1

kafkaui:
  container_name: nest_turbo_kafka_ui
  extends:
    file: .docker/compose/kafka/kafka.yml
    service: kafka_ui
  networks:
    - nest-turbo-network
  depends_on:
    - kafka
  ports:
    - '18082:8080'
  environment:
    KAFKA_CLUSTERS_0_NAME: local
    KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS: kafka:9092
    AUTH_TYPE: LOGIN_FORM
    SPRING_SECURITY_USER_NAME: admin
    SPRING_SECURITY_USER_PASSWORD: secret
```

#### **Step 1.2: Update .env**

```bash
# Kafka config already exists in .env.example (lines 39-47)
KAFKA_BROKERS=kafka:9092
KAFKA_HEARTBEAT_INTERVAL=2000
KAFKA_SESSION_TIMEOUT=60000
KAFKA_SASL_ENABLED=false
```

#### **Step 1.3: Start Kafka**

```bash
docker-compose up -d kafka kafkaui
```

**Verify:**
- Kafka UI: http://localhost:18082 (admin/secret)
- Check topics are created

---

### **Phase 2: Create Kafka Topics** (Week 1)

#### **Step 2.1: Define Topics**

Create `scripts/kafka/create-topics.sh`:

```bash
#!/bin/bash

KAFKA_CONTAINER="nest_turbo_kafka"

# Saga Events
docker exec $KAFKA_CONTAINER kafka-topics --create \
  --topic saga.booking.started \
  --partitions 3 \
  --replication-factor 1 \
  --bootstrap-server localhost:9092

docker exec $KAFKA_CONTAINER kafka-topics --create \
  --topic saga.booking.completed \
  --partitions 3 \
  --replication-factor 1 \
  --bootstrap-server localhost:9092

docker exec $KAFKA_CONTAINER kafka-topics --create \
  --topic saga.booking.failed \
  --partitions 3 \
  --replication-factor 1 \
  --bootstrap-server localhost:9092

# Service Events
docker exec $KAFKA_CONTAINER kafka-topics --create \
  --topic user.created \
  --partitions 3 \
  --replication-factor 1 \
  --bootstrap-server localhost:9092

docker exec $KAFKA_CONTAINER kafka-topics --create \
  --topic user.updated \
  --partitions 3 \
  --replication-factor 1 \
  --bootstrap-server localhost:9092

docker exec $KAFKA_CONTAINER kafka-topics --create \
  --topic notification.email.send \
  --partitions 3 \
  --replication-factor 1 \
  --bootstrap-server localhost:9092

docker exec $KAFKA_CONTAINER kafka-topics --create \
  --topic notification.sms.send \
  --partitions 3 \
  --replication-factor 1 \
  --bootstrap-server localhost:9092

# Dead Letter Queue
docker exec $KAFKA_CONTAINER kafka-topics --create \
  --topic dlq.failed-events \
  --partitions 1 \
  --replication-factor 1 \
  --bootstrap-server localhost:9092

echo "✅ All topics created successfully!"
```

#### **Step 2.2: Topic Naming Convention**

```
Format: <domain>.<entity>.<action>

Examples:
- saga.booking.started
- saga.booking.step.lock-seats
- saga.booking.step.create-booking
- saga.booking.compensate.unlock-seats
- user.created
- user.updated
- notification.email.send
- payment.processed
- dlq.failed-events
```

---

### **Phase 3: Update Microservice Factory** (Week 1-2)

#### **Step 3.1: Update libs/core/src/microservice/microservice.factory.ts**

Add Kafka client factory alongside TCP:

```typescript
import { ClientKafka, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

export class MicroserviceFactory {
  /**
   * Create Kafka Client (NEW)
   */
  static createKafkaClient(
    serviceName: MicroserviceName,
    configService: ConfigService,
  ): ClientKafka {
    return ClientProxyFactory.create({
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: serviceName,
          brokers: configService.get('KAFKA_BROKERS').split(','),
        },
        consumer: {
          groupId: `${serviceName}-consumer`,
          sessionTimeout: configService.get('KAFKA_SESSION_TIMEOUT'),
          heartbeatInterval: configService.get('KAFKA_HEARTBEAT_INTERVAL'),
        },
        producer: {
          allowAutoTopicCreation: true,
          idempotent: true, // Important for exactly-once semantics
        },
      },
    }) as ClientKafka;
  }

  /**
   * Keep TCP Client for backward compatibility (DEPRECATED)
   */
  static createTCPClient(
    serviceName: MicroserviceName,
    configService: ConfigService,
  ): ClientProxy {
    // ... existing TCP code
  }
}
```

#### **Step 3.2: Update Service Modules**

Example for `auth-service/src/modules/app.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // Kafka Client
    ClientsModule.registerAsync([
      {
        name: 'USER_SERVICE_KAFKA',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'auth-service',
              brokers: configService.get('KAFKA_BROKERS').split(','),
            },
            consumer: {
              groupId: 'auth-service-consumer',
            },
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'NOTIFICATION_SERVICE_KAFKA',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'auth-service',
              brokers: configService.get('KAFKA_BROKERS').split(','),
            },
            consumer: {
              groupId: 'auth-service-consumer',
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
})
export class AppModule {}
```

---

### **Phase 4: Migrate Service Communication** (Week 2)

#### **Step 4.1: Dual-Write Pattern (Temporary)**

During migration, support both TCP and Kafka:

```typescript
@Injectable()
export class UserService {
  constructor(
    @Inject('USER_SERVICE_TCP') private tcpClient: ClientProxy,
    @Inject('USER_SERVICE_KAFKA') private kafkaClient: ClientKafka,
    private configService: ConfigService,
  ) {}

  async createUser(data: CreateUserDto) {
    const useKafka = this.configService.get('USE_KAFKA') === 'true';

    if (useKafka) {
      // New: Kafka
      return this.kafkaClient.emit('user.created', data);
    } else {
      // Old: TCP (fallback)
      return this.tcpClient.send('user.create', data);
    }
  }
}
```

Add to `.env`:
```bash
# Feature flag for gradual migration
USE_KAFKA=false  # Set to true when ready
```

#### **Step 4.2: Update Consumers**

Example: `notification-service/src/modules/send-mail/send-mail.consumer.ts`

**Before (TCP):**
```typescript
@MessagePattern('send_mail')
async handleSendMail(@Payload() data: SendMailDto) {
  // ...
}
```

**After (Kafka):**
```typescript
@EventPattern('notification.email.send')
async handleSendMail(@Payload() message: KafkaMessage) {
  const data = JSON.parse(message.value.toString());
  
  try {
    await this.sendMailService.send(data);
    
    // Acknowledge success
    await this.kafkaClient.commitOffsets([
      { topic: 'notification.email.send', partition: 0, offset: message.offset + 1 }
    ]);
  } catch (error) {
    // Send to DLQ
    await this.kafkaClient.emit('dlq.failed-events', {
      originalTopic: 'notification.email.send',
      error: error.message,
      data,
    });
  }
}
```

---

### **Phase 5: Saga Pattern with Kafka** (Week 2-3)

#### **Step 5.1: Create Saga Event Emitter**

```typescript
// libs/common/src/saga/saga-event.emitter.ts

@Injectable()
export class SagaEventEmitter {
  constructor(
    @Inject('KAFKA_CLIENT') private kafkaClient: ClientKafka,
  ) {}

  async emitSagaStarted(sagaId: string, data: any) {
    await this.kafkaClient.emit('saga.booking.started', {
      sagaId,
      timestamp: new Date().toISOString(),
      data,
    });
  }

  async emitStepCompleted(sagaId: string, step: string, result: any) {
    await this.kafkaClient.emit(`saga.booking.step.${step}`, {
      sagaId,
      step,
      status: 'SUCCESS',
      result,
      timestamp: new Date().toISOString(),
    });
  }

  async emitStepFailed(sagaId: string, step: string, error: Error) {
    await this.kafkaClient.emit(`saga.booking.step.${step}`, {
      sagaId,
      step,
      status: 'FAILED',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }

  async emitCompensation(sagaId: string, step: string) {
    await this.kafkaClient.emit(`saga.booking.compensate.${step}`, {
      sagaId,
      step,
      timestamp: new Date().toISOString(),
    });
  }
}
```

#### **Step 5.2: Update Saga Orchestrator**

Integrate Kafka events into existing `BookingSagaOrchestrator`:

```typescript
@Injectable()
export class BookingSagaOrchestrator {
  constructor(
    // ... existing dependencies
    private sagaEventEmitter: SagaEventEmitter,
  ) {}

  async executeBookingSaga(request: CreateBookingRequest) {
    const saga = await this.createSagaInstance(request);
    
    // Emit saga started event
    await this.sagaEventEmitter.emitSagaStarted(saga.id, request);
    
    try {
      // Step 1: Lock Seats
      const lockSeatsResult = await this.step1_LockSeats(saga, request);
      await this.sagaEventEmitter.emitStepCompleted(saga.id, 'lock-seats', lockSeatsResult);
      
      // Step 2: Validate Voucher
      const voucherResult = await this.step2_ValidateVoucher(saga, request);
      await this.sagaEventEmitter.emitStepCompleted(saga.id, 'validate-voucher', voucherResult);
      
      // ... other steps
      
      return await this.completeSaga(saga, bookingResult);
      
    } catch (error) {
      await this.sagaEventEmitter.emitStepFailed(saga.id, error.step, error);
      return await this.compensateSaga(saga, error);
    }
  }
}
```

---

### **Phase 6: Testing & Monitoring** (Week 3)

#### **Step 6.1: Integration Tests**

```typescript
describe('Kafka Integration', () => {
  let kafkaClient: ClientKafka;

  beforeAll(async () => {
    // Setup test Kafka client
  });

  it('should publish and consume user.created event', async () => {
    const testData = { email: 'test@example.com' };
    
    await kafkaClient.emit('user.created', testData);
    
    // Wait for consumer to process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Verify event was consumed
    expect(/* ... */).toBeDefined();
  });
});
```

#### **Step 6.2: Monitoring Setup**

**Kafka UI Dashboard:**
- URL: http://localhost:18082
- Monitor:
  - Topic throughput
  - Consumer lag
  - Failed messages (DLQ)
  - Partition distribution

**Metrics to track:**
```typescript
interface KafkaMetrics {
  messagesProduced: number;
  messagesConsumed: number;
  consumerLag: number;
  failedMessages: number;
  averageProcessingTime: number;
}
```

---

## 🎯 Rollback Plan

If issues occur during migration:

1. **Set `USE_KAFKA=false` in .env**
2. **Restart services** (falls back to TCP)
3. **Investigate Kafka logs**
4. **Fix issues and retry**

---

## ✅ Migration Checklist

### **Week 1: Infrastructure**
- [ ] Uncomment Kafka in docker-compose.yml
- [ ] Start Kafka & Kafka UI
- [ ] Create topics with script
- [ ] Verify Kafka UI access
- [ ] Update microservice factory

### **Week 2: Code Migration**
- [ ] Add Kafka clients to all services
- [ ] Implement dual-write pattern
- [ ] Update consumers to use @EventPattern
- [ ] Add DLQ handling
- [ ] Update Saga orchestrator with events
- [ ] Test with `USE_KAFKA=false` (TCP)
- [ ] Test with `USE_KAFKA=true` (Kafka)

### **Week 3: Production Readiness**
- [ ] Load testing
- [ ] Monitor consumer lag
- [ ] Test failure scenarios
- [ ] Test compensation logic
- [ ] Documentation update
- [ ] Remove TCP code (cleanup)
- [ ] Set `USE_KAFKA=true` permanently

---

## 📊 Expected Improvements

| Metric | Before (TCP) | After (Kafka) |
|--------|--------------|---------------|
| **Throughput** | ~100 req/s | ~1000 req/s |
| **Latency** | 50-100ms | 10-30ms (async) |
| **Scalability** | Limited | Horizontal |
| **Reliability** | Single point failure | High availability |
| **Monitoring** | Basic logs | Kafka UI + metrics |
| **Saga Recovery** | Manual | Automatic (replay) |

---

## 🚀 Next Steps

1. **Review this plan** with team
2. **Start Phase 1** (enable Kafka)
3. **Create topics** (Phase 2)
4. **Gradual migration** (Phase 3-5)
5. **Monitor & optimize** (Phase 6)

---

**Created:** 2026-02-04  
**Status:** Ready for implementation  
**Estimated Effort:** 2-3 weeks  
**Risk Level:** Low (gradual migration with fallback)
