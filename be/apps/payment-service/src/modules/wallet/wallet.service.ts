import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Wallet } from '../../data-access/wallet/wallet.entity';
import { Transaction, TransactionType, TransactionStatus } from '../../data-access/transaction/transaction.entity';
import { BaseRepository } from '../../data-access/base.repository';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: BaseRepository<Wallet>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: BaseRepository<Transaction>,
  ) {}

  async getWallet(userId: string) {
    let wallet = await this.walletRepository.findOne({ userId });
    if (!wallet) {
      wallet = new Wallet();
      wallet.userId = userId;
      await this.walletRepository.getEntityManager().persistAndFlush(wallet);
    }
    return wallet;
  }

  async deposit(userId: string, amount: number, referenceId: string, description: string, metaData?: any) {
    const wallet = await this.getWallet(userId);
    
    // Kiểm tra xem transaction này đã được xử lý chưa (tránh cộng tiền 2 lần)
    if (referenceId) {
      const existingTx = await this.transactionRepository.findOne({ referenceId, status: TransactionStatus.SUCCESS });
      if (existingTx) return existingTx;
    }

    const transaction = new Transaction();
    transaction.wallet = wallet;
    transaction.type = TransactionType.DEPOSIT;
    transaction.amount = amount;
    transaction.status = TransactionStatus.SUCCESS;
    transaction.referenceId = referenceId;
    transaction.description = description;
    transaction.metaData = metaData;

    wallet.balance = Number(wallet.balance) + Number(amount);

    await this.walletRepository.getEntityManager().persist(transaction);
    await this.walletRepository.getEntityManager().flush();

    return transaction;
  }

  async pay(userId: string, amount: number, description: string, referenceId?: string) {
    const wallet = await this.getWallet(userId);

    if (wallet.balance < amount) {
      throw new BadRequestException('Insufficient balance in wallet');
    }

    const transaction = new Transaction();
    transaction.wallet = wallet;
    transaction.type = TransactionType.PAYMENT;
    transaction.amount = amount;
    transaction.status = TransactionStatus.SUCCESS;
    transaction.description = description;
    transaction.referenceId = referenceId;

    wallet.balance = Number(wallet.balance) - Number(amount);

    await this.walletRepository.getEntityManager().persist(transaction);
    await this.walletRepository.getEntityManager().flush();

    return transaction;
  }
}
