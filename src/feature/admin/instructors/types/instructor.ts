export type { InstructorResponse as Instructor } from "@/service/rtk-query/instructors/instructor-type";

// Local UI payload interfaces (for form handling)
export interface InstructorFormPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: string;
  expertise: string;
  isActive: boolean;
}
