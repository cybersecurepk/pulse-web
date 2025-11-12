"use client";

import { UseFormReturn } from "react-hook-form";
import { RadioGroupField } from "@/components/core/hook-form/radio-field";
import { CheckboxField } from "@/components/core/hook-form/checkbox-field";
import { ApplicationFormData } from "../data/schema";
import { useEffect } from "react";

interface AvailabilityStepProps {
  form: UseFormReturn<ApplicationFormData>;
}

export function AvailabilityStep({ form }: AvailabilityStepProps) {
  // Watch the area of interest fields to trigger validation when they change
  const blueTeam = form.watch("blueTeam");
  const redTeam = form.watch("redTeam");
  const grc = form.watch("grc");

  // Trigger validation when any of the area of interest fields change
  useEffect(() => {
    // Only trigger validation if at least one field has been touched
    if (blueTeam !== false || redTeam !== false || grc !== false) {
      form.trigger(["blueTeam", "redTeam", "grc"]);
    }
  }, [blueTeam, redTeam, grc, form]);

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
          required
        />
        <RadioGroupField
          name="weekends"
          label="Available on Weekends"
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
          required
        />
        <RadioGroupField
          name="onsiteSessions"
          label="Available for Onsite Sessions"
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
          required
        />
        <RadioGroupField
          name="remoteSessions"
          label="Available for Remote Sessions"
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
          required
        />
      </div>
      <div className="border-t pt-4 space-y-2">
        <h3 className="text-lg font-semibold">
          Area of Interest <span className="text-destructive">*</span>
        </h3>
        <CheckboxField
          name="blueTeam"
          options={[
            {
              id: "blueTeam",
              label: "Information & Cyber Security - Blue Team",
            },
          ]}
          required
          showErrorOnAll={true}
        />
        <CheckboxField
          name="redTeam"
          options={[
            {
              id: "redTeam",
              label: "Information & Cyber Security - Red Team",
            },
          ]}
          required
          showErrorOnAll={true}
        />
        <CheckboxField
          name="grc"
          options={[
            {
              id: "grc",
              label: "Governance, Risk and Compliance",
            },
          ]}
          required
          showErrorOnAll={true}
        />
      </div>
    </div>
  );
}