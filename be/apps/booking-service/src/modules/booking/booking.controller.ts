import { OwnerParam, RequireVerifiedEmail, User, UserRequestPayload } from '@app/common';
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './booking.dto';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @RequireVerifiedEmail()
  create(
    @User() userPayload: UserRequestPayload,
    @Body() createBookingDto: CreateBookingDto,
  ) {
    return this.bookingService.create(userPayload.id, createBookingDto);
  }

  @Get('user/:userId')
  @OwnerParam('userId')
  findByUser(@Param('userId') userId: string) {
    return this.bookingService.findByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(id);
  }
}
