import { Transform } from 'class-transformer';
import { IsMongoId, IsString } from 'class-validator';
// import { ObjectId } from 'mongoose'
import { ObjectId } from 'mongodb';

export class UpdateUserDistrictsDto {
  @IsString()
  shortId: string;

  // @Transform(({ value }) => value.map(ObjectId), { toClassOnly: true })
  @IsMongoId({ each: true })
  districts: string[];
}
