export interface Meta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  [key: string]: any;
}

export interface LinkObject {
  href: string;
  meta?: Meta;
}

export type Link = string | LinkObject;

export interface Links {
  self?: Link;
  related?: Link;
  first?: Link;
  last?: Link;
  prev?: Link;
  next?: Link;
}

export interface JsonApi {
  version?: string;
  meta?: Meta;
}

export interface ErrorSource {
  pointer?: string;
  parameter?: string;
}

export interface ErrorObject {
  id?: string;
  links?: Links;
  status?: string;
  code?: string;
  title?: string;
  detail?: string;
  source?: ErrorSource;
  meta?: Meta;
}

export interface Response<T = any> {
  data: T;
  meta?: Meta;
  links?: Links;
  included?: any[];
  jsonapi?: JsonApi;
  errors?: ErrorObject[];
}

export interface ErrorResponse {
  errors: ErrorObject[];
  meta?: Meta;
  jsonapi?: JsonApi;
  links?: Links;
}
