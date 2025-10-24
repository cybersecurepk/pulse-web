"use client";

import Button from "@/components/core/button";
import { CustomBreadcrumbs } from "@/components/core/custom-breadcrumbs";
import Table from "@/components/core/table/table";
import { useTableState } from "@/hooks/use-table-state";
import { createColumnHelper } from "@tanstack/react-table";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
import { dummyTests } from "../data/dummy-tests";
import { Test } from "../types/test";

export function TestsView() {
  const router = useRouter();
  const tableStateHook = useTableState();
  const columnHelper = createColumnHelper<Test>();

  const handleEdit = (testId: string) => {
    console.log("Edit test:", testId);
  };

  const handleDelete = (testId: string) => {
    console.log("Delete test:", testId);
  };

  const handleView = (testId: string) => {
    console.log("View test:", testId);
  };

  const columns = [
    columnHelper.accessor("testName", {
      header: "Test Name",
      cell: ({ getValue }) => <span className="font-medium">{getValue()}</span>,
    }),
    columnHelper.accessor("testCode", {
      header: "Test Code",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground font-mono text-sm">
          {getValue()}
        </span>
      ),
    }),
    // columnHelper.accessor("testType", {
    //   header: "Type",
    //   cell: ({ getValue }) => (
    //     <span className="text-muted-foreground">{getValue()}</span>
    //   ),
    // }),
    columnHelper.accessor("totalQuestions", {
      header: "Questions",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">{getValue()}</span>
      ),
    }),
    columnHelper.accessor("duration", {
      header: "Duration",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">{getValue()} min</span>
      ),
    }),
    columnHelper.accessor("passCriteria", {
      header: "Pass Criteria",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">{getValue()}%</span>
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
        const test = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleView(test.id)}
              title="View test"
              className="h-8 w-8 text-gray-600 hover:bg-gray-50 hover:text-gray-700"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(test.id)}
              title="Edit test"
              className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(test.id)}
              title="Delete test"
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
      label: "Add New Test",
      onClick: () => router.push("/admin/tests/create"),
      variant: "primary" as const,
      icon: <Plus className="h-4 w-4" />,
    },
  ];

  return (
    <div>
      <CustomBreadcrumbs
        heading="Tests Management"
        links={[
          { name: "Dashboard", href: "/admin/dashboard" },
          { name: "Tests Management" },
        ]}
      />

      <div className="py-3">
        <Table
          columns={columns}
          data={dummyTests}
          totalCount={dummyTests.length}
          loading={false}
          actions={actions}
          tableState={tableStateHook}
          heading="Test Management"
        />
      </div>
    </div>
  );
}
