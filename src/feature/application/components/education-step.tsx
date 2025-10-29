"use client"

import { UseFormReturn } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ApplicationFormData } from "../data/schema"
import { YEARS_OF_EDUCATION, DEGREES } from "../data/constants"

interface EducationStepProps {
  form: UseFormReturn<ApplicationFormData>
}

export function EducationStep({ form }: EducationStepProps) {
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="yearsOfEducation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Years of Education<span className="text-destructive">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select years" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {YEARS_OF_EDUCATION.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="highestDegree"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Highest Degree<span className="text-destructive">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select degree" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {DEGREES.map((degree) => (
                    <SelectItem key={degree} value={degree}>
                      {degree}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="majors"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Majors<span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="e.g., Computer Science" 
                {...field}
                onChange={(e) => {
                  // Allow only letters, spaces, commas, and ampersands
                  const value = e.target.value.replace(/[^a-zA-Z\s,\&]/g, '');
                  field.onChange(value);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="university"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              University<span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter university name" 
                {...field}
                onChange={(e) => {
                  // Basic cleaning for university names
                  field.onChange(e.target.value);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="yearOfCompletion"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Year of Completion<span className="text-destructive">*</span>
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}