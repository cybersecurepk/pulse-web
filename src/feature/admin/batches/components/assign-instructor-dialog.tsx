"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Field } from "@/components/core/hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import {
  useSaveBatchInstructorMutation,
  useUpdateBatchInstructorMutation,
  useGetBatchInstructorByIdQuery,
} from "@/service/rtk-query/batch-instructors/batch-instructor-api";
import { BatchInstructorPayload } from "@/service/rtk-query/batch-instructors/batch-instructor-type";
import { useGetAllInstructorsQuery } from "@/service/rtk-query/instructors/instructor-api";

const assignInstructorSchema = z.object({
  instructorId: z.string().min(1, { message: "Instructor is required" }),
  isActive: z.boolean(),
});

type AssignInstructorFormData = z.infer<typeof assignInstructorSchema>;

interface AssignInstructorDialogProps {
  open: boolean;
  onClose: () => void;
  batchId: string;
  assignmentId?: string;
}

export function AssignInstructorDialog({
  open,
  onClose,
  batchId,
  assignmentId,
}: AssignInstructorDialogProps) {
  const isEditMode = !!assignmentId;

  const { data: instructorsData = [], isLoading: isLoadingInstructors } =
    useGetAllInstructorsQuery();
  const { data: assignmentData } = useGetBatchInstructorByIdQuery(assignmentId!, {
    skip: !assignmentId,
  });
  const [saveBatchInstructor, { isLoading: isSaving }] = useSaveBatchInstructorMutation();
  const [updateBatchInstructor, { isLoading: isUpdating }] =
    useUpdateBatchInstructorMutation();

  const form = useForm<AssignInstructorFormData>({
    resolver: zodResolver(assignInstructorSchema),
    defaultValues: {
      instructorId: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (!isEditMode || !assignmentData) {
      form.reset({
        instructorId: "",
        isActive: true,
      });
      return;
    }

    form.reset({
      instructorId: assignmentData.instructor.id,
      isActive: assignmentData.isActive,
    });
  }, [assignmentData, isEditMode, form]);

  const onSubmit = async (values: AssignInstructorFormData) => {
    try {
      const payload: BatchInstructorPayload = {
        batchId,
        instructorId: values.instructorId,
        isActive: values.isActive,
      };

      if (isEditMode) {
        await updateBatchInstructor({ id: assignmentId!, payload }).unwrap();
      } else {
        await saveBatchInstructor(payload).unwrap();
      }

      form.reset();
      onClose();
    } catch (error) {
      console.error(`Failed to ${isEditMode ? "update" : "create"} assignment:`, error);
      form.setError("root", {
        type: "manual",
        message: `Failed to ${isEditMode ? "update" : "create"} assignment. Please try again.`,
      });
    }
  };

  const instructorOptions = instructorsData.map((instructor) => ({
    value: instructor.id,
    label: `${instructor.firstName} ${instructor.lastName} (${instructor.email})`,
  }));

  const isLoading = isSaving || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Instructor Assignment" : "Assign Instructor to Batch"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the instructor assignment details."
              : "Select an instructor to assign to this batch."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Field.Select
              name="instructorId"
              label="Instructor"
              options={instructorOptions}
              required
              disabled={isLoadingInstructors || isEditMode}
            />
            <Field.Switch
              name="isActive"
              label="Active"
              description="Enable this assignment"
            />

            {form.formState.errors.root && (
              <div className="text-sm text-red-600 font-medium">
                {form.formState.errors.root.message}
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {isEditMode ? "Updating..." : "Assigning..."}
                  </div>
                ) : (
                  isEditMode ? "Update" : "Assign"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

