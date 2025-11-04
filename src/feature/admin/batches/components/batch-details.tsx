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
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, MapPin, Users, Loader2, Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useGetBatchByIdQuery } from "@/service/rtk-query/batches/batch-api";
import {
  useGetBatchTestsByBatchIdQuery,
  useDeleteBatchTestMutation,
} from "@/service/rtk-query/batch-tests/batch-test-api";
import {
  useGetBatchUsersByBatchIdQuery,
  useDeleteBatchUserMutation,
} from "@/service/rtk-query/batch-users/batch-user-api";
import {
  useGetBatchInstructorsByBatchIdQuery,
  useDeleteBatchInstructorMutation,
} from "@/service/rtk-query/batch-instructors/batch-instructor-api";
import { AssignTestDialog } from "./assign-test-dialog";
import { AssignUserDialog } from "./assign-user-dialog";
import { AssignInstructorDialog } from "./assign-instructor-dialog";
import { ConfirmationDialog } from "@/components/core/confirmation-dialog";

interface BatchDetailsProps {
  batchId: string;
}

export function BatchDetails({ batchId }: BatchDetailsProps) {
  const { data: batch, isLoading } = useGetBatchByIdQuery(batchId);

  const { data: batchTests = [], isLoading: isLoadingTests } =
    useGetBatchTestsByBatchIdQuery(batchId);
  const { data: batchUsers = [], isLoading: isLoadingUsers } =
    useGetBatchUsersByBatchIdQuery(batchId);
  const { data: batchInstructors = [], isLoading: isLoadingInstructors } =
    useGetBatchInstructorsByBatchIdQuery(batchId);

  const [deleteBatchTest] = useDeleteBatchTestMutation();
  const [deleteBatchUser] = useDeleteBatchUserMutation();
  const [deleteBatchInstructor] = useDeleteBatchInstructorMutation();

  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [instructorDialogOpen, setInstructorDialogOpen] = useState(false);
  const [editingTestId, setEditingTestId] = useState<string | undefined>();
  const [editingUserId, setEditingUserId] = useState<string | undefined>();
  const [editingInstructorId, setEditingInstructorId] = useState<string | undefined>();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<"test" | "user" | "instructor">("test");
  const [deleteId, setDeleteId] = useState<string>("");
  const [deleteName, setDeleteName] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAddTest = () => {
    setEditingTestId(undefined);
    setTestDialogOpen(true);
  };

  const handleEditTest = (id: string) => {
    setEditingTestId(id);
    setTestDialogOpen(true);
  };

  const handleAddUser = () => {
    setEditingUserId(undefined);
    setUserDialogOpen(true);
  };

  const handleEditUser = (id: string) => {
    setEditingUserId(id);
    setUserDialogOpen(true);
  };

  const handleAddInstructor = () => {
    setEditingInstructorId(undefined);
    setInstructorDialogOpen(true);
  };

  const handleEditInstructor = (id: string) => {
    setEditingInstructorId(id);
    setInstructorDialogOpen(true);
  };

  const handleDeleteTest = (id: string, testTitle: string) => {
    setDeleteType("test");
    setDeleteId(id);
    setDeleteName(testTitle);
    setDeleteDialogOpen(true);
  };

  const handleDeleteUser = (id: string, userName: string) => {
    setDeleteType("user");
    setDeleteId(id);
    setDeleteName(userName);
    setDeleteDialogOpen(true);
  };

  const handleDeleteInstructor = (id: string, instructorName: string) => {
    setDeleteType("instructor");
    setDeleteId(id);
    setDeleteName(instructorName);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      if (deleteType === "test") {
        await deleteBatchTest(deleteId).unwrap();
      } else if (deleteType === "user") {
        await deleteBatchUser(deleteId).unwrap();
      } else if (deleteType === "instructor") {
        await deleteBatchInstructor(deleteId).unwrap();
      }
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting assignment:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <p>Loading batch details...</p>
        </div>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center text-muted-foreground">Batch not found</div>
      </div>
    );
  }

  // Status badge styling
  const statusColors: Record<string, string> = {
    pending: "bg-blue-100 text-blue-800",
    on_going: "bg-green-100 text-green-800",
    completed: "bg-gray-100 text-gray-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const statusLabel = batch.status === 'on_going' ? 'On Going' : 
                     batch.status.charAt(0).toUpperCase() + batch.status.slice(1);

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
              <CardTitle className="text-2xl">{batch.name}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-2">
                <span className="font-mono">{batch.batchCode}</span>
                <Separator orientation="vertical" className="h-4" />
                <Badge
                  variant="secondary"
                  className={statusColors[batch.status] || "bg-gray-100 text-gray-800"}
                >
                  {statusLabel}
                </Badge>
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
                <span>{new Date(batch.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">End Date:</span>
                <span>{new Date(batch.endDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Max Capacity:</span>
                <span>{batch.maxCapacity}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Active:</span>
                <Badge variant={batch.isActive ? "default" : "secondary"}>
                  {batch.isActive ? "Yes" : "No"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Description */}
          {batch.description && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Description</h3>
                <p className="text-muted-foreground">{batch.description}</p>
              </div>
            </>
          )}

          {/* Instructors */}
          <Separator />
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Instructors</h3>
              <Button
                size="sm"
                onClick={handleAddInstructor}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Instructor
              </Button>
            </div>
            {isLoadingInstructors ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : batchInstructors.length > 0 ? (
              <Card>
                <CardContent className="p-0">
                  <ul className="divide-y">
                    {batchInstructors.map((assignment) => (
                      <li key={assignment.id} className="p-4 hover:bg-muted group">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-medium">
                              {assignment.instructor.firstName}{" "}
                              {assignment.instructor.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {assignment.instructor.email}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Specialization: {assignment.instructor.specialization}
                            </div>
                            <Badge
                              variant={assignment.isActive ? "default" : "secondary"}
                              className="mt-2"
                            >
                              {assignment.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleEditInstructor(
                                  assignment.id,
                                )
                              }
                              className="h-8 w-8"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleDeleteInstructor(
                                  assignment.id,
                                  `${assignment.instructor.firstName} ${assignment.instructor.lastName}`,
                                )
                              }
                              className="h-8 w-8 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ) : (
              <p className="text-muted-foreground text-sm">
                No instructors assigned
              </p>
            )}
          </div>

          {/* Learners (Users) */}
          <Separator />
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Learners</h3>
              <Button
                size="sm"
                onClick={handleAddUser}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add User
              </Button>
            </div>
            {isLoadingUsers ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : batchUsers.length > 0 ? (
              <Card>
                <CardContent className="p-0">
                  <ul className="divide-y">
                    {batchUsers.map((assignment) => (
                      <li key={assignment.id} className="p-4 hover:bg-muted group">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-medium">
                              {assignment.user.firstName} {assignment.user.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {assignment.user.email}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Phone: {assignment.user.phone}
                            </div>
                            <Badge
                              variant={assignment.isActive ? "default" : "secondary"}
                              className="mt-2"
                            >
                              {assignment.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleEditUser(
                                  assignment.id,
                                )
                              }
                              className="h-8 w-8"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleDeleteUser(
                                  assignment.id,
                                  `${assignment.user.firstName} ${assignment.user.lastName}`,
                                )
                              }
                              className="h-8 w-8 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ) : (
              <p className="text-muted-foreground text-sm">No learners assigned</p>
            )}
          </div>

          {/* Tests */}
          <Separator />
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Tests</h3>
              <Button
                size="sm"
                onClick={handleAddTest}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Assign Test
              </Button>
            </div>
            {isLoadingTests ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : batchTests.length > 0 ? (
              <Card>
                <CardContent className="p-0">
                  <ul className="divide-y">
                    {batchTests.map((assignment) => (
                      <li key={assignment.id} className="p-4 hover:bg-muted group">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-medium">{assignment.test.title}</div>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-sm text-muted-foreground">
                                {assignment.test.testCode || "N/A"}
                              </span>
                              <span className="text-xs bg-muted rounded px-2 py-1">
                                {assignment.test.duration} min
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Passing: {assignment.test.passingCriteria}%
                            </div>
                            <Badge
                              variant={assignment.isActive ? "default" : "secondary"}
                              className="mt-2"
                            >
                              {assignment.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleEditTest(
                                  assignment.id,
                                )
                              }
                              className="h-8 w-8"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleDeleteTest(
                                  assignment.id,
                                  assignment.test.title,
                                )
                              }
                              className="h-8 w-8 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
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
        </CardContent>
      </Card>

      {/* Dialogs */}
      <AssignTestDialog
        open={testDialogOpen}
        onClose={() => {
          setTestDialogOpen(false);
          setEditingTestId(undefined);
        }}
        batchId={batchId}
        assignmentId={editingTestId}
      />

      <AssignUserDialog
        open={userDialogOpen}
        onClose={() => {
          setUserDialogOpen(false);
          setEditingUserId(undefined);
        }}
        batchId={batchId}
        assignmentId={editingUserId}
      />

      <AssignInstructorDialog
        open={instructorDialogOpen}
        onClose={() => {
          setInstructorDialogOpen(false);
          setEditingInstructorId(undefined);
        }}
        batchId={batchId}
        assignmentId={editingInstructorId}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        message={
          deleteName
            ? `Are you sure you want to remove ${deleteName} from this batch?`
            : undefined
        }
      />
    </div>
  );
}
