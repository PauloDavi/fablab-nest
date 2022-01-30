import { BadRequestResponse } from '@common/dtos/bad-request-response.dto';
import { UnauthorizedRequestResponse } from '@common/dtos/unauthorized-request-response.dto';
import { applyDecorators } from '@nestjs/common';
import { Get, Post, Put, Patch, Delete, HttpCode } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiResponseOptions,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
  ApiQueryOptions,
} from '@nestjs/swagger';

import { ApiQueryPagination } from './api-query-pagination.decorator';
import { ApiRouteRoles } from './api-route-roles.decorator';
import { IsPublic } from './is-public.decorator';

interface ApiResponsesProps {
  method: {
    type: 'get' | 'post' | 'put' | 'patch' | 'delete';
    statusCode?: number;
    path?: string | string[];
  };
  summary?: string;
  bearerAuth?: boolean;
  roles?: string[];
  queries?: boolean | ApiQueryOptions[];
  apiOkResponse?: ApiResponseOptions;
  apiCreatedResponse?: ApiResponseOptions;
  apiNoContentResponse?: ApiResponseOptions;
  apiBadRequestResponse?: ApiResponseOptions | boolean;
  apiForbiddenResponse?: ApiResponseOptions;
  apiNotFoundResponse?: ApiResponseOptions;
  apiUnauthorizedResponse?: ApiResponseOptions | boolean;
}

export function ApiRouteConfig({
  method,
  summary,
  bearerAuth = true,
  roles,
  queries = false,
  apiOkResponse,
  apiCreatedResponse,
  apiNoContentResponse,
  apiBadRequestResponse = true,
  apiForbiddenResponse,
  apiNotFoundResponse,
  apiUnauthorizedResponse = true,
}: ApiResponsesProps) {
  const decorators: (ClassDecorator | MethodDecorator | PropertyDecorator)[] =
    [];

  switch (method.type) {
    case 'get':
      {
        decorators.push(Get(method.path));
        decorators.push(HttpCode(method.statusCode || 200));
      }
      break;
    case 'post':
      {
        decorators.push(Post(method.path));
        decorators.push(HttpCode(method.statusCode || 201));
      }
      break;
    case 'put':
      {
        decorators.push(Put(method.path));
        decorators.push(HttpCode(method.statusCode || 200));
      }
      break;
    case 'patch':
      {
        decorators.push(Patch(method.path));
        decorators.push(HttpCode(method.statusCode || 200));
      }
      break;
    case 'delete':
      {
        decorators.push(Delete(method.path));
        decorators.push(HttpCode(method.statusCode || 204));
      }
      break;
  }

  if (summary) {
    decorators.push(ApiOperation({ summary }));
  }
  if (bearerAuth) {
    decorators.push(ApiBearerAuth('access-token'));
  } else {
    decorators.push(IsPublic());
  }
  if (roles) {
    decorators.push(ApiRouteRoles(roles));
  }
  if (queries) {
    if (typeof queries === 'boolean') {
      decorators.push(ApiQueryPagination());
    } else {
      decorators.push(ApiQueryPagination(queries));
    }
  }

  if (apiOkResponse) {
    decorators.push(ApiOkResponse(apiOkResponse));
  }
  if (apiCreatedResponse) {
    decorators.push(ApiCreatedResponse(apiCreatedResponse));
  }
  if (apiNoContentResponse) {
    decorators.push(ApiNoContentResponse(apiNoContentResponse));
  }
  if (apiBadRequestResponse) {
    if (typeof apiBadRequestResponse === 'boolean') {
      decorators.push(
        ApiBadRequestResponse({
          type: BadRequestResponse,
          description: 'Corpo da requisição inválido',
        }),
      );
    } else {
      decorators.push(ApiBadRequestResponse(apiBadRequestResponse));
    }
  }
  if (apiForbiddenResponse) {
    decorators.push(ApiForbiddenResponse(apiForbiddenResponse));
  }
  if (apiUnauthorizedResponse) {
    if (typeof apiUnauthorizedResponse === 'boolean') {
      decorators.push(
        ApiUnauthorizedResponse({
          type: UnauthorizedRequestResponse,
          description: 'Usuário deve estar autenticado',
        }),
      );
    } else {
      decorators.push(ApiUnauthorizedResponse(apiUnauthorizedResponse));
    }
  }
  if (apiNotFoundResponse) {
    decorators.push(ApiNotFoundResponse(apiNotFoundResponse));
  }

  return applyDecorators(...decorators);
}
