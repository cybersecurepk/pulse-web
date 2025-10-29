import { EditProfileView } from "@/feature/admin/account/view";
import { Suspense } from "react";

export const metadata = { title: `Edit Profile` };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const params = await searchParams;
  const userId = params.id || "1";

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditProfileView userId={userId} />
    </Suspense>
  );
}
