export type TranslationJson = {
  en: string;
  id: string;
};

export class Religion {
  id: string;
  key: string;
  name: TranslationJson;
  description?: TranslationJson;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;

  static get allowedSorts() {
    return ['key', 'created_at', 'updated_at'];
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
    return ['key', 'is_active'];
  }

  static get allowedIncludes() {
    return [];
  }
}
