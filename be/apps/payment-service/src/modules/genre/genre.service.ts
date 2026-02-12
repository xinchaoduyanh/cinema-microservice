import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, wrap } from '@mikro-orm/core';
import { Genre } from '../../data-access/genre/genre.entity';

@Injectable()
export class GenreService {
  constructor(
    @InjectRepository(Genre)
    private readonly genreRepository: EntityRepository<Genre>,
  ) {}

  async findAll() {
    const genres = await this.genreRepository.findAll();
    return genres.map(genre => wrap(genre).toObject());
  }

  async findOne(id: string) {
    const genre = await this.genreRepository.findOneOrFail(id);
    return wrap(genre).toObject();
  }
}
