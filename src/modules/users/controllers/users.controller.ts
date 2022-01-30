import { ApiController } from '@common/decorators/api-controller.decorator';
import { ApiRouteConfig } from '@common/decorators/api-responses.decorator';
import { UserDecorator } from '@common/decorators/user.decorator';
import { NotFoundRequestResponse } from '@common/dtos/not-found-request-response.dto';
import { PaginationQueryParams } from '@common/query-params/pagination-query-params';
import { Body, Inject, Param, Query } from '@nestjs/common';

import { UserCreateDto } from '../dtos/user-create.dto';
import { UserPaginationDto } from '../dtos/user-pagination.dto';
import { UserReadDto } from '../dtos/user-read.dto';
import { UserUpdateDto } from '../dtos/user-update.dto';
import { CreateUserService } from '../interfaces/services/create-user.interface';
import { DeleteUserService } from '../interfaces/services/delete-user.interface';
import { FindUserService } from '../interfaces/services/find-user.interface';
import { PaginateUsersService } from '../interfaces/services/pagination-users.interface';
import { UpdateUserService } from '../interfaces/services/update-user.interface';
import { USERS_TYPES } from '../interfaces/types';

@ApiController('users', 'Users')
export class UserController {
  constructor(
    @Inject(USERS_TYPES.services.CreateUserService)
    private readonly createUserService: CreateUserService,
    @Inject(USERS_TYPES.services.FindUserService)
    private readonly findUserService: FindUserService,
    @Inject(USERS_TYPES.services.PaginateUsersService)
    private readonly paginateUsersService: PaginateUsersService,
    @Inject(USERS_TYPES.services.UpdateUserService)
    private readonly updateUserService: UpdateUserService,
    @Inject(USERS_TYPES.services.DeleteUserService)
    private readonly deleteUserService: DeleteUserService,
  ) {}

  @ApiRouteConfig({
    method: {
      type: 'post',
    },
    summary: 'Rota de criação de usuário',
    bearerAuth: false,
    apiCreatedResponse: {
      type: UserReadDto,
      description: 'Usuário criado',
    },
  })
  create(@Body() newUser: UserCreateDto) {
    return this.createUserService.execute(newUser);
  }

  @ApiRouteConfig({
    method: {
      type: 'get',
      path: ':id',
    },
    summary: 'Rota retorna um usuário',
    roles: ['admin'],
    apiOkResponse: {
      type: UserReadDto,
      description: 'Usuário encontrado',
    },
    apiBadRequestResponse: false,
    apiNotFoundResponse: {
      type: NotFoundRequestResponse,
      description: 'Usuário não existe',
    },
  })
  find(@Param('id') id: string) {
    return this.findUserService.execute(id);
  }

  @ApiRouteConfig({
    method: {
      type: 'get',
    },
    summary: 'Rota retorna os usuários paginados',
    roles: ['admin'],
    queries: true,
    apiOkResponse: {
      type: UserPaginationDto,
      description: 'Usuários paginados',
    },
  })
  findAll(@Query() params: PaginationQueryParams) {
    return this.paginateUsersService.execute(params);
  }

  @ApiRouteConfig({
    method: {
      type: 'put',
    },
    summary: 'Rota de atualização do usuário autenticado',
    apiOkResponse: {
      type: UserReadDto,
      description: 'Usuário atualizado',
    },
  })
  update(@UserDecorator('userId') userId: string, @Body() body: UserUpdateDto) {
    return this.updateUserService.execute(userId, body);
  }

  @ApiRouteConfig({
    method: {
      type: 'delete',
    },
    summary: 'Rota de delete do usuário autenticado',
    apiNoContentResponse: {
      description: 'Usuário deletado',
    },
  })
  delete(@UserDecorator('userId') userId: string) {
    return this.deleteUserService.execute(userId);
  }
}
