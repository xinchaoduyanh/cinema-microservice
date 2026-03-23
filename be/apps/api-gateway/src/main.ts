import { Request, Response, NextFunction } from 'express';
import { Readable } from 'node:stream';
import { NestFactory } from '@nestjs/core';
import { JsonWebTokenError, JwtPayload, TokenExpiredError, verify } from 'jsonwebtoken';
import { ApiGatewayModule } from './api-gateway.module';

const METHODS_WITHOUT_BODY = new Set(['GET', 'HEAD']);
const EXCLUDED_AUTH_PATH_PREFIXES = ['/auth-service/api/auth/login', '/auth-service/api/auth/signup'];

const getServiceTargets = () => ({
  'auth-service':
    process.env.AUTH_SERVICE_BASE_URL ||
    `http://127.0.0.1:${process.env.AUTH_SERVICE_APP_PORT || 3300}`,
  'user-service':
    process.env.USER_SERVICE_BASE_URL ||
    `http://127.0.0.1:${process.env.USER_SERVICE_APP_PORT || 3301}`,
  'movie-service':
    process.env.MOVIE_SERVICE_BASE_URL ||
    `http://127.0.0.1:${process.env.MOVIE_SERVICE_APP_PORT || 3302}`,
  'cinema-service':
    process.env.CINEMA_SERVICE_BASE_URL ||
    `http://127.0.0.1:${process.env.CINEMA_SERVICE_APP_PORT || 3304}`,
  'booking-service':
    process.env.BOOKING_SERVICE_BASE_URL ||
    `http://127.0.0.1:${process.env.BOOKING_SERVICE_APP_PORT || 3305}`,
  'payment-service':
    process.env.PAYMENT_SERVICE_BASE_URL ||
    `http://127.0.0.1:${process.env.PAYMENT_SERVICE_APP_PORT || 3306}`,
  'notification-service':
    process.env.NOTIFICATION_SERVICE_BASE_URL ||
    `http://127.0.0.1:${process.env.NOTIFICATION_SERVICE_APP_PORT || 3303}`,
});

type GatewayAuthUser = {
  id: string;
  email: string;
  jti: string;
  role?: string;
  type?: string;
  iss?: string;
  key?: string;
  emailVerified?: boolean;
};

const getBearerToken = (authorizationHeader?: string) => {
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(' ');

  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return null;
  }

  return token;
};

const getGatewayAuthUser = (req: Request): GatewayAuthUser | null => {
  if (req.headers['x-auth-user']) {
    return null;
  }

  if (EXCLUDED_AUTH_PATH_PREFIXES.some((prefix) => req.path.startsWith(prefix))) {
    return null;
  }

  const token = getBearerToken(req.headers.authorization);
  const jwtSecret = process.env.JWT_SECRET;

  if (!token || !jwtSecret) {
    return null;
  }

  const decodedToken = verify(token, jwtSecret) as JwtPayload & GatewayAuthUser;

  if (!decodedToken.id || !decodedToken.email || !decodedToken.jti) {
    return null;
  }

  return {
    id: decodedToken.id,
    email: decodedToken.email,
    jti: decodedToken.jti,
    role: decodedToken.role,
    type: decodedToken.type,
    iss: decodedToken.iss,
    key: decodedToken.key,
    emailVerified: decodedToken.emailVerified,
  };
};

const buildForwardHeaders = (req: Request) => {
  const headers = new Headers();
  const authUser = getGatewayAuthUser(req);

  Object.entries(req.headers).forEach(([key, value]) => {
    if (value === undefined) {
      return;
    }

    if (['host', 'content-length', 'connection'].includes(key.toLowerCase())) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => headers.append(key, item));
      return;
    }

    headers.set(key, value);
  });

  headers.set('x-forwarded-host', req.headers.host || '');
  headers.set('x-forwarded-proto', req.protocol);
  headers.set('x-forwarded-for', req.ip || req.socket.remoteAddress || '');
  if (authUser) {
    headers.set('x-auth-user', JSON.stringify(authUser));
  }

  return headers;
};

async function proxyRequest(req: Request, res: Response, targetBaseUrl: string) {
  const targetPath = req.originalUrl.replace(/^\/[^/]+/, '') || '/';
  const targetUrl = new URL(targetPath, targetBaseUrl);

  const requestInit = {
    method: req.method,
    headers: buildForwardHeaders(req),
    body: METHODS_WITHOUT_BODY.has(req.method.toUpperCase()) ? undefined : (req as unknown as BodyInit),
    duplex: 'half',
    redirect: 'manual',
  } as RequestInit & { duplex: 'half' };

  const response = await fetch(targetUrl, requestInit);

  res.status(response.status);

  response.headers.forEach((value, key) => {
    if (['content-length', 'transfer-encoding', 'connection'].includes(key.toLowerCase())) {
      return;
    }

    res.setHeader(key, value);
  });

  if (!response.body) {
    res.end();
    return;
  }

  Readable.fromWeb(response.body).pipe(res);
}

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule, {
    bodyParser: false,
  });
  const expressApp = app.getHttpAdapter().getInstance();
  const serviceTargets = getServiceTargets();

  expressApp.use(async (req: Request, res: Response, next: NextFunction) => {
    const serviceKey = req.path.split('/').filter(Boolean)[0];
    const targetBaseUrl = serviceTargets[serviceKey as keyof typeof serviceTargets];

    if (!targetBaseUrl) {
      next();
      return;
    }

    try {
      await proxyRequest(req, res, targetBaseUrl);
    } catch (error) {
      if (error instanceof TokenExpiredError || error instanceof JsonWebTokenError) {
        res.status(401).json({
          statusCode: 401,
          message: 'Unauthorized',
        });
        return;
      }

      next(error);
    }
  });

  await app.listen(process.env.API_GATEWAY_APP_PORT ?? process.env.port ?? 9080, '0.0.0.0');
}

bootstrap();
