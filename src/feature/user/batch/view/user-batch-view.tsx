"use client";

import { CustomBreadcrumbs } from "@/components/core/custom-breadcrumbs";
import Table from "@/components/core/table/table";
import { useTableState } from "@/hooks/use-table-state";
import { createColumnHelper } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
import { useGetBatchUsersByUserIdQuery } from "@/service/rtk-query/batch-users/batch-user-api";
import { BatchUserResponse } from "@/service/rtk-query/batch-users/batch-user-type";
import Button from "@/components/core/button";

interface UserBatchViewProps {
  userId?: string;
}

export function UserBatchView({ userId }: UserBatchViewProps) {
  const router = useRouter();
  const tableStateHook = useTableState();
  const columnHelper = createColumnHelper<BatchUserResponse>();
  
  // For demo purposes, we'll use a default user ID if none is provided
  const effectiveUserId = userId || "1"; // Default user ID for testing
  
  const { data: batchUsersData = [], isLoading } = useGetBatchUsersByUserIdQuery(effectiveUserId, {
    skip: !effectiveUserId,
  });

  const handleView = (batchId: string) => {
    router.push(`/user/batch/view/${batchId}`);
  };

  const columns = [
    columnHelper.accessor("batch.name", {
      header: "Batch Name",
      cell: ({ getValue }) => <span className="font-medium">{getValue()}</span>,
    }),
    columnHelper.accessor("batch.batchCode", {
      header: "Batch Code",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground font-mono text-sm">
          {getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("batch.location", {
      header: "Location",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">{getValue()}</span>
      ),
    }),
    columnHelper.accessor("batch.sessionType", {
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
    columnHelper.accessor("batch.startDate", {
      header: "Start Date",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">
          {new Date(getValue()).toLocaleDateString()}
        </span>
      ),
    }),
    columnHelper.accessor("batch.endDate", {
      header: "End Date",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">
          {new Date(getValue()).toLocaleDateString()}
        </span>
      ),
    }),
    columnHelper.accessor("batch.status", {
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue();
        const statusColors: Record<string, string> = {
          pending: "bg-blue-100 text-blue-800",
          on_going: "bg-green-100 text-green-800",
          completed: "bg-gray-100 text-gray-800",
          cancelled: "bg-red-100 text-red-800",
        };
        const statusLabel = status === 'on_going' ? 'On Going' : 
                           status.charAt(0).toUpperCase() + status.slice(1);
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
    columnHelper.accessor("isActive", {
      header: "Assignment Status",
      cell: ({ getValue }) => (
        <span className={`font-semibold ${getValue() ? "text-green-600" : "text-red-600"}`}>
          {getValue() ? "Active" : "Inactive"}
        </span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const batchUser = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleView(batchUser.batch.id)}
              title="View batch"
              className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    }),
  ];

  return (
    <div>
      <CustomBreadcrumbs
        heading="My Batches"
        links={[
          { name: "Dashboard", href: "/user/dashboard" },
          { name: "My Batches" },
        ]}
      />
      <div className="py-3">
        <Table
          columns={columns}
          data={batchUsersData}
          totalCount={batchUsersData.length}
          loading={isLoading}
          tableState={tableStateHook}
          heading="My Batches"
        />
      </div>
    </div>
  );
}