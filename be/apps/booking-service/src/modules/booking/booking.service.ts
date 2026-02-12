import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Booking, BookingStatus } from '../../data-access/booking/booking.entity';
import { BookingItem, ItemType } from '../../data-access/booking/booking-item.entity';
import { Product } from '../../data-access/product/product.entity';
import { BaseRepository } from '../../data-access/base.repository';
import { CreateBookingDto } from './booking.dto';
import { PromotionService } from '../promotion/promotion.service';

@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name);

  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: BaseRepository<Booking>,
    @InjectRepository(BookingItem)
    private readonly bookingItemRepository: BaseRepository<BookingItem>,
    @InjectRepository(Product)
    private readonly productRepository: BaseRepository<Product>,
    private readonly promotionService: PromotionService,
    private readonly httpService: HttpService,
  ) {}

  async create(userId: string, createBookingDto: CreateBookingDto) {
    // 1. Lấy thông tin Showtime từ CinemaService qua APISIX
    let showtimeData: any;
    try {
      const response = await firstValueFrom(
        this.httpService.get(`http://localhost:9080/cinema-service/api/showtimes/${createBookingDto.showtimeId}`)
      );
      showtimeData = response.data;
    } catch (error) {
      this.logger.error(`Failed to fetch showtime: ${error.message}`);
      throw new BadRequestException('Invalid showtime ID or Cinema Service is down');
    }

    const booking = new Booking();
    booking.userId = userId;
    booking.showtimeId = createBookingDto.showtimeId;
    
    let subtotal = 0;
    const items: BookingItem[] = [];

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

    await this.bookingRepository.getEntityManager().persistAndFlush(booking);
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
