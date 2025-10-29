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
import { BookOpen, Clock, CheckCircle, Camera } from "lucide-react";
import Link from "next/link";
import { dummyTests } from "@/feature/admin/tests/data/dummy-tests";

export function ActiveTestsView() {
  // Filter for active tests only
  const activeTests = dummyTests.filter(test => test.isActive);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Tests</h1>
        <p className="text-muted-foreground">
          View and manage your active tests
        </p>
      </div>

      {/* Proctoring Demo Card */}
      <Card className="border-primary">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">Proctoring Demo</CardTitle>
              <CardDescription className="mt-1">
                Test the screen capture functionality
              </CardDescription>
            </div>
            <Badge variant="default">Demo</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center text-sm text-muted-foreground">
              <Camera className="h-4 w-4 mr-2" />
              <span>Screenshots taken on each question</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4 mr-2" />
              <span>Demo implementation with html2canvas</span>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button asChild size="sm" className="flex-1">
              <Link href="/user/tests/proctoring">
                Try Proctoring Demo
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {activeTests.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Active Tests</h3>
            <p className="text-muted-foreground text-center mb-4">
              You don't have any active tests at the moment.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {activeTests.map((test) => (
            <Card key={test.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{test.testName}</CardTitle>
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
      )}
    </div>
  );
}