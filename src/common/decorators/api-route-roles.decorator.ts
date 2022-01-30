import { SetMetadata } from '@nestjs/common';

export const ApiRouteRoles = (roles: string[]) => SetMetadata('roles', roles);
