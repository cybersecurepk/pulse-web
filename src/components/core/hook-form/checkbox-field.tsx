'use client';

import { Checkbox } from '@/components/ui/checkbox';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  useFormField,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { useFormContext } from 'react-hook-form';

interface CheckboxOption {
  id: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface CheckboxFieldProps {
  name: string;
  label?: string;
  description?: string;
  options: CheckboxOption[];
  direction?: 'vertical' | 'horizontal';
  required?: boolean;
  className?: string;
  showErrorOnAll?: boolean; // New prop to show error on all checkboxes
}

export function CheckboxField({
  name,
  label,
  description,
  options,
  direction = 'vertical',
  required = false,
  className,
  showErrorOnAll = false, // Default to false
}: CheckboxFieldProps) {
  const { control } = useFormContext();

  return (
    <FormField
      name={name}
      control={control}
      rules={required ? { required: "This field is required" } : undefined}
      render={({ field, formState }) => {
        // Check if there's an error for this field
        const hasError = !!formState.errors[name];
        
        return (
          <FormItem className={className}>
            {(label || description) && (
              <div className="mb-2">
                {label && (
                  <FormLabel className={cn(hasError && showErrorOnAll ? "text-destructive" : "")}>
                    {label}
                    {required && <span className="text-destructive"> *</span>}
                  </FormLabel>
                )}
                {description && <FormDescription>{description}</FormDescription>}
              </div>
            )}
            <div className={cn('space-y-2', direction === 'horizontal' && 'flex flex-wrap gap-4')}>
              {options.map(option => (
                <FormField
                  key={option.id}
                  control={control}
                  name={name}
                  render={() => {
                    // Handle both single checkbox (boolean) and multiple checkboxes (array) cases
                    const isSingleCheckbox = options.length === 1 && option.id === name;
                    
                    if (isSingleCheckbox) {
                      // Single checkbox case (boolean value)
                      return (
                        <FormItem
                          key={option.id}
                          className={cn(
                            'flex flex-row items-center gap-2',
                            direction === 'horizontal' && 'min-w-[150px] flex-1',
                            hasError && showErrorOnAll ? "text-destructive" : ""
                          )}
                        >
                          <FormControl>
                            <Checkbox
                              checked={!!field.value}
                              onCheckedChange={field.onChange}
                              disabled={option.disabled}
                              className={cn(
                                "cursor-pointer",
                                hasError && showErrorOnAll ? "border-destructive data-[state=checked]:bg-destructive data-[state=checked]:text-destructive-foreground" : ""
                              )}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel 
                              className={cn(
                                "cursor-pointer text-sm font-normal",
                                hasError && showErrorOnAll ? "text-destructive" : ""
                              )}
                            >
                              {option.label}
                            </FormLabel>
                            {option.description && (
                              <FormDescription className="text-xs">
                                {option.description}
                              </FormDescription>
                            )}
                          </div>
                        </FormItem>
                      );
                    } else {
                      // Multiple checkboxes case (array value)
                      const fieldValue = Array.isArray(field.value) ? field.value : [];
                      
                      return (
                        <FormItem
                          key={option.id}
                          className={cn(
                            'flex flex-row items-center gap-2',
                            direction === 'horizontal' && 'min-w-[150px] flex-1',
                            hasError && showErrorOnAll ? "text-destructive" : ""
                          )}
                        >
                          <FormControl>
                            <Checkbox
                              checked={fieldValue.includes(option.id)}
                              onCheckedChange={checked => {
                                return checked
                                  ? field.onChange([...fieldValue, option.id])
                                  : field.onChange(
                                      fieldValue.filter((value: string) => value !== option.id),
                                    );
                              }}
                              disabled={option.disabled}
                              className={cn(
                                "cursor-pointer",
                                hasError && showErrorOnAll ? "border-destructive data-[state=checked]:bg-destructive data-[state=checked]:text-destructive-foreground" : ""
                              )}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel 
                              className={cn(
                                "cursor-pointer text-sm font-normal",
                                hasError && showErrorOnAll ? "text-destructive" : ""
                              )}
                            >
                              {option.label}
                            </FormLabel>
                            {option.description && (
                              <FormDescription className="text-xs">
                                {option.description}
                              </FormDescription>
                            )}
                          </div>
                        </FormItem>
                      );
                    }
                  }}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}