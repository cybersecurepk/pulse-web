"use client";

import { UseFormReturn, useFieldArray } from "react-hook-form";
import { InputField } from "@/components/core/hook-form/input-field";
import { SelectField } from "@/components/core/hook-form/select-field";
import { Button } from "@/components/ui/button";
import { DatePickerField } from "@/components/core/hook-form/date-picker-field";
import { ApplicationFormData } from "../data/schema";
import { PlusIcon, XIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ExperienceStepProps {
  form: UseFormReturn<ApplicationFormData>;
}

export function ExperienceStep({ form }: ExperienceStepProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "experiences",
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          <InputField
            name="totalExperience"
            label="Total Experience"
            placeholder="Enter number (e.g., 5)"
            required
          />
        </div>
        <div className="md:col-span-1">
          <SelectField
            name="experienceUnit"
            label="Unit"
            required
            options={[
              { value: "months", label: "Months" },
              { value: "years", label: "Years" },
            ]}
            placeholder="Select unit"
          />
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Experience Details</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({
                organization: "",
                designation: "",
                from: undefined,
                to: undefined,
              })
            }
          >
            <PlusIcon className="mr-2 h-4 w-4" /> Add Experience
          </Button>
        </div>
        {fields.map((field, index) => (
          <Card key={field.id}>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="text-sm font-medium">Experience {index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
              <InputField
                name={`experiences.${index}.organization`}
                label="Organization"
                placeholder="Enter organization name"
              />
              <InputField
                name={`experiences.${index}.designation`}
                label="Designation"
                placeholder="e.g., Senior Developer"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DatePickerField
                  name={`experiences.${index}.from`}
                  label="From"
                  mode="single"
                />
                <DatePickerField
                  name={`experiences.${index}.to`}
                  label="To"
                  mode="single"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
