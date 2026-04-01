"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

import { AppSidebar, Navbar } from "@/components/dashboard";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useSession } from "@/lib/auth-client";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session?.session) {
    router.replace("/sign-in");
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <Navbar />
        <div className="p-8">{children}</div>
      </main>
    </SidebarProvider>
  );
}
