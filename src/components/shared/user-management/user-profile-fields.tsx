'use client';

import {
  AtSign,
  CalendarDays,
  Camera,
  Mail,
  MapPin,
  Phone,
  User,
} from 'lucide-react';

import UserFormField, {
  userInputClass,
} from '@/components/shared/user-management/user-form-field';
import UserFormSection from '@/components/shared/user-management/user-form-section';
import type { UserFormValues } from '@/types/user';

interface UserProfileFieldsProps {
  values: UserFormValues;
  onChange: <K extends keyof UserFormValues>(
    field: K,
    value: UserFormValues[K],
  ) => void;
}

export default function UserProfileFields({
  values,
  onChange,
}: UserProfileFieldsProps) {
  const update =
    <K extends keyof UserFormValues>(field: K) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      onChange(field, event.target.value);

  return (
    <>
      <UserFormSection
        icon={User}
        title="Personal Information"
        description="Enter the user's identity and profile information."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <UserFormField id="firstName" label="First Name" required>
            <input
              id="firstName"
              required
              maxLength={80}
              value={values.firstName}
              onChange={update('firstName')}
              placeholder="Enter first name"
              className={userInputClass}
              autoComplete="given-name"
            />
          </UserFormField>

          <UserFormField id="lastName" label="Last Name" required>
            <input
              id="lastName"
              required
              maxLength={80}
              value={values.lastName}
              onChange={update('lastName')}
              placeholder="Enter last name"
              className={userInputClass}
              autoComplete="family-name"
            />
          </UserFormField>

          <UserFormField id="username" label="Username" required>
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="username"
                required
                minLength={3}
                maxLength={40}
                pattern="[A-Za-z0-9_.-]+"
                value={values.username}
                onChange={update('username')}
                placeholder="e.g. reyanshpatel19"
                className={`${userInputClass} pl-9`}
                autoComplete="username"
              />
            </div>
          </UserFormField>

          <UserFormField id="dob" label="Date of Birth" required>
            <div className="relative">
              <CalendarDays className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="dob"
                type="date"
                required
                value={values.dob}
                max={new Date().toISOString().slice(0, 10)}
                onChange={update('dob')}
                className={`${userInputClass} pl-9`}
                autoComplete="bday"
              />
            </div>
          </UserFormField>

          <UserFormField id="gender" label="Gender">
            <select
              id="gender"
              value={values.gender}
              onChange={update('gender')}
              className={userInputClass}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </UserFormField>

          <UserFormField id="profileImage" label="Profile Image URL">
            <div className="relative">
              <Camera className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="profileImage"
                type="url"
                value={values.profileImage}
                onChange={update('profileImage')}
                placeholder="https://example.com/profile.jpg"
                className={`${userInputClass} pl-9`}
                autoComplete="url"
              />
            </div>
          </UserFormField>
        </div>
      </UserFormSection>

      <UserFormSection
        icon={Phone}
        title="Contact Information"
        description="Provide the user's email and phone numbers."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <UserFormField id="email" label="Email Address" required>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="email"
                type="email"
                required
                maxLength={254}
                value={values.email}
                onChange={update('email')}
                placeholder="name@company.com"
                className={`${userInputClass} pl-9`}
                autoComplete="email"
              />
            </div>
          </UserFormField>

          <UserFormField id="primaryMobile" label="Primary Mobile" required>
            <input
              id="primaryMobile"
              type="tel"
              required
              maxLength={20}
              value={values.primaryMobile}
              onChange={update('primaryMobile')}
              placeholder="+919876543210"
              className={userInputClass}
              autoComplete="tel"
            />
          </UserFormField>

          <UserFormField id="alternateMobile" label="Alternate Mobile">
            <input
              id="alternateMobile"
              type="tel"
              maxLength={20}
              value={values.alternateMobile}
              onChange={update('alternateMobile')}
              placeholder="+919876543210"
              className={userInputClass}
              autoComplete="tel"
            />
          </UserFormField>
        </div>
      </UserFormSection>

      <UserFormSection
        icon={MapPin}
        title="Address Information"
        description="Enter the user's residential or mailing address."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <UserFormField id="building" label="Building / House">
            <input
              id="building"
              value={values.building}
              onChange={update('building')}
              placeholder="House or building name"
              className={userInputClass}
              autoComplete="address-line1"
            />
          </UserFormField>

          <UserFormField id="streetAddress" label="Street Address">
            <input
              id="streetAddress"
              value={values.streetAddress}
              onChange={update('streetAddress')}
              placeholder="Street, area, locality"
              className={userInputClass}
              autoComplete="address-line2"
            />
          </UserFormField>

          <UserFormField id="city" label="City">
            <input
              id="city"
              value={values.city}
              onChange={update('city')}
              placeholder="Enter city"
              className={userInputClass}
              autoComplete="address-level2"
            />
          </UserFormField>

          <UserFormField id="state" label="State">
            <input
              id="state"
              value={values.state}
              onChange={update('state')}
              placeholder="Enter state"
              className={userInputClass}
              autoComplete="address-level1"
            />
          </UserFormField>

          <UserFormField id="postalCode" label="Postal Code">
            <input
              id="postalCode"
              value={values.postalCode}
              onChange={update('postalCode')}
              maxLength={20}
              placeholder="Enter postal code"
              className={userInputClass}
              autoComplete="postal-code"
            />
          </UserFormField>

          <UserFormField id="country" label="Country">
            <input
              id="country"
              value={values.country}
              onChange={update('country')}
              placeholder="Enter country"
              className={userInputClass}
              autoComplete="country-name"
            />
          </UserFormField>
        </div>
      </UserFormSection>
    </>
  );
}
