import { LoginResponseDto } from '@modules/auth/dtos/login-response.dto';
import { LoginDto } from '@modules/auth/dtos/login.dto';

export interface LoginService {
  execute(props: LoginDto): Promise<LoginResponseDto>;
}
