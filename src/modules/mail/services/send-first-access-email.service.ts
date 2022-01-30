import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SendFirstAccessEmailDto } from '../dtos/send-first-access-email.dto';
import { SendFirstAccessEmailService } from '../interfaces/services/send-first-access-email.interface';

@Injectable()
export class SendFirstAccessEmailServiceImp
  implements SendFirstAccessEmailService
{
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async execute({ email, token }: SendFirstAccessEmailDto) {
    const site = this.configService.get('FRONT_URL');

    const url = `${site}/first-access?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Obrigado por se cadastrar, confirme seu email',
      template: 'first-access',
      context: {
        url,
        email,
        site,
      },
    });
  }
}
