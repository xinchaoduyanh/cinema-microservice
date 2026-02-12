import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Room } from '../../data-access/room/room.entity';
import { Cinema } from '../../data-access/cinema/cinema.entity';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';

@Module({
  imports: [MikroOrmModule.forFeature([Room, Cinema])],
  controllers: [RoomController],
  providers: [RoomService],
  exports: [RoomService],
})
export class RoomModule {}
