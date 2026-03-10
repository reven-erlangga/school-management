export class Staff {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status: string;
  created_at: Date;
  updated_at: Date;

  static get allowedSorts() {
    return ['name', 'status', 'created_at', 'updated_at'];
  }

  static get allowedFields() {
    return [
      'id',
      'name',
      'email',
      'phone',
      'status',
      'created_at',
      'updated_at',
    ];
  }

  static get allowedFilters() {
    return ['name', 'status'];
  }

  static get allowedIncludes() {
    return ['staffInstitutes', 'staffInstitutes.institute'];
  }
}
