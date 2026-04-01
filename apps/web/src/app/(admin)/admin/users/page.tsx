"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Users,
  Search,
  ShieldAlert,
  UserCog,
  ArrowUpDown,
  Mail,
  Calendar,
  CreditCard,
  History,
  MoreVertical,
  ShieldCheck,
  ShieldAlert as ShieldIcon,
  ChevronRight,
  User,
  ShieldX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

import { adminFetchers } from "@/fetchers/admin";

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: adminFetchers.users,
    staleTime: 1000 * 60 * 5, // 5 min
  });

  const updateRoleMutation = useMutation({
    mutationFn: (values: { userId: string; role: string }) => adminFetchers.updateUserRole(values.userId, values.role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("Operational authority updated.");
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-12 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
          <Skeleton className="h-12 w-96 rounded-full" />
          <Skeleton className="h-16 w-64 rounded-2xl" />
        </div>
        <Skeleton className="h-[600px] w-full rounded-[2.5rem]" />
      </div>
    );
  }

  const filteredUsers = users?.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight underline decoration-primary/20 decoration-4 underline-offset-8">
            Identity & Clearance
          </h1>
          <p className="text-muted-foreground mt-4 font-medium italic">
            Audit authorized system nodes and manage administrative hierarchies.
          </p>
        </div>

        <div className="flex items-center gap-8 bg-muted/20 px-10 py-5 rounded-[2rem] border border-muted-foreground/10 backdrop-blur-sm group">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] leading-none">
              GLOBAL NODES
            </p>
            <p className="text-3xl font-black italic text-foreground leading-none tracking-tighter tabular-nums">
              {users?.length || 0}
            </p>
          </div>
          <Separator orientation="vertical" className="h-10 group-hover:rotate-6 transition-transform opacity-20" />
          <div className="space-y-1">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] leading-none">
              SYSTEM AUTHORITIES
            </p>
            <p className="text-3xl font-black italic text-primary leading-none tracking-tighter tabular-nums">
              {users?.filter((u) => u.role === "ADMIN").length || 0}
            </p>
          </div>
        </div>
      </div>

      <Card className="border-none shadow-2xl overflow-hidden rounded-[2.5rem] bg-background border-2 border-muted/10">
        <CardHeader className="border-b border-muted/10 bg-muted/5 p-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-black italic uppercase tracking-tighter">Registry Database</CardTitle>
              <CardDescription className="font-medium italic">
                Active telemetry filtering for all identified members.
              </CardDescription>
            </div>
            <div className="relative group">
              <Search className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search by name, email or protocol..."
                className="pl-12 w-full md:w-[450px] h-14 shadow-inner rounded-2xl bg-background border-muted-foreground/10 focus-visible:ring-primary/20 text-sm font-medium"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/30 text-muted-foreground uppercase text-[10px] font-black tracking-[0.3em] border-b border-muted/10">
                <tr>
                  <th className="px-10 py-6">IDENTIFIED NODE</th>
                  <th className="px-10 py-6">CLEARANCE LEVEL</th>
                  <th className="px-10 py-6">CAPITAL STATUS</th>
                  <th className="px-10 py-6">TEMPORAL ENTRY</th>
                  <th className="px-10 py-6 text-right">SYSTEM COMMANDS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted/10">
                {filteredUsers?.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/5 transition-all group">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className="h-14 w-14 rounded-2xl bg-muted/50 flex items-center justify-center border-2 border-muted/20 group-hover:border-primary/20 group-hover:rotate-3 transition-all shadow-sm overflow-hidden shrink-0">
                          {user.image ? (
                            <img src={user.image} className="w-full h-full object-cover" alt="" />
                          ) : (
                            <User className="h-6 w-6 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                          )}
                        </div>
                        <div>
                          <p className="font-black italic text-xl leading-none tracking-tight group-hover:text-primary transition-colors">
                            {user.name || "Anonymous Node"}
                          </p>
                          <div className="flex items-center gap-2 mt-2.5">
                            <Mail className="h-3 w-3 text-muted-foreground/40" />
                            <p className="text-xs font-black text-muted-foreground/60 tracking-wider lowercase italic">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <Badge
                        variant={user.role === "ADMIN" ? "default" : "outline"}
                        className={cn(
                          "text-[10px] px-4 py-1.5 font-black tracking-widest italic uppercase border-none rounded-full transition-all",
                          user.role === "ADMIN"
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/10"
                            : "bg-muted/50 text-muted-foreground border border-muted-foreground/20",
                        )}
                      >
                        {user.role === "ADMIN" ? <ShieldCheck className="h-3.5 w-3.5 mr-2" /> : null}
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-10 py-8">
                      {user.subscriptions && user.subscriptions.length > 0 ? (
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                          <span className="font-black italic text-primary uppercase text-[10px] tracking-widest">
                            ACTIVE COMMITMENT
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-black text-muted-foreground/20 uppercase tracking-[0.2em] italic">
                          ZERO ALLOCATION
                        </span>
                      )}
                    </td>
                    <td className="px-10 py-8 text-muted-foreground/60 font-black tabular-nums italic text-xs uppercase tracking-widest">
                      SYNC: {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-10 py-8 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-12 px-6 gap-3 font-black italic text-[11px] uppercase tracking-widest rounded-xl bg-muted/20 border border-transparent hover:border-primary/20 hover:bg-primary/5 hover:text-primary transition-all"
                        onClick={() => {
                          const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
                          if (confirm(`ADMINISTRATIVE OVERRIDE: Elevate/Restrict node clearance for ${user.name}?`)) {
                            updateRoleMutation.mutate({ userId: user.id, role: newRole });
                          }
                        }}
                        disabled={updateRoleMutation.isPending}
                      >
                        <UserCog
                          className={cn("h-4 w-4", user.role === "ADMIN" ? "text-primary" : "text-muted-foreground/40")}
                        />
                        CLEARANCE TOGGLE
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!filteredUsers?.length && (
              <div className="py-48 text-center flex flex-col items-center justify-center space-y-8 bg-muted/5">
                <div className="h-24 w-24 rounded-full bg-muted/20 flex items-center justify-center text-muted-foreground/10 animate-bounce">
                  <ShieldX className="h-12 w-12" />
                </div>
                <div className="space-y-2">
                  <p className="text-muted-foreground font-black italic text-2xl uppercase tracking-tighter">
                    Node Not Found
                  </p>
                  <p className="text-xs text-muted-foreground/40 font-medium tracking-[0.2em] uppercase">
                    Recalibrate search parameters for identity discovery.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Admin Safety Advisory */}
      <Card className="rounded-[2.5rem] border-4 border-dashed border-destructive/20 bg-destructive/5 p-12 flex flex-col lg:flex-row gap-10 items-center justify-between shadow-inner relative overflow-hidden group">
        <div className="flex flex-col lg:flex-row items-center gap-8 relative z-10">
          <div className="h-20 w-20 rounded-3xl bg-destructive text-destructive-foreground flex items-center justify-center shadow-2xl shadow-destructive/20 transition-transform group-hover:scale-110 group-hover:rotate-6">
            <ShieldIcon className="h-10 w-10" />
          </div>
          <div className="space-y-3 text-center lg:text-left max-w-3xl">
            <h4 className="font-black italic text-2xl uppercase tracking-tight text-destructive">
              Administrative Security Directive
            </h4>
            <p className="text-base font-medium leading-relaxed text-destructive/80 italic">
              Elevating a node to{" "}
              <span className="font-black underline decoration-2 underline-offset-4 tracking-[0.1em]">ADMIN</span>{" "}
              clearance grants absolute terminal authority. Authorized nodes bypass standard constraints, enabling full
              control over capital distribution logic, partner registry state, and system configuration. Promote only
              verified corporate identities via established protocols.
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          className="rounded-2xl border-destructive/30 text-destructive bg-background/50 hover:bg-destructive hover:text-destructive-foreground font-black italic text-xs uppercase h-14 px-8 tracking-widest shadow-xl transition-all active:scale-95 group-hover:border-destructive relative z-10 shrink-0"
        >
          ACCESS SECURITY AUDIT LOGS
        </Button>
        <div className="absolute top-0 left-0 w-64 h-64 bg-destructive/5 rounded-full blur-[100px] -ml-32 -mt-32" />
      </Card>
    </div>
  );
}
