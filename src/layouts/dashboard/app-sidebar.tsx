import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { AdminSidebar } from "./admin-sidebar";
import { UserSidebar } from "./user-sidebar";
import { PulseLogo } from "./pulse-logo";

type UserType = "admin" | "user";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userType?: UserType;
}

export function AppSidebar({ userType = "admin", ...props }: AppSidebarProps) {
  return (
    <Sidebar
      {...props}
      className="border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
    >
      <SidebarHeader className="h-16 flex items-center px-4 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-900">
        <PulseLogo />
      </SidebarHeader>

      <SidebarContent className="gap-0 bg-white dark:bg-slate-900">
        {userType === "admin" ? <AdminSidebar /> : <UserSidebar />}
      </SidebarContent>
      <SidebarRail className="bg-slate-100 dark:bg-slate-800 w-px" />
    </Sidebar>
  );
}
