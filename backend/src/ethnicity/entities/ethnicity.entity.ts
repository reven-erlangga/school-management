export class Ethnicity {
  id: string;
  key: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;

  static get allowedSorts() {
    return ['name', 'key', 'created_at', 'updated_at'];
  }

  static get allowedFields() {
    return [
      'id',
      'key',
      'name',
      'description',
      'is_active',
      'created_at',
      'updated_at',
    ];
  }

  static get allowedFilters() {
    return ['name', 'key', 'is_active'];
  }

  static get allowedIncludes() {
    return [];
  }
}
