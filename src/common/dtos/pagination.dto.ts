/* eslint-disable @typescript-eslint/ban-types */
import { ApiProperty } from '@nestjs/swagger';

export class PaginateDto {
  @ApiProperty()
  totalDocs?: number;

  @ApiProperty()
  limit?: number;

  @ApiProperty()
  totalPages?: number;

  @ApiProperty()
  page?: number;

  @ApiProperty()
  pagingCounter?: number;

  @ApiProperty()
  hasPrevPage?: Boolean;

  @ApiProperty()
  hasNextPage?: Boolean;

  @ApiProperty()
  prevPage?: number;

  @ApiProperty()
  nextPage?: number;

  @ApiProperty()
  hasMore?: Boolean;
}
