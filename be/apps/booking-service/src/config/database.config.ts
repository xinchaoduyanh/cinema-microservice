import 'reflect-metadata';
import * as dotenv from 'dotenv';
import path from 'path';
import { NodeEnv } from '@app/common';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { registerAs } from '@nestjs/config';
import { AllEntities } from '../data-access/all.entity';

const envPath = path.resolve(__dirname, '../../../../.env');
const envPathCwd = path.resolve(process.cwd(), '.env');
const envPathParent = path.resolve(process.cwd(), '../../.env');
const envPathRoot = path.resolve(process.cwd(), '../../../.env');

console.log('[BOOKING-SERVICE DEBUG] CWD:', process.cwd());

if (require('fs').existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else if (require('fs').existsSync(envPathParent)) {
  dotenv.config({ path: envPathParent });
} else if (require('fs').existsSync(envPathRoot)) {
  dotenv.config({ path: envPathRoot });
} else if (require('fs').existsSync(envPathCwd)) {
  dotenv.config({ path: envPathCwd });
}

console.log('[BOOKING-SERVICE DEBUG] KAFKA_BROKERS:', process.env.KAFKA_BROKERS);
console.log('[BOOKING-SERVICE DEBUG] DB_HOST:', process.env.BOOKING_SERVICE_DB_HOST);

export const databaseConfig = {
  driver: PostgreSqlDriver,
  dbName: process.env.BOOKING_SERVICE_DB_DATABASE || 'cinema_management',
  host: process.env.BOOKING_SERVICE_DB_HOST || 'localhost',
  port: process.env.BOOKING_SERVICE_DB_PORT ? Number(process.env.BOOKING_SERVICE_DB_PORT) : 5432,
  user: process.env.BOOKING_SERVICE_DB_USER || '',
  password: process.env.BOOKING_SERVICE_DB_PASSWORD || '',
  schema: process.env.BOOKING_SERVICE_DB_SCHEMA || 'public',
  clientUrl: process.env.BOOKING_SERVICE_DB_URL,
  baseDir: __dirname,
  debug: process.env.NODE_ENV === NodeEnv.Development,
  entities: AllEntities,
  cache: {
    enabled: false,
  },
  driverOptions: {
    connection: {
      ssl: { rejectUnauthorized: false },
    },
  },
};

export const dbConfiguration = registerAs('database', () => databaseConfig);
