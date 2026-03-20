import { UserDocument } from '../../modules/users/schemas';

declare module 'express' {
  export interface Request {
    user: UserDocument;
  }
}
