import { applyDecorators } from '@nestjs/common';
import { ApiQuery, ApiQueryOptions } from '@nestjs/swagger';

export function ApiQueryPagination(customQueries?: ApiQueryOptions[]) {
  const queries = customQueries
    ? customQueries.map((query) => ApiQuery(query))
    : [];

  return applyDecorators(
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      example: 1,
    }),
    ApiQuery({
      name: 'quantity',
      required: false,
      type: Number,
      example: 10,
    }),
    ApiQuery({
      name: 'search',
      required: false,
      type: String,
    }),
    ApiQuery({
      name: 'sortKey',
      required: false,
      type: String,
      example: 'createdAt',
    }),
    ApiQuery({
      name: 'sortValue',
      required: false,
      type: String,
      enum: ['asc', 'desc'],
    }),
    ...queries,
  );
}
