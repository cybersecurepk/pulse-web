"use client";

import Button from "@/components/core/button";
import { CustomBreadcrumbs } from "@/components/core/custom-breadcrumbs";
import Table from "@/components/core/table/table";
import { useTableState } from "@/hooks/use-table-state";
import { createColumnHelper } from "@tanstack/react-table";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { dummyBatches } from "../data/dummy-batches";
import { Batch } from "../types/batch";
import { ConfirmationDialog } from "@/components/core/confirmation-dialog";

export function BatchesView() {
  const router = useRouter();
  const tableStateHook = useTableState();
  const columnHelper = createColumnHelper<Batch>();

  // 🔹 State for delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (batchId: string) => {
    console.log("Edit batch:", batchId);
  };

  const handleDeleteClick = (batch: Batch) => {
    setSelectedBatch(batch);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedBatch) return;

    try {
      setIsDeleting(true);
      console.log("Deleting batch:", selectedBatch.id);

      // TODO: Replace this with API call (e.g., await deleteBatch(selectedBatch.id))
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log(`Batch "${selectedBatch.batchName}" deleted successfully`);
    } catch (error) {
      console.error("Error deleting batch:", error);
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setSelectedBatch(null);
    }
  };

  const handleView = (batchId: string) => {
    console.log("View batch:", batchId);
  };

  const columns = [
    columnHelper.accessor("batchName", {
      header: "Batch Name",
      cell: ({ getValue }) => <span className="font-medium">{getValue()}</span>,
    }),
    columnHelper.accessor("batchCode", {
      header: "Batch Code",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground font-mono text-sm">
          {getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("location", {
      header: "Location",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">{getValue()}</span>
      ),
    }),
    columnHelper.accessor("startDate", {
      header: "Start Date",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">
          {getValue().toLocaleDateString()}
        </span>
      ),
    }),
    columnHelper.accessor("endDate", {
      header: "End Date",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">
          {getValue().toLocaleDateString()}
        </span>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue();
        const statusColors = {
          Upcoming: "bg-blue-100 text-blue-800",
          Ongoing: "bg-green-100 text-green-800",
          Completed: "bg-gray-100 text-gray-800",
        };
        return (
          <span
            className={`rounded-sm px-2 py-1 text-sm font-semibold ${statusColors[status]}`}
          >
            {status}
          </span>
        );
      },
    }),
    columnHelper.accessor("instructors", {
      header: "Instructors",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">
          {getValue().length} instructor{getValue().length !== 1 ? "s" : ""}
        </span>
      ),
    }),
    columnHelper.accessor("maxLearners", {
      header: "Max Learners",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">{getValue()}</span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const batch = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleView(batch.id)}
              title="View batch"
              className="h-8 w-8 text-gray-600 hover:bg-gray-50 hover:text-gray-700"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(batch.id)}
              title="Edit batch"
              className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDeleteClick(batch)}
              title="Delete batch"
              className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    }),
  ];

  const actions = [
    {
      label: "Add New Batch",
      onClick: () => router.push("/admin/batches/create"),
      variant: "primary" as const,
      icon: <Plus className="h-4 w-4" />,
    },
  ];

  return (
    <div>
      <CustomBreadcrumbs
        heading="Batches Management"
        links={[
          { name: "Dashboard", href: "/admin/dashboard" },
          { name: "Batches Management" },
        ]}
      />
      <div className="py-3">
        <Table
          columns={columns}
          data={dummyBatches}
          totalCount={dummyBatches.length}
          loading={false}
          actions={actions}
          tableState={tableStateHook}
          heading="Batch Management"
        />
      </div>

      {/* 🔹 Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        message={
          selectedBatch
            ? `Are you sure you want to delete the batch "${selectedBatch.batchName}"?`
            : undefined
        }
      />
    </div>
  );
}
