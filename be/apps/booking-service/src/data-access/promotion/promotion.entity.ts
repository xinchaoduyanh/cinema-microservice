import { Entity, Property, Enum } from '@mikro-orm/core';
import { BaseEntity } from '../base.entity';

export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
}

@Entity()
export class Promotion extends BaseEntity<Promotion> {
  @Property()
  code: string;

  @Property()
  name: string;

  @Property({ nullable: true })
  description?: string;

  @Enum({ items: () => DiscountType, default: DiscountType.PERCENTAGE })
  discountType: DiscountType;

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  discountValue: number;

  @Property({ type: 'timestamp with time zone' })
  startDate: Date;

  @Property({ type: 'timestamp with time zone' })
  endDate: Date;

  @Property({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  minimumOrderValue?: number;

  @Property({ default: true })
  isActive: boolean = true;
}
