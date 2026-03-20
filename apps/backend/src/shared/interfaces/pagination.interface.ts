import { MongooseOrdering, PaginationMetaDataDto, PaginationResponseDto } from '@thaieconomap/contracts';
import { FilterQuery } from 'mongoose';


export type IPaginationResponse<T> = PaginationResponseDto<T>;

export type IPaginationMetaData = PaginationMetaDataDto;

export interface IPaginationOptions {
  page: number;
  perPage: number;
  sortedBy?: string;
  direction?: MongooseOrdering;
}

export interface IExtractedQueryAndPaginationOptions<T extends IPaginationOptions> {
  paginationOptions: IPaginationOptions;
  filterQuery: FilterQuery<Omit<T, keyof IPaginationOptions>>;
}

export type IPaginationQuery<T> = IPaginationOptions & FilterQuery<T>;
