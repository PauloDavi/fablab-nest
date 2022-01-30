import { UserReadDto } from '@modules/users/dtos/user-read.dto';
import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty()
  token: string;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  user: UserReadDto;
}
