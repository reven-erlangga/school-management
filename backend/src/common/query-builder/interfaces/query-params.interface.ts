export interface QueryParams {
  filter?: Record<string, any>;
  fields?: Record<string, string> | string | string[];
  includes?: string;
  sort?: string;
  page?: number;
  limit?: number;
  cursor?: string;
  [key: string]: any;
}
