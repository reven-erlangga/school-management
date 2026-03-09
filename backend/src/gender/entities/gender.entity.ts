export class Gender {
  id: string;
  key: string;
  name: string;
  description?: string;
  created_at: Date;
  updated_at: Date;

  static get allowedSorts() {
    return ['key', 'created_at', 'updated_at'];
  }

  static get allowedFields() {
    return ['id', 'key', 'name', 'description', 'created_at', 'updated_at'];
  }

  static get allowedFilters() {
    return ['key'];
  }

  static get allowedIncludes() {
    return [];
  }
}
