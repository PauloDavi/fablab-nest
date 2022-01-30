import { PaginateDto } from '@common/dtos/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';

import { UserReadDto } from './user-read.dto';

export class UserPaginationDto extends PaginateDto {
  @ApiProperty({
    type: () => [UserReadDto],
  })
  docs: UserReadDto[];
}
