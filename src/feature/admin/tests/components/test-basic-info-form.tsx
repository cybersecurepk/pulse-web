"use client";

import { Field } from "@/components/core/hook-form";

export function TestBasicInfoForm() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <Field.Text
          name="title"
          label="Test Name"
          placeholder="Enter test name"
          required
        />

        <Field.Text
          name="testCode"
          label="Test Code"
          placeholder="Enter test code (e.g., JS-2024-001)"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field.Text
            name="duration"
            label="Duration (minutes)"
            placeholder="60"
            type="number"
            required
          />

          <Field.Text
            name="passCriteria"
            label="Pass Criteria (%)"
            placeholder="70"
            type="number"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field.DatePicker
            name="startDate"
            label="Start Date"
            required
          />

          <Field.DatePicker
            name="endDate"
            label="End Date"
            required
          />
        </div>
      </div>

      <Field.Textarea
        name="description"
        label="Description"
        placeholder="Enter test description"
      />

      <Field.Switch
        name="isActive"
        label="Active Test"
        description="Enable this test for use"
      />
    </div>
  );
}
