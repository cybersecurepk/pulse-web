"use client";

import { EditProfileView } from "@/feature/admin/account/view";
import { useSafeSession } from "@/hooks/use-session";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default function Page({
  params,
}: {
  params: { id: string };
}) {
  const { id: userId } = params;
  
  const { data: session, status } = useSafeSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated" || !userId) {
    return notFound();
  }

  // Check if user is trying to edit their own profile or is an admin
  const isOwnProfile = session?.user?.id === userId;
  const isAdmin = session?.user?.role === "super_admin" || 
                  session?.user?.role === "admin" || 
                  session?.user?.role === "company_admin";

  // Allow editing if it's own profile or user is admin
  if (!isOwnProfile && !isAdmin) {
    return notFound();
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditProfileView userId={userId} />
    </Suspense>
  );
}