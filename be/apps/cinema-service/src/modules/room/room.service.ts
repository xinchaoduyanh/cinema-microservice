import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Room } from '../../data-access/room/room.entity';
import { Cinema } from '../../data-access/cinema/cinema.entity';
import { Seat } from '../../data-access/seat/seat.entity';
import { BaseRepository } from '../../data-access/base.repository';
import { CreateRoomDto, UpdateRoomDto, GenerateSeatsDto } from './room.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: BaseRepository<Room>,
    @InjectRepository(Cinema)
    private readonly cinemaRepository: BaseRepository<Cinema>,
    @InjectRepository(Seat)
    private readonly seatRepository: BaseRepository<Seat>,
  ) {}

  async create(createRoomDto: CreateRoomDto) {
    const cinema = await this.cinemaRepository.findOneOrFail(createRoomDto.cinemaId);
    const room = new Room(createRoomDto);
    room.cinema = cinema;
    await this.roomRepository.getEntityManager().persistAndFlush(room);
    return room;
  }

  async generateSeats(id: string, generateSeatsDto: GenerateSeatsDto) {
    const room = await this.findOne(id);
    const { numberOfRows, seatsPerRow, type } = generateSeatsDto;

    // 1. Kiểm tra xem phòng đã có ghế chưa
    const existingSeatsCount = await this.seatRepository.count({ room: id });
    if (existingSeatsCount > 0) {
      throw new BadRequestException('Phòng đã có ghế, vui lòng xóa ghế cũ trước khi sinh lại');
    }

    const seats: Seat[] = [];
    for (let r = 0; r < numberOfRows; r++) {
      const rowLabel = String.fromCharCode(65 + r); // 65 là mã ASCII của 'A'
      for (let c = 1; c <= seatsPerRow; c++) {
        const seat = new Seat();
        seat.room = room;
        seat.row = rowLabel;
        seat.column = c;
        seat.type = type;
        seats.push(seat);
      }
    }

    await this.seatRepository.getEntityManager().persistAndFlush(seats);
    return {
      message: `Đã sinh thành công ${seats.length} ghế cho phòng ${room.name}`,
      totalSeats: seats.length,
    };
  }

  async findAll() {
    return this.roomRepository.findAll({ populate: ['cinema'] });
  }

  async findByCinema(cinemaId: string) {
    return this.roomRepository.find({ cinema: cinemaId });
  }

  async findOne(id: string) {
    return this.roomRepository.findOneOrFail(id, { populate: ['cinema'] });
  }

  async update(id: string, updateRoomDto: UpdateRoomDto) {
    const room = await this.findOne(id);
    if (updateRoomDto.cinemaId) {
      const cinema = await this.cinemaRepository.findOneOrFail(updateRoomDto.cinemaId);
      room.cinema = cinema;
    }
    Object.assign(room, updateRoomDto);
    await this.roomRepository.getEntityManager().flush();
    return room;
  }

  async remove(id: string) {
    const room = await this.findOne(id);
    await this.roomRepository.getEntityManager().removeAndFlush(room);
    return { success: true };
  }
}

