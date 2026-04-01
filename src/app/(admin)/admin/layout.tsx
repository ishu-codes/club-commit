"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Users,
  Heart,
  Trophy,
  ShieldCheck,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  X,
  LayoutDashboard,
  Zap,
  Fingerprint,
  Database,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const adminItems = [
  { name: "Global Overview", href: "/admin", icon: BarChart3 },
  { name: "Partner Network", href: "/admin/charities", icon: Heart },
  { name: "Draw Protocols", href: "/admin/draws", icon: Trophy },
  { name: "Audit & Settlement", href: "/admin/winners", icon: ShieldCheck },
  { name: "Identity Registry", href: "/admin/users", icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isPending && (!session || session.user.role !== "ADMIN")) {
      toast.error("Unauthorized. Recursive access denied.");
      router.push("/dashboard");
    }
  }, [session, isPending, router]);

  if (isPending || !session || session.user.role !== "ADMIN") {
    return (
      <div className="h-screen bg-background flex flex-col items-center justify-center gap-8 selection:none">
        <div className="relative">
          <div className="h-16 w-16 rounded-3xl border-4 border-primary border-t-transparent animate-spin" />
          <Fingerprint className="absolute inset-0 m-auto h-6 w-6 text-primary animate-pulse" />
        </div>
        <div className="text-center space-y-2">
          <p className="font-black text-xl uppercase tracking-tighter">Authenticating Authority</p>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">
            Verifying clearance level...
          </p>
        </div>
      </div>
    );
  }

  const AdminSidebar = () => (
    <div className="flex flex-col h-full bg-foreground text-background relative selection:bg-primary/20">
      <div className="p-8 pb-12">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/40 rotate-6 transition-transform group-hover:rotate-0">
            <Shield className="h-7 w-7 text-primary-foreground fill-current" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tighter leading-none">ROOT_ACCESS</span>
            <span className="text-[9px] font-black text-primary uppercase tracking-[0.4em] mt-1.5 opacity-80">
              Authority Panel
            </span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-3 overflow-y-auto pb-8">
        <div className="px-5 mb-6">
          <p className="text-[10px] font-black text-background/30 uppercase tracking-[0.4em] leading-none">
            System Nodes
          </p>
        </div>
        {adminItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-black transition-all group relative overflow-hidden",
                isActive
                  ? "bg-background text-foreground shadow-2xl shadow-black/20"
                  : "text-background/40 hover:bg-background/5 hover:text-background active:scale-95",
              )}
              onClick={() => setIsSidebarOpen(false)}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 transition-transform",
                  !isActive && "group-hover:scale-110 group-hover:rotate-3",
                )}
              />
              <span className="uppercase tracking-tight">{item.name}</span>
              {isActive && <Zap className="absolute right-5 h-4 w-4 text-primary fill-current animate-pulse" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 mt-auto border-t border-background/10 space-y-6 bg-background/5">
        <div className="px-2">
          <p className="text-[10px] font-black text-background/30 uppercase tracking-[0.4em]">Authority ID</p>
        </div>

        <div className="flex items-center gap-4 px-2">
          <div className="h-12 w-12 rounded-2xl bg-background/10 border border-background/20 flex items-center justify-center overflow-hidden shrink-0">
            {session?.user?.image ? (
              <img src={session.user.image} alt="" className="w-full h-full object-cover" />
            ) : (
              <Fingerprint className="h-6 w-6 text-primary" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black truncate tracking-tight text-background">
              {session?.user?.name || "Root Admin"}
            </p>
            <Badge className="h-4 px-1.5 bg-primary text-primary-foreground border-none rounded-sm text-[8px] font-black tracking-widest uppercase mt-1 shadow-lg shadow-primary/20">
              Authorized Overlord
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 pt-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-4 h-12 px-5 rounded-xl bg-background/5 text-background/60 hover:bg-background/10 hover:text-background transition-all text-[10px] font-black uppercase tracking-widest"
            asChild
          >
            <Link href="/dashboard">
              <LayoutDashboard className="h-4 w-4" /> RECURSIVE SWITCH
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-4 h-12 px-5 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all text-[10px] font-black uppercase tracking-widest"
            onClick={() => signOut()}
          >
            <LogOut className="h-4 w-4" /> KILL CONNECTION
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans selection:bg-primary/30">
      {/* Desktop Admin Sidebar */}
      <aside className="hidden lg:flex flex-col w-80 shrink-0 shadow-3xl relative z-40">
        <AdminSidebar />
      </aside>

      {/* Main Content Terminal */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Mobile Admin Header */}
        <header className="lg:hidden flex items-center justify-between px-6 h-20 border-b border-border bg-foreground text-background sticky top-0 z-30">
          <Link href="/" className="flex items-center gap-3">
            <Trophy className="h-6 w-6 text-primary" />
            <span className="text-xl font-black tracking-tighter uppercase leading-none">Admin_Terminal</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl h-12 w-12 bg-background/10 hover:bg-primary hover:text-primary-foreground border-none transition-all"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </header>

        {/* Mobile Admin Overlay */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
            <div
              className="absolute inset-0 bg-background/60 backdrop-blur-lg animate-in fade-in duration-500"
              onClick={() => setIsSidebarOpen(false)}
            />
            <div className="absolute inset-y-0 left-0 w-80 animate-in slide-in-from-left duration-500 shadow-3xl">
              <div className="h-full relative">
                <AdminSidebar />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-8 right-6 h-10 w-10 rounded-full bg-background text-foreground hover:bg-primary transition-all"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Root Content Stream */}
        <main className="flex-1 overflow-y-auto relative scroll-smooth bg-background">
          <div className="max-w-[1500px] mx-auto p-6 md:p-12 lg:p-16 xl:p-24 min-h-full flex flex-col">
            <div className="flex-1 animate-in fade-in slide-in-from-bottom-8 duration-1000">{children}</div>

            {/* Terminal Footer */}
            <div className="pt-32 pb-10 mt-auto flex flex-col md:flex-row items-center justify-between gap-8 opacity-20 hover:opacity-50 transition-opacity">
              <div className="flex items-center gap-4">
                <Database className="h-4 w-4 text-primary" />
                <p className="text-[9px] font-black uppercase tracking-[0.4em]">ROOT_NODE // REGISTRY_v2.0.46</p>
              </div>
              <div className="flex items-center gap-10">
                <p className="text-[9px] font-black uppercase tracking-[0.4em]">KERNEL_LEVEL_PROTECTION_ACTIVE</p>
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
