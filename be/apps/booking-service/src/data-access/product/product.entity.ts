import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../base.entity';

@Entity()
export class Product extends BaseEntity<Product> {
  @Property()
  name: string;

  @Property({ nullable: true })
  description?: string;

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Property({ default: 0 })
  stock: number;

  @Property({ nullable: true })
  imageUrl?: string;

  @Property({ default: true })
  isActive: boolean = true;
}
