export class CreateBookingDto {
  showtimeId: string;
  promotionCode?: string;
  items: BookingItemDto[];
}

export class BookingItemDto {
  type: string; // SEAT, PRODUCT
  itemId: string; // Seat ID or Product ID
  quantity: number;
}
