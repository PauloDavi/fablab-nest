import { ModelPaginateAndSoftDelete } from '@common/interfaces/model-paginate-and-soft-delete.interface';
import { CreateRefreshTokensService } from '@modules/tokens/interfaces/services/create-refresh-token.interface';
import { DeleteTokensService } from '@modules/tokens/interfaces/services/delete-token.interface';
import { VerifyRefreshTokensService } from '@modules/tokens/interfaces/services/verify-refresh-token.interface';
import { VerifyTokensService } from '@modules/tokens/interfaces/services/verify-token.interface';
import { TOKENS_TYPES } from '@modules/tokens/interfaces/types';
import { User, UserDocument } from '@modules/users/schemas/user.schema';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { addDays } from 'date-fns';

import { RefreshTokenRequestDto } from '../dtos/refresh-token-request.dto';
import { RefreshTokenResponseDto } from '../dtos/refresh-token-response.dto';
import { RefreshTokenService } from '../interfaces/services/refresh-token.interface';

@Injectable()
export class RefreshTokenServiceImp implements RefreshTokenService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: ModelPaginateAndSoftDelete<UserDocument>,
    private readonly jwtService: JwtService,
    @Inject(TOKENS_TYPES.services.VerifyRefreshTokensService)
    private readonly verifyRefreshTokensService: VerifyRefreshTokensService,
    @Inject(TOKENS_TYPES.services.CreateRefreshTokensService)
    private readonly createRefreshTokensService: CreateRefreshTokensService,
    @Inject(TOKENS_TYPES.services.VerifyTokensService)
    private readonly verifyTokensService: VerifyTokensService,
    @Inject(TOKENS_TYPES.services.DeleteTokensService)
    private readonly deleteTokensService: DeleteTokensService,
  ) {}

  async execute({
    refreshToken,
  }: RefreshTokenRequestDto): Promise<RefreshTokenResponseDto> {
    const userId = await this.verifyRefreshTokensService.execute(refreshToken);

    const userToken = await this.verifyTokensService.execute(refreshToken);

    if (!userToken) {
      throw new BadRequestException('Refresh token does not exists');
    }

    await this.deleteTokensService.execute(userToken.id);

    const newRefreshToken = await this.createRefreshTokensService.execute({
      userId,
      expiresDate: addDays(new Date(), 30),
    });

    const user = await this.userModel.findById(userId);

    const payload = {
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return {
      token: this.jwtService.sign(payload),
      refreshToken: newRefreshToken,
    };
  }
}
