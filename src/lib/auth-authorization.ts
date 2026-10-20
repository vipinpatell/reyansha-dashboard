import type { AuthUser } from '@/types/auth';
import {
  canManageUsers,
  canSetUserPassword,
  hasPermission,
} from './auth-permissions';

export const publicRoutes = new Set([
  '/login',
  '/forgot-password',
  '/reset-password',
  '/forbidden',
]);

export function requiresForcedPasswordChange(
  user: AuthUser | null,
  pathname: string,
) {
  return Boolean(user?.mustChangePassword && pathname !== '/change-password');
}

export function hasRoutePermission(
  pathname: string,
  user: AuthUser | null,
) {
  if (pathname === '/roles') return hasPermission(user, 'roles.read');
  if (pathname === '/user-management/add') {
    return hasPermission(user, 'users.create');
  }
  if (/^\/user-management\/[^/]+\/password$/.test(pathname)) {
    return canSetUserPassword(user);
  }
  const editMatch = pathname.match(/^\/user-management\/([^/]+)\/edit$/);
  if (editMatch) {
    return (
      hasPermission(user, 'users.update') ||
      (user?.id === editMatch[1] &&
        hasPermission(user, 'users.update_own'))
    );
  }
  if (
    pathname === '/user-management' ||
    pathname === '/user-management/users' ||
    /^\/user-management\/[^/]+$/.test(pathname)
  ) {
    return canManageUsers(user);
  }

  return true;
}
