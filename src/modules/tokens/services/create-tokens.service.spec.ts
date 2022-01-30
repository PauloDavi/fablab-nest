import { registerModelFactory } from '@utils/create-mongoose-factory-model';
import * as mongoose from 'mongoose';

import { CreateTokensServiceImp } from './create-token.service';

describe('CreateTokensService', () => {
  let service: CreateTokensServiceImp;

  beforeEach(async () => {
    const module = await registerModelFactory({
      providers: [CreateTokensServiceImp],
    });

    service = module.get<CreateTokensServiceImp>(CreateTokensServiceImp);
  });

  it('should be defined', () => {
    expect(service).toBeDefined;
  });

  it('should be able to create a token', async () => {
    const token = await service.execute({
      uniqueIdentifier: 'uniqueIdentifier',
      expiresDate: new Date(),
    });

    expect(token.length).toEqual(6);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
});
