export interface School {
  id: string;
  name: string;
  address: string;
  studentCount: number;
  teacherCount: number;
  image?: string;
}

export interface Foundation {
  name: string;
  description: string;
  logo: string;
  contact: {
    address: string;
    phone: string;
    email: string;
  };
}

export interface User {
  id: string;
  username: string;
  role: string;
  permissions?: string[];
  roles?: string[];
}
