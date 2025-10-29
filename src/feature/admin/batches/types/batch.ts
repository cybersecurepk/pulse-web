
export type { BatchResponse as Batch } from "@/service/rtk-query/batches/batch-type";

export interface BatchFormPayload {
  name: string;
  batchCode: string;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  maxCapacity: number;
  location: string;
  status: string;
}
