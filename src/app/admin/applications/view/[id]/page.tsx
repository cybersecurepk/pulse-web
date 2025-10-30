import { ApplicationDetailsView } from "@/feature/admin/applications/view/application-details-view";

export default async function ViewApplicationRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return <ApplicationDetailsView params={resolvedParams} />;
}
