"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, MapPin, Users, FileText } from "lucide-react";
import Link from "next/link";
import { dummyBatches } from "../data/dummy-batches";
import { dummyUsers } from "../data/dummy-users";
import { dummyTests } from "../data/dummy-test";

interface BatchDetailsProps {
  batchId: string;
}

export function BatchDetails({ batchId }: BatchDetailsProps) {
  const batch = dummyBatches.find((b) => b.id === batchId);

  if (!batch) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center text-muted-foreground">Batch not found</div>
      </div>
    );
  }

  // Get user details for learners
  const learnerDetails = (batch.learners || [])
    .map((learnerId) => dummyUsers.find((user) => user.id === learnerId))
    .filter(Boolean);

  // Get test details
  const testDetails = (batch.tests || [])
    .map((testId) => dummyTests.find((test) => test.id === testId))
    .filter(Boolean);

  // Status badge styling
  const statusColors = {
    Upcoming: "bg-blue-100 text-blue-800",
    Ongoing: "bg-green-100 text-green-800",
    Completed: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/admin/batches">
            <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Batch Details</h1>
        </div>
        <p className="text-muted-foreground">
          View detailed information about the batch
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{batch.batchName}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-2">
                <span className="font-mono">{batch.batchCode}</span>
                <Separator orientation="vertical" className="h-4" />
                <span
                  className={`rounded-sm px-2 py-1 text-xs font-semibold ${
                    statusColors[batch.status]
                  }`}
                >
                  {batch.status}
                </span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Location:</span>
                <span>{batch.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Start Date:</span>
                <span>{batch.startDate.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">End Date:</span>
                <span>{batch.endDate.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Max Learners:</span>
                <span>{batch.maxLearners}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Instructors */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Instructors</h3>
            {batch.instructors.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {batch.instructors.map((instructor, index) => (
                  <span
                    key={index}
                    className="bg-secondary text-secondary-foreground rounded-sm px-2 py-1 text-sm"
                  >
                    {instructor}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                No instructors assigned
              </p>
            )}
          </div>

          <Separator />

          {/* Learners */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Learners</h3>
            {learnerDetails.length > 0 ? (
              <Card>
                <CardContent className="p-0">
                  <ul className="divide-y">
                    {learnerDetails.map((learner, index) => (
                      <li key={learner!.id} className="p-4 hover:bg-muted">
                        <div className="font-medium">{learner!.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {learner!.email}
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ) : (
              <p className="text-muted-foreground text-sm">
                No learners assigned
              </p>
            )}
          </div>

          <Separator />

          {/* Tests */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tests</h3>
            {testDetails.length > 0 ? (
              <Card>
                <CardContent className="p-0">
                  <ul className="divide-y">
                    {testDetails.map((test, index) => (
                      <li key={test!.id} className="p-4 hover:bg-muted">
                        <div className="font-medium">{test!.title}</div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-sm text-muted-foreground">
                            {test!.subject}
                          </span>
                          <span className="text-xs bg-muted rounded px-2 py-1">
                            {test!.duration} min
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ) : (
              <p className="text-muted-foreground text-sm">No tests assigned</p>
            )}
          </div>

          <Separator />

          {/* Notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Summary Notes</h3>
            {batch.summaryNotes ? (
              <p className="text-muted-foreground">{batch.summaryNotes}</p>
            ) : (
              <p className="text-muted-foreground text-sm">
                No summary notes available
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
