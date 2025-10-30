"use client";

import Button from "@/components/core/button";
import { CustomBreadcrumbs } from "@/components/core/custom-breadcrumbs";
import Table from "@/components/core/table/table";
import { useTableState } from "@/hooks/use-table-state";
import { createColumnHelper } from "@tanstack/react-table";
import { CheckCircle, XCircle } from "lucide-react";
import React from "react";
import { useGetAllUsersQuery } from "@/service/rtk-query/users/users-apis";

export function ApplicationView() {
  const tableStateHook = useTableState();
  const columnHelper = createColumnHelper<any>();

  // Fetch real users from backend
  const { data: users = [], isLoading } = useGetAllUsersQuery();

  const handleApprove = (userId: string) => {
    // TODO: Call updateUser mutation to set applicationStatus to "approved"
    console.log("Approved user:", userId);
  };
  const handleReject = (userId: string) => {
    // TODO: Call updateUser mutation to set applicationStatus to "rejected"
    console.log("Rejected user:", userId);
  };

  const columns = [
    columnHelper.accessor((row) => row.name, {
      id: "name",
      header: "Name",
      cell: ({ getValue }) => <span className="font-medium">{getValue()}</span>,
    }),
    columnHelper.accessor((row) => row.email, {
      id: "email",
      header: "Email",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground font-mono text-sm">
          {getValue()}
        </span>
      ),
    }),
    columnHelper.accessor((row) => row.primaryPhone, {
      id: "primaryPhone",
      header: "Phone Number",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">{getValue()}</span>
      ),
    }),
    columnHelper.accessor((row) => row.permanentCity, {
      id: "permanentCity",
      header: "Permanent City",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">{getValue()}</span>
      ),
    }),
    columnHelper.accessor((row) => row.createdAt, {
      id: "createdAt",
      header: "Application Date",
      cell: ({ getValue }) => {
        const d = getValue();
        return (
          <span className="text-muted-foreground">
            {d ? new Date(d).toLocaleDateString() : "-"}
          </span>
        );
      },
    }),
    columnHelper.accessor((row) => row.applicationStatus, {
      id: "applicationStatus",
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue();
        const statusColors: Record<string, string> = {
          pending: "bg-yellow-100 text-yellow-800",
          approved: "bg-green-100 text-green-800",
          rejected: "bg-red-100 text-red-800",
        };
        return (
          <span
            className={`rounded-sm px-2 py-1 text-sm font-semibold ${
              statusColors[status] || "bg-gray-100 text-gray-800"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleApprove(user.id)}
              title="Approve application"
              className="h-8 w-8 text-green-600 hover:bg-green-50 hover:text-green-700"
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleReject(user.id)}
              title="Reject application"
              className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <XCircle className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    }),
  ];

  return (
    <div>
      <CustomBreadcrumbs
        heading="Applications Management"
        links={[
          { name: "Dashboard", href: "/admin/dashboard" },
          { name: "Applications Management" },
        ]}
      />
      <div className="py-3">
        <Table
          columns={columns}
          data={users}
          totalCount={users.length}
          loading={isLoading}
          tableState={tableStateHook}
          heading="Application Management"
        />
      </div>
    </div>
  );
}
