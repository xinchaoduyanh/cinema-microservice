import { Entity, Property, OneToMany, Collection, Index, Filter } from '@mikro-orm/core';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../base.entity';
import { GenreRepository } from 'src/data-access/genre/genre.repository';
import { MovieGenre } from '../movie-genre/movie-genre.entity';

@Filter({
  name: 'softDelete',
  cond: () => ({ deletedAt: null }),
  default: true,
})
@Entity({ tableName: 'genres', repository: () => GenreRepository })
export class Genre extends BaseEntity<Genre> {
  @Property({ unique: true })
  @Index()
  name: string;

  @Property({ unique: true })
  @Index()
  slug: string;

  @Property({ type: 'text', nullable: true })
  description?: string;

  @Exclude()
  @OneToMany(() => MovieGenre, mg => mg.genre)
  movieGenres = new Collection<MovieGenre>(this);
}
