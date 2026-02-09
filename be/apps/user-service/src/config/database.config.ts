import * as dotenv from 'dotenv';
import path from 'path';
import { NodeEnv } from '@app/common';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { registerAs } from '@nestjs/config';
import * as entities from '../data-access/all.entity';

dotenv.config({ path: '/work/.env' });

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
