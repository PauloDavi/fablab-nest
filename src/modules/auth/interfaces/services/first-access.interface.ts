import { FirstAccessDto } from '@modules/auth/dtos/first-access.dto';

export interface FirstAccessService {
  execute(props: FirstAccessDto): Promise<void>;
}
