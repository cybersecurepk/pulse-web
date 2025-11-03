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
  useSaveBatchUserMutation,
  useUpdateBatchUserMutation,
  useGetBatchUserByIdQuery,
} from "@/service/rtk-query/batch-users/batch-user-api";
import { BatchUserPayload } from "@/service/rtk-query/batch-users/batch-user-type";
import { useGetAllUsersQuery } from "@/service/rtk-query/users/users-apis";

const assignUserSchema = z.object({
  userId: z.string().min(1, { message: "User is required" }),
  isActive: z.boolean(),
});

type AssignUserFormData = z.infer<typeof assignUserSchema>;

interface AssignUserDialogProps {
  open: boolean;
  onClose: () => void;
  batchId: string;
  assignmentId?: string;
}

export function AssignUserDialog({
  open,
  onClose,
  batchId,
  assignmentId,
}: AssignUserDialogProps) {
  const isEditMode = !!assignmentId;

  const { data: usersData, isLoading: isLoadingUsers } = useGetAllUsersQuery();
  const { data: assignmentData } = useGetBatchUserByIdQuery(assignmentId!, {
    skip: !assignmentId,
  });
  const [saveBatchUser, { isLoading: isSaving }] = useSaveBatchUserMutation();
  const [updateBatchUser, { isLoading: isUpdating }] = useUpdateBatchUserMutation();

  const form = useForm<AssignUserFormData>({
    resolver: zodResolver(assignUserSchema),
    defaultValues: {
      userId: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (!isEditMode || !assignmentData) {
      form.reset({
        userId: "",
        isActive: true,
      });
      return;
    }

    form.reset({
      userId: assignmentData.user.id,
      isActive: assignmentData.isActive,
    });
  }, [assignmentData, isEditMode, form]);

  const onSubmit = async (values: AssignUserFormData) => {
    try {
      const payload: BatchUserPayload = {
        batchId,
        userId: values.userId,
        isActive: values.isActive,
      };

      if (isEditMode) {
        await updateBatchUser({ id: assignmentId!, payload }).unwrap();
      } else {
        await saveBatchUser(payload).unwrap();
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

  const userOptions =
    usersData?.map((user) => ({
      value: user.id,
      label: `${user.name} (${user.email})`,
    })) || [];

  const isLoading = isSaving || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit User Assignment" : "Add User to Batch"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the user assignment details."
              : "Select a user to add to this batch."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Field.Select
              name="userId"
              label="User"
              options={userOptions}
              required
              disabled={isLoadingUsers || isEditMode}
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
                    {isEditMode ? "Updating..." : "Adding..."}
                  </div>
                ) : (
                  isEditMode ? "Update" : "Add"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

