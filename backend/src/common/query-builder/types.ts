export interface QueryOptions {
  table: string;
  select?: string | string[];
  where?: Record<string, any>;
  orderBy?:
    | Record<string, 'asc' | 'desc'>
    | Array<Record<string, 'asc' | 'desc'>>;
  limit?: number;
  offset?: number;
  returning?: boolean;
  trx?: any; // Transaction object
}

export interface FindOptions extends QueryOptions {}

export interface ReadOptions extends QueryOptions {
  where: Record<string, any>; // Mandatory for read
}

export interface CreateOptions extends QueryOptions {
  data: Record<string, any> | Array<Record<string, any>>;
}

export interface UpdateOptions extends QueryOptions {
  data: Record<string, any>;
  useSoftDelete?: boolean;
}

export interface DeleteOptions extends QueryOptions {
  useSoftDelete?: boolean;
}

export interface CreateOrUpdateOptions extends QueryOptions {
  data: Record<string, any>;
  conflictTarget?: string[]; // Columns to check for conflict
}

export interface CursorOptions extends QueryOptions {
  batchSize?: number;
}
