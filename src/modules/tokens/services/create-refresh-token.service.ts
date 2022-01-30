import { ModelPaginateAndSoftDelete } from '@common/interfaces/model-paginate-and-soft-delete.interface';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';

import { CreateRefreshTokenDto } from '../dtos/create-refresh-token.dto';
import { CreateRefreshTokensService } from '../interfaces/services/create-refresh-token.interface';
import { Token, TokenDocument } from '../schemas/token.schema';

@Injectable()
export class CreateRefreshTokensServiceImp
  implements CreateRefreshTokensService
{
  constructor(
    @InjectModel(Token.name)
    private readonly tokenModel: ModelPaginateAndSoftDelete<TokenDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async execute({
    userId,
    expiresDate,
  }: CreateRefreshTokenDto): Promise<string> {
    const refreshToken = this.jwtService.sign({ userId });

    await this.tokenModel.findOneAndUpdate(
      { uniqueIdentifier: userId },
      {
        uniqueIdentifier: userId,
        token: refreshToken,
        expiresDate,
      },
      { upsert: true },
    );

    return refreshToken;
  }
}
