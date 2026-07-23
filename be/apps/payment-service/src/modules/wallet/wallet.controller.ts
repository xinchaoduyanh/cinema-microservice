import { OwnerParam } from '@app/common';
import { Controller, Get, Param } from '@nestjs/common';
import { WalletService } from './wallet.service';

@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get(':userId')
  @OwnerParam('userId')
  async getWallet(@Param('userId') userId: string) {
    return this.walletService.getWallet(userId);
  }
}
