"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Field } from "@/components/core/hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const batchSchema = z.object({
  batchName: z
    .string()
    .min(1, { message: "Batch name is required" })
    .min(3, { message: "Name must be at least 3 characters" }),
  batchCode: z
    .string()
    .min(1, { message: "Batch code is required" })
    .min(3, { message: "Code must be at least 3 characters" }),
  location: z
    .string()
    .min(1, { message: "Location is required" }),
  startDate: z
    .date({ message: "Start date is required" }),
  endDate: z
    .date({ message: "End date is required" }),
  status: z
    .enum(["Upcoming", "Ongoing", "Completed"], {
      message: "Status is required",
    }),
  instructors: z
    .array(z.string())
    .min(1, { message: "At least one instructor must be selected" }),
  maxLearners: z
    .number()
    .min(1, { message: "Max learners must be at least 1" })
    .max(100, { message: "Max learners cannot exceed 100" }),
  courseProgram: z
    .string()
    .min(1, { message: "Course/Program is required" }),
  summaryNotes: z
    .string()
    .optional(),
});

type BatchFormData = z.infer<typeof batchSchema>;

// Static data for dropdowns and multi-selects
const locationOptions = [
  { value: "New York", label: "New York" },
  { value: "San Francisco", label: "San Francisco" },
  { value: "Los Angeles", label: "Los Angeles" },
  { value: "Chicago", label: "Chicago" },
  { value: "Seattle", label: "Seattle" },
  { value: "Boston", label: "Boston" },
  { value: "Austin", label: "Austin" },
  { value: "Denver", label: "Denver" },
];

const statusOptions = [
  { value: "Upcoming", label: "Upcoming" },
  { value: "Ongoing", label: "Ongoing" },
  { value: "Completed", label: "Completed" },
];

const instructorOptions = [
  { value: "john-smith", label: "John Smith" },
  { value: "sarah-johnson", label: "Sarah Johnson" },
  { value: "mike-chen", label: "Mike Chen" },
  { value: "emily-watson", label: "Dr. Emily Watson" },
  { value: "alex-rodriguez", label: "Alex Rodriguez" },
  { value: "lisa-park", label: "Lisa Park" },
  { value: "david-kim", label: "David Kim" },
  { value: "robert-wilson", label: "Robert Wilson" },
  { value: "maria-garcia", label: "Maria Garcia" },
  { value: "james-brown", label: "James Brown" },
];

const courseProgramOptions = [
  { value: "full-stack-development", label: "Full Stack Development" },
  { value: "data-science", label: "Data Science" },
  { value: "ui-ux-design", label: "UI/UX Design" },
  { value: "cybersecurity", label: "Cybersecurity" },
  { value: "mobile-development", label: "Mobile Development" },
  { value: "cloud-computing", label: "Cloud Computing" },
  { value: "machine-learning", label: "Machine Learning" },
  { value: "devops", label: "DevOps" },
];

export function BatchForm() {
  const router = useRouter();

  const form = useForm<BatchFormData>({
    resolver: zodResolver(batchSchema),
    defaultValues: {
      batchName: "",
      batchCode: "",
      location: "",
      startDate: undefined,
      endDate: undefined,
      status: "Upcoming",
      instructors: [],
      maxLearners: 25,
      courseProgram: "",
      summaryNotes: "",
    },
  });

  const onSubmit = async (values: BatchFormData) => {
    try {
      console.log("Batch form submitted:", values);
      
      // TODO: Replace with actual API call
      // await createBatch(values);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      router.push("/admin/batches");
    } catch (err: unknown) {
      console.error("Failed to create batch:", err);
      form.setError("root", {
        type: "manual",
        message: "Failed to create batch. Please try again.",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/admin/batches">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Create New Batch</h1>
        </div>
        <p className="text-muted-foreground">
          Create a new batch and configure its details
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Batch</CardTitle>
          <CardDescription>
            Fill in the details below to create a new batch.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <Field.Text
                  name="batchName"
                  label="Batch Name"
                  placeholder="Enter batch name"
                  required
                />
                
                <Field.Text
                  name="batchCode"
                  label="Batch Code"
                  placeholder="Enter batch code (e.g., FSD-2024-001)"
                  required
                />

                <Field.Select
                  name="location"
                  label="Location"
                  placeholder="Select location"
                  options={locationOptions}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field.DatePicker
                    name="startDate"
                    label="Start Date"
                    placeholder="Select start date"
                    required
                  />
                  
                  <Field.DatePicker
                    name="endDate"
                    label="End Date"
                    placeholder="Select end date"
                    required
                  />
                </div>

                <Field.Select
                  name="status"
                  label="Status"
                  placeholder="Select status"
                  options={statusOptions}
                  required
                />

                <Field.Select
                  name="instructors"
                  label="Instructor(s)"
                  placeholder="Select instructors"
                  options={instructorOptions}
                  multiple
                  required
                />

                <Field.Text
                  name="maxLearners"
                  label="Max Learners"
                  placeholder="Enter maximum number of learners"
                  type="number"
                  required
                />

                <Field.Select
                  name="courseProgram"
                  label="Course/Program"
                  placeholder="Select course or program"
                  options={courseProgramOptions}
                  required
                />

                <Field.Textarea
                  name="summaryNotes"
                  label="Summary/Notes"
                  placeholder="Enter summary or notes (optional)"
                />
              </div>

              {form.formState.errors.root && (
                <div className="text-sm text-red-600 font-medium">
                  {form.formState.errors.root.message}
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="flex-1"
                >
                  {form.formState.isSubmitting ? "Creating..." : "Create Batch"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/batches")}
                  className="flex-1"
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
