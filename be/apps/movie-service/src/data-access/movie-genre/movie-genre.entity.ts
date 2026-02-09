import { Entity, ManyToOne } from '@mikro-orm/core';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../base.entity';
import { Movie } from '../movie/movie.entity';
import { Genre } from '../genre/genre.entity';

@Entity({ tableName: 'movie_genres' })
export class MovieGenre extends BaseEntity<MovieGenre> {
  @Exclude()
  @ManyToOne({ entity: () => Movie, deleteRule: 'cascade' })
  movie: Movie;

  @ManyToOne({ entity: () => Genre, deleteRule: 'cascade' })
  genre: Genre;
}
