import React from "react";
import { InstructorForm } from "../components/instructor-form";

export function EditInstructorPage({ params }: { params: { id: string } }) {
  return <InstructorForm instructorId={params.id} />;
}