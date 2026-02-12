import 'reflect-metadata';
import { databaseConfig } from './src/config/database.config';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../../.env' }); // Adjust for depth in apps/movie-service
console.log('DB Name:', databaseConfig.dbName);
console.log('Entities length:', databaseConfig.entities.length);
