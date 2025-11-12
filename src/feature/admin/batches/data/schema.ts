import { z } from "zod";

export const batchSchema = z.object({
  name: z.string().min(3, { message: "Batch name must be at least 3 characters" }),
  batchCode: z.string().optional(),
  description: z.string().optional(),
  location: z.string().min(1, { message: "Location is required" }),
  startDate: z.date({ message: "Start date is required" }),
  endDate: z.date({ message: "End date is required" }),
  status: z.string().min(1, { message: "Status is required" }),
  isActive: z.boolean(),
  maxCapacity: z.number().min(1, { message: "Max capacity must be at least 1" }).max(1000),
  sessionType: z.enum(["remote", "onsite"], { message: "Session type is required" }),
});

export type BatchFormData = z.infer<typeof batchSchema>;

export const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "on_going", label: "Ongoing" },
];

export const sessionTypeOptions = [
  { value: "remote", label: "Remote" },
  { value: "onsite", label: "Onsite" },
];