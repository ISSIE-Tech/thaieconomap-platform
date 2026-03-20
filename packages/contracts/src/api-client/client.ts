import {
  BaseResponseDto,
  PaginationResponseDto,
  CommercialResponseDto,
  CommercialTinyResponseDto,
  PendingCommercialResponseDto,
  DeletedCommercialResponseDto,
  PumpuangResponseDto,
  PumpuangTinyResponseDto,
  PumpuangRouteResponseDto,
  PendingPumpuangResponseDto,
  DeletedPumpuangResponseDto,
  PumpuangRequestOtpResponseDto,
  RequestSessionResponseDto,
  PumpuangAuthResponseDto,
  ShareResponseDto,
  ShareTinyResponseDto,
  PendingShareResponseDto,
  DeletedShareResponseDto,
  AnnouncementResponseDto,
  UserResponseDto,
  DistrictResponseDto,
  TypeResponseDto,
} from '../dto/response';
import { IFavoriteListResponse } from '../models';

export interface ICommercialsClient {
  list(params?: Record<string, unknown>): Promise<PaginationResponseDto<CommercialResponseDto>>;
  getTiny(params?: Record<string, unknown>): Promise<CommercialTinyResponseDto[]>;
  getById(id: string): Promise<CommercialResponseDto>;
  getByIdTiny(id: string): Promise<CommercialTinyResponseDto>;
  create(body: unknown): Promise<BaseResponseDto<CommercialResponseDto>>;
  update(id: string, body: unknown): Promise<BaseResponseDto<CommercialResponseDto>>;
  delete(id: string): Promise<void>;
  favorite(id: string): Promise<void>;
  unfavorite(id: string): Promise<void>;
}

export interface IPendingCommercialsClient {
  list(params?: Record<string, unknown>): Promise<PaginationResponseDto<PendingCommercialResponseDto>>;
  getById(id: string): Promise<PendingCommercialResponseDto>;
  approve(id: string): Promise<BaseResponseDto<CommercialResponseDto>>;
  reject(id: string, body?: unknown): Promise<BaseResponseDto<void>>;
}

export interface IDeletedCommercialsClient {
  list(params?: Record<string, unknown>): Promise<PaginationResponseDto<DeletedCommercialResponseDto>>;
}

export interface IAllCommercialsClient {
  list(params?: Record<string, unknown>): Promise<PaginationResponseDto<CommercialResponseDto>>;
}

export interface IBusinessTypesClient {
  list(): Promise<TypeResponseDto[]>;
  create(body: unknown): Promise<BaseResponseDto<TypeResponseDto>>;
  delete(id: string): Promise<void>;
}

export interface IRestaurantTypesClient {
  list(): Promise<TypeResponseDto[]>;
  create(body: unknown): Promise<BaseResponseDto<TypeResponseDto>>;
  delete(id: string): Promise<void>;
}

export interface IPumpuangsClient {
  list(params?: Record<string, unknown>): Promise<PaginationResponseDto<PumpuangResponseDto>>;
  getTiny(params?: Record<string, unknown>): Promise<PumpuangTinyResponseDto[]>;
  getById(id: string): Promise<PumpuangResponseDto>;
  getRoute(id: string): Promise<PumpuangRouteResponseDto>;
  create(body: unknown): Promise<BaseResponseDto<PumpuangResponseDto>>;
  update(id: string, body: unknown): Promise<BaseResponseDto<PumpuangResponseDto>>;
  delete(id: string): Promise<void>;
  favorite(id: string): Promise<void>;
  unfavorite(id: string): Promise<void>;
}

export interface IPendingPumpuangsClient {
  list(params?: Record<string, unknown>): Promise<PaginationResponseDto<PendingPumpuangResponseDto>>;
  getById(id: string): Promise<PendingPumpuangResponseDto>;
  approve(id: string): Promise<BaseResponseDto<PumpuangResponseDto>>;
  reject(id: string, body?: unknown): Promise<BaseResponseDto<void>>;
}

export interface IDeletedPumpuangsClient {
  list(params?: Record<string, unknown>): Promise<PaginationResponseDto<DeletedPumpuangResponseDto>>;
}

export interface IProductTypesClient {
  list(): Promise<TypeResponseDto[]>;
  create(body: unknown): Promise<BaseResponseDto<TypeResponseDto>>;
  delete(id: string): Promise<void>;
}

export interface ISharesClient {
  list(params?: Record<string, unknown>): Promise<PaginationResponseDto<ShareResponseDto>>;
  getTiny(params?: Record<string, unknown>): Promise<ShareTinyResponseDto[]>;
  getById(id: string): Promise<ShareResponseDto>;
  create(body: unknown): Promise<BaseResponseDto<ShareResponseDto>>;
  update(id: string, body: unknown): Promise<BaseResponseDto<ShareResponseDto>>;
  delete(id: string): Promise<void>;
  favorite(id: string): Promise<void>;
  unfavorite(id: string): Promise<void>;
}

export interface IPendingSharesClient {
  list(params?: Record<string, unknown>): Promise<PaginationResponseDto<PendingShareResponseDto>>;
  getById(id: string): Promise<PendingShareResponseDto>;
  approve(id: string): Promise<BaseResponseDto<ShareResponseDto>>;
  reject(id: string, body?: unknown): Promise<BaseResponseDto<void>>;
}

export interface IDeletedSharesClient {
  list(params?: Record<string, unknown>): Promise<PaginationResponseDto<DeletedShareResponseDto>>;
}

export interface IShareTypesClient {
  list(): Promise<TypeResponseDto[]>;
  create(body: unknown): Promise<BaseResponseDto<TypeResponseDto>>;
  delete(id: string): Promise<void>;
}

export interface IConditionOptionsClient {
  list(): Promise<TypeResponseDto[]>;
  create(body: unknown): Promise<BaseResponseDto<TypeResponseDto>>;
  delete(id: string): Promise<void>;
}

export interface IShippingOptionsClient {
  list(): Promise<TypeResponseDto[]>;
  create(body: unknown): Promise<BaseResponseDto<TypeResponseDto>>;
  delete(id: string): Promise<void>;
}

export interface IAnnouncementsClient {
  list(params?: Record<string, unknown>): Promise<PaginationResponseDto<AnnouncementResponseDto>>;
  getTiny(params?: Record<string, unknown>): Promise<AnnouncementResponseDto[]>;
  getById(id: string): Promise<AnnouncementResponseDto>;
  create(body: unknown): Promise<BaseResponseDto<AnnouncementResponseDto>>;
  update(id: string, body: unknown): Promise<BaseResponseDto<AnnouncementResponseDto>>;
  delete(id: string): Promise<void>;
}

export interface IUsersClient {
  me(): Promise<UserResponseDto>;
  favorites(params?: Record<string, unknown>): Promise<IFavoriteListResponse>;
  history(params?: Record<string, unknown>): Promise<unknown[]>;
  privilegeUsers(): Promise<UserResponseDto[]>;
  updatePrivilegeUser(id: string, body: unknown): Promise<BaseResponseDto<UserResponseDto>>;
}

export interface IMapClient {
  districts(params?: Record<string, unknown>): Promise<DistrictResponseDto[]>;
}

export interface IThaiEconoMapClient {
  commercials: ICommercialsClient;
  pendingCommercials: IPendingCommercialsClient;
  deletedCommercials: IDeletedCommercialsClient;
  allCommercials: IAllCommercialsClient;
  businessTypes: IBusinessTypesClient;
  restaurantTypes: IRestaurantTypesClient;
  pumpuangs: IPumpuangsClient;
  pendingPumpuangs: IPendingPumpuangsClient;
  deletedPumpuangs: IDeletedPumpuangsClient;
  productTypes: IProductTypesClient;
  shares: ISharesClient;
  pendingShares: IPendingSharesClient;
  deletedShares: IDeletedSharesClient;
  shareTypes: IShareTypesClient;
  conditionOptions: IConditionOptionsClient;
  shippingOptions: IShippingOptionsClient;
  announcements: IAnnouncementsClient;
  users: IUsersClient;
  map: IMapClient;
}
