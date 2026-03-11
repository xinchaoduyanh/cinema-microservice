import { registerAs } from '@nestjs/config';
import * as dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(__dirname, '../../../../.env');
const envPathCwd = path.resolve(process.cwd(), '.env');
const envPathParent = path.resolve(process.cwd(), '../../.env');
const envPathRoot = path.resolve(process.cwd(), '../../../.env');

if (require('fs').existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else if (require('fs').existsSync(envPathParent)) {
  dotenv.config({ path: envPathParent });
} else if (require('fs').existsSync(envPathRoot)) {
  dotenv.config({ path: envPathRoot });
} else if (require('fs').existsSync(envPathCwd)) {
  dotenv.config({ path: envPathCwd });
}

export const getAppConfig = () => ({
  appName: process.env.BOOKING_SERVICE_APP_NAME || 'Booking Service',
  appPort: +process.env.BOOKING_SERVICE_APP_PORT || 3305,
});

export const appConfiguration = registerAs('app', getAppConfig);
