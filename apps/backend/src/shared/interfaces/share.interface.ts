import {
  DeletedShareDocument,
  PendingShareDocument,
  ShareDocument,
} from '../../modules/shares/schemas';

export type IAllShare = ShareDocument | PendingShareDocument | DeletedShareDocument;
