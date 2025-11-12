"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { useFormContext } from "react-hook-form";

export interface InputFieldProps {
  name: string;
  type?: "text" | "number" | "email" | "password" | "time";
  label?: ReactNode;
  placeholder?: string;
  className?: string;
  description?: ReactNode;
  containerClassName?: string;
  required?: boolean;
  disabled?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  inputMode?: "none" | "text" | "tel" | "url" | "email" | "numeric" | "decimal" | "search";
  maxLength?: number;
  hideError?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function InputField({
  name,
  label,
  description,
  type = "text",
  className,
  containerClassName,
  required,
  disabled = false,
  leadingIcon,
  trailingIcon,
  inputMode,
  maxLength,
  hideError = false,
  onChange,
  onKeyDown,
  ...props
}: InputFieldProps) {
  const { control } = useFormContext();
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className={cn("space-y-0.5", containerClassName)}>
          {label && (
            <FormLabel>
              {label} {required && <span className="text-red-500">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <div className="relative">
              {leadingIcon && (
                <div className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">
                  {leadingIcon}
                </div>
              )}
              <Input
                {...field}
                type={type}
                inputMode={inputMode}
                maxLength={maxLength}
                className={cn(
                  "focus:border-blue-500 focus:ring-1 focus:ring-blue-200 border-gray-300",
                  leadingIcon && "pl-10",
                  trailingIcon && "pr-10",
                  className
                )}
                value={field.value ?? ""}
                onChange={(e) => {
                  if (type === "number") {
                    field.onChange(
                      e.target.value === "" ? null : Number(e.target.value)
                    );
                  } else {
                    field.onChange(e.target.value);
                  }
                  onChange?.(e);
                }}
                onKeyDown={onKeyDown}
                disabled={disabled}
                {...props}
              />
              {trailingIcon && (
                <div className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2">
                  {trailingIcon}
                </div>
              )}
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          {!hideError && <FormMessage />}
        </FormItem>
      )}
    />
  );
}
