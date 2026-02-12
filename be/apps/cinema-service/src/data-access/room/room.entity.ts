import { Entity, Property, ManyToOne, OneToMany, Collection } from '@mikro-orm/core';
import { BaseEntity } from '../base.entity';
import { Cinema } from '../cinema/cinema.entity';
import { Seat } from '../seat/seat.entity';

@Entity()
export class Room extends BaseEntity<Room> {
  @Property()
  name: string;

  @Property({ default: '2D' })
  screenType: string; // 2D, 3D, IMAX...

  @ManyToOne(() => Cinema)
  cinema: Cinema;

  @OneToMany(() => Seat, (seat) => seat.room)
  seats = new Collection<Seat>(this);
}
