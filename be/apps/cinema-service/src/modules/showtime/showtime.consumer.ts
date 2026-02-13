import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CinemaMessagePattern, MikroOrmMicroserviceInterceptor, AllExceptionFilter } from '@app/common';
import { ShowtimeService } from './showtime.service';

@UseInterceptors(MikroOrmMicroserviceInterceptor)
@UseFilters(AllExceptionFilter)
@Controller()
export class ShowtimeConsumer {
  constructor(private readonly showtimeService: ShowtimeService) {}

  @MessagePattern(CinemaMessagePattern.GET_SHOWTIME)
  async getShowtime(@Payload() data: { id: string }) {
    return this.showtimeService.findOne(data.id);
  }

  @MessagePattern(CinemaMessagePattern.LOCK_SEATS)
  async lockSeats(@Payload() data: { showtimeId: string; seatIds: string[]; bookingId: string }) {
    return this.showtimeService.lockSeats(data.showtimeId, data.seatIds, data.bookingId);
  }

  @MessagePattern(CinemaMessagePattern.UNLOCK_SEATS)
  async unlockSeats(@Payload() data: { showtimeId: string; seatIds: string[] }) {
    return this.showtimeService.unlockSeats(data.showtimeId, data.seatIds);
  }
}
