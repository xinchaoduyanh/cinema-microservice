import { EntityRepository } from '@mikro-orm/postgresql';
import { Movie } from './movie.entity';

export class MovieRepository extends EntityRepository<Movie> {}
