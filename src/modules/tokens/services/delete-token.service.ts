import { ModelPaginateAndSoftDelete } from '@common/interfaces/model-paginate-and-soft-delete.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { DeleteTokensService } from '../interfaces/services/delete-token.interface';
import { Token, TokenDocument } from '../schemas/token.schema';

@Injectable()
export class DeleteTokensServiceImp implements DeleteTokensService {
  constructor(
    @InjectModel(Token.name)
    private readonly tokenModel: ModelPaginateAndSoftDelete<TokenDocument>,
  ) {}

  async execute(uniqueIdentifierOrToken: string): Promise<void> {
    await this.tokenModel.deleteOne({
      $or: [
        {
          uniqueIdentifier: uniqueIdentifierOrToken,
        },
        {
          token: uniqueIdentifierOrToken,
        },
      ],
    });
  }
}
