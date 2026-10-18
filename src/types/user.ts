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

export interface User {
  _id: string;
  name: UserName;
  username?: string;
  dob?: string | null;
  gender?: string;
  mobile?: UserMobile;
  email?: string;
  address?: UserAddress;
  profileImage?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserInput {
  name: {
    firstName: string;
    lastName: string;
  };
  username: string;
  dob: string | null;
  gender: string;
  mobile: {
    primary: string;
    alternate: string;
  };
  email: string;
  address: Required<UserAddress>;
  profileImage: string | null;
}

export interface UserFormValues {
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
}
