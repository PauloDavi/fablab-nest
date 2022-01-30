import { ApiRouteConfig } from '@common/decorators/api-responses.decorator';
import { Controller } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiRouteConfig({
    method: {
      type: 'get',
    },
    summary: 'Rota para verificar versão da API',
    bearerAuth: false,
    apiOkResponse: { description: 'Retorna versão atual da API', type: String },
  })
  getHeathCheck() {
    return this.appService.heathCheck();
  }
}
