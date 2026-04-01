"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Trophy,
    Heart,
    Settings,
    CreditCard,
    History,
    Menu,
    X,
    LogOut,
    ChevronRight,
    CircleDot,
    User as UserIcon,
    Shield
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { signOut, useSession } from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const sidebarItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Golf Scores", href: "/dashboard/scores", icon: Trophy },
    { name: "Charity Hub", href: "/dashboard/charity", icon: Heart },
    { name: "Draw Protocols", href: "/dashboard/draws", icon: History },
    { name: "Winnings", href: "/dashboard/winnings", icon: ChevronRight },
    { name: "Membership", href: "/dashboard/subscription", icon: CreditCard },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { data: session } = useSession();

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-background border-r border-border/40 relative">
            <div className="p-8 pb-10">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 rotate-3 transition-transform group-hover:rotate-0">
                        <Trophy className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-black italic tracking-tighter leading-none">ClubCommit</span>
                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-1">Terminal Shell</span>
                    </div>
                </Link>
            </div>

            <nav className="flex-1 px-4 space-y-2 overflow-y-auto pb-8">
                <div className="px-4 mb-4">
                    <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.3em] italic">Main Command</p>
                </div>
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-black italic transition-all group relative overflow-hidden",
                                isActive
                                    ? "bg-foreground text-background shadow-2xl shadow-foreground/20"
                                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground active:scale-95"
                            )}
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <item.icon className={cn("h-5 w-5 transition-transform", !isActive && "group-hover:scale-110 group-hover:rotate-6")} />
                            <span className="uppercase tracking-tight">{item.name}</span>
                            {isActive && (
                                <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6 mt-auto border-t border-border/40 space-y-6 bg-muted/5">
                <div className="px-2">
                    <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.3em] italic">Authorized Node</p>
                </div>

                <div className="flex items-center gap-4 px-2">
                    <div className="relative group">
                        <div className="h-12 w-12 rounded-2xl bg-muted border border-border/50 flex items-center justify-center overflow-hidden transition-all group-hover:border-primary/50 shadow-sm">
                            {session?.user?.image ? (
                                <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <UserIcon className="h-6 w-6 text-muted-foreground/40" />
                            )}
                        </div>
                        <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary border-2 border-background shadow-sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-black italic truncate tracking-tight">{session?.user?.name || "Anonymous"}</p>
                        <div className="flex items-center gap-1.5">
                            {session?.user?.role === 'ADMIN' && (
                                <Badge className="h-4 px-1.5 bg-primary/20 text-primary border-none rounded-sm text-[8px] font-black tracking-widest uppercase italic">Admin</Badge>
                            )}
                            <p className="text-[10px] text-muted-foreground/60 font-bold truncate tracking-tight">{session?.user?.email}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-2 pt-2">
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-4 h-12 px-4 rounded-xl text-muted-foreground hover:text-foreground active:scale-95 transition-all text-xs font-black italic uppercase tracking-widest"
                        asChild
                    >
                        <Link href="/dashboard/settings">
                            <Settings className="h-4 w-4" /> NODE SETTINGS
                        </Link>
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-4 h-12 px-4 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 active:scale-95 transition-all text-xs font-black italic uppercase tracking-widest"
                        onClick={() => signOut()}
                    >
                        <LogOut className="h-4 w-4" /> TERMINATE SESSION
                    </Button>
                </div>
            </div>

            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-50" />
        </div>
    );

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans selection:bg-primary/30">
            {/* Desktop Sidebar Shell */}
            <aside className="hidden lg:flex flex-col w-80 shrink-0 shadow-2xl relative z-40">
                <SidebarContent />
            </aside>

            {/* Mobile / Content Flow */}
            <div className="flex-1 flex flex-col min-w-0 relative">
                {/* Mobile Header */}
                <header className="lg:hidden flex items-center justify-between px-6 h-20 border-b border-border/40 bg-background/80 backdrop-blur-xl sticky top-0 z-30">
                    <Link href="/" className="flex items-center gap-3">
                        <Trophy className="h-6 w-6 text-primary" />
                        <span className="text-xl font-black italic tracking-tighter italic">ClubCommit</span>
                    </Link>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-xl h-12 w-12 bg-muted/50 hover:bg-primary/10 hover:text-primary border-none transition-all shadow-inner"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu className="h-6 w-6" />
                    </Button>
                </header>

                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                    <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
                        <div className="absolute inset-0 bg-background/60 backdrop-blur-lg animate-in fade-in duration-500" onClick={() => setIsSidebarOpen(false)} />
                        <div className="absolute inset-y-0 left-0 w-80 animate-in slide-in-from-left duration-500 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
                            <div className="h-full relative">
                                <SidebarContent />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-6 right-6 h-10 w-10 rounded-full bg-background border border-border/40 hover:bg-muted"
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto relative scroll-smooth selection:bg-primary/20">
                    <div className="max-w-[1400px] mx-auto p-6 md:p-10 lg:p-14 xl:p-20 min-h-full flex flex-col">
                        <div className="flex-1 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                            {children}
                        </div>

                        {/* Internal Footer */}
                        <div className="pt-20 pb-8 mt-auto flex flex-col md:flex-row items-center justify-between gap-6 opacity-40">
                            <p className="text-[10px] font-black italic uppercase tracking-[0.3em]">ClubCommit Protocol Registry © 2026</p>
                            <div className="flex items-center gap-8">
                                <Link href="#" className="text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors">Privacy</Link>
                                <Link href="#" className="text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors">Compliance</Link>
                                <Link href="#" className="text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors">Security</Link>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
