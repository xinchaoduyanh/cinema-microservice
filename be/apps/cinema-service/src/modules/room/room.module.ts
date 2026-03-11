import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Room } from '../../data-access/room/room.entity';
import { Cinema } from '../../data-access/cinema/cinema.entity';
import { Seat } from '../../data-access/seat/seat.entity';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';

@Module({
  imports: [MikroOrmModule.forFeature([Room, Cinema, Seat])],
  controllers: [RoomController],
  providers: [RoomService],
  exports: [RoomService],
})
export class RoomModule {}

