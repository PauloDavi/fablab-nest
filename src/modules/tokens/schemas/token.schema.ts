import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type TokenDocument = Token & mongoose.Document;

@Schema({ timestamps: true })
export class Token {
  @Prop({ required: true, unique: true })
  uniqueIdentifier: string;

  @Prop({ required: true, unique: true })
  token: string;

  @Prop({ required: true })
  expiresDate: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
