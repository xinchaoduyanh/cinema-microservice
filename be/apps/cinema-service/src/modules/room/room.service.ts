import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Room } from '../../data-access/room/room.entity';
import { Cinema } from '../../data-access/cinema/cinema.entity';
import { BaseRepository } from '../../data-access/base.repository';
import { CreateRoomDto, UpdateRoomDto } from './room.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: BaseRepository<Room>,
    @InjectRepository(Cinema)
    private readonly cinemaRepository: BaseRepository<Cinema>,
  ) {}

  async create(createRoomDto: CreateRoomDto) {
    const cinema = await this.cinemaRepository.findOneOrFail(createRoomDto.cinemaId);
    const room = new Room(createRoomDto);
    room.cinema = cinema;
    await this.roomRepository.getEntityManager().persistAndFlush(room);
    return room;
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
