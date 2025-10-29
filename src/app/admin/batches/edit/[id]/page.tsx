import { EditBatchPage } from "@/feature/admin/batches/view/edit-batch-view";

export default async function EditBatchRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return <EditBatchPage params={resolvedParams} />;
}
