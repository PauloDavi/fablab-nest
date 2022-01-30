import { MongoExceptionFilter } from '@common/filters/mongo-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';
import * as compression from 'compression';
import helmet from 'helmet';

import { version } from '../package.json';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const port = configService.get('PORT');

  const config = new DocumentBuilder()
    .setTitle('FABLAB Api')
    .setVersion(version)
    .setDescription('API to administration FABLAB')
    .addServer(`http://localhost:${port}/`)
    .addBearerAuth(
      {
        in: 'header',
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Set token with out "Bearer"',
      },
      'access-token',
    )
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey, methodKey) => methodKey,
  };

  const document = SwaggerModule.createDocument(app, config, options);

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
    },
    customSiteTitle: 'FABLAB - Swagger',
  });

  app.enableCors();
  app.use(compression());
  app.use(helmet());

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalFilters(new MongoExceptionFilter());

  await app.listen(port, () => {
    console.log(`api run in port ${port}`);
  });
}

bootstrap();
