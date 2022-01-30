import { ApiProperty } from '@nestjs/swagger';

export class BadRequestResponse {
  @ApiProperty({ default: 400 })
  statusCode: number;

  @ApiProperty()
  path: string;

  @ApiProperty()
  error: string;

  @ApiProperty()
  message: string[];
}
