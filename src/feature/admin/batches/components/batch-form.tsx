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
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { dummyBatches } from "../data/dummy-batches";

const batchSchema = z.object({
  batchName: z
    .string()
    .min(3, { message: "Batch name must be at least 3 characters" }),
  batchCode: z
    .string()
    .min(3, { message: "Batch code must be at least 3 characters" }),
  location: z.string().min(1, { message: "Location is required" }),
  startDate: z.date({ message: "Start date is required" }),
  endDate: z.date({ message: "End date is required" }),
  status: z.enum(["Upcoming", "Ongoing", "Completed"]),
  instructors: z
    .array(z.string())
    .min(1, { message: "At least one instructor is required" }),
  maxLearners: z.number().min(1).max(100),
  courseProgram: z.string().optional(),
  summaryNotes: z.string().optional(),
});

type BatchFormData = z.infer<typeof batchSchema>;

const locationOptions = [
  { value: "New York", label: "New York" },
  { value: "San Francisco", label: "San Francisco" },
  { value: "Los Angeles", label: "Los Angeles" },
  { value: "Chicago", label: "Chicago" },
  { value: "Seattle", label: "Seattle" },
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
];

export function BatchForm({ batchId }: { batchId?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(!!batchId);

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
      summaryNotes: "",
    },
  });

  // ✅ Load batch data into form if we're editing
  useEffect(() => {
    if (!batchId) return;

    const fetchBatch = async () => {
      try {
        // Simulate loading delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Pull from dummy data (replace this with API later)
        const batch = dummyBatches.find((b) => b.id === batchId);
        if (!batch) throw new Error("Batch not found");

        form.reset({
          batchName: batch.batchName,
          batchCode: batch.batchCode,
          location: batch.location,
          startDate: new Date(batch.startDate),
          endDate: new Date(batch.endDate),
          status: batch.status,
          instructors: batch.instructors,
          maxLearners: batch.maxLearners,
          summaryNotes: batch.summaryNotes,
        });
      } catch (error) {
        console.error("Error loading batch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBatch();
  }, [batchId, form]);

  const onSubmit = async (values: BatchFormData) => {
    console.log(batchId ? "Updating batch:" : "Creating batch:", values);
    router.push("/admin/batches");
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Loading batch details...
      </div>
    );
  }

  const isEditMode = !!batchId;

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/admin/batches">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditMode ? "Edit Batch" : "Create New Batch"}
          </h1>
        </div>
        <p className="text-muted-foreground">
          {isEditMode
            ? "Update batch details below."
            : "Create a new batch and configure its details."}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {isEditMode ? "Edit Batch" : "Create New Batch"}
          </CardTitle>
          <CardDescription>
            {isEditMode
              ? "Modify the existing batch information."
              : "Fill in the details below to create a new batch."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <Field.Text name="batchName" label="Batch Name" required />
                <Field.Text name="batchCode" label="Batch Code" required />
                <Field.Select
                  name="location"
                  label="Location"
                  options={locationOptions}
                  required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field.DatePicker
                    name="startDate"
                    label="Start Date"
                    required
                  />
                  <Field.DatePicker name="endDate" label="End Date" required />
                </div>
                <Field.Select
                  name="status"
                  label="Status"
                  options={statusOptions}
                  required
                />
                <Field.Select
                  name="instructors"
                  label="Instructor(s)"
                  options={instructorOptions}
                  multiple
                  required
                />
                <Field.Text
                  name="maxLearners"
                  label="Max Learners"
                  type="number"
                  required
                />
                <Field.Textarea
                  name="summaryNotes"
                  label="Summary/Notes"
                  placeholder="Enter summary or notes (optional)"
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1">
                  {isEditMode ? "Save Changes" : "Create Batch"}
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
