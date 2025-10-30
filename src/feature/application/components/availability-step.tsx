"use client";

import { UseFormReturn } from "react-hook-form";
import { RadioGroupField } from "@/components/core/hook-form/radio-field";
import { CheckboxField } from "@/components/core/hook-form/checkbox-field";
import { ApplicationFormData } from "../data/schema";

interface AvailabilityStepProps {
  form: UseFormReturn<ApplicationFormData>;
}

export function AvailabilityStep({ form }: AvailabilityStepProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Availability</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RadioGroupField
          name="workingDays"
          label="Available on Working days"
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
        />
        <RadioGroupField
          name="weekends"
          label="Available on Weekends"
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
        />
        <RadioGroupField
          name="onsiteSessions"
          label="Available for Onsite Sessions"
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
        />
        <RadioGroupField
          name="remoteSessions"
          label="Available for Remote Sessions"
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
        />
      </div>
      <div className="border-t pt-4 space-y-2">
        <h3 className="text-lg font-semibold">Area of Interest</h3>
        <CheckboxField
          name="blueTeam"
          options={[
            {
              id: "blueTeam",
              label: "Information & Cyber Security - Blue Team",
            },
          ]}
        />
        <CheckboxField
          name="redTeam"
          options={[
            {
              id: "redTeam",
              label: "Information & Cyber Security - Red Team",
            },
          ]}
        />
        <CheckboxField
          name="grc"
          options={[
            {
              id: "grc",
              label: "Governance, Risk and Compliance",
            },
          ]}
        />
      </div>
      <div className="border-t pt-4">
        <CheckboxField
          name="consent"
          options={[
            {
              id: "consent",
              label:
                "I consent to the use of my Personal Identifiable Information (PII)",
            },
          ]}
        />
      </div>
    </div>
  );
}
