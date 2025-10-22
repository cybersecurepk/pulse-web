"use client";

import { DashboardLayout } from "@/layouts/dashboard/layout";

type Props = {
  children: React.ReactNode;
};

export default function AdminLayout({ children }: Props) {
  return <DashboardLayout userType="admin">{children}</DashboardLayout>;
}
