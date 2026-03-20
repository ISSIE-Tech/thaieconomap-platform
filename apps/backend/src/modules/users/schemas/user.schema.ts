import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import mongoose, { HydratedDocument } from 'mongoose';

import { District, DistrictDocument } from '../../../modules/map/schemas';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class User {
  @Prop({ required: true, unique: true })
  authId: mongoose.Schema.Types.ObjectId;

  @Prop({
    required: true,
    type: [mongoose.Schema.Types.ObjectId],
    ref: District.name,
  })
  districts: DistrictDocument[];
}

export const UserSchema = SchemaFactory.createForClass(User);
