import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { HydratedDocument } from 'mongoose';

import { UserRole } from '../../../shared/enums';

import { Oauth, OauthDocument } from './oauth.schema';
import { RolesDocument, RolesSchema } from './user-roles.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class User {
  @Prop({ required: true, unique: true })
  shortId: string

  @Prop({
    default: ''
  })
  name: string;

  @Prop({ required: true })
  displayName: string;

  @Prop()
  email?: string;

  @Prop()
  phone?: string;

  @Prop({ required: true })
  profileImageUrl: string;

  @Prop()
  dateOfBirth?: Date;

  @Prop({
    type: RolesSchema,
    required: true,
    default: {
      TEC: UserRole.CUSTOMER,
      CSC: UserRole.CUSTOMER,
    },
  })
  roles: RolesDocument;

  // sha256 hashes, one per signed-in device
  @Prop({ type: [String], default: undefined })
  refreshToken?: string[];

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: Oauth.name })
  oauth: OauthDocument;
}

export const UserSchema = SchemaFactory.createForClass(User);
