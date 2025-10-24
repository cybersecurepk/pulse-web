export interface Batch {
  id: string;
  batchName: string;
  batchCode: string;
  location: string;
  startDate: Date;
  endDate: Date;
  status: "Upcoming" | "Ongoing" | "Completed";
  instructors: string[];
  maxLearners: number;
  // courseProgram: string;
  summaryNotes: string;
  testDates: Date[];
  attachments: string[];
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}
