import { IsString, IsOptional, IsArray, ValidateNested, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookingDto {
  @IsString()
  showtimeId: string;

  @IsString()
  @IsOptional()
  promotionCode?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BookingItemDto)
  items: BookingItemDto[];
}

export class BookingItemDto {
  @IsString()
  type: string; // SEAT, PRODUCT

  @IsString()
  itemId: string; // Seat ID or Product ID

  @IsNumber()
  @Min(1)
  quantity: number;
}

