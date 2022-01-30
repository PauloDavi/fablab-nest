import { BadRequestException } from '@nestjs/common';
import { registerModelFactory } from '@utils/create-mongoose-factory-model';
import { addDays, subDays } from 'date-fns';
import * as mongoose from 'mongoose';

import { CreateTokensServiceImp } from './create-token.service';
import { VerifyTokensServiceImp } from './verify-token.service';

describe('VerifyTokensService', () => {
  let service: VerifyTokensServiceImp;
  let createService: CreateTokensServiceImp;

  beforeEach(async () => {
    const module = await registerModelFactory({
      providers: [VerifyTokensServiceImp, CreateTokensServiceImp],
    });

    createService = module.get<CreateTokensServiceImp>(CreateTokensServiceImp);
    service = module.get<VerifyTokensServiceImp>(VerifyTokensServiceImp);
  });

  it('should be defined', () => {
    expect(service).toBeDefined;
  });

  it('should be able to verify a token', async () => {
    const createdToken = await createService.execute({
      uniqueIdentifier: 'uniqueIdentifier',
      expires_date: addDays(new Date(), 1),
    });

    const token = await service.execute(createdToken);

    expect(token).toHaveProperty('_id');
  });

  it('should not be able to verify an nonexistent token', async () => {
    await expect(service.execute('fakeToken')).rejects.toThrow(
      new BadRequestException('Token not exists'),
    );
  });

  it('should not be able to verify a expires token', async () => {
    const createdToken = await createService.execute({
      uniqueIdentifier: 'uniqueIdentifier',
      expires_date: subDays(new Date(), 1),
    });

    await expect(service.execute(createdToken)).rejects.toThrow(
      new BadRequestException('Invalid token'),
    );
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
});
