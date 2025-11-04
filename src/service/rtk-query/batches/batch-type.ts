
export interface BatchPayload {
  name: string;
  batchCode?: string; // Made optional
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  maxCapacity: number;
  location: string;
  status: string;
  sessionType: "remote" | "onsite";
}

export interface BatchResponse {
  id: string;
  name: string;
  batchCode?: string; // Made optional
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  maxCapacity: number;
  status: string;
  sessionType: "remote" | "onsite";
  createdAt: string;
  updatedAt: string;
}