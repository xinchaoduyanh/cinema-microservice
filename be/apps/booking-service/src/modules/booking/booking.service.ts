import { Injectable, BadRequestException, Logger, Inject, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ClientKafka, Transport } from '@nestjs/microservices';
import { CinemaMessagePattern } from '@app/common';
import { MS_INJECTION_TOKEN, MicroserviceName } from '@app/core';
import { Booking, BookingStatus } from '../../data-access/booking/booking.entity';
import { BookingItem, ItemType } from '../../data-access/booking/booking-item.entity';
import { Product } from '../../data-access/product/product.entity';
import { BaseRepository } from '../../data-access/base.repository';
import { CreateBookingDto } from './booking.dto';
import { PromotionService } from '../promotion/promotion.service';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class BookingService implements OnModuleInit {
  private readonly logger = new Logger(BookingService.name);

  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: BaseRepository<Booking>,
    @InjectRepository(BookingItem)
    private readonly bookingItemRepository: BaseRepository<BookingItem>,
    @InjectRepository(Product)
    private readonly productRepository: BaseRepository<Product>,
    private readonly promotionService: PromotionService,
    @Inject(MS_INJECTION_TOKEN(MicroserviceName.CinemaService, Transport.KAFKA))
    private readonly cinemaClientKafka: ClientKafka,
  ) {}

  async onModuleInit() {
    this.cinemaClientKafka.subscribeToResponseOf(CinemaMessagePattern.GET_SHOWTIME);
    this.cinemaClientKafka.subscribeToResponseOf(CinemaMessagePattern.LOCK_SEATS);
    this.cinemaClientKafka.subscribeToResponseOf(CinemaMessagePattern.UNLOCK_SEATS);
    await this.cinemaClientKafka.connect();
  }

  async create(userId: string, createBookingDto: CreateBookingDto) {
    // 1. Lấy thông tin Showtime từ CinemaService qua Kafka
    let showtimeData: any;
    try {
      showtimeData = await lastValueFrom(
        this.cinemaClientKafka.send(CinemaMessagePattern.GET_SHOWTIME, { id: createBookingDto.showtimeId })
      );
    } catch (error) {
      this.logger.error(`Failed to fetch showtime: ${error.message}`);
      throw new BadRequestException('Invalid showtime ID or Cinema Service is down');
    }

    const booking = new Booking();
    booking.userId = userId;
    booking.showtimeId = createBookingDto.showtimeId;
    booking.status = BookingStatus.PENDING;
    
    let subtotal = 0;
    const items: BookingItem[] = [];
    const seatIds: string[] = [];

    for (const itemDto of createBookingDto.items) {
      const item = new BookingItem();
      item.booking = booking;
      item.type = itemDto.type as ItemType;
      item.itemId = itemDto.itemId;
      item.quantity = itemDto.quantity;

      if (item.type === ItemType.PRODUCT) {
        const product = await this.productRepository.findOneOrFail(item.itemId);
        item.price = product.price;
      } else {
        // Lấy giá vé từ showtime
        item.price = showtimeData.price;
        seatIds.push(item.itemId);
      }

      subtotal += Number(item.price) * Number(item.quantity);
      items.push(item);
    }

    booking.totalAmount = subtotal;

    if (createBookingDto.promotionCode) {
      const promoResult = await this.promotionService.validateCode(createBookingDto.promotionCode, subtotal);
      booking.promotionId = promoResult.promotionId;
      booking.discountAmount = promoResult.discountAmount;
      booking.totalAmount = subtotal - booking.discountAmount;
    }

    // Persist booking first to get ID
    await this.bookingRepository.getEntityManager().persistAndFlush(booking);

    // 2. Lock Seats via Kafka (Saga Step)
    if (seatIds.length > 0) {
      try {
        await lastValueFrom(
          this.cinemaClientKafka.send(CinemaMessagePattern.LOCK_SEATS, {
            showtimeId: booking.showtimeId,
            seatIds,
            bookingId: booking.id
          })
        );
      } catch (error) {
        this.logger.error(`Failed to lock seats: ${error.message}`);
        // Compensating action: Delete the pending booking
        await this.bookingRepository.getEntityManager().removeAndFlush(booking);
        throw new BadRequestException('Failed to lock seats. They might be already occupied.');
      }
    }

    await this.bookingItemRepository.getEntityManager().persistAndFlush(items);

    return {
      ...booking,
      items,
    };
  }

  async findByUser(userId: string): Promise<Booking[]> {
    return this.bookingRepository.find({ userId } as any, { populate: ['items'] });
  }

  async findOne(id: string): Promise<Booking> {
    return this.bookingRepository.findOneOrFail({ id } as any, { populate: ['items'] });
  }
}
