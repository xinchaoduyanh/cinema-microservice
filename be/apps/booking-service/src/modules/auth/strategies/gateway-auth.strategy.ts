import { ERROR_RESPONSE, ServerException, TokenPayload } from '@app/common';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Strategy } from 'passport-custom';

@Injectable()
export class GatewayAuthStrategy extends PassportStrategy(Strategy, 'gateway-auth') {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    super();
  }

  async validate(req: any) {
    const { headers } = req;
    const authUserHeader = headers['x-auth-user'];
    if (!authUserHeader) {
      return null; // Let the guard handle missing user for non-public routes
    }

    try {
      const authUser: TokenPayload = JSON.parse(authUserHeader);
      if (!authUser?.id) {
        return null;
      }
      return authUser;
    } catch (e) {
      this.logger.error('Failed to parse x-auth-user header', e);
      return null;
    }
  }
}
