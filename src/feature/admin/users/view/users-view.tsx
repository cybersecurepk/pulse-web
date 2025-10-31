"use client";

import Button from "@/components/core/button";
import { CustomBreadcrumbs } from "@/components/core/custom-breadcrumbs";
import Table from "@/components/core/table/table";
import { useTableState } from "@/hooks/use-table-state";
import { useRouter } from "next/navigation";
import { createColumnHelper } from "@tanstack/react-table";
import React, { useState } from "react";
import { ConfirmationDialog } from "@/components/core/confirmation-dialog";
import { Edit, Eye, Trash2 } from "lucide-react";
import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
} from "@/service/rtk-query/users/users-apis";
import { User } from "@/service/rtk-query/users/users-type";

export function UsersView() {
  const router = useRouter();
  const tableStateHook = useTableState();
  const columnHelper = createColumnHelper<User>();

  const { data: usersData = [], isLoading } = useGetAllUsersQuery();
  const approvedUsers = usersData.filter(
    (user) => user.applicationStatus === "approved"
  );
  const [deleteUser] = useDeleteUserMutation();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleView = (userId: string) => {
    router.push(`/admin/users/view/${userId}`);
  };

  // const handleDeleteClick = (user: User) => {
  //   setSelectedUser(user);
  //   setDeleteDialogOpen(true);
  // };

  // const handleConfirmDelete = async () => {
  //   if (!selectedUser) return;
  //   try {
  //     setIsDeleting(true);
  //     await deleteUser(selectedUser.id).unwrap();
  //     console.log(`User deleted successfully`);
  //   } catch (error) {
  //     console.error("Error deleting user:", error);
  //   } finally {
  //     setIsDeleting(false);
  //     setDeleteDialogOpen(false);
  //     setSelectedUser(null);
  //   }
  // };

  const columns = [
    columnHelper.accessor((row) => row.name, {
      id: "name",
      header: "Name",
      cell: ({ getValue }) => getValue(),
    }),
    columnHelper.accessor((row) => row.email, {
      id: "email",
      header: "Email",
      cell: ({ getValue }) => getValue(),
    }),
    columnHelper.accessor((row) => row.primaryPhone ?? "-", {
      id: "phone",
      header: "Phone Number",
      cell: ({ getValue }) => getValue(),
    }),
    columnHelper.accessor((row) => row.permanentCity, {
      id: "permanentCity",
      header: "Permanent City",
      cell: ({ getValue }) => getValue(),
    }),
    columnHelper.accessor((row) => row.experiences, {
      id: "experience",
      header: "Experience",
      cell: ({ getValue }) =>
        getValue()
          ?.map((experience) => experience.organization)
          .join(", "),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original as User;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              title="View"
              onClick={() => handleView(user.id)}
              className="h-8 w-8"
            >
              <Eye className="h-4 w-4" />
            </Button>
          
            {/* <Button
              variant="ghost"
              size="icon"
              title="Delete"
              onClick={() => handleDeleteClick(user)}
              className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button> */}
          </div>
        );
      },
    }),
  ];

  return (
    <div>
      <CustomBreadcrumbs
        heading="Users Management"
        links={[
          { name: "Dashboard", href: "/admin/dashboard" },
          { name: "Users Management" },
        ]}
      />
      <div className="py-3">
        <Table
          columns={columns}
          data={approvedUsers}
          totalCount={approvedUsers.length}
          loading={isLoading}
          tableState={tableStateHook}
          heading="Users"
        />
      </div>
      {/* <ConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        message={
          selectedUser
            ? `Are you sure you want to delete the user "${selectedUser.name}"?`
            : undefined
        }
      /> */}
    </div>
  );
}
