"use client";

import Button from "@/components/core/button";
import { CustomBreadcrumbs } from "@/components/core/custom-breadcrumbs";
import Table from "@/components/core/table/table";
import { useTableState } from "@/hooks/use-table-state";
import { createColumnHelper } from "@tanstack/react-table";
import { Edit, Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { ConfirmationDialog } from "@/components/core/confirmation-dialog";
import { InstructorResponse } from "@/service/rtk-query/instructors/instructor-type";
import { useRouter } from "next/navigation";
import { useGetAllInstructorsQuery, useDeleteInstructorMutation } from "@/service/rtk-query/instructors/instructor-api";

export function InstructorsView() {
  const tableStateHook = useTableState();
  const columnHelper = createColumnHelper<InstructorResponse>();
  const router = useRouter();

  const { data: instructorsData = [], isLoading } = useGetAllInstructorsQuery();
  const [deleteInstructor] = useDeleteInstructorMutation();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] =
    useState<InstructorResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (instructorId: string) => {
    router.push(`/admin/instructors/edit/${instructorId}`);
  };

  const handleDelete = (instructor: InstructorResponse) => {
    setSelectedInstructor(instructor);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedInstructor) return;

    try {
      setIsDeleting(true);
      await deleteInstructor(selectedInstructor.id).unwrap();
      console.log(`Instructor deleted successfully`);
    } catch (error) {
      console.error("Error deleting instructor:", error);
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setSelectedInstructor(null);
    }
  };

  const columns = [
    columnHelper.accessor("firstName", {
      header: "Name",
      cell: ({ row }) => (
        <span className="font-medium">
          {row.original.firstName} {row.original.lastName}
        </span>
      ),
    }),
    columnHelper.accessor("email", {
      header: "Email",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground font-mono text-sm">
          {getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("phone", {
      header: "Phone Number",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">{getValue()}</span>
      ),
    }),
    columnHelper.accessor("specialization", {
      header: "Specialization",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">{getValue()}</span>
      ),
    }),
    columnHelper.accessor("expertise", {
      header: "Expertise",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground line-clamp-2 max-w-[250px] text-sm">
          {getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("isActive", {
      header: "Status",
      cell: ({ getValue }) => {
        const isActive = getValue();
        return (
          <span
            className={`rounded-sm px-2 py-1 text-sm font-semibold ${
              isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
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
          data={instructorsData}
          totalCount={instructorsData.length}
          loading={isLoading}
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
      <ConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        message={
          selectedInstructor
            ? `Are you sure you want to delete the instructor "${selectedInstructor.firstName} ${selectedInstructor.lastName}"?`
            : undefined
        }
      />
    </div>
  );
}
