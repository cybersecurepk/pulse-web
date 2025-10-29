"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { CheckIcon } from "lucide-react"

interface Step {
  id: number
  title: string
  description?: string
}

interface StepperProps {
  steps: Step[]
  currentStep: number
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = currentStep === index
          const isCompleted = currentStep > index
          
          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "flex size-10 items-center justify-center rounded-full border-2 transition-colors",
                    isCompleted && "bg-blue-600 border-blue-600 text-white",
                    isActive && "border-blue-600 text-blue-600 bg-white",
                    !isActive && !isCompleted && "border-gray-300 text-gray-300 bg-white"
                  )}
                >
                  {isCompleted ? (
                    <CheckIcon className="size-5" />
                  ) : (
                    <span className="text-sm font-semibold">{step.id}</span>
                  )}
                </div>
                <div className="text-center">
                  <div
                    className={cn(
                      "text-xs font-medium",
                      isActive && "text-blue-600",
                      isCompleted && "text-gray-900",
                      !isActive && !isCompleted && "text-gray-400"
                    )}
                  >
                    {step.title}
                  </div>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 mx-2 transition-colors",
                    currentStep > index ? "bg-blue-600" : "bg-gray-300"
                  )}
                />
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
