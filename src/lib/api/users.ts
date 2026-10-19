import type { CreateUserInput, User } from '@/types/user';

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '');

let usersRequest: Promise<User[]> | null = null;

function getApiUrl() {
  if (!API_URL) {
    throw new Error(
      'API URL is missing. Configure NEXT_PUBLIC_API_URL in .env.local.',
    );
  }

  return API_URL;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

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
  const dob =
    typeof value.dob === 'string' || value.dob === null ? value.dob : undefined;
  const profileImage =
    typeof value.profileImage === 'string' || value.profileImage === null
      ? value.profileImage
      : undefined;

  return {
    _id: value._id,
    prefix: optionalString(value, 'prefix'),
    name: {
      firstName: optionalString(value.name, 'firstName'),
      lastName: optionalString(value.name, 'lastName'),
    },
    username: optionalString(value, 'username'),
    dob,
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
    profileImage,
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
    createdAt: optionalString(value, 'createdAt'),
    updatedAt: optionalString(value, 'updatedAt'),
  };
}

async function request(path: string, init?: RequestInit): Promise<unknown> {
  const response = await fetch(`${getApiUrl()}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
    cache: 'no-store',
  });

  const text = await response.text();
  let result: unknown = text;

  if (text) {
    try {
      result = JSON.parse(text) as unknown;
    } catch {
      if (response.ok) {
        return text;
      }
    }
  }

  if (!response.ok) {
    const message =
      isRecord(result) && typeof result.message === 'string'
        ? ` ${result.message}`
        : '';
    throw new Error(`API request failed (${response.status}).${message}`);
  }

  return result;
}

function getCollection(result: unknown): unknown {
  if (Array.isArray(result)) return result;

  if (isRecord(result)) {
    const collection = result.data ?? result.users ?? result.items;
    if (collection !== undefined) return collection;
  }

  throw new Error('Unexpected API response. Expected an array of users.');
}

export function getUsers(): Promise<User[]> {
  if (!usersRequest) {
    usersRequest = request('/users')
      .then(getCollection)
      .then((result) => {
        if (!Array.isArray(result)) {
          throw new Error('Unexpected API response. Expected an array of users.');
        }

        return result.map((user, index) => parseUser(user, index));
      })
      .finally(() => {
        usersRequest = null;
      });
  }

  return usersRequest;
}

export async function getUserById(id: string): Promise<User> {
  const users = await getUsers();
  const user = users.find((item) => item._id === id);

  if (!user) {
    throw new Error(`User ${id} was not found.`);
  }

  return user;
}

export async function createUser(user: CreateUserInput): Promise<void> {
  await request('/users', {
    method: 'POST',
    body: JSON.stringify(user),
  });
}

export async function updateUser(
  id: string,
  user: CreateUserInput,
): Promise<void> {
  await request(`/users/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(user),
  });
}
