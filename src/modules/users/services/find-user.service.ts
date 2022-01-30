import { ModelPaginateAndSoftDelete } from '@common/interfaces/model-paginate-and-soft-delete.interface';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { UserReadDto } from '../dtos/user-read.dto';
import { FindUserService } from '../interfaces/services/find-user.interface';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class FindUserServiceImp implements FindUserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: ModelPaginateAndSoftDelete<UserDocument>,
  ) {}

  async execute(id: string): Promise<UserReadDto> {
    const user = await this.userModel.findById(id).lean();

    if (!user) {
      throw new NotFoundException('Usuário não existe');
    }

    return user;
  }
}
