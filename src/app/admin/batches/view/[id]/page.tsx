import { BatchDetailsView } from "@/feature/admin/batches/view/batch-details-view";

export default async function ViewBatchRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return <BatchDetailsView params={resolvedParams} />;
}
