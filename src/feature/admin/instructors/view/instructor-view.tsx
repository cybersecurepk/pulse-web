"use client";

import Button from "@/components/core/button";
import { CustomBreadcrumbs } from "@/components/core/custom-breadcrumbs";
import Table from "@/components/core/table/table";
import { useTableState } from "@/hooks/use-table-state";
import { createColumnHelper } from "@tanstack/react-table";
import { Edit, Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { dummyInstructors } from "../data/dummy-instructors";
import { ConfirmationDialog } from "@/components/core/confirmation-dialog";
import { instructor } from "../types/instructor";
import { useRouter } from "next/navigation";

export function InstructorsView() {
  const tableStateHook = useTableState();
  const columnHelper = createColumnHelper<instructor>();
  const router = useRouter();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] =
    useState<instructor | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (instructorId: string) => {
    router.push(`/admin/instructors/edit/${instructorId}`);
  };

  const handleDelete = (instructor: instructor) => {
    setSelectedInstructor(instructor);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedInstructor) return;

    try {
      setIsDeleting(true);
      console.log("Deleting instructor:", selectedInstructor.id);

      // TODO: Replace this with API call (e.g., await deleteInstructor(selectedInstructor.id))
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log(
        `Instructor "${selectedInstructor.name}" deleted successfully`
      );
    } catch (error) {
      console.error("Error deleting instructor:", error);
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setSelectedInstructor(null);
    }
  };

  const columns = [
    columnHelper.accessor("profilePhoto", {
      header: "",
      cell: ({ getValue }) => (
        <img
          src={getValue()}
          alt="Instructor"
          className="h-10 w-10 rounded-full object-cover border"
        />
      ),
    }),
    columnHelper.accessor("name", {
      header: "Name",
      cell: ({ getValue }) => <span className="font-medium">{getValue()}</span>,
    }),
    columnHelper.accessor("email", {
      header: "Email",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground font-mono text-sm">
          {getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("phoneNumber", {
      header: "Phone Number",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">{getValue()}</span>
      ),
    }),
    columnHelper.accessor("location", {
      header: "Location",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">{getValue()}</span>
      ),
    }),
    columnHelper.accessor("bio", {
      header: "Bio / Summary",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground line-clamp-2 max-w-[250px] text-sm">
          {getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("assignedBatches", {
      header: "Assigned Batches",
      cell: ({ getValue }) => {
        const batches = getValue();
        return batches.length > 0 ? (
          <span className="text-sm font-medium">{batches.join(", ")}</span>
        ) : (
          <span className="text-muted-foreground italic">None</span>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const instructor = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(instructor.id)}
              title="Edit instructor"
              className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(instructor)}
              title="Delete instructor"
              className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    }),
  ];

  return (
    <div>
      <CustomBreadcrumbs
        heading="Instructor Management"
        links={[
          { name: "Dashboard", href: "/admin/dashboard" },
          { name: "Instructor Management" },
        ]}
      />
      <div className="py-3">
        <Table
          columns={columns}
          data={dummyInstructors}
          totalCount={dummyInstructors.length}
          loading={false}
          tableState={tableStateHook}
          heading="Instructor Management"
          actions={[
            {
              label: "Add New Instructor",
              onClick: () => router.push("/admin/instructors/create"),
              variant: "primary",
              icon: <Plus className="h-4 w-4" />,
            },
          ]}
        />
      </div>
      {/* 🔹 Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        message={
          selectedInstructor
            ? `Are you sure you want to delete the instructor "${selectedInstructor.name}"?`
            : undefined
        }
      />
    </div>
  );
}
