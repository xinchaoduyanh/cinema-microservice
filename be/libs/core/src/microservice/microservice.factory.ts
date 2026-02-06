import { kafkaConfiguration, rabbitmqConfiguration, tcpConfiguration } from '@app/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { CustomClientOptions, Transport } from '@nestjs/microservices';
import {
  KafkaMicroserviceOptions,
  MicroserviceConfigOptions,
  RmqMicroserviceOptions,
  TCPMicroserviceOptions,
} from './microservice.interface';

export class MicroserviceFactory {
  private static createRmqConfig(
    rqmOptions: RmqMicroserviceOptions,
    configService: ConfigService,
  ): CustomClientOptions {
    return {
      name: rqmOptions.serviceName,
      transport: Transport.RMQ,
      options: rqmOptions.options,
    } as unknown as CustomClientOptions;
  }

  private static createKafkaConfig(
    kafkaOptions: KafkaMicroserviceOptions,
    configService: ConfigService,
  ): CustomClientOptions {
    const kafkaConfig = configService.get<ConfigType<typeof kafkaConfiguration>>('kafka');
    
    // Default kafka options
    const options: { [key: string]: any } = {
      client: {
        clientId: kafkaOptions.serviceName,
        brokers: kafkaConfig?.brokers || ['localhost:9092'],
        connectionTimeout: 10000, // 10 seconds
        requestTimeout: 30000, // 30 seconds
        retry: {
          initialRetryTime: 300,
          retries: 10,
          maxRetryTime: 30000,
          multiplier: 2,
          factor: 0.2,
        },
      },
      producer: {
        allowAutoTopicCreation: true,
        idempotent: true,
        maxInFlightRequests: 5,
        acks: 'all',
        retry: {
          initialRetryTime: 300,
          retries: 10,
          maxRetryTime: 30000,
        },
      },
      consumer: {
        groupId: `${kafkaOptions.serviceName}_consumer`,
        allowAutoTopicCreation: true,
        heartbeatInterval: kafkaConfig?.heartbeatInterval || 3000,
        sessionTimeout: kafkaConfig?.sessionTimeout || 30000,
        retry: {
          initialRetryTime: 300,
          retries: 10,
          maxRetryTime: 30000,
        },
      },
    };

    if (kafkaConfig?.saslEnabled) {
      options.client.ssl = true;
      options.client.sasl = {
        mechanism: kafkaConfig.saslMechanism,
        username: kafkaConfig.saslUsername,
        password: kafkaConfig.saslPassword,
      };
    }

    return {
      name: kafkaOptions.serviceName,
      transport: Transport.KAFKA,
      options: options,
    } as unknown as CustomClientOptions;
  }

  private static createTCPConfig(
    tcpOptions: TCPMicroserviceOptions,
    configService: ConfigService,
  ): CustomClientOptions {
    return {
      name: tcpOptions.serviceName,
      transport: Transport.TCP,
      options: tcpOptions.options,
    } as unknown as CustomClientOptions;
  }

  public static createConfig(
    options: MicroserviceConfigOptions,
    configService: ConfigService,
  ): CustomClientOptions {
    switch (options.transport) {
      case Transport.RMQ:
        return this.createRmqConfig(options as RmqMicroserviceOptions, configService);

      case Transport.KAFKA:
        return this.createKafkaConfig(options as KafkaMicroserviceOptions, configService);

      case Transport.TCP:
        return this.createTCPConfig(options as TCPMicroserviceOptions, configService);

      default:
        throw new Error(`MicroserviceFactory: Unsupported transport type`);
    }
  }
}
