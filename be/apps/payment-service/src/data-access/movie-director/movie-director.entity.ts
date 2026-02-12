import { Entity, ManyToOne } from '@mikro-orm/core';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../base.entity';
import { Movie } from '../movie/movie.entity';
import { Person } from '../person/person.entity';

@Entity({ tableName: 'movie_directors' })
export class MovieDirector extends BaseEntity<MovieDirector> {
  @Exclude()
  @ManyToOne({ entity: () => Movie, deleteRule: 'cascade' })
  movie: Movie;

  @ManyToOne({ entity: () => Person, deleteRule: 'cascade' })
  director: Person;
}
