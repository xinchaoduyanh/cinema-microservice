import { kafkaConfiguration, rabbitmqConfiguration, tcpConfiguration } from '@app/common';
import { DynamicModule, FactoryProvider, Module, Provider, Type } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientOptions, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { MS_INJECTION_TOKEN } from './microservice.constant';
import { MicroserviceFactory } from './microservice.factory';
import {
  MicroserviceClientAsyncDefinition,
  MicroserviceClientDefinition,
} from './microservice.interface';

@Module({})
export class MicroserviceModule {
  private static createClientProvider(
    client: MicroserviceClientDefinition,
  ): FactoryProvider {
    const uniqueProvideToken = MS_INJECTION_TOKEN(client.name, client.transport);

    return {
      provide: uniqueProvideToken,
      useFactory: (configService: ConfigService) => {
        const clientOptions = MicroserviceFactory.createConfig(
          {
            serviceName: client.name,
            transport: client.transport,
            options: client?.options,
          },
          configService,
        );
        return ClientProxyFactory.create(clientOptions as ClientOptions);
      },
      inject: [ConfigService],
    };
  }

  static register(clients: MicroserviceClientDefinition[]): DynamicModule {
    const clientProviders: FactoryProvider[] = clients.map(this.createClientProvider);

    return {
      global: true,
      module: MicroserviceModule,
      imports: [
        ConfigModule.forFeature(rabbitmqConfiguration),
        ConfigModule.forFeature(kafkaConfiguration),
        ConfigModule.forFeature(tcpConfiguration), 
      ],
      providers: [...clientProviders],
      exports: clientProviders.map((p) => p.provide),
    };
  }

  static registerAsync(clients: MicroserviceClientAsyncDefinition[]): DynamicModule {
    const asyncProviders: Provider[] = clients.map((client) => ({
      provide: client.name + '_ASYNC_CONFIG',
      useFactory: client.useFactory,
      inject: client.inject || [],
    }));

    const clientProviders: FactoryProvider[] = clients.map((client) => {
      const uniqueProvideToken = MS_INJECTION_TOKEN(client.name, client.transport);
      const asyncConfigToken = client.name + '_ASYNC_CONFIG';

      return {
        provide: uniqueProvideToken,
        useFactory: (
          configService: ConfigService,
          resolvedOptions: ClientOptions['options'],
        ) => {
          // Note: registerAsync logic might need adaptation if it relies on MS factory logic
          // But here it seems to just pass resolvedOptions.
          // If we want to use MicroserviceFactory for default config even in async, we need to merge.
          // For now, keeping original logic but removing MS Factory injection.
          
          const clientOptions: ClientOptions = {
            transport: client.transport,
            options: resolvedOptions,
          } as ClientOptions;

          return ClientProxyFactory.create(clientOptions);
        },
        inject: [ConfigService, asyncConfigToken],
      };
    });
    const allProviders = [...asyncProviders, ...clientProviders];

    return {
      global: true,
      module: MicroserviceModule,
      imports: [
        ConfigModule.forFeature(rabbitmqConfiguration),
        ConfigModule.forFeature(kafkaConfiguration),
        ConfigModule.forFeature(tcpConfiguration), 
      ],
      providers: [...allProviders],
      exports: clientProviders.map((p) => p.provide),
    };
  }
}
