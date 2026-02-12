import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Cinema } from '../../data-access/cinema/cinema.entity';
import { BaseRepository } from '../../data-access/base.repository';
import { CreateCinemaDto, UpdateCinemaDto } from './cinema.dto';

@Injectable()
export class CinemaService {
  constructor(
    @InjectRepository(Cinema)
    private readonly cinemaRepository: BaseRepository<Cinema>,
  ) {}

  async create(createCinemaDto: CreateCinemaDto) {
    const cinema = new Cinema(createCinemaDto);
    await this.cinemaRepository.getEntityManager().persistAndFlush(cinema);
    return cinema;
  }

  async findAll() {
    return this.cinemaRepository.findAll();
  }

  async findOne(id: string) {
    return this.cinemaRepository.findOneOrFail(id);
  }

  async update(id: string, updateCinemaDto: UpdateCinemaDto) {
    const cinema = await this.findOne(id);
    Object.assign(cinema, updateCinemaDto);
    await this.cinemaRepository.getEntityManager().flush();
    return cinema;
  }

  async remove(id: string) {
    const cinema = await this.findOne(id);
    await this.cinemaRepository.getEntityManager().removeAndFlush(cinema);
    return { success: true };
  }
}
