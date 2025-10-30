"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Step {
  id: number;
  title: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="w-full">
      <div className="flex items-start justify-between">
        {steps.map((step, index) => {
          const isActive = currentStep === index;
          const isCompleted = currentStep > index;
          return (
            <React.Fragment key={step.id}>
              {/* Circle + Label */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex size-7 items-center justify-center rounded-full border-2 text-xs transition-colors",
                    isCompleted && "bg-blue-600 border-blue-600 text-white",
                    isActive && "border-blue-600 text-blue-600 bg-white",
                    !isActive &&
                      !isCompleted &&
                      "border-gray-300 text-gray-300 bg-white"
                  )}
                >
                  {isCompleted ? (
                    <Check className="size-4" />
                  ) : (
                    <span className="font-semibold">{step.id}</span>
                  )}
                </div>
                <div className="mt-1 text-center">
                  <span
                    className={cn(
                      "text-xs font-medium",
                      isActive && "text-blue-600",
                      isCompleted && "text-gray-900",
                      !isActive && !isCompleted && "text-gray-400"
                    )}
                  >
                    {step.title}
                  </span>
                </div>
              </div>
              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 flex items-center mx-2 mt-3.5">
                  <div
                    className={cn(
                      "w-full h-0.5 transition-colors",
                      currentStep > index ? "bg-blue-600" : "bg-gray-300"
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
