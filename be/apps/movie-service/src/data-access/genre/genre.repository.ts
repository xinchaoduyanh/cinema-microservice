import { EntityRepository } from '@mikro-orm/postgresql';
import { Genre } from './genre.entity';

export class GenreRepository extends EntityRepository<Genre> {}
