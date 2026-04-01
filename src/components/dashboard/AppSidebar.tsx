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
  { name: "Golf Scores", href: "/dashboard/scores", icon: TrophyIcon },
  { name: "Charity Hub", href: "/dashboard/charity", icon: HeartIcon },
  { name: "Draw Protocols", href: "/dashboard/draws", icon: HistoryIcon },
  { name: "Winnings", href: "/dashboard/winnings", icon: ChevronRightIcon },
  { name: "Membership", href: "/dashboard/subscription", icon: CreditCardIcon },
  { name: "Settings", href: "/dashboard/settings", icon: SettingsIcon },
];

export default function AppSidebar() {
  const pathname = usePathname();
  return (
    <Sidebar>
      <SidebarHeader className="items-center py-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 rotate-3 transition-transform group-hover:rotate-0">
            <TrophyIcon className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tighter leading-none">ClubCommit</span>
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
                    "flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-black transition-all group relative overflow-hidden",
                    isActive
                      ? "bg-foreground text-background shadow-2xl shadow-foreground/20 pointer-events-none"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground active:scale-95",
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 transition-transform",
                      !isActive && "group-hover:scale-110 group-hover:rotate-6",
                    )}
                  />
                  <span className="uppercase tracking-tight">{item.name}</span>
                  {isActive && <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                </Link>
              );
            })}
          </nav>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <Logout variant="ghost" className="justify-start">
          <LogOutIcon className="h-4 w-4" /> Logout
        </Logout>
      </SidebarFooter>
    </Sidebar>
  );
}
