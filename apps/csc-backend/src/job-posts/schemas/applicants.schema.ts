import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Submission } from 'src/submissions/schemas/submission.schema';

export type ApplicantsDocument = HydratedDocument<Applicants>;

@Schema({
  toJSON: {
    getters: true,
  },
  _id: false,
})
export class Applicants {
  @Prop({
    get: (number: number) => {
      if (number == -1) {
        return 'ไม่จำกัด';
      }

      return number;
    },
  })
  number: number;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Submission' }],
    default: [],
  })
  submissions: Submission[];
}

export const ApplicantsSchema = SchemaFactory.createForClass(Applicants);
