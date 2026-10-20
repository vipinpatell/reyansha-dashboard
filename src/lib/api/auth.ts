import { apiRequest, isRecord, unwrapData } from './client';
import type { AuthRole, AuthUser } from '@/types/auth';

export interface LoginInput {
  identifier: string;
  password: string;
}

export interface PasswordChangeInput {
  currentPassword: string;
  newPassword: string;
}

export interface PasswordResetInput {
  token: string;
  newPassword: string;
}

function safeString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function parseRole(value: unknown): AuthRole | null {
  if (typeof value === 'string') {
    return { key: value };
  }
  if (!isRecord(value)) return null;

  const id =
    safeString(value._id) ??
    safeString(value.id);
  const key = safeString(value.key) ?? safeString(value.roleKey);
  const name = safeString(value.name);

  if (!id && !key && !name) return null;
  return { id, key, name };
}

export function parseCurrentUser(response: unknown): AuthUser {
  const value = unwrapData(response);
  if (!isRecord(value)) {
    throw new Error('The current-user response did not contain an account.');
  }

  const profile =
    isRecord(value.user) ? value.user :
    isRecord(value.profile) ? value.profile :
    isRecord(value.account) ? value.account :
    value;

  const nameRecord = isRecord(profile.name) ? profile.name : undefined;
  const name =
    safeString(profile.fullName) ??
    safeString(profile.displayName) ??
    (nameRecord
      ? [
          safeString(nameRecord.firstName) ?? safeString(nameRecord.first_name),
          safeString(nameRecord.lastName) ?? safeString(nameRecord.last_name),
        ]
          .filter(Boolean)
          .join(' ')
      : safeString(profile.name)) ??
    safeString(profile.username) ??
    safeString(profile.email) ??
    'Account';
  const profileImage =
    safeString(profile.profileImage) ??
    safeString(profile.profile_image) ??
    safeString(profile.avatarUrl) ??
    null;
  const roleData = profile.roles ?? value.roles;
  const permissionData = profile.permissions ?? value.permissions;

  return {
    id: safeString(profile._id) ?? safeString(profile.id),
    name,
    email: safeString(profile.email),
    username: safeString(profile.username),
    profileImage,
    userType:
      safeString(profile.userType) ??
      safeString(profile.user_type),
    roles: Array.isArray(roleData)
      ? roleData.map(parseRole).filter((role): role is AuthRole => role !== null)
      : [],
    permissions: Array.isArray(permissionData)
      ? permissionData.filter(
          (permission): permission is string =>
            typeof permission === 'string',
        )
      : [],
    mustChangePassword:
      profile.mustChangePassword === true ||
      value.mustChangePassword === true,
  };
}

export async function login(input: LoginInput): Promise<void> {
  await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function logout(): Promise<void> {
  await apiRequest('/auth/logout', { method: 'POST' });
}

export async function getCurrentUser(): Promise<AuthUser> {
  return parseCurrentUser(await apiRequest('/auth/me'));
}

export async function refreshSession(): Promise<AuthUser> {
  await apiRequest('/auth/refresh', { method: 'POST' });
  return getCurrentUser();
}

export async function changePassword(
  input: PasswordChangeInput,
): Promise<void> {
  await apiRequest('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function requestPasswordReset(email: string): Promise<void> {
  await apiRequest('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(
  input: PasswordResetInput,
): Promise<void> {
  await apiRequest('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
