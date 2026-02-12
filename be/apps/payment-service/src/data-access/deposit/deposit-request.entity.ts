import { Entity, Property, ManyToOne, Enum } from '@mikro-orm/core';
import { BaseEntity } from '../base.entity';
import { Wallet } from '../wallet/wallet.entity';

export enum DepositStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED'
}

@Entity()
export class DepositRequest extends BaseEntity<DepositRequest> {
  @ManyToOne(() => Wallet)
  wallet: Wallet;

  @Property({ unique: true })
  code: string; // Ví dụ: NAP123456

  @Property({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Enum({ items: () => DepositStatus, default: DepositStatus.PENDING })
  status: DepositStatus = DepositStatus.PENDING;

  @Property({ type: 'timestamp', nullable: true })
  expiredAt?: Date;

  @Property({ nullable: true })
  paymentUrl?: string; // QR code URL từ SePay
}
