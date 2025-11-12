"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useGetUnattemptedTestsForUserQuery } from "@/service/rtk-query/tests/tests-apis";
import { useSafeSession } from "@/hooks/use-session";

interface ActiveTestsViewProps {
  userId?: string;
  onRefetch?: () => void;
}

export function ActiveTestsView({ userId, onRefetch }: ActiveTestsViewProps) {
  const { data: session } = useSafeSession();
  const effectiveUserId = userId || session?.user?.id;

  // Use the new efficient endpoint to get only unattempted tests for the user
  const { data: unattemptedTests = [], isLoading, isError, error, refetch } = useGetUnattemptedTestsForUserQuery(effectiveUserId || "", {
    skip: !effectiveUserId,
  });

  // Call the onRefetch callback when refetching
  const handleRefetch = () => {
    refetch();
    if (onRefetch) {
      onRefetch();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse">Loading tests...</div>
      </div>
    );
  }

  if (isError) {
    console.error("Error fetching tests:", error);
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Tests</h3>
          <p className="text-muted-foreground text-center mb-4">
            There was an error loading your tests. Please try again later.
          </p>
          <Button onClick={handleRefetch} variant="outline" size="sm">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (unattemptedTests.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Active Tests</h3>
          <p className="text-muted-foreground text-center mb-4">
            You don't have any active tests at the moment.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {unattemptedTests.map((test) => (
        <Card key={test.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{test.title}</CardTitle>
                <CardDescription className="mt-1">
                  {test.description}
                </CardDescription>
              </div>
              <Badge variant="secondary">Active</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4 mr-2" />
                <span>{(test.questions && test.questions.length) || 0} questions</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-2" />
                <span>{test.duration} minutes</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span>Pass score: {test.passingCriteria}%</span>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button asChild size="sm" className="flex-1">
                <Link href={`/user/tests/attempt/${test.id}`}>
                  Start Test
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}