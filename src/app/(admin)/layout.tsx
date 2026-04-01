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
    LayoutDashboard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { toast } from "sonner";

const adminItems = [
    { name: "Overview", href: "/admin", icon: BarChart3 },
    { name: "Charities", href: "/admin/charities", icon: Heart },
    { name: "Draw Management", href: "/admin/draws", icon: Trophy },
    { name: "Winner Verification", href: "/admin/winners", icon: ShieldCheck },
    { name: "User Management", href: "/admin/users", icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session, isPending } = useSession();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (!isPending && (!session || session.user.role !== "ADMIN")) {
            toast.error("Unauthorized. Admin access required.");
            router.push("/dashboard");
        }
    }, [session, isPending, router]);

    if (isPending || !session || session.user.role !== "ADMIN") {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
            {/* Admin Sidebar */}
            <aside className="hidden lg:flex flex-col w-64 border-r bg-zinc-900 text-zinc-400">
                <div className="p-6 border-b border-zinc-800">
                    <Link href="/" className="flex items-center space-x-2 text-white">
                        <Trophy className="h-6 w-6 text-primary" />
                        <span className="text-xl font-bold">Admin Panel</span>
                    </Link>
                </div>
                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                    {adminItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                                pathname === item.href
                                    ? "bg-primary text-primary-foreground shadow-lg"
                                    : "hover:text-white hover:bg-white/5"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.name}
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t border-zinc-800 space-y-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="sm" className="w-full justify-start gap-3 hover:text-white hover:bg-white/5">
                            <LayoutDashboard className="h-4 w-4" />
                            User Dashboard
                        </Button>
                    </Link>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-900/10"
                        onClick={() => signOut()}
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="lg:hidden flex items-center justify-between p-4 border-b bg-zinc-900 text-white">
                    <Link href="/" className="flex items-center space-x-2 text-white">
                        <Trophy className="h-6 w-6 text-primary" />
                        <span className="text-xl font-bold">Admin</span>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
                        <Menu className="h-6 w-6" />
                    </Button>
                </header>

                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                    <div className="fixed inset-0 z-50 lg:hidden flex">
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
                        <div className="relative w-72 h-full bg-zinc-900 text-zinc-400 flex flex-col animate-in slide-in-from-left duration-300">
                            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                                <Link href="/" className="flex items-center space-x-2 text-white">
                                    <Trophy className="h-6 w-6 text-primary" />
                                    <span className="text-xl font-bold">Admin</span>
                                </Link>
                                <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                                    <X />
                                </Button>
                            </div>
                            <nav className="flex-1 overflow-y-auto p-4 space-y-2 pt-8">
                                {adminItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-xl text-md font-medium transition-colors",
                                            pathname === item.href
                                                ? "bg-primary text-primary-foreground shadow-md"
                                                : "hover:text-white"
                                        )}
                                        onClick={() => setIsSidebarOpen(false)}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>
                            <div className="p-6 border-t border-zinc-800">
                                <Button
                                    className="w-full justify-start gap-3 text-red-400"
                                    variant="ghost"
                                    onClick={() => { signOut(); setIsSidebarOpen(false); }}
                                >
                                    <LogOut className="h-5 w-5" />
                                    Sign Out
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10">
                    <div className="max-w-7xl mx-auto space-y-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
