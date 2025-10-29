import { BatchResponse } from "../batches/batch-type";
import { TestResponse } from "../tests/tests-type";

export interface BatchTestPayload {
  batchId: string;
  testId: string;
  isActive: boolean;
}

export interface BatchTestResponse {
  id: string;
  isActive: boolean;
  assignedDate: string;
  createdAt: string;
  updatedAt: string;
  batch: BatchResponse;
  test: TestResponse;
}

