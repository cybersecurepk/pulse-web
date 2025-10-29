"use client";

import Button from "@/components/core/button";
import { CustomBreadcrumbs } from "@/components/core/custom-breadcrumbs";
import Table from "@/components/core/table/table";
import { useTableState } from "@/hooks/use-table-state";
import { createColumnHelper } from "@tanstack/react-table";
import { CheckCircle, XCircle } from "lucide-react";
import React from "react";
import { dummyApplicants } from "../data/dummy-applicants";
import { applicant } from "../types/applicant";

export function ApplicationView() {
  const tableStateHook = useTableState();
  const columnHelper = createColumnHelper<applicant>();

  const handleApprove = (applicantId: string) => {
    console.log("Approved applicant:", applicantId);
    // You could update status in state or call an API here
  };

  const handleReject = (applicantId: string) => {
    console.log("Rejected applicant:", applicantId);
    // Similarly update status or trigger API
  };

  const columns = [
    columnHelper.accessor("Name", {
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
    columnHelper.accessor("applicationDate", {
      header: "Application Date",
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
        const statusColors: Record<string, string> = {
          Pending: "bg-yellow-100 text-yellow-800",
          Reviewed: "bg-blue-100 text-blue-800",
          Accepted: "bg-green-100 text-green-800",
          Rejected: "bg-red-100 text-red-800",
        };
        return (
          <span
            className={`rounded-sm px-2 py-1 text-sm font-semibold ${
              statusColors[status] || "bg-gray-100 text-gray-800"
            }`}
          >
            {status}
          </span>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const applicant = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleApprove(applicant.id)}
              title="Approve application"
              className="h-8 w-8 text-green-600 hover:bg-green-50 hover:text-green-700"
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleReject(applicant.id)}
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
          data={dummyApplicants}
          totalCount={dummyApplicants.length}
          loading={false}
          tableState={tableStateHook}
          heading="Application Management"
        />
      </div>
    </div>
  );
}
