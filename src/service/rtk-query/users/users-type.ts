export enum UserRole {
  ADMIN = "admin",
  COMPANY_ADMIN = "company_admin",
  EMPLOYEE = "employee",
}

export interface Company {
  id: string;
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  website?: string;
  industry?: string;
  size?: string;
  status: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  company?: Company;
}

export interface UserDropdown {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
}

export interface UserPayload {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  companyId?: string;
}

export type UserResponse = User

export type UserListResponse = User[];
export type UserDropdownResponse = UserDropdown[];
