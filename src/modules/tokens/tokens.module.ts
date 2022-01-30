import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { createMongooseFactoryModel } from '@utils/create-mongoose-factory-model';

import { TOKENS_TYPES } from './interfaces/types';
import { Token, TokenSchema } from './schemas/token.schema';
import { CreateRefreshTokensServiceImp } from './services/create-refresh-token.service';
import { CreateTokensServiceImp } from './services/create-token.service';
import { DeleteTokensServiceImp } from './services/delete-token.service';
import { VerifyRefreshTokensServiceImp } from './services/verify-refresh-token.service';
import { VerifyTokensServiceImp } from './services/verify-token.service';

const verifyRefreshTokens = {
  provide: TOKENS_TYPES.services.VerifyRefreshTokensService,
  useClass: VerifyRefreshTokensServiceImp,
};

const createRefreshTokens = {
  provide: TOKENS_TYPES.services.CreateRefreshTokensService,
  useClass: CreateRefreshTokensServiceImp,
};

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
    JwtModule.registerAsync({
      useFactory: async (config: ConfigService) => ({
        secret: config.get('REFRESH_JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: config.get('REFRESH_JWT_EXPIRATION_TIME'),
        },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeatureAsync([
      createMongooseFactoryModel(Token.name, TokenSchema),
    ]),
  ],
  providers: [
    createTokens,
    verifyTokens,
    deleteTokens,
    createRefreshTokens,
    verifyRefreshTokens,
  ],
  exports: [
    createTokens,
    verifyTokens,
    deleteTokens,
    createRefreshTokens,
    verifyRefreshTokens,
  ],
})
export class TokensModule {}
