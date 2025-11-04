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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  useGetBatchByIdQuery,
  useSaveBatchMutation,
  useUpdateBatchMutation,
} from "@/service/rtk-query/batches/batch-api";
import { BatchPayload } from "@/service/rtk-query/batches/batch-type";
import { batchSchema, BatchFormData, statusOptions, sessionTypeOptions } from "../data/schema";
import { locationOptions } from "../data/constants";

export function BatchForm({ batchId }: { batchId?: string }) {
  const router = useRouter();
  const isEditMode = !!batchId;
  const [dynamicLocationOptions, setDynamicLocationOptions] = useState(locationOptions);
  const [dynamicStatusOptions, setDynamicStatusOptions] = useState(statusOptions);
  const [dynamicSessionTypeOptions, setDynamicSessionTypeOptions] = useState(sessionTypeOptions);

  const { data: batchData, isLoading: isLoadingBatch } = useGetBatchByIdQuery(batchId!, {
    skip: !batchId,
  });
  const [saveBatch, { isLoading: isSaving }] = useSaveBatchMutation();
  const [updateBatch, { isLoading: isUpdating }] = useUpdateBatchMutation();

  const form = useForm<BatchFormData>({
    resolver: zodResolver(batchSchema),
    defaultValues: {
      name: "",
      batchCode: "",
      description: "",
      location: "",
      startDate: new Date(),
      endDate: new Date(),
      status: "pending",
      isActive: true,
      maxCapacity: 30,
      sessionType: "remote",
    },
  });

  // useEffect(() => {
  //   if (!batchId || !batchData) return;

  //   // Update location options to include the current location if it's not already there
  //   if (batchData.location && !dynamicLocationOptions.some(opt => opt.value === batchData.location)) {
  //     setDynamicLocationOptions(prev => [
  //       { value: batchData.location, label: `${batchData.location} (Current)` },
  //       ...prev
  //     ]);
  //   }

  //   // Update status options to include the current status if it's not already there
  //   if (batchData.status && !dynamicStatusOptions.some(opt => opt.value === batchData.status)) {
  //     const statusLabel = batchData.status
  //       .split('_')
  //       .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  //       .join(' ');
  //     setDynamicStatusOptions(prev => [
  //       { value: batchData.status, label: `${statusLabel} (Current)` },
  //       ...prev
  //     ]);
  //   }

  //   // Update session type options to include the current session type if it's not already there
  //   if (batchData.sessionType && !dynamicSessionTypeOptions.some(opt => opt.value === batchData.sessionType)) {
  //     const sessionTypeLabel = batchData.sessionType.charAt(0).toUpperCase() + batchData.sessionType.slice(1);
  //     setDynamicSessionTypeOptions(prev => [
  //       { value: batchData.sessionType, label: `${sessionTypeLabel} (Current)` },
  //       ...prev
  //     ]);
  //   }

  //   try {
  //     form.reset({
  //       name: batchData.name,
  //       batchCode: batchData.batchCode || "",
  //       description: batchData.description || "",
  //       location: batchData.location,
  //       startDate: new Date(batchData.startDate),
  //       endDate: new Date(batchData.endDate),
  //       status: batchData.status,
  //       isActive: batchData.isActive,
  //       maxCapacity: batchData.maxCapacity,
  //       sessionType: batchData.sessionType || "remote",
  //     });
  //   } catch (error) {
  //     console.error("Error loading batch:", error);
  //   }
  // }, [batchId, batchData, form]);

  // 1) Build dynamic options when batch loads
useEffect(() => {
  if (!batchId || !batchData) return;

  if (batchData.location && !dynamicLocationOptions.some(opt => opt.value === batchData.location)) {
    setDynamicLocationOptions(prev => [
      { value: batchData.location, label: `${batchData.location} (Current)` },
      ...prev
    ]);
  }

  if (batchData.status && !dynamicStatusOptions.some(opt => opt.value === batchData.status)) {
    const statusLabel = batchData.status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    setDynamicStatusOptions(prev => [
      { value: batchData.status, label: `${statusLabel} (Current)` },
      ...prev
    ]);
  }

  if (batchData.sessionType && !dynamicSessionTypeOptions.some(opt => opt.value === batchData.sessionType)) {
    const sessionTypeLabel = batchData.sessionType.charAt(0).toUpperCase() + batchData.sessionType.slice(1);

    setDynamicSessionTypeOptions(prev => [
      { value: batchData.sessionType, label: `${sessionTypeLabel} (Current)` },
      ...prev
    ]);
  }
}, [batchId, batchData]);


// 2) AFTER options update, reset the form WITH correct values
useEffect(() => {
  if (!batchData) return;

  form.reset({
    name: batchData.name,
    batchCode: batchData.batchCode || "",
    description: batchData.description || "",
    location: batchData.location,
    startDate: new Date(batchData.startDate),
    endDate: new Date(batchData.endDate),
    status: batchData.status,
    isActive: batchData.isActive,
    maxCapacity: batchData.maxCapacity,
    sessionType: batchData.sessionType || "remote",
  });
}, [
  batchData,
  dynamicLocationOptions,
  dynamicStatusOptions,
  dynamicSessionTypeOptions,
]);


  const onSubmit = async (values: BatchFormData) => {
    try {
      const payload: BatchPayload = {
        name: values.name,
        batchCode: values.batchCode || undefined,
        description: values.description || "",
        location: values.location,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
        status: values.status,
        isActive: values.isActive,
        maxCapacity: values.maxCapacity,
        sessionType: values.sessionType,
      };

      if (isEditMode) {
        await updateBatch({ id: batchId!, payload }).unwrap();
      } else {
        await saveBatch(payload).unwrap();
      }

      router.push("/admin/batches");
    } catch (error: any) {
      console.error(`Failed to ${isEditMode ? "update" : "create"} batch:`, error);
      if (error?.data) {
        console.error("API Error Details:", error.data);
      }
      
      let errorMessage = `Failed to ${isEditMode ? "update" : "create"} batch. Please try again.`;
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.data?.error) {
        errorMessage = error.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      form.setError("root", {
        type: "manual",
        message: errorMessage,
      });
    }
  };

  if (isEditMode && isLoadingBatch) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
        Loading batch details...
      </div>
    );
  }

  const isLoading = form.formState.isSubmitting || isSaving || isUpdating;

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/admin/batches">
            <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
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
                <Field.Text name="name" label="Batch Name" required />
                <Field.Text name="batchCode" label="Batch Code" />
                <Field.Select
                  name="location"
                  label="Location"
                  options={dynamicLocationOptions}
                  required
                />
                <Field.Select
                  name="sessionType"
                  label="Session Type"
                  options={dynamicSessionTypeOptions}
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
                  options={dynamicStatusOptions}
                  required
                />
                <Field.Switch
                  name="isActive"
                  label="Active Batch"
                  description="Enable this batch for use"
                />
                <Field.Text
                  name="maxCapacity"
                  label="Max Capacity"
                  type="number"
                  required
                />
                <Field.Textarea
                  name="description"
                  label="Description"
                  placeholder="Enter batch description (optional)"
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
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {isEditMode ? "Updating..." : "Creating..."}
                    </div>
                  ) : (
                    isEditMode ? "Save Changes" : "Create Batch"
                  )}
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