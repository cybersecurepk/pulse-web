import React from "react";
import { BatchDetails } from "../components/batch-details";

export function BatchDetailsView({ params }: { params: { id: string } }) {
  return <BatchDetails batchId={params.id} />;
}
