import { ApiController } from '@common/decorators/api-controller.decorator';
import { ApiRouteConfig } from '@common/decorators/api-responses.decorator';
import { UserDecorator } from '@common/decorators/user.decorator';
import { AuthObject } from '@common/interfaces/auth-object.interface';
import { UserReadDto } from '@modules/users/dtos/user-read.dto';
import { Body, Inject, Param } from '@nestjs/common';

import { LoginResponseDto } from '../dtos/login-response.dto';
import { LoginDto } from '../dtos/login.dto';
import { RefreshTokenRequestDto } from '../dtos/refresh-token-request.dto';
import { RefreshTokenResponseDto } from '../dtos/refresh-token-response.dto';
import { RequestResetPasswordDto } from '../dtos/request-reset-password.dto';
import { VerifyTokenAndResetPasswordDto } from '../dtos/verify-token-and-reset-password.dto';
import { LoginService } from '../interfaces/services/login.interface';
import { RefreshTokenService } from '../interfaces/services/refresh-token.interface';
import { RequestResetPasswordService } from '../interfaces/services/request-reset-password.interface';
import { VerifyTokenAndResetPasswordService } from '../interfaces/services/verify-token-and-reset-password.interface';
import { VerifyUserService } from '../interfaces/services/verify-user.interface';
import { AUTH_TYPES } from '../interfaces/types';

@ApiController('auth', 'Auth')
export class AuthController {
  constructor(
    @Inject(AUTH_TYPES.services.RefreshTokenService)
    private readonly refreshTokenService: RefreshTokenService,
    @Inject(AUTH_TYPES.services.LoginService)
    private readonly loginService: LoginService,
    @Inject(AUTH_TYPES.services.VerifyUserService)
    private readonly verifyUserService: VerifyUserService,
    @Inject(AUTH_TYPES.services.VerifyTokenAndResetPasswordService)
    private readonly verifyTokenAndResetPasswordService: VerifyTokenAndResetPasswordService,
    @Inject(AUTH_TYPES.services.RequestResetPasswordService)
    private readonly requestResetPasswordService: RequestResetPasswordService,
  ) {}

  @ApiRouteConfig({
    method: {
      type: 'post',
      path: 'refresh-token',
    },
    summary: 'Rota de valida????o e cria????o de novo token',
    bearerAuth: false,
    apiOkResponse: {
      type: RefreshTokenResponseDto,
      description: 'Usu??rio autenticado',
    },
  })
  async createRefreshTokenService(@Body() body: RefreshTokenRequestDto) {
    return this.refreshTokenService.execute(body);
  }

  @ApiRouteConfig({
    method: {
      type: 'get',
      path: 'validate',
    },
    summary: 'Rota de valida????o de usu??rio autenticado',
    apiOkResponse: {
      type: UserReadDto,
      description: 'Usu??rio autenticado',
    },
    apiUnauthorizedResponse: {
      description: 'Token inv??lido',
    },
  })
  async validate(@UserDecorator() user: AuthObject) {
    return user;
  }

  @ApiRouteConfig({
    method: {
      type: 'post',
      path: 'login',
    },
    summary: 'Rota de login de usu??rio',
    bearerAuth: false,
    apiCreatedResponse: {
      description: 'Login success',
      type: LoginResponseDto,
    },
    apiUnauthorizedResponse: {
      description: 'Usu??rio ou senha inv??lidos',
    },
  })
  async login(@Body() loginObject: LoginDto) {
    return this.loginService.execute(loginObject);
  }

  @ApiRouteConfig({
    method: {
      type: 'patch',
      path: 'verify-user/:token',
      statusCode: 204,
    },
    summary: 'Rota publica que verifica usu??rio',
    bearerAuth: false,
    apiNoContentResponse: {
      description: 'Usu??rio verificado com sucesso',
    },
  })
  verifyUser(@Param('token') token: string) {
    return this.verifyUserService.execute(token);
  }

  @ApiRouteConfig({
    method: {
      type: 'post',
      path: 'request-reset-password',
      statusCode: 204,
    },
    summary: 'Rota publica para requisitar mudan??a de senha',
    bearerAuth: false,
    apiUnauthorizedResponse: false,
    apiNoContentResponse: {
      description: 'Email de mudan??a de senha enviado com sucesso',
    },
  })
  requestResetPassword(@Body() requestResetPassword: RequestResetPasswordDto) {
    return this.requestResetPasswordService.execute(requestResetPassword);
  }

  @ApiRouteConfig({
    method: {
      type: 'patch',
      path: 'change-password',
      statusCode: 204,
    },
    summary: 'Rota publica de mudan??a de senha',
    bearerAuth: false,
    apiUnauthorizedResponse: {
      description: 'Usu??rio n??o verificado',
    },
    apiNotFoundResponse: {
      description: 'Usu??rio n??o existe',
    },
    apiNoContentResponse: {
      description: 'Senha do usu??rio modificada com sucesso',
    },
  })
  verifyTokenAndResetPassword(
    @Body() verifyTokenAndResetPassword: VerifyTokenAndResetPasswordDto,
  ) {
    return this.verifyTokenAndResetPasswordService.execute(
      verifyTokenAndResetPassword,
    );
  }
}
