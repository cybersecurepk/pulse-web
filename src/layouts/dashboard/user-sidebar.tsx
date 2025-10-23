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
  Bell,
  Shield,
  Settings,
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
      { title: "Active Tests", url: "/user/tests" },
      { title: "Completed Tests", url: "/user/tests/completed" },
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
      { title: "My Profile", url: "/user/profile" },
      { title: "Settings", url: "/user/account/settings" },
    ],
  },
];

export function UserSidebar() {
  const pathname = usePathname();

  return (
    <SidebarGroup className="bg-[#1E40AF] text-white h-screen flex flex-col overflow-hidden">
      <SidebarGroupContent className="px-3 py-4 flex-1 overflow-visible">
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
                          "w-full justify-start gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                          shouldHighlight
                            ? "bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white shadow-lg shadow-blue-500/30"
                            : "text-blue-100 hover:bg-[#3B82F6]/20 hover:text-white"
                        )}
                      >
                        {item.icon && (
                          <item.icon
                            className={cn(
                              "h-5 w-5 transition-colors",
                              shouldHighlight ? "text-white" : "text-blue-200"
                            )}
                          />
                        )}
                        <span className="flex-1">{item.title}</span>
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
                                    ? "bg-[#3B82F6]/25 text-white border-l-2 border-[#3B82F6] font-medium"
                                    : "text-blue-100 hover:bg-[#3B82F6]/20 hover:text-white"
                                )}
                              >
                                <Link
                                  href={subItem.url}
                                  className="flex items-center gap-3 w-full"
                                >
                                  {subItem.icon && (
                                    <subItem.icon
                                      className={cn(
                                        "h-4 w-4",
                                        isSubActive
                                          ? "text-[#3B82F6]"
                                          : "text-blue-200"
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
                    "w-full justify-start gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white shadow-lg shadow-blue-500/30"
                      : "text-blue-100 hover:bg-[#3B82F6]/20 hover:text-white"
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
                          isActive ? "text-white" : "text-blue-200"
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
