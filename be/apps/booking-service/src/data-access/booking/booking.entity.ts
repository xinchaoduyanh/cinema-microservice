import { Entity, Property, OneToMany, Collection, Enum, ManyToOne } from '@mikro-orm/core';
import { BaseEntity } from '../base.entity';
import { BookingItem } from './booking-item.entity';

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  PAID = 'PAID',
}

@Entity()
export class Booking extends BaseEntity<Booking> {
  @Property({ type: 'uuid' })
  userId: string; // From user-service

  @Property({ type: 'uuid' })
  showtimeId: string; // From cinema-service

  @Enum({ items: () => BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus = BookingStatus.PENDING;

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number = 0;

  @Property({ type: 'uuid', nullable: true })
  promotionId?: string;

  @Property({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discountAmount: number = 0;

  @OneToMany(() => BookingItem, (item) => item.booking)
  items = new Collection<BookingItem>(this);
}
