"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  LayoutDashboard,
  BookOpen,
  Users,
  User,
  Bell,
  Shield,
  Settings,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  disabled?: boolean;
  items?: NavItem[];
};

const userNavItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/user/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Tests",
    url: "/user/tests",
    icon: BookOpen,
    items: [
      {
        title: "Active Tests",
        url: "/user/tests",
      },
      {
        title: "Completed Tests",
        url: "/user/tests/completed",
      },
    ],
  },
  {
    title: "My Batch",
    url: "/user/batch",
    icon: Users,
  },
  {
    title: "Notifications",
    url: "/user/notifications",
    icon: Bell,
  },
  {
    title: "Privacy & Terms",
    url: "/privacy-policy",
    icon: Shield,
  },
  {
    title: "Account",
    url: "/user/account",
    icon: Settings,
    items: [
      {
        title: "My Profile",
        url: "/user/profile",
      },
      {
        title: "Settings",
        url: "/user/account/settings",
      },
    ],
  },
];

export function UserSidebar() {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="px-3 py-4">
        <SidebarMenu className="space-y-1">
          {userNavItems.map((item) => {
            const isActive = pathname === item.url;
            const hasChildren = item.items && item.items.length > 0;
            const isAnyChildActive = item.items?.some(
              (child) => pathname === child.url
            );
            const shouldHighlight = isActive || isAnyChildActive;

            if (hasChildren) {
              return (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={shouldHighlight}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        className={cn(
                          "w-full justify-start gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800",
                          shouldHighlight
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25"
                            : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
                        )}
                      >
                        {item.icon && (
                          <item.icon
                            className={cn(
                              "h-5 w-5 transition-colors",
                              shouldHighlight
                                ? "text-white"
                                : "text-slate-500 dark:text-slate-400"
                            )}
                          />
                        )}
                        <span className="flex-1 text-left">{item.title}</span>
                        <ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-1">
                      <SidebarMenuSub className="space-y-1">
                        {item.items?.map((subItem) => {
                          const isSubActive = pathname === subItem.url;

                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                aria-disabled={subItem?.disabled}
                                className={cn(
                                  "w-full justify-start gap-3 rounded-lg px-4 py-2.5 text-sm transition-all duration-200 ml-6",
                                  isSubActive
                                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-l-2 border-blue-500 font-medium"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
                                )}
                              >
                                <Link
                                  href={subItem.url}
                                  className="flex items-center gap-3 w-full"
                                >
                                  {subItem.icon && (
                                    <subItem.icon
                                      className={cn(
                                        "h-4 w-4 transition-colors",
                                        isSubActive
                                          ? "text-blue-600 dark:text-blue-400"
                                          : "text-slate-400 dark:text-slate-500"
                                      )}
                                    />
                                  )}
                                  <span className="flex-1">
                                    {subItem.title}
                                  </span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              );
            }
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={cn(
                    "w-full justify-start gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800",
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25"
                      : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
                  )}
                >
                  <Link
                    href={item.url}
                    className="flex items-center gap-3 w-full"
                  >
                    {item.icon && (
                      <item.icon
                        className={cn(
                          "h-5 w-5 transition-colors",
                          isActive
                            ? "text-white"
                            : "text-slate-500 dark:text-slate-400"
                        )}
                      />
                    )}
                    <span className="flex-1">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
