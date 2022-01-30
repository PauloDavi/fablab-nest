import { UserReadDto } from '@modules/users/dtos/user-read.dto';
import { UserUpdateDto } from '@modules/users/dtos/user-update.dto';

export interface UpdateUserService {
  execute(id: string, data: UserUpdateDto): Promise<UserReadDto>;
}
