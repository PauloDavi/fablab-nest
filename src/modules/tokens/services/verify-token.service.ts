import { ModelPaginateAndSoftDelete } from '@common/interfaces/model-paginate-and-soft-delete.interface';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isBefore } from 'date-fns';
import { LeanDocument } from 'mongoose';

import { VerifyTokensService } from '../interfaces/services/verify-token.interface';
import { Token, TokenDocument } from '../schemas/token.schema';

@Injectable()
export class VerifyTokensServiceImp implements VerifyTokensService {
  constructor(
    @InjectModel(Token.name)
    private readonly tokenModel: ModelPaginateAndSoftDelete<TokenDocument>,
  ) {}

  async execute(token: string): Promise<LeanDocument<TokenDocument>> {
    const findToken = await this.tokenModel.findOne({ token }).lean();

    if (!findToken) {
      throw new BadRequestException('Token not exists');
    }

    const tokenExpires = isBefore(new Date(findToken.expiresDate), new Date());

    if (tokenExpires) {
      await this.tokenModel.deleteOne({ token });

      throw new BadRequestException('Invalid token');
    }

    return findToken;
  }
}
