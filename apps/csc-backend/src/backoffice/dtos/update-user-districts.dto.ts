import { Transform } from 'class-transformer';
import { IsMongoId, IsString } from 'class-validator';
// import { Types } from 'mongoose'
import { Types } from 'mongoose';

export class UpdateUserDistrictsDto {
  @IsString()
  shortId: string;

  // @Transform(({ value }) => value.map(Types.ObjectId), { toClassOnly: true })
  @IsMongoId({ each: true })
  districts: string[];
}
