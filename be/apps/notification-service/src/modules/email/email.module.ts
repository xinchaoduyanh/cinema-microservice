import { awsSesConfiguration, mailConfiguration, smtpConfiguration } from '@app/common';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigType } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { AbstractEmailService } from './abstract-email.service';
import { EmailService } from './email.service';
import { SesEmailService } from './ses-email.service';
import { SmtpEmailService } from './smtp-email.service';

@Global()
@Module({
  imports: [
    ConfigModule.forFeature(mailConfiguration),
    ConfigModule.forFeature(awsSesConfiguration),
    ConfigModule.forFeature(smtpConfiguration)
  ],
  providers: [
    {
      provide: AbstractEmailService,
      useFactory: (
        mailConfig: ConfigType<typeof mailConfiguration>,
        awsSesConfig: ConfigType<typeof awsSesConfiguration>,
        smtpConfig: ConfigType<typeof smtpConfiguration>,
        logger: Logger,
      ) => {
        if (mailConfig.driver === 'ses') {
          return new SesEmailService(awsSesConfig, logger);
        }

        return new SmtpEmailService(smtpConfig, logger);
      },
      inject: [
        mailConfiguration.KEY,
        awsSesConfiguration.KEY,
        smtpConfiguration.KEY,
        WINSTON_MODULE_PROVIDER,
      ],
    },
    SesEmailService,
    SmtpEmailService,
    EmailService,
  ],
  exports: [AbstractEmailService, EmailService],
})
export class EmailModule {}
