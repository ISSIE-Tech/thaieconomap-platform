import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type WageUnitDocument = HydratedDocument<WageUnit>;

@Schema({
  collection: 'wage_units',
})
export class WageUnit {
  @Prop()
  name: string;
}

export const WageUnitSchema = SchemaFactory.createForClass(WageUnit);
