"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export interface Field {
  name: string;
  label: string;
  type?: "text" | "number" | "date" | "email" | "textarea";
  value?: string | number;
  placeholder?: string;
}

interface DynamicFormProps {
  fields: Field[];
  values: Record<string, any>;
  onChange: (name: string, value: string | number) => void;
}

export function DynamicForm({ fields, values, onChange }: DynamicFormProps) {
  return (
    <form className="space-y-4">
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col space-y-1">
          <Label htmlFor={field.name}>{field.label}</Label>

          {field.type === "textarea" ? (
            <Textarea
              id={field.name}
              placeholder={field.placeholder}
              value={values[field.name] ?? ""}
              onChange={(e) => onChange(field.name, e.target.value)}
            />
          ) : (
            <Input
              id={field.name}
              type={field.type || "text"}
              placeholder={field.placeholder}
              value={values[field.name] ?? ""}
              onChange={(e) => onChange(field.name, e.target.value)}
            />
          )}
        </div>
      ))}
    </form>
  );
}
