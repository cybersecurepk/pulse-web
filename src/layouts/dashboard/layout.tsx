"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { Bell, Settings, LogOut, User, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useSafeSession } from "@/hooks/use-session";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export type DashboardLayoutProps = {
  children: React.ReactNode;
};

export function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const { data: session, status } = useSafeSession();
  const router = useRouter();
  
  // Debug log to see what session data we have
  useEffect(() => {
    console.log('Dashboard session data:', session);
  }, [session]);
  
  // Only check for explicit logout, allow direct URL access for admin
  useEffect(() => {
    const isLoggedOut = sessionStorage.getItem("isLoggedOut");
    if (isLoggedOut === "true") {
      sessionStorage.removeItem("isLoggedOut");
      window.location.replace("/auth/sign-in");
    }
  }, []);
  
  // Get user info from session
  const userName = session?.user?.name || "User";
  const userEmail = session?.user?.email || "";
  const userAvatar = session?.user?.picture || session?.user?.avatar || "";
  
  // Generate initials from name
  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };
  
  const userInitials = getInitials(userName);

  // Handle logout
  const handleLogout = () => {
    // Clear all session data from localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("pendingLoginEmail");
    
    // Set a flag to indicate user has logged out
    sessionStorage.setItem("isLoggedOut", "true");
    
    // Clear all history and redirect to login
    window.location.href = "/auth/sign-in";
  };
  
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-x-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-slate-900 sticky top-0 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 dark:border-slate-700 px-6 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="-ml-1 bg-blue-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg p-2 transition-all duration-200 hover:scale-105 active:scale-95 border border-transparent hover:border-blue-200 dark:hover:border-blue-800 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400" />
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg p-2 transition-colors group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <Avatar className="h-8 w-8 ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-blue-500 transition-all">
                    {userAvatar && <AvatarImage src={userAvatar} alt={userName} />}
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {userName}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {userEmail}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-64 p-2 z-50 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg rounded-lg"
                sideOffset={8}
              >
                <DropdownMenuLabel className="px-2 py-1.5">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      {userAvatar && <AvatarImage src={userAvatar} alt={userName} />}
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {userName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {userEmail}
                      </p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
                <DropdownMenuItem className="px-2 py-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md focus:bg-slate-100 dark:focus:bg-slate-700" asChild>
                  <Link href="/admin/account/profile">
                    <User className="h-4 w-4 mr-3 text-slate-600 dark:text-slate-400" />
                    <span className="text-slate-900 dark:text-slate-100">
                      Profile
                    </span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="px-2 py-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md focus:bg-slate-100 dark:focus:bg-slate-700" asChild>
                  <Link href="/admin/account/password">
                    <Settings className="h-4 w-4 mr-3 text-slate-600 dark:text-slate-400" />
                    <span className="text-slate-900 dark:text-slate-100">
                      Change Password
                    </span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
                <DropdownMenuItem 
                  className="px-2 py-2 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md focus:bg-red-50 dark:focus:bg-red-900/20"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 flex-col gap-6 p-6 overflow-x-hidden bg-slate-50 dark:bg-slate-900/50">
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}