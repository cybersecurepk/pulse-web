import React from "react";
import { BatchForm } from "../components/batch-form";

export function EditBatchPage({ params }: { params: { id: string } }) {
  return <BatchForm batchId={params.id} />;
}
