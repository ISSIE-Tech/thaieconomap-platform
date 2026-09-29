import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  _id: false,
  versionKey: false,
})
export class BotInfo {
  @Prop()
  basicId: string;

  @Prop()
  displayName: string;

  @Prop()
  lineImageUrl: string;
}

export const BotInfoSchema = SchemaFactory.createForClass(BotInfo);
