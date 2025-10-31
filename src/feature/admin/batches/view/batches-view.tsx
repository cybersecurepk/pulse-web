"use client";

import Button from "@/components/core/button";
import { CustomBreadcrumbs } from "@/components/core/custom-breadcrumbs";
import Table from "@/components/core/table/table";
import { useTableState } from "@/hooks/use-table-state";
import { createColumnHelper } from "@tanstack/react-table";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ConfirmationDialog } from "@/components/core/confirmation-dialog";
import { useGetAllBatchesQuery, useDeleteBatchMutation } from "@/service/rtk-query/batches/batch-api";
import { BatchResponse } from "@/service/rtk-query/batches/batch-type";

export function BatchesView() {
  const router = useRouter();
  const tableStateHook = useTableState();
  const columnHelper = createColumnHelper<BatchResponse>();

  const { data: batchesData = [], isLoading } = useGetAllBatchesQuery();
  const [deleteBatch] = useDeleteBatchMutation();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<BatchResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (batchId: string) => {
    router.push(`/admin/batches/edit/${batchId}`);
  };

  const handleDeleteClick = (batch: BatchResponse) => {
    setSelectedBatch(batch);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedBatch) return;

    try {
      setIsDeleting(true);
      await deleteBatch(selectedBatch.id).unwrap();
      console.log(`Batch deleted successfully`);
    } catch (error) {
      console.error("Error deleting batch:", error);
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setSelectedBatch(null);
    }
  };

  const handleView = (batchId: string) => {
    router.push(`/admin/batches/view/${batchId}`);
  };

  const columns = [
    columnHelper.accessor("name", {
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
    columnHelper.accessor("sessionType", {
      header: "Session Type",
      cell: ({ getValue }) => {
        const sessionType = getValue();
        const sessionTypeColors: Record<string, string> = {
          remote: "bg-blue-100 text-blue-800",
          onsite: "bg-green-100 text-green-800",
        };
        const sessionTypeLabel = sessionType 
          ? sessionType.charAt(0).toUpperCase() + sessionType.slice(1)
          : "N/A";
        return (
          <span
            className={`rounded-sm px-2 py-1 text-sm font-semibold ${
              sessionTypeColors[sessionType || ""] || "bg-gray-100 text-gray-800"
            }`}
          >
            {sessionTypeLabel}
          </span>
        );
      },
    }),
    columnHelper.accessor("startDate", {
      header: "Start Date",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">
          {new Date(getValue()).toLocaleDateString()}
        </span>
      ),
    }),
    columnHelper.accessor("endDate", {
      header: "End Date",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">
          {new Date(getValue()).toLocaleDateString()}
        </span>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue();
        const statusColors: Record<string, string> = {
          pending: "bg-blue-100 text-blue-800",
          ongoing: "bg-green-100 text-green-800",
          completed: "bg-gray-100 text-gray-800",
          cancelled: "bg-red-100 text-red-800",
        };
        const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);
        return (
          <span
            className={`rounded-sm px-2 py-1 text-sm font-semibold ${
              statusColors[status] || "bg-gray-100 text-gray-800"
            }`}
          >
            {statusLabel}
          </span>
        );
      },
    }),
    columnHelper.accessor("maxCapacity", {
      header: "Max Capacity",
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
              className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
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
          data={batchesData}
          totalCount={batchesData.length}
          loading={isLoading}
          actions={actions}
          tableState={tableStateHook}
          heading="Batch Management"
        />
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        message={
          selectedBatch
            ? `Are you sure you want to delete the batch "${selectedBatch.name}"?`
            : undefined
        }
      />
    </div>
  );
}
