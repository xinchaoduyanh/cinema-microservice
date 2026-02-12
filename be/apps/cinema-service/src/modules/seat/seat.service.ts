import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Seat, SeatType } from '../../data-access/seat/seat.entity';
import { Room } from '../../data-access/room/room.entity';
import { BaseRepository } from '../../data-access/base.repository';
import { CreateSeatDto, CreateSeatsDto } from './seat.dto';

@Injectable()
export class SeatService {
  constructor(
    @InjectRepository(Seat)
    private readonly seatRepository: BaseRepository<Seat>,
    @InjectRepository(Room)
    private readonly roomRepository: BaseRepository<Room>,
  ) {}

  async create(createSeatDto: CreateSeatDto) {
    const room = await this.roomRepository.findOneOrFail(createSeatDto.roomId);
    const seat = new Seat({
      ...createSeatDto,
      type: createSeatDto.type as SeatType,
    });
    seat.room = room;
    await this.seatRepository.getEntityManager().persistAndFlush(seat);
    return seat;
  }

  async createBulk(createSeatsDto: CreateSeatsDto) {
    const room = await this.roomRepository.findOneOrFail(createSeatsDto.roomId);
    const seats: Seat[] = [];
    
    for (const row of createSeatsDto.rows) {
      for (let col = 1; col <= createSeatsDto.columns; col++) {
        const seat = new Seat({
          row,
          column: col,
          type: createSeatsDto.type as SeatType,
        });
        seat.room = room;
        seats.push(seat);
      }
    }
    
    await this.seatRepository.getEntityManager().persistAndFlush(seats);
    return { count: seats.length };
  }

  async findByRoom(roomId: string) {
    return this.seatRepository.find({ room: roomId });
  }

  async remove(id: string) {
    const seat = await this.seatRepository.findOneOrFail(id);
    await this.seatRepository.getEntityManager().removeAndFlush(seat);
    return { success: true };
  }
}
