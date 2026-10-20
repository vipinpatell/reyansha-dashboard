export interface Role {
  _id?: string;
  id?: string;
  key: string;
  name?: string;
  permissions?: string[];
}

export interface RoleInput {
  key: string;
  name: string;
  permissions: string[];
}
