import {
  CommercialDocument,
  DeletedCommercialDocument,
  PendingCommercialDocument,
} from '../../modules/commercials/schemas';

export type IAllCommercial =
  | CommercialDocument
  | PendingCommercialDocument
  | DeletedCommercialDocument;
