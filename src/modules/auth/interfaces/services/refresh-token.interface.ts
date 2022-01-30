import { RefreshTokenRequestDto } from '@modules/auth/dtos/refresh-token-request.dto';
import { RefreshTokenResponseDto } from '@modules/auth/dtos/refresh-token-response.dto';

export interface RefreshTokenService {
  execute(props: RefreshTokenRequestDto): Promise<RefreshTokenResponseDto>;
}
