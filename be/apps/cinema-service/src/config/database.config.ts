import 'reflect-metadata';
import * as dotenv from 'dotenv';
import path from 'path';
import { NodeEnv } from '@app/common';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { registerAs } from '@nestjs/config';
import { AllEntities } from '../data-access/all.entity';

const envPath = path.resolve(__dirname, '../../../../.env');
const envPathCwd = path.resolve(process.cwd(), '.env'); // Fixed path for microservice .env

if (require('fs').existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else if (require('fs').existsSync(envPathCwd)) {
  dotenv.config({ path: envPathCwd });
}

export const databaseConfig = {
  driver: PostgreSqlDriver,
  dbName: process.env.CINEMA_SERVICE_DB_DATABASE || '',
  host: process.env.CINEMA_SERVICE_DB_HOST || 'localhost',
  port: process.env.CINEMA_SERVICE_DB_PORT
    ? Number(process.env.CINEMA_SERVICE_DB_PORT)
    : 5432,
  user: process.env.CINEMA_SERVICE_DB_USER || '',
  password: process.env.CINEMA_SERVICE_DB_PASSWORD || '',
  schema: process.env.CINEMA_SERVICE_DB_SCHEMA || 'public',
  clientUrl: process.env.CINEMA_SERVICE_DB_URL,
  baseDir: __dirname,
  debug: process.env.NODE_ENV === NodeEnv.Development,
  entities: AllEntities,
  cache: {
    enabled: false,
  },
  driverOptions: {
    connection: {
      ssl: process.env.CINEMA_SERVICE_DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    },
  },
};

export const dbConfiguration = registerAs('database', () => databaseConfig);
