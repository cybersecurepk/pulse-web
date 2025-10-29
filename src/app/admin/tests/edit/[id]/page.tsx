import { EditTestView } from "@/feature/admin/tests/view";

export default async function EditTestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return <EditTestView testId={resolvedParams.id} />;
}