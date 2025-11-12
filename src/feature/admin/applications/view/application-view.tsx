"use client";

import Button from "@/components/core/button";
import { CustomBreadcrumbs } from "@/components/core/custom-breadcrumbs";
import Table from "@/components/core/table/table";
import { ConfirmationDialog } from "@/components/core/confirmation-dialog";
import { useTableState } from "@/hooks/use-table-state";
import { createColumnHelper } from "@tanstack/react-table";
import { CheckCircle, XCircle, Eye } from "lucide-react";
import React, { useState } from "react";
import { useGetAllUsersQuery, useUpdateUserMutation, useGetUserByIdQuery } from "@/service/rtk-query/users/users-apis";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function ApplicationView() {
  const tableStateHook = useTableState();
  const columnHelper = createColumnHelper<any>();
  const router = useRouter();
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    action: null as 'approve' | 'reject' | null,
    userId: '',
    userName: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Fetch real users from backend
  const { data: allUsers = [], isLoading } = useGetAllUsersQuery();
  const [updateUser] = useUpdateUserMutation();

  // Filter to only show applicants and users (not admins, super_admins, company_admins, or employees)
  const users = allUsers.filter(
    (user) => user.role === 'applicant' || user.role === 'user'
  );

  const handleApprove = async (userId: string, userName: string) => {
    setConfirmDialog({
      open: true,
      action: 'approve',
      userId,
      userName,
    });
  };
  
  const handleReject = async (userId: string, userName: string) => {
    setConfirmDialog({
      open: true,
      action: 'reject',
      userId,
      userName,
    });
  };

  const handleView = async (userId: string) => {
    // Navigate to the application view page
    router.push(`/admin/applications/view/${userId}`);
  };

  const handleConfirmAction = async () => {
    if (!confirmDialog.action || !confirmDialog.userId) return;
    
    // Check if the user data is still available and if the application has already been processed
    const user = users.find(u => u.id === confirmDialog.userId);
    if (user && (user.applicationStatus === 'approved' || user.applicationStatus === 'rejected')) {
      toast.error("This application has already been processed and cannot be modified.");
      setConfirmDialog({
        open: false,
        action: null,
        userId: '',
        userName: '',
      });
      return;
    }
    
    setIsUpdating(true);
    try {
      const status = confirmDialog.action === 'approve' ? 'approved' : 'rejected';
      await updateUser({ 
        id: confirmDialog.userId, 
        payload: { applicationStatus: status }
      }).unwrap();
      
      toast.success(
        `Application ${confirmDialog.action === 'approve' ? 'approved' : 'rejected'} successfully for ${confirmDialog.userName}`
      );
    } catch (error: any) {
      console.error(`Error ${confirmDialog.action}ing user:`, error);
      toast.error(`Failed to ${confirmDialog.action} application: ${error?.data?.message || error?.message || 'Unknown error'}`);
    } finally {
      setIsUpdating(false);
      setConfirmDialog({
        open: false,
        action: null,
        userId: '',
        userName: '',
      });
    }
  };

  const columns = [
    columnHelper.accessor((row) => row.name, {
      id: "name",
      header: "Name",
      cell: ({ getValue, row }) => {
        const isProcessed = row.original.applicationStatus === 'approved' || row.original.applicationStatus === 'rejected';
        return (
          <div className="flex items-center gap-2">
            <span className="font-medium">{getValue()}</span>
            {isProcessed && (
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                Processed
              </span>
            )}
          </div>
        );
      },
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
        // Check if the application has already been processed
        const isProcessed = user.applicationStatus === 'approved' || user.applicationStatus === 'rejected';
        
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              title="View profile"
              onClick={() => handleView(user.id)}
              className="h-8 w-8"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleApprove(user.id, user.name)}
              title={isProcessed ? "Application already processed" : "Approve application"}
              className="h-8 w-8 text-green-600 hover:bg-green-50 hover:text-green-700"
              disabled={isProcessed}
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleReject(user.id, user.name)}
              title={isProcessed ? "Application already processed" : "Reject application"}
              className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
              disabled={isProcessed}
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
      
      <ConfirmationDialog
        open={confirmDialog.open}
        message={`Are you sure you want to ${confirmDialog.action} the application for ${confirmDialog.userName}?`}
        loading={isUpdating}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
}