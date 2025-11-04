"use client";

import { UseFormReturn } from "react-hook-form";
import { InputField } from "@/components/core/hook-form/input-field";
import { SelectField } from "@/components/core/hook-form/select-field";
import { ApplicationFormData } from "../data/schema";
import { YEARS_OF_EDUCATION, DEGREES } from "../data/constants";

interface EducationStepProps {
  form: UseFormReturn<ApplicationFormData>;
}

export function EducationStep({ form }: EducationStepProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) =>
    (currentYear - i).toString()
  );
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField
          name="yearsOfEducation"
          label="Years of Education"
          required
          options={YEARS_OF_EDUCATION.map((y) => ({ value: y, label: y }))}
          placeholder="Select years"
        />
        <SelectField
          name="highestDegree"
          label="Highest Degree"
          required
          options={DEGREES.map((d) => ({ value: d, label: d }))}
          placeholder="Select degree"
        />
      </div>
      <InputField
        name="majors"
        label="Majors"
        placeholder="e.g., Computer Science"
        required
      />
      <InputField
        name="university"
        label="University"
        placeholder="Enter university name"
        required
      />
      <SelectField
        name="yearOfCompletion"
        label="Year of Completion"
        required
        options={years.map((y) => ({ value: y, label: y }))}
        placeholder="Select year"
      />
    </div>
  );
}
