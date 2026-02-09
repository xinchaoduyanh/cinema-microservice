import 'reflect-metadata';
import * as dotenv from 'dotenv';
import path from 'path';
import { NodeEnv } from '@app/common';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { registerAs } from '@nestjs/config';
import { Movie, Genre, Person, MovieGenre, MovieDirector, MovieCast } from '../data-access/all.entity';

const envPath = path.resolve(__dirname, '../../../../.env');
const envPathCwd = path.resolve(process.cwd(), '../../.env');
console.log('[DEBUG-MOVIE] Loading .env from:', { envPath, envPathCwd, cwd: process.cwd() });

if (require('fs').existsSync(envPath)) {
  console.log('[DEBUG-MOVIE] Found .env at envPath');
  dotenv.config({ path: envPath });
} else if (require('fs').existsSync(envPathCwd)) {
  console.log('[DEBUG-MOVIE] Found .env at envPathCwd');
  dotenv.config({ path: envPathCwd });
} else {
  console.log('[DEBUG-MOVIE] Fallback to /work/.env');
  dotenv.config({ path: '/work/.env' });
}

export const databaseConfig = {
  driver: PostgreSqlDriver,
  dbName: process.env.MOVIE_SERVICE_DB_DATABASE || '',
  host: process.env.MOVIE_SERVICE_DB_HOST || 'localhost',
  port: process.env.MOVIE_SERVICE_DB_PORT
    ? Number(process.env.MOVIE_SERVICE_DB_PORT)
    : 5432,
  user: process.env.MOVIE_SERVICE_DB_USERNAME || '',
  password: process.env.MOVIE_SERVICE_DB_PASSWORD || '',
  schema: process.env.MOVIE_SERVICE_DB_SCHEMA || 'public',
  clientUrl: process.env.MOVIE_SERVICE_DB_URL,
  baseDir: __dirname,
  debug: process.env.NODE_ENV === NodeEnv.Development,
  entities: [Movie, Genre, Person, MovieGenre, MovieDirector, MovieCast],
  cache: {
    enabled: false,
  },
  driverOptions: {
    connection: {
      ssl: process.env.MOVIE_SERVICE_DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    },
  },
};

export const dbConfiguration = registerAs('database', () => databaseConfig);
