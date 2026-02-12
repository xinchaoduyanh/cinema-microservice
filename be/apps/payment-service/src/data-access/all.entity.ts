import { Wallet } from './wallet/wallet.entity';
import { Transaction } from './transaction/transaction.entity';
import { DepositRequest } from './deposit/deposit-request.entity';

export { Wallet, Transaction, DepositRequest };
export const AllEntities = [Wallet, Transaction, DepositRequest];
