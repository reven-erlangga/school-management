export class Student {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status: string;
  institute_id: string;
  created_at: Date;
  updated_at: Date;

  static get allowedSorts() {
    return ['name', 'status', 'created_at', 'updated_at'];
  }

  static get allowedFields() {
    return ['id', 'name', 'email', 'phone', 'status', 'institute_id', 'created_at', 'updated_at'];
  }

  static get allowedFilters() {
    return ['name', 'status', 'institute_id'];
  }

  static get allowedIncludes() {
    return ['institute'];
  }
}
