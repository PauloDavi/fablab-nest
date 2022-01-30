import { registerModelFactory } from '@utils/create-mongoose-factory-model';
import * as mongoose from 'mongoose';

import { CreateTokensServiceImp } from './create-token.service';
import { DeleteTokensServiceImp } from './delete-token.service';

describe('DeleteTokensService', () => {
  let service: DeleteTokensServiceImp;
  let createService: CreateTokensServiceImp;

  beforeEach(async () => {
    const module = await registerModelFactory({
      providers: [DeleteTokensServiceImp, CreateTokensServiceImp],
    });

    createService = module.get<CreateTokensServiceImp>(CreateTokensServiceImp);
    service = module.get<DeleteTokensServiceImp>(DeleteTokensServiceImp);
  });

  it('should be defined', () => {
    expect(service).toBeDefined;
  });

  it('should be able to delete a token', async () => {
    const deleteFunction = jest.spyOn(service, 'execute');

    await createService.execute({
      uniqueIdentifier: 'uniqueIdentifier',
      expires_date: new Date(),
    });

    await service.execute('uniqueIdentifier');

    expect(deleteFunction).toBeCalledTimes(1);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
});
