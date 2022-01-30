import { AuthModule } from '@modules/auth/auth.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { createMongooseFactoryModel } from '@utils/create-mongoose-factory-model';

import { UserController } from './controllers/users.controller';
import { USERS_TYPES } from './interfaces/types';
import { User, UserSchema } from './schemas/user.schema';
import { CreateUserServiceImp } from './services/create-user.service';
import { DeleteUserServiceImp } from './services/delete-user.service';
import { FindUserServiceImp } from './services/find-user.service';
import { PaginateUsersServiceImp } from './services/paginate-users.service';
import { UpdateUserServiceImp } from './services/update-user.service';

const createUser = {
  provide: USERS_TYPES.services.CreateUserService,
  useClass: CreateUserServiceImp,
};

const findUser = {
  provide: USERS_TYPES.services.FindUserService,
  useClass: FindUserServiceImp,
};

const paginateUsersService = {
  provide: USERS_TYPES.services.PaginateUsersService,
  useClass: PaginateUsersServiceImp,
};

const updateUserService = {
  provide: USERS_TYPES.services.UpdateUserService,
  useClass: UpdateUserServiceImp,
};

const deleteUserService = {
  provide: USERS_TYPES.services.DeleteUserService,
  useClass: DeleteUserServiceImp,
};

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      createMongooseFactoryModel(User.name, UserSchema),
    ]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [
    createUser,
    findUser,
    paginateUsersService,
    updateUserService,
    deleteUserService,
  ],
  exports: [findUser],
})
export class UsersModule {}
