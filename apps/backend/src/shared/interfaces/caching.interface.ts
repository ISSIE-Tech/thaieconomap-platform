import { ShopDisplayOpening, ShopOpening } from '../../modules/caching/schemas';
import { Location } from '../schemas';

export interface IBase {
  _id: string;
  name: string;
  botInfo: IBotInfo;
}

interface IBotInfo {
  basicId: string;
  displayName: string;
  pictureUrl: string;
}

export interface IShop {
  _id: string;
  name: string;
  type: string;
  location: Location;
  imageUrl: string;
  address: string;
  commercialOwner: string;
  phoneNumber: string;
  base: string;
  category: string;
  opening: ShopOpening[];
  displayOpening: ShopDisplayOpening[];
}
