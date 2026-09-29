import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';

import { COLLECTION_NAME } from '../../../shared/constants';

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
}

export const BaseSchema = SchemaFactory.createForClass(Base);
