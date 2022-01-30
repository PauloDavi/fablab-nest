import { ModelPaginateAndSoftDelete } from '@common/interfaces/model-paginate-and-soft-delete.interface';
import { FirstAccessService } from '@modules/auth/interfaces/services/first-access.interface';
import { AUTH_TYPES } from '@modules/auth/interfaces/types';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from 'bcrypt';

import { UserCreateDto } from '../dtos/user-create.dto';
import { UserReadDto } from '../dtos/user-read.dto';
import { CreateUserService } from '../interfaces/services/create-user.interface';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class CreateUserServiceImp implements CreateUserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: ModelPaginateAndSoftDelete<UserDocument>,
    @Inject(AUTH_TYPES.services.FirstAccessService)
    private readonly firstAccessService: FirstAccessService,
  ) {}

  async execute({
    password,
    email,
    name,
  }: UserCreateDto): Promise<UserReadDto> {
    const hashPassword = await hash(password, 10);

    const user = await this.userModel.create({
      email,
      name,
      password: hashPassword,
      role: 'client',
    });

    this.firstAccessService.execute({ email });

    return this.userModel.findById(user.id).lean();
  }
}
