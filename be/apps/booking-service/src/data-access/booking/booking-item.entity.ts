import { Entity, Property, ManyToOne, Enum } from '@mikro-orm/core';
import { BaseEntity } from '../base.entity';
import { Booking } from './booking.entity';

export enum ItemType {
  SEAT = 'SEAT',
  PRODUCT = 'PRODUCT',
}

@Entity()
export class BookingItem extends BaseEntity<BookingItem> {
  @ManyToOne(() => Booking)
  booking: Booking;

  @Enum({ items: () => ItemType })
  type: ItemType;

  @Property({ type: 'uuid' })
  itemId: string; // Seat ID or Product ID

  @Property()
  quantity: number = 1;

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  price: number;
}
