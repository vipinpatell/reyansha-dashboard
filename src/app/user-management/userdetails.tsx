
'use client';

import { useEffect, useState } from 'react';
import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  AtSign,
  Clock,
  Camera,
  User as UserIcon,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import Breadcrumbs from '@/components/shared/breadcrumbs/page';
import { Button } from '@/components/ui/button';
import { getUserById } from '@/lib/api/users';
import {
  formatUserDate,
  formatUserDateTime,
  getUserFullName,
} from '@/lib/user-format';
import type { User } from '@/types/user';

interface UserDetailsProps {
  id: string;
}

export default function UserDetails({ id }: UserDetailsProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;

    getUserById(id)
      .then((result) => {
        if (active) setUser(result);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'Unable to load this user.',
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id, retryCount]);

  if (loading) {
    return (
      <main className="min-h-screen bg-muted/30 p-6 sm:p-8">
        <div className="mx-auto max-w-5xl space-y-6">
          <Breadcrumbs />
          <section
            aria-live="polite"
            aria-busy="true"
            className="rounded-xl border bg-card px-6 py-16 text-center"
          >
            <RefreshCw className="mx-auto mb-3 size-8 animate-spin text-primary" />
            <p className="font-medium">Loading user details...</p>
          </section>
        </div>
      </main>
    );
  }

  if (error || !user) {
    return (
      <main className="min-h-screen bg-muted/30 p-6 sm:p-8">
        <div className="mx-auto max-w-5xl space-y-6">
          <Breadcrumbs />
          <section className="rounded-xl border bg-card px-6 py-16 text-center">
            <AlertCircle className="mx-auto mb-3 size-10 text-destructive" />
            <h1 className="text-xl font-semibold">
              {error ? 'Unable to load user' : 'User Not Found'}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {error || `No user was returned for ID ${id}.`}
            </p>
            {error && (
              <Button
                className="mt-4"
                onClick={() => {
                  setError('');
                  setLoading(true);
                  setRetryCount((count) => count + 1);
                }}
              >
                <RefreshCw className="mr-2 size-4" />
                Try Again
              </Button>
            )}
          </section>
        </div>
      </main>
    );
  }

  const fullName = getUserFullName(user);

  return (
    <main className="min-h-screen bg-muted/30 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
       <Breadcrumbs />

        {/* Cover and profile header */}
        <section className="overflow-hidden rounded-2xl border bg-card">
          <div className="relative h-36 bg-gradient-to-r from-primary/40 via-primary/15 to-muted sm:h-48">
            <span className="absolute right-5 top-5 rounded-full border border-white/30 bg-background/70 px-3 py-1 text-xs font-medium backdrop-blur">
              User Profile
            </span>
          </div>

          <div className="flex flex-col gap-4 px-5 pb-6 sm:flex-row sm:items-end sm:px-8">
            <div className="-mt-12 flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-card bg-background text-primary shadow-sm">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={fullName}
                  className="size-full object-cover"
                />
              ) : (
                <UserRound className="size-11" />
              )}
            </div>

            <div className="min-w-0 flex-1 pt-1">
              <h1 className="text-2xl font-bold tracking-tight">{fullName}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                @{user.username || '—'}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <span className="size-1.5 rounded-full bg-current" />
                  User Profile
                </span>
                <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                  ID: {user._id}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Profile overview */}
        <div className="grid gap-6 lg:grid-cols-2">
          <InfoSection
            icon={<UserIcon className="size-5" />}
            title="Personal Information"
            description="Basic information about this user."
          >
            <DetailRow label="First Name" value={user.name.firstName} />
            <DetailRow label="Last Name" value={user.name.lastName} />
            <DetailRow
              icon={<AtSign className="size-4" />}
              label="Username"
              value={user.username}
            />
            <DetailRow
              icon={<CalendarDays className="size-4" />}
              label="Date of Birth"
              value={formatUserDate(user.dob, 'long')}
            />
            <DetailRow
              label="Gender"
              value={user.gender
                ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1)
                : '—'}
            />
          </InfoSection>

          <InfoSection
            icon={<Phone className="size-5" />}
            title="Contact Information"
            description="Email and phone numbers."
          >
            <DetailRow
              icon={<Mail className="size-4" />}
              label="Email Address"
              value={user.email}
            />
            <DetailRow
              icon={<Phone className="size-4" />}
              label="Primary Mobile"
              value={user.mobile?.primary}
            />
            <DetailRow
              icon={<Phone className="size-4" />}
              label="Alternate Mobile"
              value={user.mobile?.alternate}
            />
          </InfoSection>

          <InfoSection
            icon={<MapPin className="size-5" />}
            title="Address Information"
            description="Registered address for this user."
          >
            <DetailRow label="Building / House" value={user.address?.building} />
            <DetailRow label="Street Address" value={user.address?.streetAddress} />
            <DetailRow label="City" value={user.address?.city} />
            <DetailRow label="State" value={user.address?.state} />
            <DetailRow label="Postal Code" value={user.address?.postalCode} />
            <DetailRow label="Country" value={user.address?.country} />
          </InfoSection>

          <InfoSection
            icon={<Clock className="size-5" />}
            title="Account Information"
            description="Record creation and last update."
          >
            <DetailRow label="MongoDB ID" value={user._id} />
            <DetailRow label="Created At" value={formatUserDateTime(user.createdAt)} />
            <DetailRow label="Last Updated" value={formatUserDateTime(user.updatedAt)} />
            <DetailRow
              icon={<Camera className="size-4" />}
              label="Profile Image"
              value={user.profileImage ? 'Image available' : 'No profile image'}
            />
          </InfoSection>
        </div>
      </div>
    </main>
  );
}

function InfoSection({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-xl border bg-card">
      <div className="flex items-start gap-3 border-b p-5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <div>
          <h2 className="font-semibold">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="space-y-4 p-5">{children}</div>
    </section>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3 border-b pb-4 last:border-0 last:pb-0">
      <div className="mt-0.5 text-muted-foreground">
        {icon ?? <span className="block size-4" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 break-words text-sm font-medium">{value || '—'}</p>
      </div>
    </div>
  );
}
