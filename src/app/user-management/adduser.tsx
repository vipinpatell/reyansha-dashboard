
'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Camera,
  Save,
  UserRound,
  User,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  AtSign,
} from 'lucide-react';

import { Button, buttonVariants } from '@/components/ui/button';
import Breadcrumbs from '@/components/shared/breadcrumbs/page';

const inputClass =
  'h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-ring';

const labelClass = 'mb-2 block text-sm font-medium';

export default function AddUser() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('male');

  const [email, setEmail] = useState('');
  const [primaryMobile, setPrimaryMobile] = useState('');
  const [alternateMobile, setAlternateMobile] = useState('');

  const [building, setBuilding] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');

  const [profileImage, setProfileImage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    const payload = {
      name: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      },
      username: username.trim(),
      dob: dob ? new Date(`${dob}T00:00:00.000Z`).toISOString() : null,
      gender,
      mobile: {
        primary: primaryMobile.trim(),
        alternate: alternateMobile.trim(),
      },
      email: email.trim(),
      address: {
        building: building.trim(),
        streetAddress: streetAddress.trim(),
        city: city.trim(),
        state: state.trim(),
        postalCode: postalCode.trim(),
        country: country.trim(),
      },
      profileImage: profileImage.trim() || null,
    };

    // Replace this with your POST request to the NestJS API.
    console.log('New user payload:', payload);
    alert('Form validated. Connect the API to save this user to MongoDB.');
  }

  return (
    <main className="min-h-screen bg-muted/30 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <Breadcrumbs />

        {/* Cover / page heading */}
        <section className="relative overflow-hidden rounded-2xl border bg-card">
          <div className="h-36 bg-gradient-to-r from-primary/30 via-primary/10 to-muted sm:h-44">
            <div className="absolute right-6 top-6 hidden rounded-full border border-white/40 bg-background/60 px-3 py-1 text-xs font-medium backdrop-blur sm:block">
              User Management
            </div>
          </div>

          <div className="flex flex-col gap-4 px-5 pb-6 sm:flex-row sm:items-end sm:px-8">
            <div className="-mt-12 flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-card bg-background text-primary shadow-sm">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile preview"
                  className="size-full object-cover"
                />
              ) : (
                <UserRound className="size-11" />
              )}
            </div>

            <div className="min-w-0 flex-1 pt-1">
              <h1 className="text-2xl font-bold tracking-tight">Add New User</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Create a user profile with personal, contact, and address details.
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal information */}
          <FormSection
            icon={<User className="size-5" />}
            title="Personal Information"
            description="Enter the user's identity and profile information."
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="First Name" required>
                <input
                  required
                  maxLength={80}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter first name"
                  className={inputClass}
                />
              </Field>

              <Field label="Last Name" required>
                <input
                  required
                  maxLength={80}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter last name"
                  className={inputClass}
                />
              </Field>

              <Field label="Username" required>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    required
                    minLength={3}
                    maxLength={40}
                    pattern="[A-Za-z0-9_.-]+"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. reyanshpatel19"
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </Field>

              <Field label="Date of Birth">
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="date"
                    value={dob}
                    max={new Date().toISOString().slice(0, 10)}
                    onChange={(e) => setDob(e.target.value)}
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </Field>

              <Field label="Gender">
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className={inputClass}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </Field>

              <Field label="Profile Image URL">
                <div className="relative">
                  <Camera className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="url"
                    value={profileImage}
                    onChange={(e) => setProfileImage(e.target.value)}
                    placeholder="https://example.com/profile.jpg"
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </Field>
            </div>
          </FormSection>

          {/* Contact information */}
          <FormSection
            icon={<Phone className="size-5" />}
            title="Contact Information"
            description="Provide the user's email and phone numbers."
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Email Address" required>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    maxLength={254}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className={`${inputClass} pl-9`}
                  />
                </div>
              </Field>

              <Field label="Primary Mobile" required>
                <input
                  type="tel"
                  required
                  maxLength={20}
                  value={primaryMobile}
                  onChange={(e) => setPrimaryMobile(e.target.value)}
                  placeholder="+919876543210"
                  className={inputClass}
                />
              </Field>

              <Field label="Alternate Mobile">
                <input
                  type="tel"
                  maxLength={20}
                  value={alternateMobile}
                  onChange={(e) => setAlternateMobile(e.target.value)}
                  placeholder="+919876543210"
                  className={inputClass}
                />
              </Field>
            </div>
          </FormSection>

          {/* Address */}
          <FormSection
            icon={<MapPin className="size-5" />}
            title="Address Information"
            description="Enter the user's residential or mailing address."
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Building / House">
                <input
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                  placeholder="House or building name"
                  className={inputClass}
                />
              </Field>

              <Field label="Street Address">
                <input
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="Street, area, locality"
                  className={inputClass}
                />
              </Field>

              <Field label="City">
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter city"
                  className={inputClass}
                />
              </Field>

              <Field label="State">
                <input
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="Enter state"
                  className={inputClass}
                />
              </Field>

              <Field label="Postal Code">
                <input
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  maxLength={20}
                  placeholder="Enter postal code"
                  className={inputClass}
                />
              </Field>

              <Field label="Country">
                <input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Enter country"
                  className={inputClass}
                />
              </Field>
            </div>
          </FormSection>

          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}

          {/* Form actions */}
          <div className="flex flex-col-reverse justify-end gap-3 rounded-xl border bg-card p-4 sm:flex-row sm:p-5">
            <Button variant="outline" type="button" asChild>
              <Link href="/user-management/users">Cancel</Link>
            </Button>

            <Button type="submit" disabled={saving}>
              <Save className="mr-2 size-4" />
              {saving ? 'Saving...' : 'Save User'}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}

function FormSection({
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
      <div className="flex items-start gap-3 border-b p-5 sm:p-6">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <div>
          <h2 className="font-semibold">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function Field({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <label className={labelClass}>
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </label>
      {children}
    </div>
  );
}
