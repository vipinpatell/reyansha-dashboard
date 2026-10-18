'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, LoaderCircle, Save, UserRound } from 'lucide-react';

import UserProfileFields from '@/components/shared/user-management/user-profile-fields';
import Breadcrumbs from '@/components/shared/breadcrumbs/page';
import { Button, buttonVariants } from '@/components/ui/button';
import { createUser, getUserById, updateUser } from '@/lib/api/users';
import type { CreateUserInput, User, UserFormValues } from '@/types/user';

const initialValues: UserFormValues = {
  firstName: '',
  lastName: '',
  username: '',
  dob: '',
  gender: 'male',
  email: '',
  primaryMobile: '',
  alternateMobile: '',
  building: '',
  streetAddress: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'India',
  profileImage: '',
};

function hasRequiredFields(values: UserFormValues) {
  return [
    values.firstName,
    values.lastName,
    values.username,
    values.dob,
    values.email,
    values.primaryMobile,
  ].every((value) => value.trim().length > 0);
}

function toFormValues(user: User): UserFormValues {
  return {
    firstName: user.name.firstName ?? '',
    lastName: user.name.lastName ?? '',
    username: user.username ?? '',
    dob: user.dob ? user.dob.slice(0, 10) : '',
    gender: user.gender ?? 'male',
    email: user.email ?? '',
    primaryMobile: user.mobile?.primary ?? '',
    alternateMobile: user.mobile?.alternate ?? '',
    building: user.address?.building ?? '',
    streetAddress: user.address?.streetAddress ?? '',
    city: user.address?.city ?? '',
    state: user.address?.state ?? '',
    postalCode: user.address?.postalCode ?? '',
    country: user.address?.country ?? 'India',
    profileImage: user.profileImage ?? '',
  };
}

interface UserFormProps {
  userId?: string;
}

export default function UserForm({ userId }: UserFormProps) {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [originalValues, setOriginalValues] =
    useState<UserFormValues | null>(null);
  const [error, setError] = useState('');
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);
  const [loadingUser, setLoadingUser] = useState(Boolean(userId));
  const requiredFieldsComplete = hasRequiredFields(values);
  const isEditing = Boolean(userId);

  useEffect(() => {
    if (!userId) return;

    let active = true;

    getUserById(userId)
      .then((user) => {
        if (active) {
          const formValues = toFormValues(user);
          setValues(formValues);
          setOriginalValues(formValues);
        }
      })
      .catch((requestError: unknown) => {
        if (active) {
          setLoadError(
            requestError instanceof Error
              ? requestError.message
              : 'Unable to load this user.',
          );
        }
      })
      .finally(() => {
        if (active) setLoadingUser(false);
      });

    return () => {
      active = false;
    };
  }, [userId]);

  const hasChanges =
    !isEditing ||
    (originalValues !== null &&
      Object.keys(values).some((field) => {
        const key = field as keyof UserFormValues;
        return values[key] !== originalValues[key];
      }));
  const canSave = requiredFieldsComplete && hasChanges;

  function updateField<K extends keyof UserFormValues>(
    field: K,
    value: UserFormValues[K],
  ) {
    setValues((currentValues) => ({ ...currentValues, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving) return;
    if (!canSave || loadError) return;

    setError('');
    setSaving(true);

    const payload: CreateUserInput = {
      name: {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
      },
      username: values.username.trim(),
      dob: new Date(`${values.dob}T00:00:00.000Z`).toISOString(),
      gender: values.gender,
      mobile: {
        primary: values.primaryMobile.trim(),
        alternate: values.alternateMobile.trim(),
      },
      email: values.email.trim(),
      address: {
        building: values.building.trim(),
        streetAddress: values.streetAddress.trim(),
        city: values.city.trim(),
        state: values.state.trim(),
        postalCode: values.postalCode.trim(),
        country: values.country.trim(),
      },
      profileImage: values.profileImage.trim() || null,
    };

    try {
      if (userId) {
        await updateUser(userId, payload);
      } else {
        await createUser(payload);
      }
      router.push('/user-management/users');
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : `Unable to ${isEditing ? 'update' : 'create'} the user. Please try again.`,
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-muted/30 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <Breadcrumbs />

        <section className="relative overflow-hidden rounded-2xl border bg-card">
          <div className="h-36 bg-gradient-to-r from-primary/30 via-primary/10 to-muted sm:h-44">
            <div className="absolute right-6 top-6 hidden rounded-full border border-white/40 bg-background/60 px-3 py-1 text-xs font-medium backdrop-blur sm:block">
              User Management
            </div>
          </div>

          <div className="flex flex-col gap-4 px-5 pb-6 sm:flex-row sm:items-end sm:px-8">
            <div className="-mt-12 flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-card bg-background text-primary shadow-sm">
              {values.profileImage ? (
                <img
                  src={values.profileImage}
                  alt="Profile preview"
                  className="size-full object-cover"
                />
              ) : (
                <UserRound className="size-11" />
              )}
            </div>

            <div className="min-w-0 flex-1 pt-1">
              <h1 className="text-2xl font-bold tracking-tight">
                {isEditing ? 'Edit User' : 'Add New User'}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {isEditing
                  ? 'Update this user’s personal, contact, and address details.'
                  : 'Create a user profile with personal, contact, and address details.'}
              </p>
            </div>

            <Link
              href="/user-management/users"
              className={buttonVariants({ variant: 'outline' })}
            >
              <ArrowLeft className="mr-2 size-4" />
              Back to Users
            </Link>
          </div>
        </section>

        {loadingUser ? (
          <div
            aria-live="polite"
            aria-busy="true"
            className="rounded-xl border bg-card p-12 text-center"
          >
            <LoaderCircle className="mx-auto mb-3 size-7 animate-spin text-primary" />
            <p className="font-medium">Loading user details...</p>
          </div>
        ) : loadError ? (
          <div className="rounded-xl border border-destructive/30 bg-card p-8 text-center">
            <p role="alert" className="text-sm text-destructive">
              Unable to load user: {loadError}
            </p>
            <Link
              href="/user-management/users"
              className={`${buttonVariants({ variant: 'outline' })} mt-4`}
            >
              Back to Users
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <UserProfileFields values={values} onChange={updateField} />

            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}

            <div className="flex flex-col-reverse justify-end gap-3 rounded-xl border bg-card p-4 sm:flex-row sm:p-5">
              <Link
                href="/user-management"
                className={buttonVariants({ variant: 'outline' })}
              >
                Cancel
              </Link>

              <Button
                type="submit"
                disabled={saving || !canSave}
                title={
                  !requiredFieldsComplete
                    ? 'Complete all required fields to save.'
                    : !hasChanges
                      ? 'Change at least one field before saving.'
                      : undefined
                }
              >
                <Save className="mr-2 size-4" />
                {saving
                  ? isEditing
                    ? 'Updating...'
                    : 'Saving...'
                  : isEditing
                    ? 'Update User'
                    : 'Save User'}
              </Button>
            </div>
            {!requiredFieldsComplete ? (
              <p className="text-right text-sm text-muted-foreground">
                Complete all required fields to enable saving.
              </p>
            ) : isEditing && !hasChanges ? (
              <p className="text-right text-sm text-muted-foreground">
                Make a change to enable updating this user.
              </p>
            ) : null}
          </form>
        )}
      </div>
    </main>
  );
}
