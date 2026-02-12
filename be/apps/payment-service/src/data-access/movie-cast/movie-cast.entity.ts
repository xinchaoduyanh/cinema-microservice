import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../base.entity';
import { Movie } from '../movie/movie.entity';
import { Person } from '../person/person.entity';

@Entity({ tableName: 'movie_cast' })
export class MovieCast extends BaseEntity<MovieCast> {
  @Exclude()
  @ManyToOne({ entity: () => Movie, deleteRule: 'cascade' })
  movie: Movie;

  @ManyToOne({ entity: () => Person, deleteRule: 'cascade' })
  person: Person;

  @Property()
  roleName: string; // The character the actor plays (e.g., "J. Robert Oppenheimer")
}
