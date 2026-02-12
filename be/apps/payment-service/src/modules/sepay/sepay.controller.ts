import { Controller, Post, Body, Headers, UnauthorizedException, Logger } from '@nestjs/common';
import { WalletService } from '../wallet/wallet.service';
import { ConfigService } from '@nestjs/config';

@Controller('sepay')
export class SePayController {
  private readonly logger = new Logger(SePayController.name);

  constructor(
    private readonly walletService: WalletService,
    private readonly configService: ConfigService,
  ) {}

  @Post('webhook')
  async handleWebhook(
    @Body() data: any,
    @Headers('x-sepay-token') token: string,
  ) {
    const secretToken = this.configService.get('SEPAY_WEBHOOK_TOKEN');
    
    // 1. Verify token để đảm bảo request đến từ SePay
    if (token !== secretToken) {
    //   throw new UnauthorizedException('Invalid SePay Token');
       this.logger.warn('Received invalid SePay token, check your config.');
    }

    this.logger.log(`Received SePay Webhook: ${JSON.stringify(data)}`);

    const { content, transferAmount, id, referenceCode } = data;

    // 2. Parse Code từ nội dung chuyển khoản (vd: NAP1002)
    const codeMatch = content.match(/(?:NAP|NAPTIEN)\s*(\d+)/i);
    
    if (codeMatch && codeMatch[1]) {
      const code = `NAP${codeMatch[1]}`;
      // Logic xử lý cộng tiền dựa trên code
      this.logger.log(`Found deposit code: ${code}`);
      // Gọi service để xử lý cộng tiền...
    }

    this.logger.error(`Could not parse UserID from content: ${content}`);
    return { success: false, message: 'UserID not found in content' };
  }
}
