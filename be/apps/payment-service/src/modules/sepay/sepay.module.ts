import { Module } from '@nestjs/common';
import { SePayController } from './sepay.controller';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [WalletModule],
  controllers: [SePayController],
})
export class SePayModule {}
