import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type UserDocument = User & mongoose.Document;

export enum UserRoles {
  ADMIN = 'admin',
  TECHNICIAN = 'technician',
  CLIENT = 'client',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false, select: false })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: UserRoles })
  role: UserRoles;

  @Prop({ default: false })
  verified: boolean;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    autopopulate: { select: { _id: 1, name: 1 } },
  })
  createdBy: string;

  @Prop({
    required: false,
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    autopopulate: { select: { _id: 1, name: 1 } },
  })
  updatedBy: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
