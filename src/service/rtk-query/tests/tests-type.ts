import { User } from "../users/users-type";

export interface TestPayload {
  testCode?: string;
  title: string;
  description: string;
  isActive: boolean;
  duration: number;
  passingCriteria: number;
  startDate: string;
  endDate: string;
  questions: QuestionPayload[];
}

export interface QuestionPayload {
  sortOrder: number;
  text: string;
  type: string;
  points: number;
  options: OptionPayload[];
}

export interface OptionPayload {
  text: string;
  isCorrect: boolean;
}

export interface TestResponse {
  id: string;
  testCode?: string;
  title: string;
  description: string;
  duration: number;
  passingCriteria: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  questions: QuestionResponse[];
  screenshots?: TestScreenshot[];
}

export interface TestScreenshot {
  id: string;
  imageUrl: string;
  description?: string;
  createdAt: string;
}

export interface QuestionResponse {
  id: string;
  sortOrder: number;
  text: string;
  type: string;
  points: number;
  createdAt: string;
  updatedAt: string;
  options: OptionResponse[];
}

export interface OptionResponse {
  id: string;
  text: string;
  isCorrect: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserTestResponse {
  id: string;
  assignmentId: string;
  userId: string;
  maxAttempts: number;
  dueAt: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user: User;
}

export interface Question {
  id: string;
  text: string;
  type: string;
  points?: number;
  questionNo: number;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  options: Option[];
  orientation?: "straight" | "reverse";
  dimension?: string;
}

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
  score?: number;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}