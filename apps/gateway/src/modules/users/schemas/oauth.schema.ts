import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

import { OauthProvider } from '../../../shared/enums';

export type OauthDocument = HydratedDocument<Oauth>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Oauth {
  @Prop({ type: String, required: true, enum: OauthProvider })
  provider: string;

  @Prop({ required: true })
  sub: string;
}

export const OauthSchema = SchemaFactory.createForClass(Oauth);
