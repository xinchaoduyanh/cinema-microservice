import { Entity, Property, ManyToOne, Enum } from '@mikro-orm/core';
import { BaseEntity } from '../base.entity';
import { Room } from '../room/room.entity';

export enum SeatType {
  STANDARD = 'STANDARD',
  VIP = 'VIP',
  SWEETBOX = 'SWEETBOX',
}

@Entity()
export class Seat extends BaseEntity<Seat> {
  @Property()
  row: string; // A, B, C...

  @Property()
  column: number; // 1, 2, 3...

  @Enum({ items: () => SeatType, default: SeatType.STANDARD })
  type: SeatType;

  @ManyToOne(() => Room)
  room: Room;
}
