import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { ThemeToggle } from "@/components/navbar/ThemeToggle";
import { useSession } from "@/lib/auth-client";
import Logout from "./Logout";

export default function Navbar() {
  const { data: session } = useSession();
  return (
    <div className="w-full flex gap-4 items-center justify-between px-4 py-2 sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <SidebarTrigger size={"lg"} />

      <div className="flex gap-4">
        <ThemeToggle />
        {session && (
          <Popover>
            <PopoverTrigger>
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
                <div className="grid grid-cols-1 gap-3">
                  <Logout variant="outline" className="text-destructive hover:bg-destructive/5 hover:text-destructive">
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
