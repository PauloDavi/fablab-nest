import { ISendMailOptions } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FakeMailerService {
  async sendMail(sendMailOptions: ISendMailOptions): Promise<any> {
    console.log(sendMailOptions);
  }
}
