import { UserProfileView } from "@/feature/admin/users/view/user-profile-view";

export default async function ViewUserRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return <UserProfileView params={resolvedParams} />;
}
