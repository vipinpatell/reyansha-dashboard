'use client';

import Link from 'next/link';
import { Eye, KeyRound, MapPin, Pencil, UserRound } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';

import { buttonVariants } from '@/components/ui/button';
import {
  formatUserDate,
  getUserFullName,
  getUserStatusClasses,
} from '@/lib/user-format';
import type { User } from '@/types/user';
import { canSetUserPassword, hasPermission } from '@/lib/auth-permissions';
import type { AuthUser } from '@/types/auth';

export function createUserColumns(currentUser: AuthUser | null): ColumnDef<User>[] {
  return [
  {
    id: 'user',
    accessorFn: (user) => getUserFullName(user),
    header: 'User',
    cell: ({ row }) => {
      const user = row.original;
      const fullName = getUserFullName(user) || '—';

      return (
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary">
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={fullName}
                className="size-full object-cover"
              />
            ) : (
              <UserRound className="size-5" />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-foreground">{fullName}</p>
            <p className="max-w-64 truncate text-muted-foreground">
              {user.email || '—'}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              @{user.username || '—'}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'accountStatus',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.accountStatus;
      const label = status
        ? `${status.charAt(0).toUpperCase()}${status.slice(1)}`
        : 'Unavailable';

      return (
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getUserStatusClasses(status)}`}>
          {label}
        </span>
      );
    },
  },
  {
    id: 'mobile',
    accessorFn: (user) => user.mobile?.primary ?? '',
    header: 'Mobile',
    cell: ({ row }) => {
      const mobile = row.original.mobile;

      return (
        <div>
          <p>{mobile?.primary || '—'}</p>
          {mobile?.alternate && (
            <p className="mt-1 text-xs text-muted-foreground">
              {mobile.alternate}
            </p>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'gender',
    header: 'Gender',
    cell: ({ row }) => (
      <span className="capitalize">
        {row.original.gender?.replaceAll('_', ' ') || '—'}
      </span>
    ),
  },
  {
    accessorKey: 'dob',
    header: 'Date of Birth',
    cell: ({ row }) => formatUserDate(row.original.dob),
  },
  {
    id: 'location',
    accessorFn: (user) =>
      [user.address?.city, user.address?.state].filter(Boolean).join(', '),
    header: 'Location',
    cell: ({ row }) => {
      const address = row.original.address;
      const cityAndState = [address?.city, address?.state]
        .filter(Boolean)
        .join(', ');
      const countryAndPostalCode = [address?.country, address?.postalCode]
        .filter(Boolean)
        .join(' · ');

      return (
        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <div>
            <p>{cityAndState || '—'}</p>
            {countryAndPostalCode && (
              <p className="mt-1 text-xs text-muted-foreground">
                {countryAndPostalCode}
              </p>
            )}
          </div>
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: () => <span className="block text-right">Actions</span>,
    enableSorting: false,
    cell: ({ row }) => {
      const user = row.original;
      const name = getUserFullName(user) || 'user';
      const canEdit =
        hasPermission(currentUser, 'users.update') ||
        (currentUser?.id === user._id &&
          hasPermission(currentUser, 'users.update_own'));
      const canSetPassword = canSetUserPassword(currentUser);

      return (
        <div className="flex justify-end gap-2">
          <Link
            href={`/user-management/${user._id}`}
            className={buttonVariants({ variant: 'outline', size: 'icon-sm' })}
            aria-label={`View ${name} details`}
            title={`View ${name} details`}
          >
            <Eye className="size-4" />
          </Link>
          {canEdit && (
            <Link
              href={`/user-management/${user._id}/edit`}
              className={buttonVariants({ variant: 'outline', size: 'icon-sm' })}
              aria-label={`Edit ${name}`}
              title={`Edit ${name}`}
            >
              <Pencil className="size-4" />
            </Link>
          )}
          {canSetPassword && (
            <Link
              href={`/user-management/${user._id}/password`}
              className={buttonVariants({ variant: 'outline', size: 'icon-sm' })}
              aria-label={`Set temporary password for ${name}`}
              title={`Set temporary password for ${name}`}
            >
              <KeyRound className="size-4" />
            </Link>
          )}
        </div>
      );
    },
  },
  ];
}
