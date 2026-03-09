export class QueryBuilderError extends Error {
  constructor(
    public message: string,
    public code: string,
    public originalError?: any,
  ) {
    super(message);
    this.name = 'QueryBuilderError';
  }
}

export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  RECORD_NOT_FOUND: 'RECORD_NOT_FOUND',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
  FOREIGN_KEY_VIOLATION: 'FOREIGN_KEY_VIOLATION',
  DATABASE_ERROR: 'DATABASE_ERROR',
};
