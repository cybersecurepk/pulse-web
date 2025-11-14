"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stepper } from "@/components/core/stepper";
import {
  PersonalInfoStep,
  EducationStep,
  ExperienceStep,
  AvailabilityStep,
  ReviewStep,
} from "../components";
import { applicationFormSchema, ApplicationFormData } from "../data/schema";
import { STEPS } from "../data/constants";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

const PERSONAL_INFO_FIELDS: (keyof ApplicationFormData)[] = [
  "name",
  "email",
  "gender",
  "primaryPhone",
  "currentCity",
  "permanentCity",
];

const EDUCATION_FIELDS: (keyof ApplicationFormData)[] = [
  "yearsOfEducation",
  "highestDegree",
  "majors",
  "university",
  "yearOfCompletion",
];

const EXPERIENCE_FIELDS: (keyof ApplicationFormData)[] = [
  "totalExperience",
  "experienceUnit",
];

const AVAILABILITY_FIELDS: (keyof ApplicationFormData)[] = [
  "workingDays",
  "weekends",
  "onsiteSessions",
  "remoteSessions",
  "blueTeam",
  "redTeam",
  "grc",
];

export function ApplicationFormView() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const router = useRouter();
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
  });

  const validateCurrentStep = async () => {
    let fieldsToValidate: (keyof ApplicationFormData)[] = [];

    switch (currentStep) {
      case 0:
        fieldsToValidate = PERSONAL_INFO_FIELDS;
        break;
      case 1:
        fieldsToValidate = EDUCATION_FIELDS;
        break;
      case 2:
        fieldsToValidate = EXPERIENCE_FIELDS;
        break;
      case 3:
        fieldsToValidate = AVAILABILITY_FIELDS;
        break;
      case 4:
        // Review step - validate consent field
        fieldsToValidate = ["consent"];
        break;
      default:
        return true;
    }

    const result = await form.trigger(fieldsToValidate);
    return result;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();

    if (isValid && currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (data: ApplicationFormData) => {
    try {
      setIsSaving(true);
      
      // Prepare payload matching API route expectations
      const payload = {
        ...data,
        experiences: data.experiences?.map((e) => ({
          organization: e.organization,
          designation: e.designation,
          from: e.from ? new Date(e.from).toISOString() : undefined,
          to: e.to ? new Date(e.to).toISOString() : undefined,
        })),
      };

      // Submit to API route
      const response = await fetch("/api/submit-application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to submit application");
      }

      toast.success(result.message || "Application submitted successfully");
      setIsComplete(true);
    } catch (err) {
      console.error("Failed to submit application", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to submit application";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  // Simple click handler for the submit button
  const handleFormSubmit = async () => {
    // Validate consent field before submission
    const isValid = await validateCurrentStep();
    
    if (!isValid) {
      return;
    }
    
    // Get the form data and submit it
    const data = form.getValues();
    await handleSubmit(data);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <PersonalInfoStep form={form} />;
      case 1:
        return <EducationStep form={form} />;
      case 2:
        return <ExperienceStep form={form} />;
      case 3:
        return <AvailabilityStep form={form} />;
      case 4:
        return <ReviewStep data={form.getValues()} form={form} />;
      default:
        return null;
    }
  };

  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <FormProvider {...form}>
      {isComplete ? (
        <Card className="w-full max-w-[600px] mx-auto border-green-500 bg-green-50 mt-12 text-green-700 shadow-lg flex flex-col items-center justify-center p-12">
          <CheckCircle className="w-20 h-20 mb-4 text-green-500" />
          <CardTitle className="text-center text-2xl font-semibold mb-2">
            Application Submitted!
          </CardTitle>
          <p className="text-center text-green-700">
            Thank you for applying. Your application has been received
            successfully. We'll be in touch soon.
          </p>
        </Card>
      ) : (
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
                  <Button
                    type="button"
                    onClick={handleFormSubmit}
                    disabled={isSaving}
                  >
                    {isSaving ? "Submitting..." : "Submit Application"}
                  </Button>
                ) : (
                  <Button type="button" onClick={handleNext}>
                    Next step →
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </form>
      )}
    </FormProvider>
  );
}
