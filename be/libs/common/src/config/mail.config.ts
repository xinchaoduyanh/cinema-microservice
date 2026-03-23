import { registerAs } from '@nestjs/config';

export const mailConfiguration = registerAs('mail', () => ({
  driver:
    (process.env.MAIL_DRIVER || 'smtp').toLowerCase() === 'ses'
      ? 'ses'
      : 'smtp',
}));
