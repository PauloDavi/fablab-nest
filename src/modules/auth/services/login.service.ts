import { ModelPaginateAndSoftDelete } from '@common/interfaces/model-paginate-and-soft-delete.interface';
import { CreateRefreshTokensService } from '@modules/tokens/interfaces/services/create-refresh-token.interface';
import { TOKENS_TYPES } from '@modules/tokens/interfaces/types';
import { User, UserDocument } from '@modules/users/schemas/user.schema';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { compare } from 'bcrypt';
import { addDays } from 'date-fns';

import { LoginResponseDto } from '../dtos/login-response.dto';
import { LoginDto } from '../dtos/login.dto';
import { LoginService } from '../interfaces/services/login.interface';

@Injectable()
export class LoginServiceImp implements LoginService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: ModelPaginateAndSoftDelete<UserDocument>,
    private readonly jwtService: JwtService,
    @Inject(TOKENS_TYPES.services.CreateRefreshTokensService)
    private readonly createRefreshTokensService: CreateRefreshTokensService,
  ) {}

  async execute({ email, password }: LoginDto): Promise<LoginResponseDto> {
    const user = await this.userModel
      .findOne({ email })
      .select('+password')
      .lean();

    if (!user) {
      throw new UnauthorizedException('Email or password invalid');
    }

    if (!user.verified) {
      throw new UnauthorizedException('Email not verified');
    }

    const { password: userPassword, ...userWithoutPassword } = user;

    const passwordIsValid = await compare(password, userPassword);

    if (!passwordIsValid) {
      throw new UnauthorizedException('Email or password invalid');
    }

    const refreshToken = await this.createRefreshTokensService.execute({
      userId: user._id,
      expiresDate: addDays(new Date(), 30),
    });

    const payload = {
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    delete user.password;

    return {
      user: userWithoutPassword,
      refreshToken,
      token: this.jwtService.sign(payload),
    };
  }
}
