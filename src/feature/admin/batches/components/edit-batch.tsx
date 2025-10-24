"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { EditPageLayout } from "@/components/core/edit-page/edit-layout";
import { DynamicForm, Field } from "@/components/core/edit-page/dynamic-form";
import { dummyBatches } from "../data/dummy-batches";

export function EditBatchPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const batch = dummyBatches.find((b) => b.id === params.id);

  const [values, setValues] = useState({
    batchName: batch?.batchName || "",
    batchCode: batch?.batchCode || "",
    location: batch?.location || "",
    startDate: batch?.startDate
      ? new Date(batch.startDate).toISOString().split("T")[0]
      : "",
    endDate: batch?.endDate
      ? new Date(batch.endDate).toISOString().split("T")[0]
      : "",
    maxLearners: batch?.maxLearners || 0,
  });

  const fields: Field[] = [
    { name: "batchName", label: "Batch Name", type: "text" },
    { name: "batchCode", label: "Batch Code", type: "text" },
    { name: "location", label: "Location", type: "text" },
    { name: "startDate", label: "Start Date", type: "date" },
    { name: "endDate", label: "End Date", type: "date" },
    { name: "maxLearners", label: "Max Learners", type: "number" },
  ];

  const handleChange = (name: string, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    console.log("Saving batch:", values);
    router.push("/admin/batches");
  };

  return (
    <EditPageLayout
      title="Edit Batch"
      breadcrumbs={[
        { name: "Dashboard", href: "/admin/dashboard" },
        { name: "Batches", href: "/admin/batches" },
        { name: "Edit Batch" },
      ]}
      onSave={handleSave}
      onCancel={() => router.push("/admin/batches")}
    >
      <DynamicForm fields={fields} values={values} onChange={handleChange} />
    </EditPageLayout>
  );
}
