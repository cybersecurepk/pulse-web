export interface InstructorPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: string;
  expertise: string;
  isActive: boolean;
}

export interface InstructorResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: string;
  expertise: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
