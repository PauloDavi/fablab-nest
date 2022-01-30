import { applyDecorators, Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

export function ApiController(controllerName: string, tagName: string) {
  return applyDecorators(
    ApiTags(tagName || controllerName),
    Controller(controllerName),
  );
}
