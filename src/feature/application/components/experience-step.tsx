"use client"

import { UseFormReturn, useFieldArray } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DatePickerField } from "@/components/core/hook-form/date-picker-field"
import { ApplicationFormData } from "../data/schema"
import { PlusIcon, XIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ExperienceStepProps {
  form: UseFormReturn<ApplicationFormData>
}

export function ExperienceStep({ form }: ExperienceStepProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "experiences",
  })

  // Validation function for total experience - only allow numbers
  const validateTotalExperience = (value: string): string => {
    // Remove any non-digit characters
    return value.replace(/[^0-9]/g, '');
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          <FormField
            control={form.control}
            name="totalExperience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Total Experience<span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter number (e.g., 5)" 
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => {
                      // Only allow numbers
                      const validatedValue = validateTotalExperience(e.target.value);
                      field.onChange(validatedValue);
                    }}
                    onBlur={(e) => {
                      // Clean up the value on blur
                      const cleanedValue = e.target.value.replace(/[^0-9]/g, '');
                      field.onChange(cleanedValue);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="md:col-span-1">
          <FormField
            control={form.control}
            name="experienceUnit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Unit<span className="text-destructive">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || "years"}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="months">Months</SelectItem>
                    <SelectItem value="years">Years</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
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
            onClick={() => append({ organization: "", designation: "", from: undefined, to: undefined })}
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Experience
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

              <FormField
                control={form.control}
                name={`experiences.${index}.organization`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organization</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter organization name" 
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => {
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
                name={`experiences.${index}.designation`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Designation</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Senior Developer" 
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
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
  )
}