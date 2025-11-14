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
import { BookOpen, Clock, CheckCircle, Calendar } from "lucide-react";
import Link from "next/link";
import { useGetUserTestAttemptsQuery } from "@/service/rtk-query/tests/tests-apis";
import { useSafeSession } from "@/hooks/use-session";
import { BookOpen as BookOpenIcon } from "lucide-react";

interface CompletedTestsViewProps {
  userId?: string;
}

export function CompletedTestsView({ userId }: CompletedTestsViewProps) {
  const { data: session } = useSafeSession();
  
  // Use session user ID if available, otherwise fallback to prop
  const effectiveUserId = session?.user?.id || userId;
  
  const { data: testAttempts = [], isLoading, isError, error } = useGetUserTestAttemptsQuery(effectiveUserId || "", {
    skip: !effectiveUserId,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Completed Tests</h1>
          <p className="text-muted-foreground">
            View your completed tests and results
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
          <h1 className="text-3xl font-bold tracking-tight">Completed Tests</h1>
          <p className="text-muted-foreground">
            View your completed tests and results
          </p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpenIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Tests</h3>
            <p className="text-muted-foreground text-center mb-4">
              There was an error loading your completed tests. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Completed Tests</h1>
        <p className="text-muted-foreground">
          View your completed tests and results
        </p>
      </div>

      {testAttempts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpenIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Completed Tests</h3>
            <p className="text-muted-foreground text-center mb-4">
              You haven't completed any tests yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testAttempts.map((attempt) => {
            const test = attempt.test;
            if (!test) return null;
            
            return (
              <Card key={attempt.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{test.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {test.description}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">Completed</Badge>
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
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Completed on: {new Date(attempt.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className={`font-semibold ${attempt.passed ? 'text-green-600' : 'text-red-600'}`}>
                        Score: {attempt.score}% {attempt.passed ? '(Passed)' : '(Failed)'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}