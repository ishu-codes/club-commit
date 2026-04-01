"use client";

import { useState } from "react";
import Link from "next/link";

import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Trophy, LogOut, User, LayoutDashboard, Menu, X } from "lucide-react";
// import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/navbar/ThemeToggle";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function Navbar() {
  const { data: session, isPending } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Trophy className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold tracking-tight">ClubCommit</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/#how-it-works" className="transition-colors hover:text-primary">
            How it Works
          </Link>
          <Link href="/#charities" className="transition-colors hover:text-primary">
            Charities
          </Link>
          <Link href="/#pricing" className="transition-colors hover:text-primary">
            Pricing
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          {isPending ? (
            <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />
          ) : session ? (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer hover:ring-2 ring-foreground/20 transition-all">
                  <AvatarImage src={session?.user.image ?? ""} alt="profile" />
                  <AvatarFallback className="font-bold">{session?.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-80 rounded-2xl p-6 shadow-2xl border-border/50" align="end">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={session?.user.image ?? ""} alt="profile" />
                      <AvatarFallback className="text-lg font-bold">{session?.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-md font-bold leading-none mb-1">{session?.user.name}</h3>
                      <p className="text-sm text-muted-foreground leading-none">{session?.user.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button asChild className="">
                      <Link href={"/dashboard"}>Dashboard</Link>
                    </Button>
                    <Button
                      variant={"outline"}
                      className="text-destructive hover:bg-destructive/5 hover:text-destructive"
                      // onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            // <div className="flex items-center space-x-4">
            //   <Link href="/dashboard">
            //     <Button variant="ghost" size="lg" className="gap-2">
            //       <LayoutDashboard className="h-4 w-4" />
            //       Dashboard
            //     </Button>
            //   </Link>
            //   <Button variant="outline" size="lg" className="gap-2" onClick={() => signOut()}>
            //     <LogOut className="h-4 w-4" />
            //     Sign Out
            //   </Button>
            // </div>
            <>
              <Link href="/sign-in">
                <Button size="lg">Sign In</Button>
              </Link>
              {/*<Link href="/sign-up">
                <Button size="sm">Join Now</Button>
              </Link>*/}
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background px-4 py-4 space-y-4 animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col space-y-3">
            <Link href="/#how-it-works" className="text-sm font-medium" onClick={() => setIsMenuOpen(false)}>
              How it Works
            </Link>
            <Link href="/#charities" className="text-sm font-medium" onClick={() => setIsMenuOpen(false)}>
              Charities
            </Link>
            <Link href="/#pricing" className="text-sm font-medium" onClick={() => setIsMenuOpen(false)}>
              Pricing
            </Link>
          </nav>
          <div className="flex flex-col space-y-2 pt-2 border-t">
            {session ? (
              <>
                <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full justify-start gap-2" variant="ghost">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Button
                  className="w-full justify-start gap-2"
                  variant="outline"
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/sign-in" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full" variant="ghost">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full">Join Now</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
