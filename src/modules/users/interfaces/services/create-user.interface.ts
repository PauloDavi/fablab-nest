import { UserCreateDto } from '@modules/users/dtos/user-create.dto';
import { UserReadDto } from '@modules/users/dtos/user-read.dto';

export interface CreateUserService {
  execute(props: UserCreateDto): Promise<UserReadDto>;
}
