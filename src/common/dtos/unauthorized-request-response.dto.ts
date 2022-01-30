import { ApiProperty } from '@nestjs/swagger';

export class UnauthorizedRequestResponse {
  @ApiProperty({ default: 401 })
  statusCode: number;

  @ApiProperty()
  path: string;

  @ApiProperty()
  error: string;

  @ApiProperty()
  message: string;
}
