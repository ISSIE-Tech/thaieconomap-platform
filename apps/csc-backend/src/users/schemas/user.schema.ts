import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, now } from 'mongoose';
import { JobPost } from 'src/job-posts/schemas/job-post.schema';
import { UserRole } from './user-role.enum';
import { District } from 'src/districts/district.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  // thaieconomap gateway user id (set when the user comes in through the gateway)
  @Prop({ unique: true, sparse: true })
  authId?: string;

  @Prop({ required: true, unique: true })
  lineId: string;

  @Prop({ required: true, unique: true })
  shortId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  birthDate: Date;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop()
  experiences: string;

  @Prop({ enum: UserRole, default: UserRole.Customer })
  role: UserRole;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'District' }],
    default: [],
  })
  districts: District[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'JobPost' }],
    default: [],
  })
  favoritePosts: JobPost[];

  @Prop()
  profileImageUrl: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
