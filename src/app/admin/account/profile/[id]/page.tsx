"use client";

import { MyProfileView } from "@/feature/admin/account/view";
import { useSafeSession } from "@/hooks/use-session";
import { notFound } from "next/navigation";
import { use } from "react";

export default function Page({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  // Unwrap the params Promise if it's a Promise
  const unwrappedParams = use(params as Promise<{ id: string }>);
  const { id: userId } = unwrappedParams;
  
  const { data: session, status } = useSafeSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated" || !userId) {
    return notFound();
  }

  // Check if user is trying to view their own profile or is an admin
  const isOwnProfile = session?.user?.id === userId;
  const isAdmin = session?.user?.role === "super_admin" || 
                  session?.user?.role === "admin" || 
                  session?.user?.role === "company_admin";

  // Allow viewing if it's own profile or user is admin
  if (!isOwnProfile && !isAdmin) {
    return notFound();
  }

  return <MyProfileView userId={userId} />;
}