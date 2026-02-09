import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Movie } from '../../data-access/movie/movie.entity';
import { Genre } from '../../data-access/genre/genre.entity';
import { Person } from '../../data-access/person/person.entity';
import { MovieGenre } from '../../data-access/movie-genre/movie-genre.entity';
import { MovieDirector } from '../../data-access/movie-director/movie-director.entity';
import { MovieCast } from '../../data-access/movie-cast/movie-cast.entity';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      Movie,
      Genre,
      Person,
      MovieGenre,
      MovieDirector,
      MovieCast,
    ]),
  ],
  controllers: [MovieController],
  providers: [MovieService],
  exports: [MovieService],
})
export class MovieModule {}
