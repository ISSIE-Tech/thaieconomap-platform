import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { CommercialCategory } from '@thaieconomap/contracts';
import mongoose, { HydratedDocument } from 'mongoose';

import { COLLECTION_NAME } from '../../../shared/constants';
import { Location, LocationSchema } from '../../../shared/schemas';

import { Base, BaseDocument } from './base.schema';
import { ShopDisplayOpening, ShopDisplayOpeningSchema } from './shop-display-opening.schema';
import { ShopOpening, ShopOpeningSchema } from './shop-opening.schema';

export type ShopDocument = HydratedDocument<Shop>;

@Schema({
  collection: COLLECTION_NAME.shops,
  versionKey: false,
})
export class Shop {
  @Prop({ required: true, index: true })
  sourceId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: string;

  @Prop({
    required: true,
    type: LocationSchema,
    index: '2dsphere',
  })
  location: Location;

  // empty string when the owner never uploaded a photo
  @Prop()
  imageUrl: string;

  // nullable upstream
  @Prop()
  address: string;

  @Prop({ required: true })
  commercialOwner: string;

  // nullable upstream - a shop without a phone is still a real shop
  @Prop()
  phoneNumber: string;

  @Prop({
    required: true,
    ref: Base.name,
    type: mongoose.Schema.Types.ObjectId,
  })
  base: BaseDocument;

  @Prop({ required: true })
  category: CommercialCategory;

  @Prop({
    required: true,
    type: [ShopOpeningSchema],
  })
  opening: ShopOpening[];

  @Prop({
    required: true,
    type: [ShopDisplayOpeningSchema],
  })
  displayOpening: ShopDisplayOpening[];
}

export const ShopSchema = SchemaFactory.createForClass(Shop);
