"use client";

import { useState, useEffect } from "react";
import { ActiveTestsView } from "./active-tests-view";
import { useSafeSession } from "@/hooks/use-session";
import { BookOpen } from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import { useGetUnattemptedTestsForUserQuery } from "@/service/rtk-query/tests/tests-apis";

interface UserTestsViewProps {
  userId?: string;
}

export function UserTestsView({ userId }: UserTestsViewProps) {
  const { data: session } = useSafeSession();
  const searchParams = useSearchParams();
  const refresh = searchParams.get('refresh');
  
  // Use session user ID if available, otherwise fallback to prop
  const effectiveUserId = session?.user?.id || userId;

  // Use the unattempted tests query to trigger refresh when needed
  const { refetch } = useGetUnattemptedTestsForUserQuery(effectiveUserId || "", {
    skip: !effectiveUserId,
  });

  // Refresh data when the refresh parameter is present
  useEffect(() => {
    if (refresh === 'true' && effectiveUserId) {
      refetch();
      // Remove the refresh parameter from URL
      if (typeof window !== 'undefined') {
        window.history.replaceState({}, document.title, "/user/tests");
      }
    }
  }, [refresh, effectiveUserId, refetch]);

  if (!effectiveUserId) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Tests</h1>
          <p className="text-muted-foreground">
            View and manage your active tests
          </p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">User Not Found</h3>
            <p className="text-muted-foreground text-center mb-4">
              Please log in to view your tests.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Tests</h1>
        <p className="text-muted-foreground">
          View and manage your active tests
        </p>
      </div>
      <ActiveTestsView userId={effectiveUserId} onRefetch={refetch} />
    </div>
  );
}