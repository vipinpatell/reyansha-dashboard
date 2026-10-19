
'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  UserRound,
  Download,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

import DataTable from '@/components/shared/data-table';
import { userColumns } from '@/components/shared/user-management/user-columns';
import { Button } from '@/components/ui/button';
import { getUsers } from '@/lib/api/users';
import { formatUserDate, getUserFullName } from '@/lib/user-format';
import type { User } from '@/types/user';

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  function refreshUsers() {
    setLoading(true);
    setError('');

    getUsers()
      .then(setUsers)
      .catch((requestError: unknown) => {
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Unable to load users.',
        );
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    let active = true;

    getUsers()
      .then((data) => {
        if (active) setUsers(data);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'Unable to load users.',
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return users;

    return users.filter((user) => {
      const fullName = getUserFullName(user).toLowerCase();
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
      formatUserDate(user.dob),
      user.gender ?? '',
      user.mobile?.primary ?? '',
      user.mobile?.alternate ?? '',
      user.address?.building ?? '',
      user.address?.streetAddress ?? '',
      user.address?.city ?? '',
      user.address?.state ?? '',
      user.address?.postalCode ?? '',
      user.address?.country ?? '',
      formatUserDate(user.createdAt),
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
              className="h-8 w-full border border-input bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <Button
            variant="outline"
            onClick={refreshUsers}
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
            onClick={refreshUsers}
          >
            <RefreshCw className="mr-2 size-4" />
            Try Again
          </Button>
        </div>
      )}

      {/* User data table */}
      {!loading && !error && (
        <DataTable
          ariaLabel="Users"
          columns={userColumns}
          data={filteredUsers}
          emptyState={
            <div>
              <UserRound className="mx-auto mb-3 size-8 text-muted-foreground" />
              <p className="font-medium">No users found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {users.length === 0
                  ? 'No users have been returned by the API.'
                  : 'Try another search term.'}
              </p>
            </div>
          }
        />
      )}
    </section>
  );
}
