import { Types } from 'mongoose';

import { ShopDisplayOpening, ShopOpening } from '../../modules/caching/schemas';
import { Location } from '../schemas';

export interface IBase {
  _id: Types.ObjectId;
  /** The node id as tamsang-tamsong knows it (uuid). */
  sourceId: string;
  name: string;
  botInfo: IBotInfo;
  location: Location | null;
  serviceRadiusKm: number;
}

interface IBotInfo {
  basicId: string;
  displayName: string;
  lineImageUrl: string;
}

export interface IShop {
  _id: Types.ObjectId;
  /** The shop id as tamsang-tamsong knows it (uuid). */
  sourceId: string;
  name: string;
  type: string;
  location: Location;
  imageUrl: string;
  address: string;
  commercialOwner: string;
  phoneNumber: string;
  base: Types.ObjectId;
  category: string;
  opening: ShopOpening[];
  displayOpening: ShopDisplayOpening[];
}
