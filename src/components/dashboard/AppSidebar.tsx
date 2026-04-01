"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRightIcon,
  CreditCardIcon,
  HeartIcon,
  HistoryIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  SettingsIcon,
  TrophyIcon,
} from "lucide-react";

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Logout from "./Logout";

const sidebarItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboardIcon },
  { name: "Scores", href: "/dashboard/scores", icon: TrophyIcon },
  { name: "Charities", href: "/dashboard/charity", icon: HeartIcon },
  { name: "Draw History", href: "/dashboard/draws", icon: HistoryIcon },
  { name: "Winnings", href: "/dashboard/winnings", icon: ChevronRightIcon },
  { name: "Subscription", href: "/dashboard/subscription", icon: CreditCardIcon },
  { name: "Settings", href: "/dashboard/settings", icon: SettingsIcon },
];

export default function AppSidebar() {
  const pathname = usePathname();
  return (
    <Sidebar>
      <SidebarHeader className="items-center py-4">
        <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/10">
            <TrophyIcon className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight leading-none">ClubCommit</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <nav className="flex-1 px-4 space-y-2 overflow-y-auto pb-8">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group relative",
                    isActive
                      ? "bg-primary text-primary-foreground pointer-events-none"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                  )}
                >
                  <item.icon className={cn("h-4 w-4 transition-transform", !isActive && "group-hover:scale-105")} />
                  <span className="tracking-tight">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter className="px-4">
        <Logout
          variant="ghost"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group relative w-full justify-start",
            "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
          )}
        >
          <LogOutIcon className="h-4 w-4 transition-transform group-hover:scale-105" />
          <span className="tracking-tight">Logout</span>
        </Logout>
      </SidebarFooter>
    </Sidebar>
  );
}
