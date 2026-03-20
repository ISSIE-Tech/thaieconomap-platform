import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { FavoriteCategories, FavoriteType } from '@thaieconomap/contracts';
import mongoose, { HydratedDocument } from 'mongoose';

import { COLLECTION_NAME } from '../../../shared/constants';
import { FavoriteTarget } from '../../../shared/interfaces';

import { User, UserDocument } from './user.schema';

export type FavoriteDocument = HydratedDocument<Favorite>;

export const FavoriteTypeMapper = new Map<FavoriteType, string>([
  [FavoriteType.BUSINESSES, 'businesses'],
  [FavoriteType.SHARES, 'shares'],
  [FavoriteType.RESTAURANTS, 'restaurants'],
  [FavoriteType.PUMPUANGS, 'pumpuangs'],
]);

export const FavoriteCategoriesMapper = new Map<FavoriteType, FavoriteCategories>([
  [FavoriteType.BUSINESSES, FavoriteCategories.COMMERCIALS],
  [FavoriteType.SHARES, FavoriteCategories.SHARES],
  [FavoriteType.RESTAURANTS, FavoriteCategories.COMMERCIALS],
  [FavoriteType.PUMPUANGS, FavoriteCategories.PUMPUANGS],
]);

@Schema({
  timestamps: true,
  versionKey: false,
  collection: COLLECTION_NAME.favorites,
})
export class Favorite {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: User.name,
  })
  userId: UserDocument;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  targetId: FavoriteTarget;

  @Prop({
    type: Number,
    required: true,
    enum: FavoriteType,
  })
  type: FavoriteType;
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);
