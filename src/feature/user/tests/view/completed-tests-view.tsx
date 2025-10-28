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
import { dummyTests } from "@/feature/admin/tests/data/dummy-tests";

export function CompletedTestsView() {
  // For demo purposes, let's show inactive tests as completed
  const completedTests = dummyTests.filter(test => !test.isActive);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Completed Tests</h1>
        <p className="text-muted-foreground">
          View your completed tests and results
        </p>
      </div>

      {completedTests.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Completed Tests</h3>
            <p className="text-muted-foreground text-center mb-4">
              You haven't completed any tests yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {completedTests.map((test) => (
            <Card key={test.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{test.testName}</CardTitle>
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
                    <span>{test.totalQuestions} questions</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{test.duration} minutes</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span>Pass score: {test.passCriteria}%</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Completed on: {test.updatedAt.toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button asChild variant="secondary" size="sm" className="flex-1">
                    <Link href={`/user/tests/results/${test.id}`}>
                      View Results
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}