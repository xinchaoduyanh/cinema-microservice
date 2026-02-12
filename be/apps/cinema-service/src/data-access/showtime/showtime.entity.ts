import { Entity, Property, ManyToOne } from '@mikro-orm/core';
import { BaseEntity } from '../base.entity';
import { Room } from '../room/room.entity';

@Entity()
export class Showtime extends BaseEntity<Showtime> {
  @Property({ type: 'uuid' })
  movieId: string; // ID tham chiếu sang movie-service

  @ManyToOne(() => Room)
  room: Room;

  @Property({ type: 'timestamp with time zone' })
  startTime: Date;

  @Property({ type: 'timestamp with time zone' })
  endTime: Date;

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Property({ default: 'VND' })
  currency: string;
}
