'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  BadgeCheck,
  CircleAlert,
  LoaderCircle,
  Save,
  UserRound,
  X,
} from 'lucide-react';

import UserProfileFields from '@/components/shared/user-management/user-profile-fields';
import Breadcrumbs from '@/components/shared/breadcrumbs/page';
import { Button, buttonVariants } from '@/components/ui/button';
import { createUser, getUserById, updateUser } from '@/lib/api/users';
import { userOptions } from '@/lib/user-options';
import type { CreateUserInput, User, UserFormValues } from '@/types/user';

const initialValues: UserFormValues = {
  prefix: '',
  firstName: '',
  lastName: '',
  username: '',
  dob: '',
  gender: 'prefer_not_to_say',
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
  designation: '',
  userType: '',
  department: '',
  employeeId: '',
  reportingManager: '',
  joiningDate: '',
  employmentType: '',
  workLocation: '',
  tags: '',
  notes: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  alternateContactEmail: '',
  skills: '',
};

const phonePattern = /^\+[1-9]\d{7,14}$/;
const usernamePattern =
  /^[a-zA-Z0-9._-]+(?:@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})?$/;
const employeeIdPattern = /^[a-zA-Z0-9_-]+$/;
const mongoIdPattern = /^[a-fA-F0-9]{24}$/;

function splitList(value: string) {
  return [...new Set(value.split(',').map((item) => item.trim()).filter(Boolean))];
}

function validateForm(values: UserFormValues): string | null {
  const requiredValues = [
    values.firstName,
    values.lastName,
    values.username,
    values.dob,
    values.gender,
    values.email,
    values.primaryMobile,
    values.building,
    values.streetAddress,
    values.city,
    values.state,
    values.postalCode,
    values.country,
  ];

  if (requiredValues.some((value) => !value.trim())) {
    return 'Complete all required fields.';
  }
  if (
    values.prefix &&
    !userOptions.prefixes.some((option) => option.value === values.prefix)
  ) {
    return 'Choose a valid prefix.';
  }
  if (!userOptions.genders.some((option) => option.value === values.gender)) {
    return 'Choose a valid gender.';
  }
  if (
    values.userType &&
    !userOptions.userTypes.some((option) => option.value === values.userType)
  ) {
    return 'Choose a valid user type.';
  }
  if (
    values.department &&
    !userOptions.departments.some((option) => option.value === values.department)
  ) {
    return 'Choose a valid department.';
  }
  if (
    values.employmentType &&
    !userOptions.employmentTypes.some(
      (option) => option.value === values.employmentType,
    )
  ) {
    return 'Choose a valid employment type.';
  }
  if (
    values.workLocation &&
    !userOptions.workLocations.some(
      (option) => option.value === values.workLocation,
    )
  ) {
    return 'Choose a valid work location.';
  }
  if (values.username.length < 3 || values.username.length > 30 || !usernamePattern.test(values.username)) {
    return 'Username must match the accepted format and be 3–30 characters.';
  }
  if (values.firstName.length > 100 || values.lastName.length > 100) {
    return 'First and last names must be 100 characters or fewer.';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) || values.email.length > 254) {
    return 'Enter a valid email address of 254 characters or fewer.';
  }
  if (!phonePattern.test(values.primaryMobile)) {
    return 'Enter the primary mobile number in international format.';
  }
  if (values.alternateMobile && !phonePattern.test(values.alternateMobile)) {
    return 'Enter the alternate mobile number in international format.';
  }
  if (values.emergencyContactName.trim() && !values.emergencyContactPhone) {
    return 'Enter a phone number for the emergency contact.';
  }
  if (!values.emergencyContactName.trim() && values.emergencyContactPhone) {
    return 'Enter a name for the emergency contact.';
  }
  if (values.emergencyContactPhone && !phonePattern.test(values.emergencyContactPhone)) {
    return 'Enter the emergency contact number in international format.';
  }
  if (values.emergencyContactName.length > 100) {
    return 'Emergency contact name must be 100 characters or fewer.';
  }
  if (
    values.employeeId &&
    (values.employeeId.length > 50 || !employeeIdPattern.test(values.employeeId))
  ) {
    return 'Employee ID may contain only letters, numbers, hyphens, and underscores.';
  }
  if (values.reportingManager && !mongoIdPattern.test(values.reportingManager)) {
    return 'Reporting Manager ID must be a 24-character MongoDB ID.';
  }
  if (
    values.alternateContactEmail &&
    (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.alternateContactEmail) ||
      values.alternateContactEmail.length > 254)
  ) {
    return 'Enter a valid alternate contact email.';
  }
  if (
    values.profileImage &&
    (!URL.canParse(values.profileImage) ||
      !['http:', 'https:'].includes(new URL(values.profileImage).protocol))
  ) {
    return 'Profile image must be a valid HTTP or HTTPS URL.';
  }
  if (values.designation.length > 100) {
    return 'Designation must be 100 characters or fewer.';
  }
  if (
    values.building.length > 200 ||
    values.streetAddress.length > 300 ||
    values.city.length > 100 ||
    values.state.length > 100 ||
    values.postalCode.length > 20 ||
    values.country.length > 100
  ) {
    return 'One or more address fields exceed the allowed length.';
  }
  if (
    values.dob &&
    (Number.isNaN(Date.parse(values.dob)) || values.dob > new Date().toISOString().slice(0, 10))
  ) {
    return 'Date of birth must be a valid date in the past.';
  }
  if (values.joiningDate && Number.isNaN(Date.parse(values.joiningDate))) {
    return 'Joining date must be a valid date.';
  }

  const tags = splitList(values.tags);
  const skills = splitList(values.skills);

  if (tags.length > 25 || tags.some((tag) => tag.length > 50)) {
    return 'Enter up to 25 tags, each no longer than 50 characters.';
  }
  if (skills.length > 50 || skills.some((skill) => skill.length > 100)) {
    return 'Enter up to 50 skills, each no longer than 100 characters.';
  }
  if (values.notes.length > 2000) {
    return 'Internal notes must be 2,000 characters or fewer.';
  }

  return null;
}

function toFormValues(user: User): UserFormValues {
  return {
    prefix: user.prefix ?? '',
    firstName: user.name.firstName ?? '',
    lastName: user.name.lastName ?? '',
    username: user.username ?? '',
    dob: user.dob ? user.dob.slice(0, 10) : '',
    gender: user.gender ?? 'prefer_not_to_say',
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
    designation: user.designation ?? '',
    userType: user.userType ?? '',
    department: user.department ?? '',
    employeeId: user.employeeId ?? '',
    reportingManager: user.reportingManager ?? '',
    joiningDate: user.joiningDate ? user.joiningDate.slice(0, 10) : '',
    employmentType: user.employmentType ?? '',
    workLocation: user.workLocation ?? '',
    tags: user.tags?.join(', ') ?? '',
    notes: user.notes ?? '',
    emergencyContactName: user.emergencyContact?.name ?? '',
    emergencyContactPhone: user.emergencyContact?.phone ?? '',
    alternateContactEmail: user.alternateContactEmail ?? '',
    skills: user.skills?.join(', ') ?? '',
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
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);
  const [loadingUser, setLoadingUser] = useState(Boolean(userId));
  const validationError = validateForm(values);
  const formIsValid = validationError === null;
  const isEditing = Boolean(userId);

  useEffect(() => {
    if (!feedback) return;

    const timeout = window.setTimeout(() => {
      if (feedback.type === 'success') {
        router.push('/user-management');
      } else {
        setFeedback(null);
      }
    }, feedback.type === 'success' ? 1400 : 7000);

    return () => window.clearTimeout(timeout);
  }, [feedback, router]);

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
  const canSave = formIsValid && hasChanges;

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

    setFeedback(null);
    setSaving(true);

    const payload: CreateUserInput = {
      prefix: values.prefix || null,
      name: {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
      },
      username: values.username.trim(),
      dob: new Date(`${values.dob}T00:00:00.000Z`).toISOString(),
      gender: values.gender,
      mobile: {
        primary: values.primaryMobile.trim(),
        alternate: values.alternateMobile.trim() || null,
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
      designation: values.designation.trim() || null,
      userType: values.userType || null,
      department: values.department || null,
      employeeId: values.employeeId.trim() || null,
      reportingManager: values.reportingManager.trim() || null,
      joiningDate: values.joiningDate
        ? new Date(`${values.joiningDate}T00:00:00.000Z`).toISOString()
        : null,
      employmentType: values.employmentType || null,
      workLocation: values.workLocation || null,
      tags: splitList(values.tags),
      notes: values.notes.trim() || null,
      emergencyContact:
        values.emergencyContactName.trim() && values.emergencyContactPhone.trim()
          ? {
              name: values.emergencyContactName.trim(),
              phone: values.emergencyContactPhone.trim(),
            }
          : null,
      alternateContactEmail: values.alternateContactEmail.trim() || null,
      skills: splitList(values.skills),
    };

    try {
      if (userId) {
        await updateUser(userId, payload);
      } else {
        await createUser(payload);
      }
      setFeedback({
        type: 'success',
        message: isEditing
          ? 'User updated successfully. Returning to the user list…'
          : 'User created successfully. Returning to the user list…',
      });
    } catch (submitError) {
      setFeedback({
        type: 'error',
        message:
          submitError instanceof Error
            ? submitError.message
            : `Unable to ${isEditing ? 'update' : 'create'} the user. Please try again.`,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="relative flex-1 bg-muted/30 px-4 py-6 sm:px-6 lg:px-8">
      {feedback && (
        <div
          role={feedback.type === 'error' ? 'alert' : 'status'}
          aria-live={feedback.type === 'error' ? 'assertive' : 'polite'}
          className={`fixed right-4 top-20 z-50 flex w-[calc(100%-2rem)] max-w-md items-start gap-3 rounded-xl border p-4 shadow-lg ${
            feedback.type === 'success'
              ? 'border-emerald-500/30 bg-background text-foreground'
              : 'border-destructive/30 bg-background text-foreground'
          }`}
        >
          {feedback.type === 'success' ? (
            <BadgeCheck className="mt-0.5 size-5 shrink-0 text-emerald-600" />
          ) : (
            <CircleAlert className="mt-0.5 size-5 shrink-0 text-destructive" />
          )}
          <p className="flex-1 text-sm font-medium">{feedback.message}</p>
          {feedback.type === 'error' && (
            <button
              type="button"
              onClick={() => setFeedback(null)}
              aria-label="Dismiss notification"
              className="rounded-md p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      )}

      <div className="mx-auto max-w-5xl space-y-6">
        <Breadcrumbs />

        <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
          <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-7">
            <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-primary/5 text-primary sm:size-20">
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
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                User management
              </p>
              <h1 className="text-2xl font-bold tracking-tight">
                {isEditing ? 'Edit User' : 'Add New User'}
              </h1>
              <p className="mt-1 max-w-2xl text-sm leading-5 text-muted-foreground">
                {isEditing
                  ? 'Update profile details, employment information, and contact preferences.'
                  : 'Create a complete profile with personal, employment, and contact details.'}
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                Fields marked with <span className="font-semibold text-destructive">*</span> are required.
              </p>
            </div>

            <Link
              href="/user-management"
              className={buttonVariants({ variant: 'outline' })}
            >
              <ArrowLeft className="mr-2 size-4" />
              User list
            </Link>
          </div>
        </section>

        {loadingUser ? (
          <div
            aria-live="polite"
            aria-busy="true"
            className="rounded-2xl border bg-card p-12 text-center shadow-sm"
          >
            <LoaderCircle className="mx-auto mb-3 size-7 animate-spin text-primary" />
            <p className="font-medium">Loading user details...</p>
          </div>
        ) : loadError ? (
          <div className="rounded-2xl border border-destructive/30 bg-card p-8 text-center shadow-sm">
            <p role="alert" className="text-sm text-destructive">
              Unable to load user: {loadError}
            </p>
            <Link
              href="/user-management"
              className={`${buttonVariants({ variant: 'outline' })} mt-4`}
            >
              Back to user list
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <UserProfileFields values={values} onChange={updateField} />

            <div className="sticky bottom-3 z-20 flex flex-col gap-3 rounded-sm border bg-background/95 p-3 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div className="min-w-0 flex-1">
                {!formIsValid ? (
                  <p className="text-sm text-muted-foreground">
                    {validationError}
                  </p>
                ) : isEditing && !hasChanges ? (
                  <p className="text-sm text-muted-foreground">
                    Make a change to enable updating this user.
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {isEditing
                      ? 'Your changes are ready to be saved.'
                      : 'Review the details before creating this user.'}
                  </p>
                )}
              </div>

              <div className="flex flex-col-reverse gap-2 sm:flex-row">
                <Link
                  href="/user-management"
                  className={buttonVariants({ variant: 'outline', size: 'lg' })}
                >
                  Cancel
                </Link>

                <Button
                  type="submit"
                  size="lg"
                  disabled={saving || !canSave || feedback?.type === 'success'}
                  title={
                    !formIsValid
                      ? validationError ?? 'Check the form values.'
                      : !hasChanges
                        ? 'Change at least one field before saving.'
                        : undefined
                  }
                >
                  {saving ? (
                    <LoaderCircle className="mr-2 size-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 size-4" />
                  )}
                  {saving
                    ? isEditing
                      ? 'Updating...'
                      : 'Saving...'
                    : isEditing
                      ? 'Update User'
                      : 'Create User'}
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
