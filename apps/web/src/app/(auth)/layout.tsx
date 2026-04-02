"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

// import { useSession } from "@/lib/auth-client";
import { useAuthSession } from "@/hooks/useAuthSession";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  // const { data: session } = useSession();
  const { session } = useAuthSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.session) {
      router.replace("/dashboard");
    }
  }, [session, router]);

  if (session?.session) return null;

  return <>{children}</>;
}
