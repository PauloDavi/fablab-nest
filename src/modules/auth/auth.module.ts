import { MailModule } from '@modules/mail/mail.module';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { createMongooseFactoryModel } from '@utils/create-mongoose-factory-model';

import { TokensModule } from '../tokens/tokens.module';
import { User, UserSchema } from '../users/schemas/user.schema';
import { AuthController } from './controllers/auth.controller';
import { AUTH_TYPES } from './interfaces/types';
import { FirstAccessServiceImp } from './services/first-access.service';
import { LoginServiceImp } from './services/login.service';
import { RefreshTokenServiceImp } from './services/refresh-token.service';
import { RequestResetPasswordServiceImp } from './services/request-reset-password.service';
import { VerifyTokenAndResetPasswordServiceImp } from './services/verify-token-and-reset-password.service';
import { VerifyUserServiceImp } from './services/verify-user.service';

const refreshTokenService = {
  provide: AUTH_TYPES.services.RefreshTokenService,
  useClass: RefreshTokenServiceImp,
};

const loginService = {
  provide: AUTH_TYPES.services.LoginService,
  useClass: LoginServiceImp,
};

const firstAccessService = {
  provide: AUTH_TYPES.services.FirstAccessService,
  useClass: FirstAccessServiceImp,
};

const verifyTokenAndResetPasswordService = {
  provide: AUTH_TYPES.services.VerifyTokenAndResetPasswordService,
  useClass: VerifyTokenAndResetPasswordServiceImp,
};

const verifyUserService = {
  provide: AUTH_TYPES.services.VerifyUserService,
  useClass: VerifyUserServiceImp,
};

const requestResetPasswordService = {
  provide: AUTH_TYPES.services.RequestResetPasswordService,
  useClass: RequestResetPasswordServiceImp,
};

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (config: ConfigService) => ({
        secret: config.get('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: config.get('JWT_EXPIRATION_TIME'),
        },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeatureAsync([
      createMongooseFactoryModel(User.name, UserSchema),
    ]),
    MailModule,
    TokensModule,
  ],
  controllers: [AuthController],
  providers: [
    loginService,
    firstAccessService,
    verifyUserService,
    verifyTokenAndResetPasswordService,
    requestResetPasswordService,
    refreshTokenService,
  ],
  exports: [firstAccessService],
})
export class AuthModule {}
