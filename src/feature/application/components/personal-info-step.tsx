"use client";

import { UseFormReturn } from "react-hook-form";
import { InputField } from "@/components/core/hook-form/input-field";
import { SelectField } from "@/components/core/hook-form/select-field";
import { RadioGroupField } from "@/components/core/hook-form/radio-field";
import { ApplicationFormData } from "../data/schema";
import { CITIES } from "../data/constants";

interface PersonalInfoStepProps {
  form: UseFormReturn<ApplicationFormData>;
}

export function PersonalInfoStep({ form }: PersonalInfoStepProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          name="name"
          type="text"
          label="Full Name"
          placeholder="Enter your full name"
          required
        />
        <InputField
          name="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          required
        />
      </div>
      <RadioGroupField
        name="gender"
        label="Gender"
        options={[
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
          { value: "other", label: "Others" },
        ]}
        required
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          name="primaryPhone"
          type="text"
          label="Primary Phone #"
          placeholder="+92 300-000-0000"
          required
        />
        <InputField
          name="secondaryPhone"
          type="text"
          label="Secondary Phone #"
          placeholder="+92 300-000-0000"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField
          name="currentCity"
          label="Current City"
          required
          options={CITIES.map((city) => ({ value: city, label: city }))}
          placeholder="Select city"
        />
        <SelectField
          name="permanentCity"
          label="Permanent City"
          required
          options={CITIES.map((city) => ({ value: city, label: city }))}
          placeholder="Select city"
        />
      </div>
    </div>
  );
}
