import type { Foundation, School } from './types';

export const SITE_TITLE = 'Amanah School Management';
export const SITE_DESCRIPTION = 'Professional School Management System for Amanah Foundation';

export const foundationData: Foundation = {
  name: "Yayasan Pendidikan Amanah",
  description: "Membangun generasi unggul melalui pendidikan berkualitas dan berintegritas tinggi sejak tahun 1990.",
  logo: "/favicon.svg",
  contact: {
    address: "Jl. Pendidikan No. 123, Jakarta Selatan",
    phone: "(021) 1234-5678",
    email: "info@yayasan-amanah.sch.id"
  }
};

export const schoolsData: School[] = [
  {
    id: "1",
    name: "SD IT Amanah",
    address: "Kebayoran Lama, Jakarta Selatan",
    studentCount: 450,
    teacherCount: 25,
    image: "https://images.unsplash.com/photo-1546410531-bb4caa1b4227?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "2",
    name: "SMP IT Amanah",
    address: "Cilandak, Jakarta Selatan",
    studentCount: 380,
    teacherCount: 30,
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "3",
    name: "SMA IT Amanah",
    address: "Jagakarsa, Jakarta Selatan",
    studentCount: 320,
    teacherCount: 35,
    image: "https://images.unsplash.com/photo-1523050335456-c38730b0ebf4?auto=format&fit=crop&q=80&w=400"
  }
];
