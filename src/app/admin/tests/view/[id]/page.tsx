import { ViewTestPage } from "@/feature/admin/tests/view/view-test-view";

export default async function ViewTestRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return <ViewTestPage params={{ id: resolvedParams.id }} />;
}