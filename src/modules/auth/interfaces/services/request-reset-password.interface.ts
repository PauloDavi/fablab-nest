import { RequestResetPasswordDto } from '@modules/auth/dtos/request-reset-password.dto';

export interface RequestResetPasswordService {
  execute({ email }: RequestResetPasswordDto): Promise<void>;
}
