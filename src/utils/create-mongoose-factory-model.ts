/* eslint-disable @typescript-eslint/no-var-requires */
import { Token, TokenSchema } from '@modules/tokens/schemas/token.schema';
import { User, UserSchema } from '@modules/users/schemas/user.schema';
import {
  DynamicModule,
  ForwardReference,
  Provider,
  Type,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { mongoConfig } from '@test/mongo-config';
import * as mongoose from 'mongoose';
import { mongoosePagination } from 'mongoose-paginate-ts';

interface RegisterModelFactoryParams {
  imports?: Array<
    Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
  >;
  controllers?: Type<any>[];
  providers: Provider[];
}

export function createMongooseFactoryModel(
  name: string,
  schema: mongoose.Schema<any>,
) {
  return {
    name,
    useFactory: () => {
      schema.plugin(require('mongoose-autopopulate'));
      schema.plugin(require('mongoose-delete'), {
        deletedAt: true,
        deletedBy: true,
        overrideMethods: true,
      });
      schema.plugin(mongoosePagination);

      return schema;
    },
  };
}

// Precisa adicionar os Models todos aqui para funcionar os testes.
export async function registerModelFactory(params: RegisterModelFactoryParams) {
  const module: TestingModule = await Test.createTestingModule({
    imports: [
      MongooseModule.forRoot(
        `mongodb://${mongoConfig.IP}:${mongoConfig.Port}/test`,
      ),
      MongooseModule.forFeatureAsync([
        createMongooseFactoryModel(User.name, UserSchema),
        createMongooseFactoryModel(Token.name, TokenSchema),
      ]),
      ...(params.imports || []),
    ],
    controllers: params.controllers,
    providers: params.providers,
  }).compile();

  return module;
}
