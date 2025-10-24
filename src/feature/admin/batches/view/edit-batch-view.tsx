import React from "react";
import { EditBatchForm } from "../components/edit-batch";

export function EditBatchPage({ params }: { params: { id: string } }) {
  return <EditBatchForm params={params} />;
}
