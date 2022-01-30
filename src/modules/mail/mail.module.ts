import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

import { EMAIL_TYPES } from './interfaces/types';
import { SendFirstAccessEmailServiceImp } from './services/send-first-access-email.service';
import { SendResetPasswordEmailServiceImp } from './services/send-reset-password-email.service';

const sendFirstAccessEmail = {
  provide: EMAIL_TYPES.services.SendFirstAccessEmailService,
  useClass: SendFirstAccessEmailServiceImp,
};

const sendResetPasswordEmail = {
  provide: EMAIL_TYPES.services.SendResetPasswordEmailService,
  useClass: SendResetPasswordEmailServiceImp,
};

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST'),
          port: config.get('MAIL_PORT'),
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASS'),
          },
          secure: false,
          requireTLS: false,
        },
        defaults: {
          from: `"No Reply" <${config.get('MAIL_SENDER_EMAIL')}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [sendFirstAccessEmail, sendResetPasswordEmail],
  exports: [sendFirstAccessEmail, sendResetPasswordEmail],
})
export class MailModule {}
