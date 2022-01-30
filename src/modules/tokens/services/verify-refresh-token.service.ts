import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { VerifyRefreshTokensService } from '../interfaces/services/verify-refresh-token.interface';

@Injectable()
export class VerifyRefreshTokensServiceImp
  implements VerifyRefreshTokensService
{
  constructor(private readonly jwtService: JwtService) {}

  async execute(refreshToken: string): Promise<string> {
    const { userId } = await this.jwtService.verify(refreshToken);

    return userId;
  }
}
