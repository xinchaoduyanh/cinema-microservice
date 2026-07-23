import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import { Readable } from 'node:stream';
import { NestFactory } from '@nestjs/core';
import { Algorithm, JsonWebTokenError, JwtPayload, TokenExpiredError, verify } from 'jsonwebtoken';
import { ApiGatewayModule } from './api-gateway.module';

const METHODS_WITHOUT_BODY = new Set(['GET', 'HEAD', 'OPTIONS']);

/** Routes that deliberately do not require an access token. */
const PUBLIC_PATHS = new Set([
  '/auth-service/api/auth/login',
  '/auth-service/api/auth/sign-up',
  '/auth-service/api/auth/forgot-password',
  '/auth-service/api/auth/forgot-password/verify',
  '/auth-service/api/auth/reset-password',
]);

const HOP_BY_HOP_HEADERS = new Set([
  'connection',
  'content-length',
  'host',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
]);

type GatewayAuthUser = {
  id: string;
  email: string;
  jti: string;
  role?: string;
  emailVerified?: boolean;
};

type ServiceTargets = Record<string, string>;

const getServiceTargets = (): ServiceTargets => ({
  'auth-service': process.env.AUTH_SERVICE_BASE_URL || `http://127.0.0.1:${process.env.AUTH_SERVICE_APP_PORT || 3300}`,
  'user-service': process.env.USER_SERVICE_BASE_URL || `http://127.0.0.1:${process.env.USER_SERVICE_APP_PORT || 3301}`,
  'movie-service': process.env.MOVIE_SERVICE_BASE_URL || `http://127.0.0.1:${process.env.MOVIE_SERVICE_APP_PORT || 3302}`,
  'notification-service': process.env.NOTIFICATION_SERVICE_BASE_URL || `http://127.0.0.1:${process.env.NOTIFICATION_SERVICE_APP_PORT || 3303}`,
  'cinema-service': process.env.CINEMA_SERVICE_BASE_URL || `http://127.0.0.1:${process.env.CINEMA_SERVICE_APP_PORT || 3304}`,
  'booking-service': process.env.BOOKING_SERVICE_BASE_URL || `http://127.0.0.1:${process.env.BOOKING_SERVICE_APP_PORT || 3305}`,
  'payment-service': process.env.PAYMENT_SERVICE_BASE_URL || `http://127.0.0.1:${process.env.PAYMENT_SERVICE_APP_PORT || 3306}`,
});

const getBearerToken = (authorization?: string): string | null => {
  const match = authorization?.match(/^Bearer\s+(.+)$/i);
  return match?.[1] || null;
};

const isPublicRequest = (req: Request): boolean =>
  req.method === 'OPTIONS' || PUBLIC_PATHS.has(req.path);

const expectedTokenType = (req: Request): 'access_token' | 'refresh_token' =>
  req.path === '/auth-service/api/auth/refresh-token' ? 'refresh_token' : 'access_token';

const getAuthenticatedUser = (req: Request): GatewayAuthUser | null => {
  if (isPublicRequest(req)) return null;

  const token = getBearerToken(req.headers.authorization);
  const secret = process.env.JWT_SECRET;
  if (!token || !secret) throw new JsonWebTokenError('Missing access token');

  const payload = verify(token, secret, {
    algorithms: [(process.env.JWT_ALGORITHM || 'HS256') as Algorithm],
    issuer: process.env.JWT_ISSUER || undefined,
  }) as JwtPayload & GatewayAuthUser & { type?: string };

  if (payload.type !== expectedTokenType(req) || !payload.id || !payload.email || !payload.jti) {
    throw new JsonWebTokenError('Invalid access token payload');
  }

  return {
    id: payload.id,
    email: payload.email,
    jti: payload.jti,
    role: payload.role,
    emailVerified: payload.emailVerified,
  };
};

const buildForwardHeaders = (req: Request, user: GatewayAuthUser | null): Headers => {
  const headers = new Headers();

  for (const [key, value] of Object.entries(req.headers)) {
    const normalizedKey = key.toLowerCase();
    // Authentication context is owned by this gateway and must never be client supplied.
    if (HOP_BY_HOP_HEADERS.has(normalizedKey) || normalizedKey === 'x-auth-user') continue;
    if (value === undefined) continue;
    if (Array.isArray(value)) value.forEach((item) => headers.append(key, item));
    else headers.set(key, value);
  }

  headers.set('x-forwarded-host', req.headers.host || '');
  headers.set('x-forwarded-proto', req.protocol);
  headers.set('x-forwarded-for', req.ip || req.socket.remoteAddress || '');
  headers.set('x-request-id', req.headers['x-request-id']?.toString() || randomUUID());
  if (user) headers.set('x-auth-user', JSON.stringify(user));

  return headers;
};

async function proxyRequest(req: Request, res: Response, targetBaseUrl: string, user: GatewayAuthUser | null) {
  const targetPath = req.originalUrl.replace(/^\/[^/]+/, '') || '/';
  const targetUrl = new URL(targetPath, targetBaseUrl);
  const response = await fetch(targetUrl, {
    method: req.method,
    headers: buildForwardHeaders(req, user),
    body: METHODS_WITHOUT_BODY.has(req.method.toUpperCase()) ? undefined : (req as unknown as BodyInit),
    duplex: 'half',
    redirect: 'manual',
  } as RequestInit & { duplex: 'half' });

  res.status(response.status);
  response.headers.forEach((value, key) => {
    if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) res.setHeader(key, value);
  });
  if (!response.body) return res.end();
  Readable.fromWeb(response.body).pipe(res);
}

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule, { bodyParser: false });
  const expressApp = app.getHttpAdapter().getInstance();
  const serviceTargets = getServiceTargets();

  expressApp.use(async (req: Request, res: Response, next: NextFunction) => {
    const serviceKey = req.path.split('/').filter(Boolean)[0];
    const target = serviceTargets[serviceKey];
    if (!target) return next();

    try {
      const user = getAuthenticatedUser(req);
      await proxyRequest(req, res, target, user);
    } catch (error) {
      if (error instanceof TokenExpiredError || error instanceof JsonWebTokenError) {
        return res.status(401).json({ statusCode: 401, message: 'Unauthorized' });
      }
      return res.status(502).json({ statusCode: 502, message: `Unable to reach ${serviceKey}` });
    }
  });

  await app.listen(process.env.API_GATEWAY_APP_PORT ?? process.env.port ?? 9080, '0.0.0.0');
}

bootstrap();
