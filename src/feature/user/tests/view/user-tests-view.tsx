"use client";

import { useState, useEffect } from "react";
import { ActiveTestsView } from "./active-tests-view";
import { useGetBatchTestsByUserIdQuery } from "@/service/rtk-query/batch-tests/batch-test-api";
import { useSafeSession } from "@/hooks/use-session";
import { BookOpen } from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface UserTestsViewProps {
  userId?: string;
}

export function UserTestsView({ userId }: UserTestsViewProps) {
  const { data: session } = useSafeSession();
  
  // Use session user ID if available, otherwise fallback to prop
  const effectiveUserId = session?.user?.id || userId;
  
  const { data: batchTestsData = [], isLoading, isError, error } = useGetBatchTestsByUserIdQuery(effectiveUserId!, {
    skip: !effectiveUserId,
  });

  // Filter tests into active based on the test's isActive property
  const activeTests = batchTestsData
    .filter(bt => bt.test?.isActive)
    .map(bt => bt.test);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Tests</h1>
          <p className="text-muted-foreground">
            View and manage your active tests
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-pulse">Loading tests...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    console.error("Error fetching tests:", error);
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
            <h3 className="text-lg font-semibold mb-2">Error Loading Tests</h3>
            <p className="text-muted-foreground text-center mb-4">
              There was an error loading your tests. Please try again later.
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
      <ActiveTestsView tests={activeTests} />
    </div>
  );
}