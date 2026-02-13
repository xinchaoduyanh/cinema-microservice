import { Entity, Property, ManyToOne, Enum } from '@mikro-orm/core';
import { BaseEntity } from '../base.entity';
import { Showtime } from '../showtime/showtime.entity';
import { Seat } from '../seat/seat.entity';

export enum ShowtimeSeatStatus {
  AVAILABLE = 'AVAILABLE',
  LOCKED = 'LOCKED',
  BOOKED = 'BOOKED',
}

@Entity()
export class ShowtimeSeat extends BaseEntity<ShowtimeSeat> {
  @ManyToOne(() => Showtime)
  showtime: Showtime;

  @ManyToOne(() => Seat)
  seat: Seat;

  @Enum({ items: () => ShowtimeSeatStatus, default: ShowtimeSeatStatus.AVAILABLE })
  status: ShowtimeSeatStatus = ShowtimeSeatStatus.AVAILABLE;

  @Property({ type: 'uuid', nullable: true })
  bookingId?: string; // Reference to booking-service booking

  @Property({ type: 'timestamp with time zone', nullable: true })
  lockedAt?: Date;
}
