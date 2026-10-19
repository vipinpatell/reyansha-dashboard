'use client';

import {
  AtSign,
  BriefcaseBusiness,
  CalendarDays,
  Camera,
  ContactRound,
  Mail,
  MapPin,
  Phone,
  User,
} from 'lucide-react';

import UserFormField, {
  userInputClass,
} from '@/components/shared/user-management/user-form-field';
import UserFormSection from '@/components/shared/user-management/user-form-section';
import { userOptions } from '@/lib/user-options';
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
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) =>
      onChange(field, event.target.value);

  return (
    <>
      <UserFormSection
        icon={User}
        title="Personal Information"
        description="Enter the user's identity and profile information."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <UserFormField id="prefix" label="Prefix">
            <select
              id="prefix"
              value={values.prefix}
              onChange={update('prefix')}
              className={userInputClass}
            >
              <option value="">Select a prefix</option>
              {userOptions.prefixes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </UserFormField>

          <UserFormField id="firstName" label="First Name" required>
            <input
              id="firstName"
              required
              maxLength={100}
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
              maxLength={100}
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
                maxLength={30}
                pattern="[A-Za-z0-9._-]+(@[A-Za-z0-9.-]+\.[A-Za-z]{2,})?"
                title="Use 3–30 letters, numbers, dots, underscores, or hyphens. An email-style username is also allowed."
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

          <UserFormField id="gender" label="Gender" required>
            <select
              id="gender"
              required
              value={values.gender}
              onChange={update('gender')}
              className={userInputClass}
            >
              {userOptions.genders.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
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
              maxLength={16}
              pattern="\+[1-9][0-9]{7,14}"
              title="Enter an international number, e.g. +919000000019."
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
              maxLength={16}
              pattern="\+[1-9][0-9]{7,14}"
              title="Enter an international number, e.g. +919000000020."
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
          <UserFormField id="building" label="Building / House" required>
            <input
              id="building"
              value={values.building}
              onChange={update('building')}
              placeholder="House or building name"
              className={userInputClass}
              required
              autoComplete="address-line1"
            />
          </UserFormField>

          <UserFormField id="streetAddress" label="Street Address" required>
            <input
              id="streetAddress"
              value={values.streetAddress}
              onChange={update('streetAddress')}
              placeholder="Street, area, locality"
              className={userInputClass}
              required
              autoComplete="address-line2"
            />
          </UserFormField>

          <UserFormField id="city" label="City" required>
            <input
              id="city"
              value={values.city}
              onChange={update('city')}
              placeholder="Enter city"
              className={userInputClass}
              required
              autoComplete="address-level2"
            />
          </UserFormField>

          <UserFormField id="state" label="State" required>
            <input
              id="state"
              value={values.state}
              onChange={update('state')}
              placeholder="Enter state"
              className={userInputClass}
              required
              autoComplete="address-level1"
            />
          </UserFormField>

          <UserFormField id="postalCode" label="Postal Code" required>
            <input
              id="postalCode"
              value={values.postalCode}
              onChange={update('postalCode')}
              maxLength={20}
              placeholder="Enter postal code"
              className={userInputClass}
              required
              autoComplete="postal-code"
            />
          </UserFormField>

          <UserFormField id="country" label="Country" required>
            <input
              id="country"
              value={values.country}
              onChange={update('country')}
              placeholder="Enter country"
              className={userInputClass}
              required
              autoComplete="country-name"
            />
          </UserFormField>
        </div>
      </UserFormSection>

      <UserFormSection
        icon={BriefcaseBusiness}
        title="Employment Information"
        description="Add the user's role, team, and work arrangement."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <UserFormField id="designation" label="Designation">
            <input
              id="designation"
              value={values.designation}
              onChange={update('designation')}
              maxLength={100}
              placeholder="e.g. Frontend Developer"
              className={userInputClass}
            />
          </UserFormField>

          <UserFormField id="userType" label="User Type">
            <select
              id="userType"
              value={values.userType}
              onChange={update('userType')}
              className={userInputClass}
            >
              <option value="">Select user type</option>
              {userOptions.userTypes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </UserFormField>

          <UserFormField id="department" label="Department">
            <select
              id="department"
              value={values.department}
              onChange={update('department')}
              className={userInputClass}
            >
              <option value="">Select department</option>
              {userOptions.departments.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </UserFormField>

          <UserFormField id="employeeId" label="Employee ID">
            <input
              id="employeeId"
              value={values.employeeId}
              onChange={update('employeeId')}
              maxLength={50}
              pattern="[A-Za-z0-9_-]+"
              placeholder="e.g. EMP-1001"
              className={userInputClass}
            />
          </UserFormField>

          <UserFormField id="reportingManager" label="Reporting Manager ID">
            <input
              id="reportingManager"
              value={values.reportingManager}
              onChange={update('reportingManager')}
              maxLength={24}
              minLength={24}
              pattern="[a-fA-F0-9]{24}"
              placeholder="24-character MongoDB ID"
              className={userInputClass}
            />
          </UserFormField>

          <UserFormField id="joiningDate" label="Joining Date">
            <input
              id="joiningDate"
              type="date"
              value={values.joiningDate}
              onChange={update('joiningDate')}
              className={userInputClass}
            />
          </UserFormField>

          <UserFormField id="employmentType" label="Employment Type">
            <select
              id="employmentType"
              value={values.employmentType}
              onChange={update('employmentType')}
              className={userInputClass}
            >
              <option value="">Select employment type</option>
              {userOptions.employmentTypes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </UserFormField>

          <UserFormField id="workLocation" label="Work Location">
            <select
              id="workLocation"
              value={values.workLocation}
              onChange={update('workLocation')}
              className={userInputClass}
            >
              <option value="">Select work location</option>
              {userOptions.workLocations.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </UserFormField>
        </div>
      </UserFormSection>

      <UserFormSection
        icon={ContactRound}
        title="Additional Information"
        description="Add contacts, skills, tags, and internal notes."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <UserFormField id="emergencyContactName" label="Emergency Contact Name">
            <input
              id="emergencyContactName"
              value={values.emergencyContactName}
              onChange={update('emergencyContactName')}
              maxLength={100}
              placeholder="e.g. Priya Patel"
              className={userInputClass}
            />
          </UserFormField>

          <UserFormField id="emergencyContactPhone" label="Emergency Contact Phone">
            <input
              id="emergencyContactPhone"
              type="tel"
              value={values.emergencyContactPhone}
              onChange={update('emergencyContactPhone')}
              maxLength={16}
              pattern="\+[1-9][0-9]{7,14}"
              title="Enter an international number, e.g. +919000000021."
              placeholder="+919000000021"
              className={userInputClass}
            />
          </UserFormField>

          <UserFormField
            id="alternateContactEmail"
            label="Alternate Contact Email"
          >
            <input
              id="alternateContactEmail"
              type="email"
              value={values.alternateContactEmail}
              onChange={update('alternateContactEmail')}
              maxLength={254}
              placeholder="contact@example.com"
              className={userInputClass}
            />
          </UserFormField>

          <UserFormField id="tags" label="Tags">
            <input
              id="tags"
              value={values.tags}
              onChange={update('tags')}
              placeholder="Onshore, Project-A"
              className={userInputClass}
              aria-describedby="tags-hint"
            />
            <p id="tags-hint" className="mt-1 text-xs text-muted-foreground">
              Separate tags with commas (up to 25).
            </p>
          </UserFormField>

          <UserFormField id="skills" label="Skills">
            <input
              id="skills"
              value={values.skills}
              onChange={update('skills')}
              placeholder="TypeScript, NestJS"
              className={userInputClass}
              aria-describedby="skills-hint"
            />
            <p id="skills-hint" className="mt-1 text-xs text-muted-foreground">
              Separate skills with commas (up to 50).
            </p>
          </UserFormField>

          <UserFormField id="notes" label="Internal Notes">
            <textarea
              id="notes"
              value={values.notes}
              onChange={update('notes')}
              maxLength={2000}
              rows={4}
              placeholder="Additional internal notes."
              className={`${userInputClass} h-auto min-h-24 py-2`}
            />
          </UserFormField>
        </div>
      </UserFormSection>
    </>
  );
}
