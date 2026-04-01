"use client";

import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";

interface Props {
  children: ReactNode;
  variant?: "default" | "outline" | "ghost";
  className?: string;
}
export default function Logout({ children, variant = "default", className = "" }: Props) {
  const handleLogout = () => {
    signOut();
    redirect("/");
  };
  return (
    <Button variant={variant} className={className} onClick={handleLogout}>
      {children}
    </Button>
  );
}
