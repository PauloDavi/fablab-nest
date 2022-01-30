import { TokenDocument } from '@modules/tokens/schemas/token.schema';
import { LeanDocument } from 'mongoose';

export interface VerifyTokensService {
  execute(token: string): Promise<LeanDocument<TokenDocument>>;
}
