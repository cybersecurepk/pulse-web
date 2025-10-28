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
import { dummyInstructors } from "../data/dummy-instructors";
import { instructor } from "../types/instructor";

const instructorSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .min(3, { message: "Name must be at least 3 characters" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" }),
  phoneNumber: z
    .string()
    .min(1, { message: "Phone number is required" }),
  location: z
    .string()
    .min(1, { message: "Location is required" }),
  profilePhoto: z
    .string()
    .min(1, { message: "Profile photo URL is required" }),
  bio: z
    .string()
    .min(1, { message: "Bio is required" })
    .max(500, { message: "Bio must be less than 500 characters" }),
  assignedBatches: z
    .array(z.string())
    .min(0, { message: "Assigned batches are optional" }),
});

type InstructorFormData = z.infer<typeof instructorSchema>;

const locationOptions = [
  { value: "New York", label: "New York" },
  { value: "San Francisco", label: "San Francisco" },
  { value: "Los Angeles", label: "Los Angeles" },
  { value: "Chicago", label: "Chicago" },
  { value: "Seattle", label: "Seattle" },
  { value: "Austin", label: "Austin" },
  { value: "Denver", label: "Denver" },
  { value: "Miami", label: "Miami" },
  { value: "Boston", label: "Boston" },
  { value: "Portland", label: "Portland" },
];

export function InstructorForm({ instructorId }: { instructorId?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(!!instructorId);

  const form = useForm<InstructorFormData>({
    resolver: zodResolver(instructorSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      location: "",
      profilePhoto: "",
      bio: "",
      assignedBatches: [],
    },
  });

  // ✅ Load instructor data into form if we're editing
  useEffect(() => {
    if (!instructorId) return;

    const fetchInstructor = async () => {
      try {
        // Simulate loading delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Pull from dummy data (replace this with API later)
        const instructor = dummyInstructors.find((i) => i.id === instructorId);
        if (!instructor) throw new Error("Instructor not found");

        form.reset({
          name: instructor.name,
          email: instructor.email,
          phoneNumber: instructor.phoneNumber,
          location: instructor.location,
          profilePhoto: instructor.profilePhoto,
          bio: instructor.bio,
          assignedBatches: instructor.assignedBatches,
        });
      } catch (error) {
        console.error("Error loading instructor:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructor();
  }, [instructorId, form]);

  const onSubmit = async (values: InstructorFormData) => {
    console.log(instructorId ? "Updating instructor:" : "Creating instructor:", values);
    router.push("/admin/instructors");
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Loading instructor details...
      </div>
    );
  }

  const isEditMode = !!instructorId;

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/admin/instructors">
            <Button variant="ghost" size="icon" className="h-8 w-8">
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
                <Field.Text name="name" label="Full Name" required />
                <Field.Text name="email" label="Email Address" type="email" required />
                <Field.Text name="phoneNumber" label="Phone Number" required />
                <Field.Select
                  name="location"
                  label="Location"
                  options={locationOptions}
                  required
                />
                <Field.Text name="profilePhoto" label="Profile Photo URL" required />
                <Field.Textarea name="bio" label="Bio / Summary" placeholder="Enter instructor bio/summary" required />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  {isEditMode ? "Update Instructor" : "Create Instructor"}
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