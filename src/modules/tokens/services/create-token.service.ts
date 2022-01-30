import { ModelPaginateAndSoftDelete } from '@common/interfaces/model-paginate-and-soft-delete.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreateTokenDto } from '../dtos/create-token.dto';
import { CreateTokensService } from '../interfaces/services/create-token.interface';
import { Token, TokenDocument } from '../schemas/token.schema';

@Injectable()
export class CreateTokensServiceImp implements CreateTokensService {
  constructor(
    @InjectModel(Token.name)
    private readonly tokenModel: ModelPaginateAndSoftDelete<TokenDocument>,
  ) {}

  async execute({
    uniqueIdentifier,
    expiresDate,
  }: CreateTokenDto): Promise<string> {
    const tokens = await this.tokenModel.find();

    const stringTokens = tokens.map((token) => token.token);

    let token: string;
    while (true) {
      token = Math.random().toString().substring(2, 8);
      if (!stringTokens.includes(token)) {
        break;
      }
    }

    await this.tokenModel.findOneAndUpdate(
      { uniqueIdentifier },
      {
        uniqueIdentifier,
        token,
        expiresDate,
      },
      { upsert: true },
    );

    return token;
  }
}
