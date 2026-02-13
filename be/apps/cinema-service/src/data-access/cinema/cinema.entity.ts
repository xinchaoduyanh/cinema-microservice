import { Entity, Property, OneToMany, Collection } from '@mikro-orm/core';
import { BaseEntity } from '../base.entity';
import { Room } from '../room/room.entity';

@Entity()
export class Cinema extends BaseEntity<Cinema> {
  @Property()
  name: string;

  @Property()
  address: string;

  @Property({ nullable: true })
  city: string;

  @Property({ nullable: true })
  description?: string;

  @Property({ nullable: true })
  imageUrl?: string;

  @Property({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude?: number;

  @Property({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude?: number;

  @OneToMany(() => Room, (room) => room.cinema)
  rooms = new Collection<Room>(this);
}
