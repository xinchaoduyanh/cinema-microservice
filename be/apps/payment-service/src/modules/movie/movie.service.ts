import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, wrap } from '@mikro-orm/core';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from '../../data-access/movie/movie.entity';
import { MovieRepository } from '../../data-access/movie/movie.repository';
import { Genre } from '../../data-access/genre/genre.entity';
import { MovieGenre } from '../../data-access/movie-genre/movie-genre.entity';

import { Person } from '../../data-access/person/person.entity';
import { MovieDirector } from '../../data-access/movie-director/movie-director.entity';
import { MovieCast } from '../../data-access/movie-cast/movie-cast.entity';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: MovieRepository,
    @InjectRepository(Genre)
    private readonly genreRepository: EntityRepository<Genre>,
    @InjectRepository(MovieGenre)
    private readonly movieGenreRepository: EntityRepository<MovieGenre>,
    @InjectRepository(Person)
    private readonly personRepository: EntityRepository<Person>,
    @InjectRepository(MovieDirector)
    private readonly movieDirectorRepository: EntityRepository<MovieDirector>,
    @InjectRepository(MovieCast)
    private readonly movieCastRepository: EntityRepository<MovieCast>,
  ) {}

  async findAll(query: any = {}) {
    console.log('MovieService.findAll started');
    const { status, search } = query;
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.title = { $ilike: `%${search}%` };
    }

    console.log('Querying database...');
    const movies = await this.movieRepository.findAll({
      where,
      populate: ['movieGenres.genre', 'directors.director', 'cast.person'] as any,
    });
    
    console.log(`Found ${movies.length} movies. Converting to object...`);
    const results = movies.map(movie => wrap(movie).toObject());
    console.log('Conversion done. Returning results.');
    return results;
  }

  async findOne(id: string) {
    const movie = await this.findOneEntity(id);
    return wrap(movie).toObject();
  }

  private async findOneEntity(id: string) {
    const movie = await this.movieRepository.findOne(id, {
      populate: ['movieGenres.genre', 'directors.director', 'cast.person'] as any,
    });
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }
    return movie;
  }

  async create(dto: CreateMovieDto) {
    const { genreIds, directorNames, cast, ...rest } = dto;
    const movie = this.movieRepository.create({
      ...rest,
      releaseDate: new Date(dto.releaseDate),
    } as any);

    if (genreIds?.length) {
      for (const genreId of genreIds) {
        const genre = await this.genreRepository.findOneOrFail(genreId);
        const movieGenre = this.movieGenreRepository.create({
          movie,
          genre,
        });
        movie.movieGenres.add(movieGenre);
      }
    }

    if (directorNames?.length) {
      for (const name of directorNames) {
        const person = await this.findOrCreatePerson(name);
        const movieDirector = this.movieDirectorRepository.create({
          movie,
          director: person,
        });
        movie.directors.add(movieDirector);
      }
    }

    if (cast?.length) {
      for (const actor of cast) {
        const person = await this.findOrCreatePerson(actor.name);
        const movieCast = this.movieCastRepository.create({
          movie,
          person,
          roleName: actor.role,
        });
        movie.cast.add(movieCast);
      }
    }

    await this.movieRepository.getEntityManager().persistAndFlush(movie);
    return wrap(movie).toObject();
  }

  private async findOrCreatePerson(name: string): Promise<Person> {
    let person = await this.personRepository.findOne({ name });
    if (!person) {
      person = this.personRepository.create({ name });
      await this.personRepository.getEntityManager().persistAndFlush(person);
    }
    return person;
  }

  async update(id: string, dto: UpdateMovieDto) {
    const movie = await this.findOneEntity(id);
    const { genreIds, directorNames, cast, ...rest } = dto;

    wrap(movie).assign({
      ...rest,
      releaseDate: dto.releaseDate ? new Date(dto.releaseDate) : movie.releaseDate,
    } as any);

    if (genreIds !== undefined) {
      await this.movieGenreRepository.nativeDelete({ movie: movie.id });
      movie.movieGenres.removeAll();
      for (const genreId of genreIds) {
        const genre = await this.genreRepository.findOneOrFail(genreId);
        const movieGenre = this.movieGenreRepository.create({
          movie,
          genre,
        });
        movie.movieGenres.add(movieGenre);
      }
    }

    if (directorNames !== undefined) {
      await this.movieDirectorRepository.nativeDelete({ movie: movie.id });
      movie.directors.removeAll();
      for (const name of directorNames) {
        const person = await this.findOrCreatePerson(name);
        const movieDirector = this.movieDirectorRepository.create({
          movie,
          director: person,
        });
        movie.directors.add(movieDirector);
      }
    }

    if (cast !== undefined) {
      await this.movieCastRepository.nativeDelete({ movie: movie.id });
      movie.cast.removeAll();
      for (const actor of cast) {
        const person = await this.findOrCreatePerson(actor.name);
        const movieCast = this.movieCastRepository.create({
          movie,
          person,
          roleName: actor.role,
        });
        movie.cast.add(movieCast);
      }
    }

    await this.movieRepository.getEntityManager().flush();
    return wrap(movie).toObject();
  }

  async remove(id: string) {
    const movie = await this.findOneEntity(id);
    movie.deletedAt = new Date();
    await this.movieRepository.getEntityManager().flush();
  }
}
