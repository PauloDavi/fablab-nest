import { SendFirstAccessEmailService } from '@modules/mail/interfaces/services/send-first-access-email.interface';
import { EMAIL_TYPES } from '@modules/mail/interfaces/types';
import { CreateTokensService } from '@modules/tokens/interfaces/services/create-token.interface';
import { TOKENS_TYPES } from '@modules/tokens/interfaces/types';
import { Inject, Injectable } from '@nestjs/common';
import { addDays } from 'date-fns';

import { FirstAccessDto } from '../dtos/first-access.dto';
import { FirstAccessService } from '../interfaces/services/first-access.interface';

@Injectable()
export class FirstAccessServiceImp implements FirstAccessService {
  constructor(
    @Inject(EMAIL_TYPES.services.SendFirstAccessEmailService)
    private readonly sendFirstAccessEmailService: SendFirstAccessEmailService,
    @Inject(TOKENS_TYPES.services.CreateTokensService)
    private readonly createTokensService: CreateTokensService,
  ) {}

  async execute({ email }: FirstAccessDto): Promise<void> {
    const token = await this.createTokensService.execute({
      uniqueIdentifier: email,
      expiresDate: addDays(new Date(), 1),
    });

    await this.sendFirstAccessEmailService.execute({ email, token });
  }
}
