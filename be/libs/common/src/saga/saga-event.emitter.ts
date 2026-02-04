import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SagaEventEmitter {
  constructor(
    @Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientKafka,
  ) {}

  async emitSagaStarted(sagaId: string, data: any) {
    return firstValueFrom(
      this.kafkaClient.emit('saga.booking.started', {
        sagaId,
        timestamp: new Date().toISOString(),
        data,
      }),
    );
  }

  async emitStepCompleted(sagaId: string, step: string, result: any) {
    return firstValueFrom(
      this.kafkaClient.emit(`saga.booking.step.${step}`, {
        sagaId,
        step,
        status: 'SUCCESS',
        result,
        timestamp: new Date().toISOString(),
      }),
    );
  }

  async emitStepFailed(sagaId: string, step: string, error: Error) {
    return firstValueFrom(
      this.kafkaClient.emit(`saga.booking.step.${step}`, {
        sagaId,
        step,
        status: 'FAILED',
        error: error.message,
        timestamp: new Date().toISOString(),
      }),
    );
  }

  async emitCompensation(sagaId: string, step: string) {
    return firstValueFrom(
      this.kafkaClient.emit(`saga.booking.compensate.${step}`, {
        sagaId,
        step,
        timestamp: new Date().toISOString(),
      }),
    );
  }
}
