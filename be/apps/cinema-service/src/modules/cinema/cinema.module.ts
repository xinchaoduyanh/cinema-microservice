import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Cinema } from '../../data-access/cinema/cinema.entity';
import { CinemaService } from './cinema.service';
import { CinemaController } from './cinema.controller';

@Module({
  imports: [MikroOrmModule.forFeature([Cinema])],
  controllers: [CinemaController],
  providers: [CinemaService],
  exports: [CinemaService],
})
export class CinemaModule {}
