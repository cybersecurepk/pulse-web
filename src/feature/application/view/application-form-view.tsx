"use client"

import { useState } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Stepper } from "@/components/core/stepper"
import {
  PersonalInfoStep,
  EducationStep,
  ExperienceStep,
  AvailabilityStep,
  ReviewStep,
} from "../components"
import { applicationFormSchema, ApplicationFormData } from "../data/schema"
import { STEPS } from "../data/constants"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const PERSONAL_INFO_FIELDS: (keyof ApplicationFormData)[] = [
  "name",
  "email",
  "gender",
  "primaryPhone",
  "currentCity",
  "permanentCity",
]

const EDUCATION_FIELDS: (keyof ApplicationFormData)[] = [
  "yearsOfEducation",
  "highestDegree",
  "majors",
  "university",
  "yearOfCompletion",
]

const EXPERIENCE_FIELDS: (keyof ApplicationFormData)[] = ["totalExperience", "experienceUnit"]

const AVAILABILITY_FIELDS: (keyof ApplicationFormData)[] = [
  "workingDays",
  "weekends",
  "onsiteSessions",
  "remoteSessions",
  "consent",
]

export function ApplicationFormView() {
  const [currentStep, setCurrentStep] = useState(0)

  const router = useRouter()
  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationFormSchema),
    mode: "onBlur",
    defaultValues: {
      // Personal Information
      name: "",
      email: "",
      gender: undefined,
      primaryPhone: "",
      secondaryPhone: "",
      currentCity: "",
      permanentCity: "",
      
      // Education
      yearsOfEducation: undefined,
      highestDegree: undefined,
      majors: "",
      university: "",
      yearOfCompletion: "",
      
      // Experience
      totalExperience: "",
      experienceUnit: "years",
      experiences: [],
      
      // Availability & Interests
      workingDays: undefined,
      weekends: undefined,
      onsiteSessions: undefined,
      remoteSessions: undefined,
      blueTeam: false,
      redTeam: false,
      grc: false,
      consent: false,
    },
  })

  const validateCurrentStep = async () => {
    let fieldsToValidate: (keyof ApplicationFormData)[] = []

    switch (currentStep) {
      case 0:
        fieldsToValidate = PERSONAL_INFO_FIELDS
        break
      case 1:
        fieldsToValidate = EDUCATION_FIELDS
        break
      case 2:
        fieldsToValidate = EXPERIENCE_FIELDS
        break
      case 3:
        fieldsToValidate = AVAILABILITY_FIELDS
        break
      case 4:
        // Review step - no validation needed
        return true
      default:
        return true
    }

    const result = await form.trigger(fieldsToValidate)
    return result
  }

  const handleNext = async () => {
    const isValid = await validateCurrentStep()

    if (isValid && currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSubmit = async (data: ApplicationFormData) => {
    console.log("Form submitted:", data)
    toast.success("Application submitted successfully!")
    router.push("/")
    // TODO: Send data to backend API
  }

  // Simple click handler for the submit button
  const handleFormSubmit = async () => {
    // Get the form data and submit it
    const data = form.getValues()
    await handleSubmit(data)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <PersonalInfoStep form={form} />
      case 1:
        return <EducationStep form={form} />
      case 2:
        return <ExperienceStep form={form} />
      case 3:
        return <AvailabilityStep form={form} />
      case 4:
        return <ReviewStep data={form.getValues()} />
      default:
        return null
    }
  }

  const isLastStep = currentStep === STEPS.length - 1

  return (
    <FormProvider {...form}>
      <form>
        <Card className="w-full max-w-[1400px] min-w-[800px] ">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-xl">
              Application Form
            </CardTitle>
            <div className="mt-4">
              <Stepper steps={STEPS} currentStep={currentStep} />
            </div>
            <p className="text-sm text-muted-foreground text-center mt-3">
              Mandatory fields are marked with an asterisk (*)
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            {renderStepContent()}

            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
              >
                Back
              </Button>

              {isLastStep ? (
                <Button type="button" onClick={handleFormSubmit}>Submit Application</Button>
              ) : (
                <Button type="button" onClick={handleNext}>
                  Next step →
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </form>
    </FormProvider>
  )
}
