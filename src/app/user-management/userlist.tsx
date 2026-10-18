
'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Search,
  UserRound,
  Eye,
  MapPin,
  Download,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

import { Button, buttonVariants } from '@/components/ui/button';

interface User {
  _id: string;
  name: {
    firstName: string;
    lastName: string;
  };
  username: string;
  dob: string;
  gender: string;
  mobile: {
    primary: string;
    alternate?: string;
  };
  email: string;
  address: {
    building?: string;
    streetAddress?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  profileImage: string | null;
  createdAt: string;
  updatedAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Reuse an in-flight GET request when React Strict Mode runs effects twice.
let usersRequest: Promise<User[]> | null = null;

function requestUsers(): Promise<User[]> {
  if (!API_URL) {
    return Promise.reject(
      new Error('API URL is missing. Configure NEXT_PUBLIC_API_URL in .env.local.'),
    );
  }

  if (!usersRequest) {
    usersRequest = fetch(`${API_URL}/users`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Unable to fetch users. Server returned ${response.status}.`);
        }

        const result: unknown = await response.json();
        let data: unknown = result;

        if (!Array.isArray(result) && result && typeof result === 'object') {
          const body = result as Record<string, unknown>;
          data = body.data ?? body.users ?? body.items;
        }

        if (!Array.isArray(data)) {
          throw new Error('Unexpected API response. Expected an array of users.');
        }

        return data as User[];
      })
      .finally(() => {
        usersRequest = null;
      });
  }

  return usersRequest;
}

function formatDate(value?: string) {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '—';

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function getFullName(user: User) {
  return `${user.name?.firstName ?? ''} ${user.name?.lastName ?? ''}`.trim();
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = useCallback(async (isActive?: () => boolean) => {
    setLoading(true);
    setError('');

    try {
      const data = await requestUsers();

      if (isActive && !isActive()) return;
      setUsers(data);
    } catch (err) {
      if (isActive && !isActive()) return;

      setError(
        err instanceof Error ? err.message : 'Something went wrong.',
      );
    } finally {
      if (!isActive || isActive()) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let active = true;

    void fetchUsers(() => active);

    return () => {
      active = false;
    };
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return users;

    return users.filter((user) => {
      const fullName = getFullName(user).toLowerCase();
      const username = (user.username ?? '').toLowerCase();
      const email = (user.email ?? '').toLowerCase();
      const mobile = user.mobile?.primary ?? '';
      const city = user.address?.city ?? '';
      const state = user.address?.state ?? '';

      return (
        fullName.includes(query) ||
        username.includes(query) ||
        email.includes(query) ||
        mobile.toLowerCase().includes(query) ||
        city.toLowerCase().includes(query) ||
        state.toLowerCase().includes(query)
      );
    });
  }, [users, search]);

  function exportUsers() {
    const headers = [
      'ID',
      'First Name',
      'Last Name',
      'Username',
      'Email',
      'Date of Birth',
      'Gender',
      'Primary Mobile',
      'Alternate Mobile',
      'Building',
      'Street Address',
      'City',
      'State',
      'Postal Code',
      'Country',
      'Created At',
    ];

    const rows = filteredUsers.map((user) => [
      user._id,
      user.name?.firstName ?? '',
      user.name?.lastName ?? '',
      user.username ?? '',
      user.email ?? '',
      formatDate(user.dob),
      user.gender ?? '',
      user.mobile?.primary ?? '',
      user.mobile?.alternate ?? '',
      user.address?.building ?? '',
      user.address?.streetAddress ?? '',
      user.address?.city ?? '',
      user.address?.state ?? '',
      user.address?.postalCode ?? '',
      user.address?.country ?? '',
      formatDate(user.createdAt),
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','),
      )
      .join('\r\n');

    const url = URL.createObjectURL(
      new Blob(['\uFEFF' + csv], {
        type: 'text/csv;charset=utf-8;',
      }),
    );

    const link = document.createElement('a');
    link.href = url;
    link.download = 'reyansha-users.csv';
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <section className="space-y-5">
      {/* Heading and actions */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold">All Users</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {loading
              ? 'Loading users...'
              : `${filteredUsers.length} users found`}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative sm:w-72">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, email, mobile..."
              aria-label="Search users"
              className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <Button
            variant="outline"
            onClick={() => void fetchUsers()}
            disabled={loading}
          >
            <RefreshCw className={`mr-2 size-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button
            variant="outline"
            onClick={exportUsers}
            disabled={filteredUsers.length === 0}
          >
            <Download className="mr-2 size-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="rounded-xl border bg-card p-12 text-center">
          <RefreshCw className="mx-auto mb-3 size-7 animate-spin text-primary" />
          <p className="font-medium">Loading users</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Fetching users from the API...
          </p>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="rounded-xl border border-destructive/30 bg-card p-8 text-center">
          <AlertCircle className="mx-auto mb-3 size-8 text-destructive" />
          <h3 className="font-semibold">Unable to load users</h3>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
            {error}
          </p>
          <Button
            className="mt-4"
            onClick={() => void fetchUsers()}
          >
            <RefreshCw className="mr-2 size-4" />
            Try Again
          </Button>
        </div>
      )}

      {/* Users table */}
      {!loading && !error && (
        <div className="overflow-x-auto rounded-xl border bg-card">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-5 py-4 font-medium">User</th>
                <th className="px-5 py-4 font-medium">Mobile</th>
                <th className="px-5 py-4 font-medium">Gender</th>
                <th className="px-5 py-4 font-medium">Date of Birth</th>
                <th className="px-5 py-4 font-medium">Location</th>
                <th className="px-5 py-4 text-right font-medium">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="transition-colors hover:bg-muted/30"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary">
                        {user.profileImage ? (
                          <img
                            src={user.profileImage}
                            alt={getFullName(user)}
                            className="size-full object-cover"
                          />
                        ) : (
                          <UserRound className="size-5" />
                        )}
                      </div>

                      <div>
                        <p className="font-medium">{getFullName(user) || '—'}</p>
                        <p className="text-muted-foreground">
                          {user.email || '—'}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          @{user.username || '—'}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <p>{user.mobile?.primary || '—'}</p>
                    {user.mobile?.alternate && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {user.mobile.alternate}
                      </p>
                    )}
                  </td>

                  <td className="px-5 py-4 capitalize">
                    {user.gender || '—'}
                  </td>

                  <td className="px-5 py-4">
                    {formatDate(user.dob)}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                      <div>
                        <p>
                          {[user.address?.city, user.address?.state]
                            .filter(Boolean)
                            .join(', ') || '—'}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {[user.address?.country, user.address?.postalCode]
                            .filter(Boolean)
                            .join(' · ')}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/user-management/${user._id}`}
                      className={buttonVariants({
                        variant: 'outline',
                        size: 'sm',
                      })}
                    >
                      <Eye className="mr-2 size-4" />
                      View
                    </Link>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <UserRound className="mx-auto mb-3 size-8 text-muted-foreground" />
                    <p className="font-medium">No users found</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {users.length === 0
                        ? 'No users have been returned by the API.'
                        : 'Try another search term.'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
