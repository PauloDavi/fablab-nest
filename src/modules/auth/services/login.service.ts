import { ModelPaginateAndSoftDelete } from '@common/interfaces/model-paginate-and-soft-delete.interface';
import { User, UserDocument } from '@modules/users/schemas/user.schema';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { compare } from 'bcrypt';

import { LoginResponseDto } from '../dtos/login-response.dto';
import { LoginDto } from '../dtos/login.dto';
import { LoginService } from '../interfaces/services/login.interface';

@Injectable()
export class LoginServiceImp implements LoginService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: ModelPaginateAndSoftDelete<UserDocument>,
    private readonly jwtService: JwtService,
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

    const payload = {
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    delete user.password;

    return {
      user: userWithoutPassword,
      token: this.jwtService.sign(payload),
    };
  }
}
