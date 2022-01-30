import { SendResetPasswordEmailService } from '@modules/mail/interfaces/services/send-reset-password-email.interface';
import { EMAIL_TYPES } from '@modules/mail/interfaces/types';
import { CreateTokensService } from '@modules/tokens/interfaces/services/create-token.interface';
import { TOKENS_TYPES } from '@modules/tokens/interfaces/types';
import { Inject, Injectable } from '@nestjs/common';
import { addDays } from 'date-fns';

import { RequestResetPasswordDto } from '../dtos/request-reset-password.dto';
import { RequestResetPasswordService } from '../interfaces/services/request-reset-password.interface';

@Injectable()
export class RequestResetPasswordServiceImp
  implements RequestResetPasswordService
{
  constructor(
    @Inject(EMAIL_TYPES.services.SendResetPasswordEmailService)
    private readonly sendResetPasswordEmailService: SendResetPasswordEmailService,
    @Inject(TOKENS_TYPES.services.CreateTokensService)
    private readonly createTokensService: CreateTokensService,
  ) {}

  async execute({ email }: RequestResetPasswordDto): Promise<void> {
    const token = await this.createTokensService.execute({
      uniqueIdentifier: email,
      expiresDate: addDays(new Date(), 1),
    });

    await this.sendResetPasswordEmailService.execute({ email, token });
  }
}
