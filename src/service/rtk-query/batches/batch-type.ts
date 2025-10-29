
export interface BatchPayload {
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

export interface BatchResponse {
  id: string;
  name: string;
  batchCode: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  maxCapacity: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

