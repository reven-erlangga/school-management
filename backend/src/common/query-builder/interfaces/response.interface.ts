export interface Meta {
  total?: number;
  page?: number;
  last_page?: number;
  limit?: number;
  timestamp?: string;
  [key: string]: any;
}

export interface Links {
  self?: string;
  first?: string;
  last?: string;
  prev?: string;
  next?: string;
  [key: string]: any;
}

export interface JsonApi {
  version: string;
  meta?: any;
}

export interface ErrorObject {
  id?: string;
  status?: string;
  code?: string;
  title?: string;
  detail?: string;
  source?: {
    pointer?: string;
    parameter?: string;
  };
  meta?: any;
}

export interface Response<T = any> {
  data: T;
  meta?: Meta;
  links?: Links;
  included?: any[];
  jsonapi?: JsonApi;
  errors?: ErrorObject[];
}

/**
 * Helper to convert camelCase string to snake_case
 */
const toSnakeCase = (str: string): string => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

/**
 * Helper to recursively convert object keys from camelCase to snake_case
 */
const keysToSnakeCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map((v) => keysToSnakeCase(v));
  } else if (
    obj !== null &&
    typeof obj === 'object' &&
    !(obj instanceof Date) &&
    !(obj instanceof RegExp)
  ) {
    return Object.keys(obj).reduce((result, key) => {
      const snakeKey = toSnakeCase(key);
      result[snakeKey] = keysToSnakeCase(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
};

/**
 * Utility function to format response and convert keys to snake_case
 */
export function toResponse<T>(
  data: T,
  meta?: Meta,
  links?: Links,
  included?: any[],
  errors?: ErrorObject[],
): Response<T> {
  const metaWithTimestamp = {
    ...(meta || {}),
    timestamp: new Date().toISOString(),
  };

  return {
    data: keysToSnakeCase(data),
    meta: keysToSnakeCase(metaWithTimestamp),
    links: links ? keysToSnakeCase(links) : undefined,
    included: included ? keysToSnakeCase(included) : undefined,
    jsonapi: { version: '1.0' },
    errors: errors ? keysToSnakeCase(errors) : undefined,
  };
}
