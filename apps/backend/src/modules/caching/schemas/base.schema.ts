import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

import { COLLECTION_NAME } from '../../../shared/constants';
import { Location, LocationSchema } from '../../../shared/schemas';

import { BotInfo, BotInfoSchema } from './bot-info.schema';

export type BaseDocument = HydratedDocument<Base>;

@Schema({
  collection: COLLECTION_NAME.bases,
  versionKey: false,
})
export class Base {
  @Prop({ required: true, index: true })
  sourceId: string;

  // nullable upstream
  @Prop()
  name: string;

  // null until the node has a tamsang_tamsong LINE channel configured
  @Prop({ type: BotInfoSchema })
  botInfo: BotInfo;

  // centre of the service area, null until the node has a home location set
  @Prop({ type: LocationSchema, index: '2dsphere' })
  location: Location | null;

  // 0 = service disabled
  @Prop()
  serviceRadiusKm: number;
}

export const BaseSchema = SchemaFactory.createForClass(Base);
