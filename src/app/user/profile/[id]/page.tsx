"use client";

import { UserProfileView } from "@/feature/user/account/view";
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

  // Check if user is trying to view their own profile
  const isOwnProfile = session?.user?.id === userId;

  // Only allow users to view their own profile
  if (!isOwnProfile) {
    return notFound();
  }

  return <UserProfileView />;
}