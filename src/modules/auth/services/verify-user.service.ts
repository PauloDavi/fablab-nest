import { ModelPaginateAndSoftDelete } from '@common/interfaces/model-paginate-and-soft-delete.interface';
import { DeleteTokensService } from '@modules/tokens/interfaces/services/delete-token.interface';
import { VerifyTokensService } from '@modules/tokens/interfaces/services/verify-token.interface';
import { TOKENS_TYPES } from '@modules/tokens/interfaces/types';
import { User, UserDocument } from '@modules/users/schemas/user.schema';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { VerifyUserService } from '../interfaces/services/verify-user.interface';

@Injectable()
export class VerifyUserServiceImp implements VerifyUserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: ModelPaginateAndSoftDelete<UserDocument>,
    @Inject(TOKENS_TYPES.services.VerifyTokensService)
    private readonly verifyTokensService: VerifyTokensService,
    @Inject(TOKENS_TYPES.services.DeleteTokensService)
    private readonly deleteTokensService: DeleteTokensService,
  ) {}

  async execute(token: string): Promise<void> {
    const { uniqueIdentifier } = await this.verifyTokensService.execute(token);

    await this.userModel.findOneAndUpdate(
      { email: uniqueIdentifier },
      {
        verified: true,
      },
    );

    await this.deleteTokensService.execute(token);
  }
}
