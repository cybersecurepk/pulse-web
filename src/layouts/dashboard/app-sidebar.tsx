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
import { useSafeSession } from "@/hooks/use-session";

type UserType = "admin" | "user";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userType?: UserType;
}

export function AppSidebar({ userType, ...props }: AppSidebarProps) {
  const { data: session } = useSafeSession();
  
  // Determine if user is an admin based on their role
  const isAdmin = session?.user?.role === "super_admin" || 
                 session?.user?.role === "company_admin" ||
                 session?.user?.role === "admin";
  
  // Use the determined user type or fallback to the provided userType prop
  const effectiveUserType = userType || (isAdmin ? "admin" : "user");

  return (
    <Sidebar
      {...props}
      className="border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
    >
      <SidebarHeader className="h-16 flex items-center px-4 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-900">
        <PulseLogo />
      </SidebarHeader>

      <SidebarContent className="gap-0 bg-white dark:bg-slate-900">
        {effectiveUserType === "admin" ? <AdminSidebar /> : <UserSidebar />}
      </SidebarContent>
      <SidebarRail className="bg-slate-100 dark:bg-slate-800 w-px" />
    </Sidebar>
  );
}