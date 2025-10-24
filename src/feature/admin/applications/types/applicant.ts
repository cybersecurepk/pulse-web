export interface applicant {
  id: string;
  Name: string;
  email: string;
  phoneNumber: string;
  location: string;
  applicationDate: Date;
  status: "Pending" | "Reviewed" | "Accepted" | "Rejected";
}
