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
  useSaveBatchTestMutation,
  useUpdateBatchTestMutation,
  useGetBatchTestByIdQuery,
} from "@/service/rtk-query/batch-tests/batch-test-api";
import { BatchTestPayload } from "@/service/rtk-query/batch-tests/batch-test-type";
import { useGetAllTestsQuery } from "@/service/rtk-query/tests/tests-apis";

const assignTestSchema = z.object({
  testId: z.string().min(1, { message: "Test is required" }),
  isActive: z.boolean(),
});

type AssignTestFormData = z.infer<typeof assignTestSchema>;

interface AssignTestDialogProps {
  open: boolean;
  onClose: () => void;
  batchId: string;
  assignmentId?: string;
}

export function AssignTestDialog({
  open,
  onClose,
  batchId,
  assignmentId,
}: AssignTestDialogProps) {
  const isEditMode = !!assignmentId;

  const { data: testsData = [], isLoading: isLoadingTests } = useGetAllTestsQuery();
  const { data: assignmentData } = useGetBatchTestByIdQuery(assignmentId!, {
    skip: !assignmentId,
  });
  const [saveBatchTest, { isLoading: isSaving }] = useSaveBatchTestMutation();
  const [updateBatchTest, { isLoading: isUpdating }] = useUpdateBatchTestMutation();

  const form = useForm<AssignTestFormData>({
    resolver: zodResolver(assignTestSchema),
    defaultValues: {
      testId: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (!isEditMode || !assignmentData) {
      form.reset({
        testId: "",
        isActive: true,
      });
      return;
    }

    form.reset({
      testId: assignmentData.test.id,
      isActive: assignmentData.isActive,
    });
  }, [assignmentData, isEditMode, form]);

  const onSubmit = async (values: AssignTestFormData) => {
    try {
      const payload: BatchTestPayload = {
        batchId,
        testId: values.testId,
        isActive: values.isActive,
      };

      if (isEditMode) {
        await updateBatchTest({ id: assignmentId!, payload }).unwrap();
      } else {
        await saveBatchTest(payload).unwrap();
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

  const testOptions = testsData.map((test) => ({
    value: test.id,
    label: `${test.title} (${test.testCode || "N/A"})`,
  }));

  const isLoading = isSaving || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Test Assignment" : "Assign Test to Batch"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the test assignment details."
              : "Select a test to assign to this batch."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Field.Select
              name="testId"
              label="Test"
              options={testOptions}
              required
              disabled={isLoadingTests || isEditMode}
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

