"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  User,
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
    if (!isPending && (!session || (session.user as any).role !== "ADMIN")) {
      toast.error("Unauthorized. Recursive access denied.");
      router.push("/dashboard");
    }
  }, [session, isPending, router]);

  if (isPending || !session || (session.user as any).role !== "ADMIN") {
    return (
      <div className="h-screen bg-background flex flex-col items-center justify-center gap-6 selection:none">
        <div className="relative">
          <div className="h-12 w-12 rounded-xl border-2 border-primary border-t-transparent animate-spin" />
        </div>
        <div className="text-center space-y-1">
          <p className="font-semibold text-lg tracking-tight">Authenticating</p>
          <p className="text-xs text-muted-foreground">
            Verifying access...
          </p>
        </div>
      </div>
    );
  }

  const AdminSidebar = () => (
    <div className="flex flex-col h-full bg-foreground text-background relative selection:bg-primary/20">
      <div className="p-6 pb-8">
        <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/10">
            <Shield className="h-5 w-5 text-primary-foreground fill-current" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight leading-none">Admin Panel</span>
            <span className="text-[10px] font-medium text-muted-foreground mt-1">
              Management
            </span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto pb-8">
        <div className="px-3 mb-4">
          <p className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-widest leading-none">
            Main Menu
          </p>
        </div>
        {adminItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors group relative",
                isActive
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground/70 hover:bg-background/5 hover:text-background",
              )}
              onClick={() => setIsSidebarOpen(false)}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 transition-transform",
                  !isActive && "group-hover:scale-105",
                )}
              />
              <span className="tracking-tight">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-background/10 space-y-4 bg-background/5">
        <div className="flex items-center gap-3 px-2">
          <div className="h-10 w-10 rounded-lg bg-background/10 border border-background/20 flex items-center justify-center overflow-hidden shrink-0">
            {session?.user?.image ? (
              <img src={session.user.image} alt="" className="w-full h-full object-cover" />
            ) : (
              <User className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate tracking-tight text-background">
              {session?.user?.name || "Admin"}
            </p>
            <Badge className="h-4 px-1.5 bg-primary text-primary-foreground border-none rounded-sm text-[8px] font-bold tracking-wider uppercase mt-1">
              Administrator
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 h-9 px-3 rounded-md bg-background/5 text-background/60 hover:bg-background/10 hover:text-background transition-colors text-xs font-medium"
            asChild
          >
            <Link href="/dashboard">
              <LayoutDashboard className="h-4 w-4" /> Go to Dashboard
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 h-9 px-3 rounded-md bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors text-xs font-medium"
            onClick={() => signOut()}
          >
            <LogOut className="h-4 w-4" /> Log out
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

            {/* Footer */}
            <div className="pt-24 pb-8 mt-auto flex flex-col md:flex-row items-center justify-between gap-6 opacity-30">
              <div className="flex items-center gap-3">
                <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                <p className="text-[10px] font-medium uppercase tracking-widest">Admin Node // v1.0.0</p>
              </div>
              <div className="flex items-center gap-8">
                <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">System Secure</p>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
