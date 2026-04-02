"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { ThemeToggle } from "@/components/navbar/ThemeToggle";
// import { useSession } from "@/lib/auth-client";
import { useAuthSession } from "@/hooks/useAuthSession";
import Logout from "./Logout";

export default function Navbar() {
  // const { data: session } = useSession();
  const { session } = useAuthSession();
  return (
    <div className="w-full flex gap-4 items-center justify-between px-4 py-2 sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <SidebarTrigger size={"lg"} />

      <div className="flex gap-4">
        <ThemeToggle />
        {session && (
          <Popover>
            <PopoverTrigger>
              <Avatar className="cursor-pointer transition-opacity hover:opacity-80">
                <AvatarImage src={session?.user.image ?? ""} alt="profile" />
                <AvatarFallback className="font-semibold">{session?.user.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            </PopoverTrigger>
            <PopoverContent className="w-80 rounded-xl p-6 shadow-xl border-border/50" align="end">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={session?.user.image ?? ""} alt="profile" />
                    <AvatarFallback className="text-base font-semibold">
                      {session?.user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-sm font-semibold leading-none mb-1">{session?.user.name}</h3>
                    <p className="text-xs text-muted-foreground leading-none">{session?.user.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <Logout variant="outline" className="h-9 text-xs text-destructive hover:text-destructive">
                    Logout
                  </Logout>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
}
