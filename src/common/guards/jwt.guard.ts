import { IS_PUBLIC_KEY } from '@common/decorators/is-public.decorator';
import { AuthRequest } from '@common/interfaces/auth-request.interface';
import { FindUserService } from '@modules/users/interfaces/services/find-user.interface';
import { USERS_TYPES } from '@modules/users/interfaces/types';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @Inject(USERS_TYPES.services.FindUserService)
    private readonly findUserService: FindUserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthRequest>();

    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Token não enviado');
    }

    const [, token] = authHeader.split(' ');

    try {
      this.jwtService.verify(token, this.configService.get('JWT_SECRET_KEY'));

      const decoded = this.jwtService.decode(token, { complete: true });

      if (typeof decoded === 'string') {
        throw new UnauthorizedException('Token inválido');
      }

      const { userId, name, email, role } = decoded.payload;

      const user = await this.findUserService.execute(userId);

      if (!user) {
        throw new UnauthorizedException('Token inválido');
      }

      request.user = { userId, name, email, role };

      return true;
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }
}
