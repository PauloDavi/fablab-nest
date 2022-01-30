import { ModelPaginateAndSoftDelete } from '@common/interfaces/model-paginate-and-soft-delete.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { DeleteUserService } from '../interfaces/services/delete-user.interface';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class DeleteUserServiceImp implements DeleteUserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: ModelPaginateAndSoftDelete<UserDocument>,
  ) {}

  async execute(id: string): Promise<void> {
    await this.userModel.deleteById(id);
  }
}
