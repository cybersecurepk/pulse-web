"use client";

import { useSafeSession } from "@/hooks/use-session";
import { notFound, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();
  const { data: session, status } = useSafeSession();

  // Redirect to the dynamic route with the user's own ID
  useEffect(() => {
    if (session?.user?.id) {
      router.replace(`/user/profile/${session.user.id}`);
    }
  }, [session, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated" || !session?.user?.id) {
    return notFound();
  }

  // This page will redirect to the dynamic route, so we don't need to render anything
  return <div>Redirecting...</div>;
}