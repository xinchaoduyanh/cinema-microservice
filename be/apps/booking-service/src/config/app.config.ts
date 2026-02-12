import { registerAs } from '@nestjs/config';

export const getAppConfig = () => ({
  appName: process.env.BOOKING_SERVICE_APP_NAME || 'Booking Service',
  appPort: +process.env.BOOKING_SERVICE_APP_PORT || 3305,
});

export const appConfiguration = registerAs('app', getAppConfig);
