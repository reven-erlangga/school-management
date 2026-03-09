import { writable, derived } from 'svelte/store';
import type { UserWithRBAC, Module, ModuleGroup } from '../types/rbac';

// State for the logged-in user
export const rbacUser = writable<UserWithRBAC | null>(null);

// State for all available modules (usually fetched from API)
export const availableModules = writable<Module[]>([]);

// Cache for permission checks
const permissionCache = new Map<string, boolean>();

/**
 * Check if the user has a specific permission.
 * Results are cached for optimization.
 */
export const hasPermission = (permissionSlug: string, user: UserWithRBAC | null): boolean => {
  if (!user) return false;
  
  const cacheKey = `${user.id}:${permissionSlug}`;
  if (permissionCache.has(cacheKey)) {
    return permissionCache.get(cacheKey)!;
  }

  const hasIt = user.permissions.includes(permissionSlug) || user.roles.includes('super_admin');
  permissionCache.set(cacheKey, hasIt);
  return hasIt;
};

/**
 * Derived store that provides the sidebar menu structure.
 * Groups modules based on user permissions and the 'group' field.
 */
export const sidebarMenu = derived(
  [rbacUser, availableModules],
  ([$user, $modules]) => {
    if (!$user) return [];

    // Filter modules the user has access to
    const accessibleModules = $modules.filter(module => {
      // Respect sidebar config if present
      if (module.config) {
        const config = typeof module.config === 'string' ? JSON.parse(module.config) : module.config;
        if (config?.sidebar?.enabled === false) return false;
      }

      // Only include 'default', 'monitoring', and 'direct' page modules in sidebar
      if (module.page && !['default', 'monitoring', 'direct'].includes(module.page)) return false;

      // If user is super_admin, skip permission check
      if ($user.roles.includes('super_admin')) return true;

      // If module requires specific permissions, check them
      if (module.permissions && module.permissions.length > 0) {
        return module.permissions.some(p => hasPermission(p, $user));
      }
      return true; // Default to accessible if no permissions defined
    });

    // Group modules by their 'group' field
    const groups: Record<string, Module[]> = {};
    accessibleModules.forEach(module => {
      const groupName = module.group || 'General';
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(module);
    });

    // Convert to array of ModuleGroup
    return Object.entries(groups).map(([name, modules]) => ({
      name,
      modules
    })) as ModuleGroup[];
  }
);

// Clear cache on logout
rbacUser.subscribe(user => {
  if (!user) permissionCache.clear();
});
