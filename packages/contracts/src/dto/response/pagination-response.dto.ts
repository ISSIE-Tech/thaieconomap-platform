export interface PaginationMetaDataDto {
  perPage: number;
  count: number;
  prevPage: number;
  currentPage: number;
  nextPage: number;
  lastPage: number;
}

export interface PaginationResponseDto<T> {
  data: T[];
  metaData: PaginationMetaDataDto;
}
