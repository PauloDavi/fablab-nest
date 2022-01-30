import { ModelPaginateAndSoftDelete } from '@common/interfaces/model-paginate-and-soft-delete.interface';
import { PaginationQueryParams } from '@common/query-params/pagination-query-params';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  createMongooseQuery,
  createSortObj,
} from '@utils/mongoose-filter-utils';

import { UserPaginationDto } from '../dtos/user-pagination.dto';
import { PaginateUsersService } from '../interfaces/services/pagination-users.interface';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class PaginateUsersServiceImp implements PaginateUsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: ModelPaginateAndSoftDelete<UserDocument>,
  ) {}

  async execute({
    page = 1,
    quantity = 10,
    search,
    sortKey = 'createdAt',
    sortValue = 'desc',
  }: PaginationQueryParams): Promise<UserPaginationDto> {
    const searchableFields = ['name', 'email', 'role'];

    const auditOrders = await this.userModel.paginate({
      page: page,
      limit: quantity,
      sort: createSortObj(sortKey, sortValue),
      query: createMongooseQuery(searchableFields, search),
    });

    return auditOrders;
  }
}
