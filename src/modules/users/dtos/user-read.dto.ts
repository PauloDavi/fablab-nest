import { ApiProperty } from '@nestjs/swagger';

import { PopulatedUserDto } from './populated-user.dto';

export class UserReadDto {
  @ApiProperty()
  _id?: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  role: string;

  @ApiProperty({ default: false })
  verified: boolean;

  @ApiProperty({ type: PopulatedUserDto })
  createdBy?: PopulatedUserDto | string;

  @ApiProperty({ type: PopulatedUserDto })
  updatedBy?: PopulatedUserDto | string;
}
