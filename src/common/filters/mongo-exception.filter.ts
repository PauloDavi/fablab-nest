import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { MongoServerError, MongoError } from 'mongodb';

@Catch(MongoServerError, MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoServerError, host: ArgumentsHost) {
    console.log('mongo', exception);

    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();

    return {
      statusCode: 500,
      path: request.url,
      name: exception.name,
      message: exception.message,
    };
  }
}
