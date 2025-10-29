"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Field } from "@/components/core/hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  useGetInstructorByIdQuery,
  useSaveInstructorMutation,
  useUpdateInstructorMutation,
} from "@/service/rtk-query/instructors/instructor-api";
import { InstructorPayload } from "@/service/rtk-query/instructors/instructor-type";

const instructorSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "First name is required" })
    .min(2, { message: "First name must be at least 2 characters" }),
  lastName: z
    .string()
    .min(1, { message: "Last name is required" })
    .min(2, { message: "Last name must be at least 2 characters" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" }),
  phone: z
    .string()
    .min(1, { message: "Phone number is required" }),
  specialization: z
    .string()
    .min(1, { message: "Specialization is required" }),
  expertise: z
    .string()
    .min(1, { message: "Expertise is required" }),
  isActive: z.boolean(),
});

type InstructorFormData = z.infer<typeof instructorSchema>;

export function InstructorForm({ instructorId }: { instructorId?: string }) {
  const router = useRouter();
  const isEditMode = !!instructorId;

  const { data: instructorData, isLoading: isLoadingInstructor } = useGetInstructorByIdQuery(instructorId!, {
    skip: !instructorId,
  });
  const [saveInstructor, { isLoading: isSaving }] = useSaveInstructorMutation();
  const [updateInstructor, { isLoading: isUpdating }] = useUpdateInstructorMutation();

  const form = useForm<InstructorFormData>({
    resolver: zodResolver(instructorSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      specialization: "",
      expertise: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (!instructorId || !instructorData) return;

    try {
      form.reset({
        firstName: instructorData.firstName,
        lastName: instructorData.lastName,
        email: instructorData.email,
        phone: instructorData.phone,
        specialization: instructorData.specialization,
        expertise: instructorData.expertise,
        isActive: instructorData.isActive,
      });
    } catch (error) {
      console.error("Error loading instructor:", error);
    }
  }, [instructorId, instructorData, form]);

  const onSubmit = async (values: InstructorFormData) => {
    try {
      const payload: InstructorPayload = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        specialization: values.specialization,
        expertise: values.expertise,
        isActive: values.isActive,
      };

      if (isEditMode) {
        await updateInstructor({ id: instructorId!, payload }).unwrap();
      } else {
        await saveInstructor(payload).unwrap();
      }

      router.push("/admin/instructors");
    } catch (error) {
      console.error(`Failed to ${isEditMode ? "update" : "create"} instructor:`, error);
      form.setError("root", {
        type: "manual",
        message: `Failed to ${isEditMode ? "update" : "create"} instructor. Please try again.`,
      });
    }
  };

  if (isEditMode && isLoadingInstructor) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
        Loading instructor details...
      </div>
    );
  }

  const isLoading = form.formState.isSubmitting || isSaving || isUpdating;

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/admin/instructors">
            <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditMode ? "Edit Instructor" : "Create New Instructor"}
          </h1>
        </div>
        <p className="text-muted-foreground">
          {isEditMode
            ? "Update instructor details below."
            : "Create a new instructor and configure their details."}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {isEditMode ? "Edit Instructor" : "Create New Instructor"}
          </CardTitle>
          <CardDescription>
            {isEditMode
              ? "Modify the existing instructor information."
              : "Fill in the details below to create a new instructor."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field.Text name="firstName" label="First Name" required />
                  <Field.Text name="lastName" label="Last Name" required />
                </div>
                <Field.Text name="email" label="Email Address" type="email" required />
                <Field.Text name="phone" label="Phone Number" required />
                <Field.Text name="specialization" label="Specialization" required />
                <Field.Textarea 
                  name="expertise" 
                  label="Expertise" 
                  placeholder="e.g., React, Node.js, TypeScript"
                  required 
                />
                <Field.Switch
                  name="isActive"
                  label="Active Instructor"
                  description="Enable this instructor for use"
                />
              </div>

              {form.formState.errors.root && (
                <div className="text-sm text-red-600 font-medium">
                  {form.formState.errors.root.message}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {isEditMode ? "Updating..." : "Creating..."}
                    </div>
                  ) : (
                    isEditMode ? "Update Instructor" : "Create Instructor"
                  )}
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  className="flex-1"
                  onClick={() => router.push("/admin/instructors")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
