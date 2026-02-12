import { registerAs } from '@nestjs/config';

export const getAppConfig = () => ({
  appName: process.env.CINEMA_SERVICE_APP_NAME || 'Cinema Service',
  appPort: +process.env.CINEMA_SERVICE_APP_PORT || 3304,
});

export const appConfiguration = registerAs('app', getAppConfig);
