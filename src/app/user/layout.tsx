"use client";

import { DashboardLayout } from "@/layouts/dashboard/layout";

type Props = {
  children: React.ReactNode;
};

export default function UserLayout({ children }: Props) {
  return <DashboardLayout userType="user">{children}</DashboardLayout>;
}
