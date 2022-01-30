import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SendResetPasswordEmailDto } from '../dtos/send-reset-password-email.dto';
import { SendResetPasswordEmailService } from '../interfaces/services/send-reset-password-email.interface';

@Injectable()
export class SendResetPasswordEmailServiceImp
  implements SendResetPasswordEmailService
{
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async execute({ email, token }: SendResetPasswordEmailDto) {
    const site = this.configService.get('FRONT_URL');

    const url = `${site}/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Email de mudança de senha',
      template: 'reset-password',
      context: {
        url,
        email,
        site,
      },
    });
  }
}
