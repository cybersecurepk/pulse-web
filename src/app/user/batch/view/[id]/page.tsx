import { UserBatchDetails } from "@/feature/user/batch/view/components/user-batch-details";

export const metadata = { title: `My Batch` };

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return <UserBatchDetails batchId={resolvedParams.id} />;
}