"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

import { useSession } from "@/lib/auth-client";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const router = useRouter();

  if (session?.session) {
    router.replace("/dashboard");
    return null;
  }

  return <>{children}</>;
}
