import { PaginationQueryParams } from '@common/query-params/pagination-query-params';
import { UserPaginationDto } from '@modules/users/dtos/user-pagination.dto';

export interface PaginateUsersService {
  execute(params: PaginationQueryParams): Promise<UserPaginationDto>;
}
