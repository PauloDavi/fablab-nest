import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class PaginationQueryParams {
  @IsInt()
  @IsOptional()
  @Min(1)
  @Transform((value) => value && parseInt(value.value, 10))
  page?: number;

  @IsInt()
  @IsOptional()
  @Min(1)
  @Transform((value) => value && parseInt(value.value, 10))
  quantity?: number;

  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  sortKey?: string;

  @IsString()
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortValue?: string;
}
