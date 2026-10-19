export interface Role {
  key: string;
  name?: string;
  description?: string;
  permissions?: string[];
}

export interface RoleInput {
  key: string;
  name: string;
  description: string;
  permissions: string[];
}
