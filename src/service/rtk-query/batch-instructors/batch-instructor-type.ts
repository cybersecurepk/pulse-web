import { BatchResponse } from "../batches/batch-type";
import { InstructorResponse } from "../instructors/instructor-type";

export interface BatchInstructorPayload {
  batchId: string;
  instructorId: string;
  isActive: boolean;
}

export interface BatchInstructorResponse {
  id: string;
  isActive: boolean;
  assignedDate: string;
  createdAt: string;
  updatedAt: string;
  batch: BatchResponse;
  instructor: InstructorResponse;
}

