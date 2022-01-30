import { CreateRefreshTokenDto } from '@modules/tokens/dtos/create-refresh-token.dto';

export interface CreateRefreshTokensService {
  execute(props: CreateRefreshTokenDto): Promise<string>;
}
