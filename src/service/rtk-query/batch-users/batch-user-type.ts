import { BatchResponse } from "../batches/batch-type";

export interface BatchUserUserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  applicationStatus: string;
  applicationNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BatchUserPayload {
  batchId: string;
  userId: string;
  isActive: boolean;
}

export interface BatchUserResponse {
  id: string;
  isActive: boolean;
  enrolledDate: string;
  createdAt: string;
  updatedAt: string;
  batch: BatchResponse;
  user: BatchUserUserResponse;
}

