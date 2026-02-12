import { Entity, Property, OneToOne, Collection, OneToMany } from '@mikro-orm/core';
import { BaseEntity } from '../base.entity';
import { Transaction } from '../transaction/transaction.entity';

@Entity()
export class Wallet extends BaseEntity<Wallet> {
  @Property({ type: 'uuid', unique: true })
  userId: string;

  @Property({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  balance: number = 0;

  @OneToMany(() => Transaction, (transaction) => transaction.wallet)
  transactions = new Collection<Transaction>(this);

  @Property({ default: true })
  isActive: boolean = true;
}
