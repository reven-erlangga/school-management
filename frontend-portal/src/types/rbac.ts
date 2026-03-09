import type { User } from './index';

export interface Module {
  id: string;
  name: string; // e.g., 'Institute'
  slug: string; // e.g., 'institute'
  icon?: string;
  group: string; // e.g., 'management'
  path: string; // e.g., '/admin/institutes'
  permissions: string[]; // List of permission slugs required
  subModules?: Module[];
  meta?: any; // JSON object for { filter: [], chart: [] }
  config?: any; // JSON object for { sidebar: { enabled: boolean } }
  forms?: any[]; // Array of form definitions
  endpoints?: any[]; // Array of API endpoints
  page: 'default' | 'monitoring' | 'fab' | 'side' | 'direct';
}

export interface ModuleGroup {
  name: string;
  modules: Module[];
}

export interface UserWithRBAC extends User {
  permissions: string[];
  roles: string[];
}
