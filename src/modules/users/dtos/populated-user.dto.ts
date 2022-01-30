import { ApiProperty } from '@nestjs/swagger';

export class PopulatedUserDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;
}
