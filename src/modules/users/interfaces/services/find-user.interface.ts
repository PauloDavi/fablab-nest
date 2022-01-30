import { UserReadDto } from '@modules/users/dtos/user-read.dto';

export interface FindUserService {
  execute(id: string): Promise<UserReadDto>;
}
