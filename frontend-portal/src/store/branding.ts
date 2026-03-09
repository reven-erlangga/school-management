import { writable, get } from 'svelte/store';

interface BrandingSettings {
  appName: string;
  foundationName: string;
  shortName: string;
  appIcon: string;
  favicon: string;
  isLoaded?: boolean;
}

export const branding = writable<BrandingSettings>({
  appName: 'School Management',
  foundationName: 'AdminPanel',
  shortName: 'SMS',
  appIcon: '',
  favicon: '',
  isLoaded: false,
});

export const updateBranding = async () => {
  if (get(branding).isLoaded) {
    return;
  }
  const apiUrl = import.meta.env.PUBLIC_API_URL || 'http://localhost:3001';
  try {
    const res = await fetch(`${apiUrl}/settings/overview`);
    if (res.ok) {
      const data = await res.json();
      branding.set({
        appName: data['Application Name'] || 'School Management',
        foundationName: data['Foundation Name'] || 'AdminPanel',
        shortName: data['Short Name'] || 'SMS',
        appIcon: data['App Icon'] || '',
        favicon: data['Favicon'] || '',
        isLoaded: true,
      });

      // Update document title and favicon
      if (typeof document !== 'undefined') {
        if (data['Application Name']) {
          document.title = data['Application Name'];
        }
        
        if (data['Favicon']) {
          let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
          if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.getElementsByTagName('head')[0].appendChild(link);
          }
          link.href = data['Favicon'];
        }
      }
    }
  } catch (e) {
    console.error('Failed to fetch branding settings:', e);
  }
};
