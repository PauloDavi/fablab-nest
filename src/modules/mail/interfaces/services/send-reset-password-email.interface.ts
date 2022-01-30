import { SendResetPasswordEmailDto } from '@modules/mail/dtos/send-reset-password-email.dto';

export interface SendResetPasswordEmailService {
  execute(props: SendResetPasswordEmailDto): Promise<void>;
}
