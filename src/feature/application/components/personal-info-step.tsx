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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ApplicationFormData } from "../data/schema"
import { CITIES } from "../data/constants"

interface PersonalInfoStepProps {
  form: UseFormReturn<ApplicationFormData>
}

export function PersonalInfoStep({ form }: PersonalInfoStepProps) {
  // Validation functions
  const validateName = (value: string): string => {
    // Remove extra whitespace and ensure proper formatting
    return value.replace(/\s+/g, ' ').trim();
  };

  const validateEmail = (value: string): string => {
    // Convert to lowercase and trim
    return value.toLowerCase().trim();
  };

  const validatePhone = (value: string): string => {
    // Remove any non-digit characters except + and spaces
    return value.replace(/[^0-9+\s]/g, '');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Name<span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter your full name" 
                  {...field} 
                  value={field.value || ''}
                  onChange={(e) => {
                    const validatedValue = validateName(e.target.value);
                    field.onChange(validatedValue);
                  }}
                  onBlur={(e) => {
                    // Clean up extra spaces on blur
                    const cleanedValue = e.target.value.replace(/\s+/g, ' ').trim();
                    field.onChange(cleanedValue);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Email<span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => {
                    const validatedValue = validateEmail(e.target.value);
                    field.onChange(validatedValue);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="gender"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Gender<span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Others</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="primaryPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Primary Phone #<span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="+92 300-000-0000" 
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => {
                    const validatedValue = validatePhone(e.target.value);
                    field.onChange(validatedValue);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="secondaryPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Secondary Phone #</FormLabel>
              <FormControl>
                <Input 
                  placeholder="+92 300-000-0000" 
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => {
                    const validatedValue = validatePhone(e.target.value);
                    field.onChange(validatedValue);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="currentCity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Current City<span className="text-destructive">*</span>
              </FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                value={field.value || ''}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CITIES.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
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
          name="permanentCity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Permanent City<span className="text-destructive">*</span>
              </FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                value={field.value || ''}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CITIES.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}