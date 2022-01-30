import { ApiProperty } from '@nestjs/swagger';

export class NotFoundRequestResponse {
  @ApiProperty({ default: 404 })
  statusCode: number;

  @ApiProperty()
  path: string;

  @ApiProperty()
  error: string;

  @ApiProperty()
  message: string;
}
