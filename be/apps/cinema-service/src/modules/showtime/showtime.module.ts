import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { RedisModule } from '@app/core';
import { Showtime } from '../../data-access/showtime/showtime.entity';
import { Room } from '../../data-access/room/room.entity';
import { ShowtimeSeat } from '../../data-access/showtime-seat/showtime-seat.entity';
import { ShowtimeService } from './showtime.service';
import { ShowtimeController } from './showtime.controller';
import { ShowtimeConsumer } from './showtime.consumer';

@Module({
  imports: [
    MikroOrmModule.forFeature([Showtime, Room, ShowtimeSeat]),
    RedisModule,
  ],
  controllers: [ShowtimeController, ShowtimeConsumer],
  providers: [ShowtimeService],
  exports: [ShowtimeService],
})
export class ShowtimeModule {}
