import { MyProfileView } from "@/feature/admin/account/view";
import { Suspense } from "react";

export const metadata = { title: `My Profile` };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const params = await searchParams;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MyProfileView userId={params.id || "1"} />
    </Suspense>
  );
}
