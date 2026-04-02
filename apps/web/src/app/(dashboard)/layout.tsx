"use client";

import { type ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

import { AppSidebar, Navbar } from "@/components/dashboard";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useSession } from "@/lib/auth-client";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { data: session, isPending: loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session?.session) {
      router.replace("/sign-in");
    } else if (session?.user.role === "ADMIN") router.replace("/admin");
  }, [session, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center p-8">
        <div className="w-full max-w-4xl space-y-4">
          <Skeleton className="h-12 w-full" />
          <div className="flex gap-4">
            <Skeleton className="h-[600px] w-64" />
            <Skeleton className="h-[600px] flex-1" />
          </div>
        </div>
      </div>
    );
  }

  if (!session?.session) {
    return null;
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
