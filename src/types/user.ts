export interface UserName {
  firstName?: string;
  lastName?: string;
}

export interface UserMobile {
  primary?: string;
  alternate?: string;
}

export interface UserAddress {
  building?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface UserEmergencyContact {
  name: string;
  phone: string;
}

export const USER_ACCOUNT_STATUSES = [
  'invited',
  'active',
  'suspended',
  'deactivated',
] as const;

export type UserAccountStatus = (typeof USER_ACCOUNT_STATUSES)[number];

export function isUserAccountStatus(
  value: string,
): value is UserAccountStatus {
  return (USER_ACCOUNT_STATUSES as readonly string[]).includes(value);
}

export interface User {
  _id: string;
  accountStatus?: UserAccountStatus;
  prefix?: string | null;
  name: UserName;
  username?: string;
  dob?: string | null;
  gender?: string;
  mobile?: UserMobile;
  email?: string;
  address?: UserAddress;
  profileImage?: string | null;
  designation?: string | null;
  userType?: string | null;
  department?: string | null;
  employeeId?: string | null;
  reportingManager?: string | null;
  joiningDate?: string | null;
  employmentType?: string | null;
  workLocation?: string | null;
  tags?: string[];
  notes?: string | null;
  emergencyContact?: UserEmergencyContact | null;
  alternateContactEmail?: string | null;
  skills?: string[];
  roles?: string[];
  roleIds?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserInput {
  prefix?: string | null;
  name: {
    firstName: string;
    lastName: string;
  };
  username: string;
  dob: string;
  gender: string;
  mobile: {
    primary: string;
    alternate: string | null;
  };
  email: string;
  address: Required<UserAddress>;
  profileImage: string | null;
  designation?: string | null;
  userType?: string | null;
  department?: string | null;
  employeeId?: string | null;
  reportingManager?: string | null;
  joiningDate?: string | null;
  employmentType?: string | null;
  workLocation?: string | null;
  tags?: string[];
  notes?: string | null;
  emergencyContact?: UserEmergencyContact | null;
  alternateContactEmail?: string | null;
  skills?: string[];
}

export interface UserFormValues {
  prefix: string;
  firstName: string;
  lastName: string;
  username: string;
  dob: string;
  gender: string;
  email: string;
  primaryMobile: string;
  alternateMobile: string;
  building: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  profileImage: string;
  designation: string;
  userType: string;
  department: string;
  employeeId: string;
  reportingManager: string;
  joiningDate: string;
  employmentType: string;
  workLocation: string;
  tags: string;
  notes: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  alternateContactEmail: string;
  skills: string;
}
