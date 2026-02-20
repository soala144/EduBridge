"use client";

import {
  BookOpen,
  Calendar,
  FileText,
  Home,
  Library,
  MessageSquare,
  Settings,
  User,
  Bell,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/contexts/UserContext";

const menuItems = [
  { title: "Dashboard", icon: Home, url: "/dashboard" },
  { title: "My Courses", icon: BookOpen, url: "/courses" },
  { title: "Attendance", icon: Calendar, url: "/attendance" },
  { title: "Reports", icon: FileText, url: "/reports" },
  { title: "Alerts", icon: Bell, url: "/alerts" },
  { title: "Library", icon: Library, url: "/library" },
  { title: "Assignments", icon: FileText, url: "/assignments" },
  { title: "Feedback", icon: MessageSquare, url: "/feedback" },
];

const bottomItems = [
  { title: "Settings", icon: Settings, url: "/settings" },
  { title: "Profile", icon: User, url: "/profile" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { currentUser, isLoading } = useUser();

  if (isLoading || !currentUser) return null;

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-[#261CC1] flex items-center justify-center">
            <span className="text-white font-bold text-lg">EB</span>
          </div>
          <div>
            <h2 className="font-semibold text-lg">EduBridge</h2>
            <p className="text-xs text-muted-foreground">UNIPORT</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={
                        isActive
                          ? "bg-[#261CC1]/10 border-l-4 border-[#261CC1] text-[#261CC1] font-medium"
                          : ""
                      }
                    >
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {bottomItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={
                        isActive
                          ? "bg-[#261CC1]/10 border-l-4 border-[#261CC1] text-[#261CC1] font-medium"
                          : ""
                      }
                    >
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="px-4 py-3 border-t">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src="" />
              <AvatarFallback className="bg-[#261CC1] text-white">
                {currentUser.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {currentUser.role.toLowerCase().replace("_", " ")}
              </p>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
