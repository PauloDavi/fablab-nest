import { MailerService } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { FakeMailerService } from '../fake/fake-mailer.service';
import { SendFirstAccessEmailServiceImp } from './send-first-access-email.service';

describe('SendFirstAccessEmailServiceImp', () => {
  let service: SendFirstAccessEmailServiceImp;
  let fakeMailerService: FakeMailerService;

  beforeEach(async () => {
    fakeMailerService = new FakeMailerService();

    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        { provide: MailerService, useValue: fakeMailerService },
        SendFirstAccessEmailServiceImp,
      ],
    }).compile();

    service = module.get<SendFirstAccessEmailServiceImp>(
      SendFirstAccessEmailServiceImp,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to send a first access mail to user', async () => {
    const sendFirstAccessEmail = jest.spyOn(fakeMailerService, 'sendMail');

    await service.execute({
      email: 'test@test.com',
      token: 'token',
    });

    expect(sendFirstAccessEmail).toHaveBeenCalledTimes(1);
  });
});
