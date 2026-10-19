import { apiRequest, isRecord, unwrapData } from '@/lib/api/client';
import type { CreateUserInput, User } from '@/types/user';

function optionalString(
  record: Record<string, unknown>,
  key: string,
): string | undefined {
  return typeof record[key] === 'string' ? record[key] : undefined;
}

function parseUser(value: unknown, index?: number): User {
  const location = index === undefined ? 'response' : `at index ${index}`;

  if (
    !isRecord(value) ||
    typeof value._id !== 'string' ||
    !isRecord(value.name)
  ) {
    throw new Error(`Unexpected user ${location}.`);
  }

  const mobile = isRecord(value.mobile) ? value.mobile : undefined;
  const address = isRecord(value.address) ? value.address : undefined;
  const emergencyContact = isRecord(value.emergencyContact)
    ? value.emergencyContact
    : undefined;

  return {
    _id: value._id,
    prefix: optionalString(value, 'prefix'),
    name: {
      firstName: optionalString(value.name, 'firstName'),
      lastName: optionalString(value.name, 'lastName'),
    },
    username: optionalString(value, 'username'),
    dob:
      typeof value.dob === 'string' || value.dob === null
        ? value.dob
        : undefined,
    gender: optionalString(value, 'gender'),
    mobile: mobile
      ? {
          primary: optionalString(mobile, 'primary'),
          alternate: optionalString(mobile, 'alternate'),
        }
      : undefined,
    email: optionalString(value, 'email'),
    address: address
      ? {
          building: optionalString(address, 'building'),
          streetAddress: optionalString(address, 'streetAddress'),
          city: optionalString(address, 'city'),
          state: optionalString(address, 'state'),
          postalCode: optionalString(address, 'postalCode'),
          country: optionalString(address, 'country'),
        }
      : undefined,
    profileImage:
      typeof value.profileImage === 'string' || value.profileImage === null
        ? value.profileImage
        : undefined,
    designation: optionalString(value, 'designation'),
    userType: optionalString(value, 'userType'),
    department: optionalString(value, 'department'),
    employeeId: optionalString(value, 'employeeId'),
    reportingManager: optionalString(value, 'reportingManager'),
    joiningDate: optionalString(value, 'joiningDate'),
    employmentType: optionalString(value, 'employmentType'),
    workLocation: optionalString(value, 'workLocation'),
    tags: Array.isArray(value.tags)
      ? value.tags.filter((tag): tag is string => typeof tag === 'string')
      : undefined,
    notes: optionalString(value, 'notes'),
    emergencyContact:
      emergencyContact &&
      typeof emergencyContact.name === 'string' &&
      typeof emergencyContact.phone === 'string'
        ? {
            name: emergencyContact.name,
            phone: emergencyContact.phone,
          }
        : undefined,
    alternateContactEmail: optionalString(value, 'alternateContactEmail'),
    skills: Array.isArray(value.skills)
      ? value.skills.filter((skill): skill is string => typeof skill === 'string')
      : undefined,
    roles: Array.isArray(value.roles)
      ? value.roles.filter((role): role is string => typeof role === 'string')
      : undefined,
    isActive:
      typeof value.isActive === 'boolean' ? value.isActive : undefined,
    createdAt: optionalString(value, 'createdAt'),
    updatedAt: optionalString(value, 'updatedAt'),
  };
}

function getCollection(result: unknown): unknown {
  const data = unwrapData(result);
  if (Array.isArray(data)) return data;

  if (isRecord(data)) {
    const collection = data.users ?? data.items;
    if (collection !== undefined) return collection;
  }

  throw new Error('Unexpected API response. Expected an array of users.');
}

export async function getUsers(): Promise<User[]> {
  const result = await apiRequest<unknown>('/users');
  const collection = getCollection(result);

  if (!Array.isArray(collection)) {
    throw new Error('Unexpected API response. Expected an array of users.');
  }

  return collection.map((user, index) => parseUser(user, index));
}

export async function getUserById(id: string): Promise<User> {
  const result = unwrapData(
    await apiRequest<unknown>(`/users/${encodeURIComponent(id)}`),
  );
  return parseUser(result);
}

export async function createUser(user: CreateUserInput): Promise<void> {
  await apiRequest('/users', {
    method: 'POST',
    body: JSON.stringify(user),
  });
}

export async function replaceUser(
  id: string,
  user: CreateUserInput,
): Promise<void> {
  await apiRequest(`/users/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(user),
  });
}

export async function updateUser(
  id: string,
  user: Partial<CreateUserInput>,
): Promise<void> {
  await apiRequest(`/users/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(user),
  });
}

export async function updateUserRoles(
  id: string,
  roles: string[],
): Promise<void> {
  await apiRequest(`/users/${encodeURIComponent(id)}/roles`, {
    method: 'PATCH',
    body: JSON.stringify({ roles }),
  });
}

export async function deactivateUser(id: string): Promise<void> {
  await apiRequest(`/users/${encodeURIComponent(id)}/deactivate`, {
    method: 'PATCH',
  });
}
