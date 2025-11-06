import { TestAttemptView } from "@/feature/user/tests/view/test-attempt-view";

export default async function TestAttemptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const testId = resolvedParams.id;
  return <TestAttemptView testId={testId} />;
}
