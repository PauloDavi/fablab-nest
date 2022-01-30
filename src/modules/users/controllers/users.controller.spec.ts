import { registerModelFactory } from '@utils/create-mongoose-factory-model';
import { closeInMongodConnection } from '@utils/mongoose-test-module';

import { UserCreateDto } from '../dtos/user-create.dto';
import { CreateUserServiceImp } from '../services/create-user.service';
import { FindUserServiceImp } from '../services/find-user.service';
import { UserController } from './users.controller';

const defaultUser = {
  name: 'TESTE',
  email: 'user@user.com',
  password: '123455',
} as UserCreateDto;

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module = await registerModelFactory({
      controllers: [UserController],
      providers: [FindUserServiceImp, CreateUserServiceImp],
    });
    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be create a user', async () => {
    const user = await controller.create(defaultUser);

    expect(user).toHaveProperty('_id');
  });

  // it('should be find one user', async () => {
  //   const user = await controller.create(defaultUser, userId);

  //   const findUser = await controller.findOne(user._id, userCompanies);

  //   expect(findUser).toHaveProperty('_id');
  // });

  // it('should be find all user', async () => {
  //   await controller.create(defaultUser, userId);

  //   await controller.create(
  //     { ...defaultUser, email: 'teste@teste.com.br' },
  //     userId,
  //   );

  //   const findAllUser = await controller.findAll({}, userCompanies);

  //   expect(findAllUser.docs).toBeDefined();
  //   expect(findAllUser.docs.length).toEqual(2);
  // });

  // it('should update a user', async () => {
  //   const user = await controller.create(defaultUser, userId);
  //   const updatedUser = await controller.update(
  //     user._id,
  //     { name: '123' },
  //     userId,
  //   );
  //   expect(updatedUser.name).toEqual('123');
  // });

  // it('should delete a user', async () => {
  //   const user = await controller.create(defaultUser, userId);
  //   const deleted = await controller.delete(user._id, userId);
  //   const found = await controller.findOne(user._id, userCompanies);

  //   expect(found).toEqual(null);
  //   expect(deleted).toHaveProperty('ok');
  //   expect(deleted['ok']).toEqual(1);
  // });

  afterEach(async (done) => {
    await closeInMongodConnection();
    done();
  });
});
