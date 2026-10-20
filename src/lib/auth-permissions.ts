import type { AuthUser } from '@/types/auth';

export function hasPermission(user: AuthUser | null, permission: string) {
  return user?.permissions.includes(permission) ?? false;
}

export function hasRole(user: AuthUser | null, roleKey: string) {
  const normalized = roleKey.toLowerCase();
  return (
    user?.roles.some((role) => role.key?.toLowerCase() === normalized) ?? false
  );
}

export function canManageUsers(user: AuthUser | null) {
  return (
    hasPermission(user, 'users.read') ||
    hasPermission(user, 'users.read_limited')
  );
}

export function canSetUserPassword(user: AuthUser | null) {
  return (
    hasRole(user, 'super_admin') &&
    hasPermission(user, 'roles.manage')
  );
}
