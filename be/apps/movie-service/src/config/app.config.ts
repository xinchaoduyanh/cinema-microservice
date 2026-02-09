import { MicroserviceName } from '@app/core';
import { registerAs } from '@nestjs/config';

export const getAppConfig = () => ({
  appName: process.env.MOVIE_SERVICE_APP_NAME,
  appPort: +process.env.MOVIE_SERVICE_APP_PORT || 3302,
  microserviceName: MicroserviceName.MovieService,
});

export const appConfiguration = registerAs('app', getAppConfig);
