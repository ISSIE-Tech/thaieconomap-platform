export interface TypeResponseDto {
  _id: string;
  name: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BusinessTypeResponseDto extends TypeResponseDto {}
export interface RestaurantTypeResponseDto extends TypeResponseDto {}
export interface ProductTypeResponseDto extends TypeResponseDto {}
export interface ShareTypeResponseDto extends TypeResponseDto {}
export interface ConditionOptionResponseDto extends TypeResponseDto {}
export interface ShippingOptionResponseDto extends TypeResponseDto {}
