import { Test, TestingModule } from '@nestjs/testing';

import { version } from '../package.json';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();
  });

  describe('getHeathCheck', () => {
    it('should return "OK!"', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.getHeathCheck()).toBe(version);
    });
  });
});
