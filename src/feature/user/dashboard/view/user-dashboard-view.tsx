"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useSafeSession } from "@/hooks/use-session";
import { useGetBatchUsersByUserIdQuery } from "@/service/rtk-query/batch-users/batch-user-api";
import { useGetBatchInstructorsByBatchIdQuery } from "@/service/rtk-query/batch-instructors/batch-instructor-api";
import { Calendar, MapPin, Users, BookOpen, CheckCircle2, Clock, AlertCircle, User } from "lucide-react";
import { format } from "date-fns";

export function UserDashboardView() {
  const { data: session } = useSafeSession();
  const userId = session?.user?.id || "";
  const userName = session?.user?.name || "User";
  
  // Get batch assignments for the user
  const { data: batchUsers = [], isLoading } = useGetBatchUsersByUserIdQuery(userId, {
    skip: !userId,
  });

  // Get the active/latest batch
  const activeBatch = batchUsers.find((bu) => bu.isActive);
  const batchId = activeBatch?.batch?.id || "";

  // Get instructors for the active batch
  const { data: batchInstructors = [] } = useGetBatchInstructorsByBatchIdQuery(batchId, {
    skip: !batchId,
  });

  // Determine application status based on batch user data
  const getApplicationStatus = () => {
    if (!activeBatch) return "applied";
    const status = activeBatch.batch?.status?.toLowerCase() || "pending";
    
    if (status === "active" || status === "on_going") return "active";
    if (status === "completed") return "completed";
    if (activeBatch.isActive) return "approved";
    return "applied";
  };

  const applicationStatus = getApplicationStatus();

  // Status tracker steps
  const statusSteps = [
    { key: "applied", label: "Applied", icon: AlertCircle },
    { key: "approved", label: "Approved", icon: CheckCircle2 },
    { key: "active", label: "Active", icon: Clock },
    { key: "completed", label: "Completed", icon: CheckCircle2 },
  ];

  const getCurrentStepIndex = () => {
    return statusSteps.findIndex((step) => step.key === applicationStatus);
  };

  const currentStepIndex = getCurrentStepIndex();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome back, {userName}!</CardTitle>
          <CardDescription className="text-base">
            {activeBatch
              ? `You are enrolled in ${activeBatch.batch?.name}`
              : "You have no active batch assignments yet"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{session?.user?.email}</span>
          </div>
        </CardContent>
      </Card>

      {/* Status Tracker */}
      <Card>
        <CardHeader>
          <CardTitle>Application Status</CardTitle>
          <CardDescription>Track your progress through the program</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute left-0 top-6 h-0.5 w-full bg-gray-200">
              <div
                className="h-full bg-blue-600 transition-all duration-500"
                style={{
                  width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%`,
                }}
              />
            </div>

            {/* Status Steps */}
            <div className="relative flex justify-between">
              {statusSteps.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const Icon = step.icon;

                return (
                  <div key={step.key} className="flex flex-col items-center">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all ${
                        isCompleted
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-gray-300 bg-white text-gray-400"
                      } ${
                        isCurrent ? "ring-4 ring-blue-200" : ""
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span
                      className={`mt-2 text-sm font-medium ${
                        isCompleted ? "text-gray-900" : "text-gray-500"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Batch Information */}
      {activeBatch && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Assigned Batch Information</CardTitle>
              <Badge
                variant={activeBatch.batch?.status === "active" ? "default" : "secondary"}
              >
                {activeBatch.batch?.status || "Pending"}
              </Badge>
            </div>
            <CardDescription>Details about your current batch</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Batch Name and Code */}
            <div>
              <h3 className="text-lg font-semibold mb-1">{activeBatch.batch?.name}</h3>
              {activeBatch.batch?.batchCode && (
                <p className="text-sm text-muted-foreground">
                  Code: {activeBatch.batch.batchCode}
                </p>
              )}
            </div>

            <Separator />

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Start Date</p>
                  <p className="text-base font-semibold">
                    {format(new Date(activeBatch.batch.startDate), "MMM dd, yyyy")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">End Date</p>
                  <p className="text-base font-semibold">
                    {format(new Date(activeBatch.batch.endDate), "MMM dd, yyyy")}
                  </p>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Location</p>
                <p className="text-base font-semibold">
                  {activeBatch.batch.location || "TBD"}
                </p>
                <Badge variant="outline" className="mt-1">
                  {activeBatch.batch.sessionType === "remote" ? "Remote" : "On-site"}
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Summary */}
            {activeBatch.batch.description && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
                  <BookOpen className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Summary</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {activeBatch.batch.description}
                  </p>
                </div>
              </div>
            )}

            {/* Instructor Info */}
            {batchInstructors.length > 0 && (
              <>
                <Separator />
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                    <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-3">
                      Instructor{batchInstructors.length > 1 ? "s" : ""}
                    </p>
                    <div className="space-y-3">
                      {batchInstructors.map((batchInstructor) => (
                        <Card key={batchInstructor.id} className="border-indigo-200">
                          <CardContent className="pt-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h4 className="font-semibold">
                                  {batchInstructor.instructor.firstName}{" "}
                                  {batchInstructor.instructor.lastName}
                                </h4>
                                <Badge variant="outline">
                                  {batchInstructor.instructor.specialization}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground space-y-1">
                                <p>📧 {batchInstructor.instructor.email}</p>
                                <p>📱 {batchInstructor.instructor.phone}</p>
                                <p className="text-xs italic">
                                  Expertise: {batchInstructor.instructor.expertise}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Enrollment Date */}
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Enrolled on: {format(new Date(activeBatch.enrolledDate), "MMM dd, yyyy 'at' hh:mm a")}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Batch Message */}
      {!activeBatch && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Active Batch</h3>
            <p className="text-muted-foreground text-center max-w-md">
              You are not currently assigned to any batch. Please contact the administrator for more information.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
