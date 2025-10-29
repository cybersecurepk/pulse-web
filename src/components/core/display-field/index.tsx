"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const displayFieldVariants = cva("rounded-lg p-4 transition-all duration-200", {
  variants: {
    variant: {
      default: "bg-muted hover:brightness-90 hover:shadow-md",
      secondary: "bg-secondary hover:brightness-90 hover:shadow-md",
      accent: "bg-accent hover:brightness-90 hover:shadow-md",
      outline: "border border-border hover:brightness-90 hover:shadow-md",
      ghost: "hover:brightness-90 hover:shadow-md",
    },
    size: {
      sm: "p-3",
      default: "p-4",
      lg: "p-6",
    },
    spacing: {
      none: "space-y-0",
      sm: "space-y-1",
      default: "space-y-2",
      lg: "space-y-3",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
    spacing: "default",
  },
});

export interface DisplayFieldProps
  extends VariantProps<typeof displayFieldVariants> {
  label: string;
  value: string | number | Date;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
  formatValue?: (value: string | number | Date) => string;
  onClick?: () => void;
  disabled?: boolean;
}

export function DisplayField({
  label,
  value,
  variant,
  size,
  spacing,
  className,
  labelClassName,
  valueClassName,
  formatValue,
  onClick,
  disabled = false,
}: DisplayFieldProps) {
  const formattedValue = formatValue ? formatValue(value) : String(value);

  return (
    <div
      className={cn(
        displayFieldVariants({ variant, size, spacing }),
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={disabled ? undefined : onClick}
    >
      <div className="flex justify-between items-center">
        <span className={cn("font-medium", labelClassName)}>{label}</span>
        <span className={cn("text-sm", valueClassName)}>{formattedValue}</span>
      </div>
    </div>
  );
}

export interface DisplayFieldGroupProps
  extends VariantProps<typeof displayFieldVariants> {
  fields: Array<{
    label: string;
    value: string | number | Date;
    formatValue?: (value: string | number | Date) => string;
  }>;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function DisplayFieldGroup({
  fields,
  variant,
  size,
  spacing,
  className,
  labelClassName,
  valueClassName,
  onClick,
  disabled = false,
}: DisplayFieldGroupProps) {
  return (
    <div
      className={cn(
        displayFieldVariants({ variant, size, spacing }),
        disabled && "opacity-50 cursor-not-allowed",
        !disabled && "hover:bg-muted/80", // Explicit hover state
        className
      )}
      onClick={disabled ? undefined : onClick}
    >
      {fields.map((field, index) => (
        <div key={index} className="flex justify-between items-center">
          <span className={cn("font-medium", labelClassName)}>
            {field.label}
          </span>
          <span className={cn("text-sm", valueClassName)}>
            {field.formatValue
              ? field.formatValue(field.value)
              : String(field.value)}
          </span>
        </div>
      ))}
    </div>
  );
}
