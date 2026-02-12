export enum AgeRating {
  P = 'P',      // General
  C13 = 'C13',  // 13+
  C16 = 'C16',  // 16+
  C18 = 'C18',  // 18+
}

export enum MovieStatus {
  COMING_SOON = 'COMING_SOON',
  NOW_SHOWING = 'NOW_SHOWING',
  ENDED = 'ENDED',
}

import { Entity, Property, Enum, OneToMany, Collection, Index, Filter } from '@mikro-orm/core';
import { BaseEntity } from '../base.entity';
import { MovieRepository } from 'src/data-access/movie/movie.repository';
import { MovieGenre } from '../movie-genre/movie-genre.entity';
import { MovieCast } from '../movie-cast/movie-cast.entity';
import { MovieDirector } from '../movie-director/movie-director.entity';

@Filter({
  name: 'softDelete',
  cond: () => ({ deletedAt: null }),
  default: true,
})
@Entity({ tableName: 'movies', repository: () => MovieRepository })
export class Movie extends BaseEntity<Movie> {
  @Property()
  @Index()
  title: string;

  @Property({ nullable: true })
  originalTitle?: string;

  @Property({ type: 'text' })
  description: string;

  @Property({ type: 'text', nullable: true })
  longDescription?: string;

  @Property({ type: 'date' })
  releaseDate: Date;

  @Property()
  duration: number; // in minutes

  @Property({ type: 'decimal', precision: 2, scale: 1, default: 0 })
  rating: number;

  @Property({ nullable: true })
  rottenTomatoes?: number;

  @Property({ nullable: true })
  trailerUrl?: string;

  @Property({ nullable: true })
  backdropUrl?: string;

  @Property({ nullable: true })
  posterUrl?: string;

  @Property({ nullable: true })
  previewVideoUrl?: string;

  @Property({ nullable: true })
  accentColor?: string;

  @Enum({ items: () => Object.values(MovieStatus) })
  @Index()
  status: MovieStatus;

  @Enum({ items: () => Object.values(AgeRating) })
  ageRating: AgeRating;

  @Property({ type: 'json', nullable: true })
  stills?: string[];

  @OneToMany(() => MovieGenre, mg => mg.movie)
  movieGenres = new Collection<MovieGenre>(this);

  @OneToMany(() => MovieDirector, md => md.movie)
  directors = new Collection<MovieDirector>(this);

  @OneToMany(() => MovieCast, mc => mc.movie)
  cast = new Collection<MovieCast>(this);
}
