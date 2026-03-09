import { writable, derived } from 'svelte/store';

export interface SchoolBranding {
  id: string;
  subdomain: string;
  name: string;
  fullName: string;
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  address?: string;
  phone?: string;
  email?: string;
}

// Mock data for schools
export const schoolConfigs: Record<string, SchoolBranding> = {
  'yadika-8': {
    id: '1',
    subdomain: 'yadika-8',
    name: 'Yadika 8',
    fullName: 'SMA Yadika 8 Jatiwaringin',
    primaryColor: '#4338CA',
    secondaryColor: '#6366F1',
    address: 'Jl. Jatiwaringin Raya No. 8, Bekasi',
    phone: '+62 21 1234567',
    email: 'info@yadika8.sch.id'
  },
  'yadika-7': {
    id: '2',
    subdomain: 'yadika-7',
    name: 'Yadika 7',
    fullName: 'SMK Yadika 7 Bogor',
    primaryColor: '#059669',
    secondaryColor: '#10B981',
    address: 'Jl. Raya Bogor KM 7, Bogor',
    phone: '+62 251 7654321',
    email: 'info@yadika7.sch.id'
  }
};

export const currentSubdomain = writable<string | null>(null);

export const currentSchoolBranding = derived(
  currentSubdomain,
  ($subdomain) => {
    if (!$subdomain || $subdomain === 'www' || $subdomain === 'localhost') {
      return null;
    }
    return schoolConfigs[$subdomain] || null;
  }
);

export const isSubdomainValid = derived(
  currentSubdomain,
  ($subdomain) => {
    if (!$subdomain || $subdomain === 'www' || $subdomain === 'localhost') {
      return true; // Main site is always valid
    }
    return !!schoolConfigs[$subdomain];
  }
);

export const updateSubdomain = () => {
  if (typeof window === 'undefined') return;
  
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  
  // Handle localhost:4321 and production domains
  // localhost: parts = ["localhost"]
  // yadika-8.localhost: parts = ["yadika-8", "localhost"]
  // yadika-8.domain.com: parts = ["yadika-8", "domain", "com"]
  
  if (parts.length > 1) {
    if (parts[parts.length - 1] === 'localhost') {
      // yadika-8.localhost
      currentSubdomain.set(parts[0]);
    } else if (parts.length >= 3) {
      // yadika-8.domain.com
      currentSubdomain.set(parts[0]);
    } else {
      currentSubdomain.set(null);
    }
  } else {
    currentSubdomain.set(null);
  }
};
