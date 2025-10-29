import { TestDetails } from "@/feature/admin/tests/components/test-details";

export default async function UserViewTestRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return <TestDetails params={{ id: resolvedParams.id }} />;
}