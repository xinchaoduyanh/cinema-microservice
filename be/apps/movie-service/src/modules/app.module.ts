import {
  AllExceptionFilter,
  appCommonConfiguration,
  getWinstonConfig,
  HttpLoggerMiddleware,
  kafkaConfiguration,
  rabbitmqConfiguration,
  tcpConfiguration,
} from '@app/common';
import { AwsS3Module, RedisModule } from '@app/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { appConfiguration, dbConfiguration } from 'src/config';
import { BaseRepository } from 'src/data-access/base.repository';
import { RoleBasedAccessControlGuard } from 'src/guards/rbac.guard';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MovieModule } from './movie/movie.module';
import { GenreModule } from './genre/genre.module';
import { AppAuthGuard } from '../guards/app-auth.guard';
import { PassportModule } from '@nestjs/passport';
import { GatewayAuthStrategy } from './auth/strategies/gateway-auth.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      // validationSchema,
      validationOptions: {
        abortEarly: false,
      },
      load: [
        appCommonConfiguration,
        appConfiguration,
        dbConfiguration,
        rabbitmqConfiguration,
        kafkaConfiguration,
        tcpConfiguration,
      ],
    }),
    MikroOrmModule.forRootAsync({
      useFactory: (dbConfig: ConfigType<typeof dbConfiguration>) => {
        return {
          ...dbConfig,
          entityRepository: BaseRepository,
        };
      },
      inject: [dbConfiguration.KEY],
    }),
    WinstonModule.forRootAsync({
      useFactory: (
        appConfig: ConfigType<typeof appConfiguration>,
        appCommonConfig: ConfigType<typeof appCommonConfiguration>
      ) => {
        return getWinstonConfig(appConfig.appName, appCommonConfig.nodeEnv);
      },
      inject: [appConfiguration.KEY, appCommonConfiguration.KEY],
    }),
    PassportModule,
    MovieModule,
    GenreModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    GatewayAuthStrategy,
    {
      provide: APP_GUARD,
      useClass: RoleBasedAccessControlGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
