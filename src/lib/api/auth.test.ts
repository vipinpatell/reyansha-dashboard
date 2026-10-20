import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  getCurrentUser,
  login,
  logout,
} from './auth';
import {
  ApiError,
  apiRequest,
  getApiErrorMessage,
} from './client';
import {
  hasRoutePermission,
  requiresForcedPasswordChange,
} from '../auth-authorization';
import { canSetUserPassword } from '../auth-permissions';
import { validatePassword } from '../password-validation';
import {
  deactivateUser,
  getUsers,
  setUserPassword,
  updateUserRoles,
} from './users';
import type { AuthUser } from '@/types/auth';

const mockFetch = vi.fn<typeof fetch>();

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

const superAdmin: AuthUser = {
  id: 'admin-1',
  name: 'Admin',
  roles: [{ key: 'super_admin' }],
  permissions: ['roles.read', 'roles.manage', 'users.read'],
  mustChangePassword: false,
};

beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_API_URL', 'http://localhost:3000');
  mockFetch.mockReset();
  vi.stubGlobal('fetch', mockFetch);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('cookie-session API client', () => {
  it('includes browser-managed credentials without adding an authorization token', async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ ok: true }));

    await apiRequest('/users');

    const [, init] = mockFetch.mock.calls[0];
    expect(init?.credentials).toBe('include');
    expect(new Headers(init?.headers).has('Authorization')).toBe(false);
  });

  it('supports login, current-user loading, and logout without handling tokens', async () => {
    mockFetch
      .mockResolvedValueOnce(jsonResponse({ success: true }))
      .mockResolvedValueOnce(
        jsonResponse({
          data: {
            _id: 'user-1',
            name: { firstName: 'Ari', lastName: 'User' },
            roles: [{ _id: 'role-1', key: 'super_admin' }],
            permissions: ['roles.manage'],
            mustChangePassword: true,
            passwordHash: 'must-not-be-exposed',
          },
        }),
      )
      .mockResolvedValueOnce(jsonResponse({ success: true }));

    await login({ identifier: 'ari@example.com', password: 'example-password' });
    const user = await getCurrentUser();
    await logout();

    expect(user).toMatchObject({
      id: 'user-1',
      name: 'Ari User',
      mustChangePassword: true,
      roles: [{ id: 'role-1', key: 'super_admin' }],
      permissions: ['roles.manage'],
    });
    expect(user).not.toHaveProperty('passwordHash');
    expect(mockFetch.mock.calls.map(([url]) => url)).toEqual([
      'http://localhost:3000/api/v1/auth/login',
      'http://localhost:3000/api/v1/auth/me',
      'http://localhost:3000/api/v1/auth/logout',
    ]);
    for (const [, init] of mockFetch.mock.calls) {
      expect(init?.credentials).toBe('include');
    }
    expect(JSON.parse(String(mockFetch.mock.calls[0][1]?.body))).toEqual({
      identifier: 'ari@example.com',
      password: 'example-password',
    });
  });

  it('clears auth on protected 401 and maps permission errors clearly', async () => {
    const unauthorized = vi.fn();
    window.addEventListener('reyansha:unauthorized', unauthorized);
    mockFetch.mockResolvedValueOnce(jsonResponse({ message: 'Unauthorized' }, 401));

    await expect(apiRequest('/roles')).rejects.toMatchObject({
      status: 401,
    } satisfies Partial<ApiError>);
    expect(unauthorized).toHaveBeenCalledOnce();
    window.removeEventListener('reyansha:unauthorized', unauthorized);

    expect(
      getApiErrorMessage(new ApiError(403, 'server detail')),
    ).toBe('You do not have permission to perform this action.');
  });

  it('does not surface server responses that could echo password inputs', async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse({ message: 'Rejected: secret-value' }, 409),
    );

    await expect(
      apiRequest('/users/user-1/password', {
        method: 'PATCH',
        body: JSON.stringify({ password: 'secret-value' }),
      }),
    ).rejects.toMatchObject({
      message: 'Password request failed (409).',
    });

    mockFetch.mockResolvedValueOnce(
      jsonResponse({ message: 'Rejected: login-secret' }, 400),
    );
    await expect(
      apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          identifier: 'user@example.com',
          password: 'login-secret',
        }),
      }),
    ).rejects.toMatchObject({
      message: 'Sign-in request is invalid.',
    });
  });

  it('sets an admin password with only the documented password field', async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ success: true }));

    await setUserPassword('user-1', 'temporary-password');

    expect(mockFetch.mock.calls[0][0]).toBe(
      'http://localhost:3000/api/v1/users/user-1/password',
    );
    expect(mockFetch.mock.calls[0][1]?.method).toBe('PATCH');
    expect(JSON.parse(String(mockFetch.mock.calls[0][1]?.body))).toEqual({
      password: 'temporary-password',
    });
  });

  it('sends MongoDB role IDs and calls deactivation without an invented body', async () => {
    mockFetch
      .mockResolvedValueOnce(jsonResponse({ success: true }))
      .mockResolvedValueOnce(jsonResponse({ success: true }));

    await updateUserRoles('user-1', ['role-id-1']);
    await deactivateUser('user-1');

    expect(mockFetch.mock.calls[0][0]).toBe(
      'http://localhost:3000/api/v1/users/user-1/roles',
    );
    expect(JSON.parse(String(mockFetch.mock.calls[0][1]?.body))).toEqual({
      roleIds: ['role-id-1'],
    });
    expect(mockFetch.mock.calls[1][0]).toBe(
      'http://localhost:3000/api/v1/users/user-1/deactivate',
    );
    expect(mockFetch.mock.calls[1][1]?.method).toBe('PATCH');
    expect(mockFetch.mock.calls[1][1]?.body).toBeUndefined();
  });

  it('accepts a reduced profile from the limited-user listing', async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse({ data: { users: [{ _id: 'report-1' }] } }),
    );

    await expect(getUsers()).resolves.toMatchObject([
      { _id: 'report-1', name: {} },
    ]);
  });
});

describe('route authorization and forced password change', () => {
  it('requires password change before ordinary protected navigation', () => {
    const forcedUser = { ...superAdmin, mustChangePassword: true };

    expect(requiresForcedPasswordChange(forcedUser, '/')).toBe(true);
    expect(requiresForcedPasswordChange(forcedUser, '/change-password')).toBe(
      false,
    );
  });

  it('enforces password length and UTF-8 byte limits', () => {
    expect(validatePassword('twelve-char')).toContain('12 characters');
    expect(validatePassword('123456789012')).toBeNull();
    expect(validatePassword('é'.repeat(36))).toBeNull();
    expect(validatePassword('é'.repeat(37))).toContain('72 UTF-8 bytes');
  });

  it('gates role and temporary-password actions by trusted role and permissions', () => {
    expect(hasRoutePermission('/roles', superAdmin)).toBe(true);
    expect(canSetUserPassword(superAdmin)).toBe(true);

    const missingManagePermission = {
      ...superAdmin,
      permissions: ['users.read'],
    };
    const wrongRole = {
      ...superAdmin,
      roles: [{ key: 'admin' }],
    };

    expect(hasRoutePermission('/roles', missingManagePermission)).toBe(false);
    expect(canSetUserPassword(missingManagePermission)).toBe(false);
    expect(canSetUserPassword(wrongRole)).toBe(false);
  });
});
