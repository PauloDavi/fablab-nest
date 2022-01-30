import { VerifyTokenAndResetPasswordDto } from '@modules/auth/dtos/verify-token-and-reset-password.dto';

export interface VerifyTokenAndResetPasswordService {
  execute(props: VerifyTokenAndResetPasswordDto): Promise<void>;
}
