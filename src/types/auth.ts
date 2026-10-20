export interface AuthRole {
  id?: string;
  key?: string;
  name?: string;
}

export interface AuthUser {
  id?: string;
  name: string;
  email?: string;
  username?: string;
  profileImage?: string | null;
  userType?: string;
  roles: AuthRole[];
  permissions: string[];
  mustChangePassword: boolean;
}
