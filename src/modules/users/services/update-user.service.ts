import { ModelPaginateAndSoftDelete } from '@common/interfaces/model-paginate-and-soft-delete.interface';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from 'bcrypt';

import { UserReadDto } from '../dtos/user-read.dto';
import { UserUpdateDto } from '../dtos/user-update.dto';
import { UpdateUserService } from '../interfaces/services/update-user.interface';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UpdateUserServiceImp implements UpdateUserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: ModelPaginateAndSoftDelete<UserDocument>,
  ) {}

  async execute(
    id: string,
    { name, password }: UserUpdateDto,
  ): Promise<UserReadDto> {
    if (!name && !password) {
      throw new BadRequestException('There are no fields to update');
    }

    const hashPassword = password ? hash(password, 10) : undefined;

    const user = await this.userModel.findByIdAndUpdate(
      id,
      {
        name,
        password: hashPassword,
      },
      { new: true },
    );

    return user;
  }
}
