export interface PaginationMeta {
  currentPage: number;
  perPage: number;
  total: number;
  lastPage: number;
  [key: string]: unknown;
}

export interface CursorPaginationMeta {
  perPage: number;
  nextCursor: string | null;
  [key: string]: unknown;
}

export interface PaginationResult<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface CursorPaginationResult<T> {
  data: T[];
  meta: CursorPaginationMeta;
}
