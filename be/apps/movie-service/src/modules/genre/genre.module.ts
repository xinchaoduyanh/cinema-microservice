import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Genre } from '../../data-access/genre/genre.entity';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';

@Module({
  imports: [MikroOrmModule.forFeature([Genre])],
  controllers: [GenreController],
  providers: [GenreService],
  exports: [GenreService],
})
export class GenreModule {}
