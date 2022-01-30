import { ModelPaginateAndSoftDelete } from '@common/interfaces/model-paginate-and-soft-delete.interface';
import { DeleteTokensService } from '@modules/tokens/interfaces/services/delete-token.interface';
import { VerifyTokensService } from '@modules/tokens/interfaces/services/verify-token.interface';
import { TOKENS_TYPES } from '@modules/tokens/interfaces/types';
import { User, UserDocument } from '@modules/users/schemas/user.schema';
import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from 'bcrypt';

import { VerifyTokenAndResetPasswordDto } from '../dtos/verify-token-and-reset-password.dto';
import { VerifyTokenAndResetPasswordService } from '../interfaces/services/verify-token-and-reset-password.interface';

@Injectable()
export class VerifyTokenAndResetPasswordServiceImp
  implements VerifyTokenAndResetPasswordService
{
  constructor(
    @InjectModel(User.name)
    private readonly userModel: ModelPaginateAndSoftDelete<UserDocument>,
    @Inject(TOKENS_TYPES.services.VerifyTokensService)
    private readonly verifyTokensService: VerifyTokensService,
    @Inject(TOKENS_TYPES.services.DeleteTokensService)
    private readonly deleteTokensService: DeleteTokensService,
  ) {}

  async execute({
    token,
    password,
  }: VerifyTokenAndResetPasswordDto): Promise<void> {
    const { uniqueIdentifier } = await this.verifyTokensService.execute(token);

    const user = await this.userModel.findOne({ email: uniqueIdentifier });

    if (!user) {
      await this.deleteTokensService.execute(token);

      throw new NotFoundException('User not exist');
    }

    if (!user.verified) {
      await this.deleteTokensService.execute(token);

      throw new UnauthorizedException('User not verified');
    }

    const hashedPassword = await hash(password, 10);

    await this.userModel.findOneAndUpdate(
      { email: uniqueIdentifier },
      {
        password: hashedPassword,
      },
    );

    await this.deleteTokensService.execute(token);
  }
}
