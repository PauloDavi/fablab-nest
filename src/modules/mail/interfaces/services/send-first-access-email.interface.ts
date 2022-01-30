import { SendFirstAccessEmailDto } from '@modules/mail/dtos/send-first-access-email.dto';

export interface SendFirstAccessEmailService {
  execute(props: SendFirstAccessEmailDto): Promise<void>;
}
