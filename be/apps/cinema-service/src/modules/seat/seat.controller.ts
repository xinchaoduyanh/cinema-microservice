import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { SeatService } from './seat.service';
import { CreateSeatDto, CreateSeatsDto } from './seat.dto';

@Controller('seats')
export class SeatController {
  constructor(private readonly seatService: SeatService) {}

  @Post()
  create(@Body() createSeatDto: CreateSeatDto) {
    return this.seatService.create(createSeatDto);
  }

  @Post('bulk')
  createBulk(@Body() createSeatsDto: CreateSeatsDto) {
    return this.seatService.createBulk(createSeatsDto);
  }

  @Get('room/:roomId')
  findByRoom(@Param('roomId') roomId: string) {
    return this.seatService.findByRoom(roomId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.seatService.remove(id);
  }
}
