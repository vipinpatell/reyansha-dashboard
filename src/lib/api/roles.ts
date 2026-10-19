import { apiRequest, isRecord, unwrapData } from './client';
import type { Role, RoleInput } from '@/types/role';

function parseRole(value: unknown, index?: number): Role {
  const location = index === undefined ? 'response' : `at index ${index}`;
  if (!isRecord(value) || typeof value.key !== 'string') {
    throw new Error(`Unexpected role ${location}.`);
  }

  return {
    key: value.key,
    name: typeof value.name === 'string' ? value.name : undefined,
    description:
      typeof value.description === 'string' ? value.description : undefined,
    permissions: Array.isArray(value.permissions)
      ? value.permissions.filter(
          (permission): permission is string =>
            typeof permission === 'string',
        )
      : undefined,
  };
}

export async function getRoles(): Promise<Role[]> {
  const response = unwrapData(await apiRequest<unknown>('/roles'));
  const collection = Array.isArray(response)
    ? response
    : isRecord(response)
      ? response.roles ?? response.items
      : undefined;

  if (!Array.isArray(collection)) {
    throw new Error('Unexpected API response. Expected an array of roles.');
  }

  return collection.map((role, index) => parseRole(role, index));
}

export async function createRole(input: RoleInput): Promise<void> {
  await apiRequest('/roles', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function updateRole(
  key: string,
  input: Omit<RoleInput, 'key'>,
): Promise<void> {
  await apiRequest(`/roles/${encodeURIComponent(key)}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export async function deleteRole(key: string): Promise<void> {
  await apiRequest(`/roles/${encodeURIComponent(key)}`, {
    method: 'DELETE',
  });
}
