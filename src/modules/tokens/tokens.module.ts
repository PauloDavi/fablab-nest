import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { createMongooseFactoryModel } from '@utils/create-mongoose-factory-model';

import { TOKENS_TYPES } from './interfaces/types';
import { Token, TokenSchema } from './schemas/token.schema';
import { CreateTokensServiceImp } from './services/create-token.service';
import { DeleteTokensServiceImp } from './services/delete-token.service';
import { VerifyTokensServiceImp } from './services/verify-token.service';

const createTokens = {
  provide: TOKENS_TYPES.services.CreateTokensService,
  useClass: CreateTokensServiceImp,
};

const verifyTokens = {
  provide: TOKENS_TYPES.services.VerifyTokensService,
  useClass: VerifyTokensServiceImp,
};

const deleteTokens = {
  provide: TOKENS_TYPES.services.DeleteTokensService,
  useClass: DeleteTokensServiceImp,
};

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      createMongooseFactoryModel(Token.name, TokenSchema),
    ]),
  ],
  providers: [createTokens, verifyTokens, deleteTokens],
  exports: [createTokens, verifyTokens, deleteTokens],
})
export class TokensModule {}
