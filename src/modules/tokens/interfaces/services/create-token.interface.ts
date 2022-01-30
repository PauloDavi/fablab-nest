import { CreateTokenDto } from '@modules/tokens/dtos/create-token.dto';

export interface CreateTokensService {
  execute(props: CreateTokenDto): Promise<string>;
}
