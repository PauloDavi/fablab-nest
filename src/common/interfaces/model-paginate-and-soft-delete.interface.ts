import { Document } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';
import { Pagination } from 'mongoose-paginate-ts';

export type ModelPaginateAndSoftDelete<T extends Document<any, any>> =
  SoftDeleteModel<T> & Pagination<T>;
