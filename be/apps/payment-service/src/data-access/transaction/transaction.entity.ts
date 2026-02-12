import { Entity, Property, ManyToOne, Enum } from '@mikro-orm/core';
import { BaseEntity } from '../base.entity';
import { Wallet } from '../wallet/wallet.entity';

export enum TransactionType {
  DEPOSIT = 'DEPOSIT', // Nạp tiền
  PAYMENT = 'PAYMENT', // Giao dịch mua vé
  REFUND = 'REFUND',   // Hoàn tiền
  WITHDRAW = 'WITHDRAW' // Rút tiền (nếu có)
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED'
}

@Entity()
export class Transaction extends BaseEntity<Transaction> {
  @ManyToOne(() => Wallet)
  wallet: Wallet;

  @Enum({ items: () => TransactionType })
  type: TransactionType;

  @Enum({ items: () => TransactionStatus, default: TransactionStatus.PENDING })
  status: TransactionStatus = TransactionStatus.PENDING;

  @Property({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Property({ nullable: true })
  description?: string;

  @Property({ nullable: true })
  referenceId?: string; // ID từ SePay hoặc ID từ Booking Service

  @Property({ type: 'json', nullable: true })
  metaData?: any; // Lưu log từ SePay
}
