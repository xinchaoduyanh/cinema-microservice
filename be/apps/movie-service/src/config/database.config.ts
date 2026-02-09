import 'reflect-metadata';
import * as dotenv from 'dotenv';
import path from 'path';
import { NodeEnv } from '@app/common';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { registerAs } from '@nestjs/config';
import { Movie, Genre, Person, MovieGenre, MovieDirector, MovieCast } from '../data-access/all.entity';

dotenv.config({ path: '/work/.env' });

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
