import { AuthObject } from '@common/interfaces/auth-object.interface';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

type DataType = 'userId' | 'email' | 'name' | 'role';

export const UserDecorator = createParamDecorator(
  (data: DataType, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const user = request.user as AuthObject;

    return data ? user?.[data] : user;
  },
);
