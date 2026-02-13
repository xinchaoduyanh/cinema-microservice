import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { HttpModule } from '@nestjs/axios';
import { MicroserviceName, MS_INJECTION_TOKEN } from '@app/core';
import { Transport, ClientsModule } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Booking } from '../../data-access/booking/booking.entity';
import { BookingItem } from '../../data-access/booking/booking-item.entity';
import { Product } from '../../data-access/product/product.entity';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { PromotionModule } from '../promotion/promotion.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([Booking, BookingItem, Product]),
    PromotionModule,
    HttpModule,
    ClientsModule.registerAsync([
      {
        name: MS_INJECTION_TOKEN(MicroserviceName.CinemaService, Transport.KAFKA),
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: configService.get('kafka'),
        }),
      },
    ]),
  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
