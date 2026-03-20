import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

import { UserRole } from '../../../shared/enums';

export type RolesDocument = HydratedDocument<Roles>;

@Schema({
  _id: false,
  versionKey: false,
})
export class Roles {
  @Prop()
  TEC: UserRole;

  @Prop()
  CSC: UserRole;
}

export const RolesSchema = SchemaFactory.createForClass(Roles);
