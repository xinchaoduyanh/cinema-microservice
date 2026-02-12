import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Showtime } from '../../data-access/showtime/showtime.entity';
import { Room } from '../../data-access/room/room.entity';
import { BaseRepository } from '../../data-access/base.repository';
import { CreateShowtimeDto, UpdateShowtimeDto } from './showtime.dto';

@Injectable()
export class ShowtimeService {
  constructor(
    @InjectRepository(Showtime)
    private readonly showtimeRepository: BaseRepository<Showtime>,
    @InjectRepository(Room)
    private readonly roomRepository: BaseRepository<Room>,
  ) {}

  async create(createShowtimeDto: CreateShowtimeDto) {
    const room = await this.roomRepository.findOneOrFail(createShowtimeDto.roomId);
    const showtime = new Showtime(createShowtimeDto);
    showtime.room = room;
    await this.showtimeRepository.getEntityManager().persistAndFlush(showtime);
    return showtime;
  }

  async findAll() {
    return this.showtimeRepository.findAll({ populate: ['room', 'room.cinema'] });
  }

  async findByRoom(roomId: string) {
    return this.showtimeRepository.find({ room: roomId });
  }

  async findByMovie(movieId: string) {
    return this.showtimeRepository.find({ movieId }, { populate: ['room', 'room.cinema'] });
  }

  async findOne(id: string) {
    return this.showtimeRepository.findOneOrFail(id, { populate: ['room', 'room.cinema'] });
  }

  async update(id: string, updateShowtimeDto: UpdateShowtimeDto) {
    const showtime = await this.findOne(id);
    if (updateShowtimeDto.roomId) {
      const room = await this.roomRepository.findOneOrFail(updateShowtimeDto.roomId);
      showtime.room = room;
    }
    Object.assign(showtime, updateShowtimeDto);
    await this.showtimeRepository.getEntityManager().flush();
    return showtime;
  }

  async remove(id: string) {
    const showtime = await this.findOne(id);
    await this.showtimeRepository.getEntityManager().removeAndFlush(showtime);
    return { success: true };
  }
}
