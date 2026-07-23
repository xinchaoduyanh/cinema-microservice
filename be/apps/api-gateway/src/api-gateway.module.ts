import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { GatewayRateLimitService } from './rate-limit.service';

@Module({
  imports: [],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService, GatewayRateLimitService],
})
export class ApiGatewayModule {}
