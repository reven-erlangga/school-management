export class Institute {
  id: string;
  name: string;
  description?: string;
  address?: string;
  type: string;
  status: string;
  admin_id?: string;
  teacher_count: number;
  student_count: number;
  staff_count: number;
  created_at: Date;
  updated_at: Date;

  static get allowedSorts() {
    return ['name', 'status', 'type', 'created_at', 'updated_at'];
  }

  static get allowedFields() {
    return [
      'id',
      'name',
      'description',
      'address',
      'type',
      'status',
      'admin_id',
      'teacher_count',
      'student_count',
      'staff_count',
      'created_at',
      'updated_at',
    ];
  }

  static get allowedFilters() {
    return ['name', 'status', 'type', 'admin_id'];
  }

  static get allowedIncludes() {
    return ['units', 'streams', 'bannerInstitutes', 'staffInstitutes', 'staffInstitutes.staff'];
  }
}
