import * as dotenv from 'dotenv';
import path from 'path';
import { NodeEnv } from '@app/common';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { registerAs } from '@nestjs/config';
import * as entities from '../data-access/all.entity';

const envPath = path.resolve(__dirname, '../../../../.env');
const envPathCwd = path.resolve(process.cwd(), '../../.env');
console.log('[DEBUG] Loading .env from:', { envPath, envPathCwd, cwd: process.cwd() });

if (require('fs').existsSync(envPath)) {
  console.log('[DEBUG] Found .env at envPath');
  dotenv.config({ path: envPath });
} else if (require('fs').existsSync(envPathCwd)) {
  console.log('[DEBUG] Found .env at envPathCwd');
  dotenv.config({ path: envPathCwd });
} else {
  console.log('[DEBUG] Fallback to /work/.env');
  dotenv.config({ path: '/work/.env' });
}

console.log('DB Host:', process.env.USER_SERVICE_DB_HOST);
console.log('DB SSL:', process.env.USER_SERVICE_DB_SSL);

export const databaseConfig = {
  driver: PostgreSqlDriver,
  dbName: process.env.USER_SERVICE_DB_DATABASE || '',
  host: process.env.USER_SERVICE_DB_HOST || 'localhost',
  port: process.env.USER_SERVICE_DB_PORT
    ? Number(process.env.USER_SERVICE_DB_PORT)
    : 5432,
  user: process.env.USER_SERVICE_DB_USERNAME || '',
  password: process.env.USER_SERVICE_DB_PASSWORD || '',
  schema: process.env.USER_SERVICE_DB_SCHEMA || 'public',
  clientUrl: process.env.USER_SERVICE_DB_URL,
  baseDir: __dirname,
  debug: process.env.USER_SERVICE_NODE_ENV === NodeEnv.Production,
  entities: Object.values(entities),
  cache: {
    enabled: false,
  },
  driverOptions: {
    connection: {
      ssl: process.env.USER_SERVICE_DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    },
  },
};

export const dbConfiguration = registerAs('database', () => databaseConfig);
