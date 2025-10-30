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

export type Experience = {
  organization?: string;
  designation?: string;
  from?: string;
  to?: string;
};

export interface User {
  id: string;
  name: string;
  email: string;
  gender: "male" | "female" | "other";
  primaryPhone: string;
  secondaryPhone?: string;
  currentCity: string;
  permanentCity: string;
  yearsOfEducation: "12" | "14" | "16" | "18";
  highestDegree: "HSSC" | "A-Levels" | "BS" | "BSc" | "MS" | "MSc";
  majors: string;
  university: string;
  yearOfCompletion: string;
  totalExperience: string;
  experienceUnit: "months" | "years";
  experiences?: Experience[];
  workingDays: "yes" | "no";
  weekends: "yes" | "no";
  onsiteSessions: "yes" | "no";
  remoteSessions: "yes" | "no";
  blueTeam: boolean;
  redTeam: boolean;
  grc: boolean;
  consent: boolean;
  applicationStatus: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
  batchUsers?: unknown[];
}

export interface UserDropdown {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
}

export type UserPayload = Omit<
  User,
  "id" | "createdAt" | "updatedAt" | "batchUsers"
>;

export type UserResponse = User;
export type UserListResponse = User[];
export type UserDropdownResponse = UserDropdown[];
