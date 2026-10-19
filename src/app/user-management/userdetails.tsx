
'use client';

import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  UserRound,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  AtSign,
  Clock,
  Camera,
  AlertCircle,
  RefreshCw,
  BriefcaseBusiness,
  ContactRound,
  Pencil,
} from 'lucide-react';
import Link from 'next/link';
import Breadcrumbs from '@/components/shared/breadcrumbs/page';
import { Button, buttonVariants } from '@/components/ui/button';
import { getUserById } from '@/lib/api/users';
import { userOptions } from '@/lib/user-options';
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
      <main className="flex-1 bg-muted/30 p-6 sm:p-8">
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
      <main className="flex-1 bg-muted/30 p-6 sm:p-8">
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
  const address = user.address;
  const emergencyContact = user.emergencyContact;

  return (
    <main className="flex-1 bg-muted/30 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-5">
        <Breadcrumbs />

        <section className="relative overflow-hidden rounded-2xl border bg-card shadow-sm">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-28 bg-gradient-to-r from-primary/15 via-primary/5 to-transparent"
          />
          <div className="relative flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-7">
            <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-background text-primary shadow-sm sm:size-24">
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

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                User profile
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                {fullName}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {[user.prefix && formatOption(user.prefix, userOptions.prefixes), user.designation]
                  .filter(Boolean)
                  .join(' · ') || 'No role specified'}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {user.department && (
                  <span className="rounded-full border bg-background/80 px-2.5 py-1 text-xs font-medium">
                    {formatOption(user.department, userOptions.departments)}
                  </span>
                )}
                {user.userType && (
                  <span className="rounded-full border bg-background/80 px-2.5 py-1 text-xs font-medium">
                    {formatOption(user.userType, userOptions.userTypes)}
                  </span>
                )}
                {user.employeeId && (
                  <span className="rounded-full border bg-background/80 px-2.5 py-1 font-mono text-xs text-muted-foreground">
                    {user.employeeId}
                  </span>
                )}
              </div>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:items-end">
              <Link
                href={`/user-management/${user._id}/edit`}
                className={buttonVariants()}
              >
                <Pencil className="mr-2 size-4" />
                Edit User
              </Link>
              <Link
                href="/user-management"
                className={buttonVariants({ variant: 'ghost', size: 'sm' })}
              >
                <ArrowLeft className="mr-2 size-4" />
                Back to users
              </Link>
            </div>
          </div>

          <div className="grid border-t bg-muted/20 sm:grid-cols-3">
            <SummaryItem
              icon={<Mail className="size-4" />}
              label="Email"
              value={user.email}
            />
            <SummaryItem
              icon={<Phone className="size-4" />}
              label="Primary phone"
              value={user.mobile?.primary}
            />
            <SummaryItem
              icon={<BriefcaseBusiness className="size-4" />}
              label="Work location"
              value={formatOption(user.workLocation, userOptions.workLocations)}
            />
          </div>
        </section>

        <div className="grid items-start gap-5 xl:grid-cols-2">
          <InfoSection
            icon={<UserRound className="size-5" />}
            title="Personal Information"
            description="Identity and personal details."
          >
            <DetailItem label="First name" value={user.name.firstName} />
            <DetailItem label="Last name" value={user.name.lastName} />
            <DetailItem
              icon={<AtSign className="size-4" />}
              label="Username"
              value={user.username}
            />
            <DetailItem
              icon={<CalendarDays className="size-4" />}
              label="Date of birth"
              value={formatUserDate(user.dob, 'long')}
            />
            <DetailItem
              label="Gender"
              value={user.gender ? formatOption(user.gender, userOptions.genders) : undefined}
            />
          </InfoSection>

          <InfoSection
            icon={<Phone className="size-5" />}
            title="Contact Information"
            description="Reach this user and their emergency contact."
          >
            <DetailItem
              icon={<Mail className="size-4" />}
              label="Email address"
              value={user.email}
            />
            <DetailItem
              icon={<Phone className="size-4" />}
              label="Primary mobile"
              value={user.mobile?.primary}
            />
            <DetailItem
              icon={<Phone className="size-4" />}
              label="Alternate mobile"
              value={user.mobile?.alternate}
            />
            <DetailItem
              icon={<Mail className="size-4" />}
              label="Alternate contact email"
              value={user.alternateContactEmail}
            />
            <DetailItem label="Emergency contact" value={emergencyContact?.name} />
            <DetailItem
              icon={<Phone className="size-4" />}
              label="Emergency contact phone"
              value={emergencyContact?.phone}
            />
          </InfoSection>

          <InfoSection
            icon={<MapPin className="size-5" />}
            title="Address Information"
            description="Registered residential or mailing address."
          >
            <DetailItem label="Building / house" value={address?.building} />
            <DetailItem
              className="sm:col-span-2"
              label="Street address"
              value={address?.streetAddress}
            />
            <DetailItem label="City" value={address?.city} />
            <DetailItem label="State" value={address?.state} />
            <DetailItem label="Postal code" value={address?.postalCode} />
            <DetailItem label="Country" value={address?.country} />
          </InfoSection>

          <InfoSection
            icon={<BriefcaseBusiness className="size-5" />}
            title="Employment Information"
            description="Position, organization, and work arrangement."
          >
            <DetailItem label="Designation" value={user.designation} />
            <DetailItem
              label="User type"
              value={formatOption(user.userType, userOptions.userTypes)}
            />
            <DetailItem
              label="Department"
              value={formatOption(user.department, userOptions.departments)}
            />
            <DetailItem label="Employee ID" value={user.employeeId} />
            <DetailItem
              className="sm:col-span-2"
              label="Reporting manager ID"
              value={user.reportingManager}
            />
            <DetailItem
              icon={<CalendarDays className="size-4" />}
              label="Joining date"
              value={formatUserDate(user.joiningDate, 'long')}
            />
            <DetailItem
              label="Employment type"
              value={formatOption(user.employmentType, userOptions.employmentTypes)}
            />
            <DetailItem
              label="Work location"
              value={formatOption(user.workLocation, userOptions.workLocations)}
            />
          </InfoSection>

          <InfoSection
            icon={<ContactRound className="size-5" />}
            title="Additional Information"
            description="Skills, tags, and internal notes."
          >
            <DetailItem label="Tags" value={<TagList values={user.tags} />} />
            <DetailItem label="Skills" value={<TagList values={user.skills} />} />
            <DetailItem
              className="sm:col-span-2"
              label="Internal notes"
              value={user.notes}
            />
            <DetailItem
              className="sm:col-span-2"
              icon={<Camera className="size-4" />}
              label="Profile image URL"
              value={user.profileImage}
            />
          </InfoSection>

          <InfoSection
            icon={<Clock className="size-5" />}
            title="Account Information"
            description="Record identifiers and audit timestamps."
          >
            <DetailItem
              className="sm:col-span-2"
              label="User ID"
              value={user._id}
              monospace
            />
            <DetailItem
              label="Created"
              value={formatUserDateTime(user.createdAt)}
            />
            <DetailItem
              label="Last updated"
              value={formatUserDateTime(user.updatedAt)}
            />
          </InfoSection>
        </div>
      </div>
    </main>
  );
}

function formatOption(
  value: string | null | undefined,
  options: readonly { value: string; label: string }[],
) {
  if (!value) return undefined;

  return (
    options.find((option) => option.value === value)?.label ??
    value
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
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
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <div className="min-w-0">
          <h2 className="font-semibold tracking-tight">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5">{children}</div>
    </section>
  );
}

function SummaryItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3 border-b p-4 last:border-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
      <div className="mt-0.5 text-primary">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="mt-1 break-words text-sm font-semibold">{value || '—'}</p>
      </div>
    </div>
  );
}

function DetailItem({
  icon,
  label,
  value,
  className,
  monospace = false,
}: {
  icon?: React.ReactNode;
  label: string;
  value?: React.ReactNode;
  className?: string;
  monospace?: boolean;
}) {
  const isEmpty = value === undefined || value === null || value === '';

  return (
    <div className={`min-w-0 rounded-lg border bg-muted/20 p-3 ${className ?? ''}`}>
      <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        {icon}
        {label}
      </p>
      <div
        className={`mt-1.5 break-words text-sm font-medium ${monospace ? 'font-mono text-xs' : ''}`}
      >
        {isEmpty ? <span className="text-muted-foreground">—</span> : value}
      </div>
    </div>
  );
}

function TagList({ values }: { values?: string[] }) {
  if (!values?.length) {
    return <span className="text-muted-foreground">—</span>;
  }

  return (
    <span className="flex flex-wrap gap-1.5">
      {values.map((value) => (
        <span
          key={value}
          className="rounded-full border bg-background px-2 py-0.5 text-xs font-medium"
        >
          {value}
        </span>
      ))}
    </span>
  );
}
