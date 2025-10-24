import { EditBatchPage } from "@/feature/admin/batches/components/edit-batch";

export default async function EditBatchRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return <EditBatchPage params={resolvedParams} />;
}
