"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Trophy,
  ChevronRight,
  Clock,
  CheckCircle2,
  Ticket,
  TrendingUp,
  ArrowRight,
  Info,
  HistoryIcon,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { drawFetchers } from "@/fetchers/draw";
import { dashboardFetchers } from "@/fetchers/dashboard";

export default function DrawsPage() {
  const queryClient = useQueryClient();

  const { data: draws, isLoading: loadingDraws } = useQuery({
    queryKey: ["draws"],
    queryFn: () => drawFetchers.list(),
    staleTime: 1000 * 60 * 5, // 5 min
  });

  const { data: dashboard, isLoading: loadingDashboard } = useQuery({
    queryKey: ["dashboard"],
    queryFn: dashboardFetchers.get,
    staleTime: 1000 * 60 * 5, // 5 min
  });

  const enterMutation = useMutation({
    mutationFn: drawFetchers.enter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["draws"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Successfully entered the draw!");
    },
    onError: (err: any) => toast.error(err.message || "Failed to enter draw"),
  });

  if (loadingDraws || loadingDashboard) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <Skeleton className="h-64 w-full rounded-[2rem]" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-56 rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  const upcomingDraws = draws?.filter((d) => d.status === "OPEN") || [];
  const pastDraws = draws?.filter((d) => d.status !== "OPEN") || [];
  const entries = dashboard?.draws.entries || [];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight underline decoration-primary/20 decoration-4 underline-offset-8">
          Engagement Registry
        </h1>
        <p className="text-muted-foreground mt-4 font-medium italic text-balance max-w-2xl">
          Exclusive tactical competitions initialized for the elite commitment network.
        </p>
      </div>

      {/* Featured Upcoming Draw */}
      {upcomingDraws.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 bg-foreground text-background overflow-hidden relative border-none rounded-[2.5rem] shadow-2xl group">
            <CardHeader className="pb-8 relative z-10 p-12">
              <div className="flex items-center justify-between mb-8">
                <Badge className="bg-primary text-primary-foreground border-none px-5 py-2 font-black uppercase text-[10px] tracking-[0.2em] rounded-full">
                  LIVE REGISTRATION
                </Badge>
                <div className="flex items-center gap-2 text-background/50 text-[10px] font-black uppercase tracking-widest">
                  <Clock className="h-4 w-4 text-primary animate-spin-slow" />
                  TEMPORAL GATE OPEN
                </div>
              </div>
              <CardTitle className="text-7xl font-black italic tracking-tighter uppercase leading-none">
                {new Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date(0, upcomingDraws[0].month - 1))}
                <span className="block text-primary text-4xl mt-2 not-italic font-black opacity-80">
                  {upcomingDraws[0].year} RECOVERY FUND
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 space-y-10 pb-12 px-12">
              <div className="flex items-baseline gap-6">
                <span className="text-9xl font-black text-primary italic leading-none tracking-tighter drop-shadow-2xl">
                  ${upcomingDraws[0].prizePool}
                </span>
                <div className="space-y-1">
                  <p className="text-background/40 font-black uppercase text-[10px] tracking-[0.3em] leading-none">
                    PROJECTED
                  </p>
                  <p className="text-background/80 font-black uppercase text-2xl tracking-tighter leading-none italic">
                    POOL VALUE
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6">
                <div className="bg-background/5 rounded-3xl p-8 border border-background/10 backdrop-blur-md group-hover:bg-background/10 transition-all border-l-4 border-l-primary">
                  <p className="text-[10px] text-background/40 uppercase font-black tracking-[0.3em] mb-3 leading-none">
                    ALGORITHM LOAD
                  </p>
                  <p className="font-black italic text-xl uppercase tracking-tight">
                    {upcomingDraws[0].drawType === "ALGORITHM" ? "Weighted Performance" : "Full Randomization"}
                  </p>
                </div>
                <div className="bg-background/5 rounded-3xl p-8 border border-background/10 backdrop-blur-md group-hover:bg-background/10 transition-all border-l-4 border-l-primary">
                  <p className="text-[10px] text-background/40 uppercase font-black tracking-[0.3em] mb-3 leading-none">
                    ACTIVE NODES
                  </p>
                  <p className="font-black italic text-xl uppercase tracking-tight">
                    {upcomingDraws[0]._count?.entries || 0} ELIGIBLE DATA POINTS
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="relative z-10 bg-background/5 p-12 border-t border-background/10 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-8">
              <div className="text-sm">
                {entries.some((e: any) => e.drawId === upcomingDraws[0].id) ? (
                  <span className="flex items-center gap-3 text-primary font-black italic uppercase tracking-widest text-lg">
                    <CheckCircle2 className="h-6 w-6 stroke-[3px]" /> Participation Locked
                  </span>
                ) : (
                  <div className="flex items-center gap-3 text-background/40 italic font-medium">
                    <Info className="h-5 w-5 text-primary" />
                    <span className="text-xs uppercase tracking-wider font-bold">
                      Protocol requires:{" "}
                      <span className="text-background underline decoration-primary decoration-2">ACTIVE STAKE</span> +{" "}
                      <span className="text-background underline decoration-primary decoration-2">VERIFIED SCORE</span>
                    </span>
                  </div>
                )}
              </div>
              <Button
                size="lg"
                className="w-full sm:w-auto h-20 px-16 text-2xl font-black italic shadow-2xl rounded-2xl group/btn overflow-hidden"
                disabled={entries.some((e: any) => e.drawId === upcomingDraws[0].id) || enterMutation.isPending}
                onClick={() => enterMutation.mutate(upcomingDraws[0].id)}
              >
                <span className="relative z-10">
                  {entries.some((e: any) => e.drawId === upcomingDraws[0].id) ? "DEPLOYED" : "INITIALIZE ENTRY"}
                </span>
                <div className="absolute inset-0 bg-primary-foreground transform scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left opacity-10" />
              </Button>
            </CardFooter>
            <div className="absolute top-0 right-0 w-[60%] h-full bg-primary/20 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/4 transition-opacity duration-1000 group-hover:opacity-40 pointer-events-none" />
          </Card>

          <Card className="border-none bg-muted/5 shadow-sm rounded-[2.5rem] h-full flex flex-col border-2 border-muted/10 group">
            <CardHeader className="p-10 pb-6">
              <CardTitle className="text-sm font-black italic flex items-center gap-3 uppercase tracking-[0.3em] text-muted-foreground/60">
                <Ticket className="h-5 w-5 text-primary" /> Qualification Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-10 p-10 pt-6 flex-1">
              <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-muted/10 pb-4">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    Network Stake
                  </span>
                  {dashboard?.subscription ? (
                    <Badge className="bg-primary/20 text-primary border-none px-4 py-1 font-black text-[10px] uppercase italic tracking-widest">
                      ESTABLISHED
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="font-black text-[10px] uppercase tracking-widest px-4 py-1">
                      DISCONNECTED
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between border-b border-muted/10 pb-4">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    Temporal Load
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-black italic text-2xl tracking-tighter">
                      {dashboard?.scores.active.length || 0}
                    </span>
                    <span className="text-[10px] text-muted-foreground/40 font-black uppercase tracking-widest">
                      / 5 DATA
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    Current Seed
                  </span>
                  <span className="font-black italic text-4xl tracking-tighter text-primary">
                    {dashboard?.scores.average || "0.00"}
                  </span>
                </div>
              </div>

              <div className="bg-background p-6 rounded-3xl border-2 border-dashed border-muted/20 relative overflow-hidden">
                <p className="text-[10px] font-bold text-muted-foreground/60 leading-relaxed italic uppercase tracking-tighter relative z-10 text-center">
                  "Efficiency is the byproduct of discipline. Rebuild your handicaps to optimize your draw weight."
                </p>
                <div className="absolute top-0 left-0 w-full h-1 bg-primary transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
              </div>
            </CardContent>
            <CardFooter className="p-10 pt-0">
              <Link href="/dashboard/scores" className="w-full">
                <Button
                  variant="outline"
                  className="w-full gap-3 font-black text-xs uppercase tracking-[0.2em] border-2 h-14 rounded-2xl group transition-all hover:bg-primary/5 hover:border-primary/30"
                >
                  <TrendingUp className="h-4 w-4 text-primary group-hover:scale-125 transition-transform" /> OPTIMIZE
                  RECOGNITION
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Participation History */}
      <div className="space-y-10 pt-8">
        <h2 className="text-sm font-black italic tracking-[0.3em] uppercase text-muted-foreground flex items-center gap-3">
          <HistoryIcon className="h-5 w-5 text-primary opacity-50" /> ARCHIVAL PERFORMANCE REGISTRY
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pastDraws.length > 0 ? (
            pastDraws.map((draw) => {
              const entry = entries.find((e: any) => e.drawId === draw.id);
              return (
                <Card
                  key={draw.id}
                  className="group overflow-hidden border-none shadow-lg bg-background rounded-3xl transition-all hover:shadow-xl hover:-translate-y-1 relative"
                >
                  <CardHeader className="bg-muted/5 pb-8 p-10 transition-colors group-hover:bg-muted/10 border-b border-muted/10">
                    <div className="flex items-center justify-between mb-6">
                      <CardTitle className="text-3xl font-black italic tracking-tighter uppercase">
                        {new Intl.DateTimeFormat("en-US", { month: "short" }).format(new Date(0, draw.month - 1))}
                        <span className="text-primary font-black ml-2">{draw.year}</span>
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className="text-[8px] h-4 font-black px-2 border-muted-foreground/20 uppercase tracking-widest"
                      >
                        {draw.status}
                      </Badge>
                    </div>
                    <div className="flex items-baseline gap-2 text-4xl font-black text-foreground leading-none tracking-tighter uppercase italic">
                      <span className="text-primary not-italic text-2xl font-bold">$</span>
                      {draw.prizePool.toLocaleString()}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-10 p-10 bg-background relative z-10">
                    {entry ? (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-muted/5 pb-4">
                          <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">
                            ENTRY SEED
                          </span>
                          <span className="font-black italic text-2xl tracking-tighter group-hover:text-primary transition-colors">
                            {entry.entryScore}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">
                            AUDIT STATE
                          </span>
                          <span className="text-primary font-black text-[10px] uppercase italic flex items-center gap-2 tracking-widest bg-primary/10 px-3 py-1 rounded-full">
                            <CheckCircle2 className="h-3.5 w-3.5 stroke-[3px]" /> VERIFIED
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 bg-muted/5 text-muted-foreground/30 italic text-[10px] font-black uppercase tracking-[0.2em] border-2 border-dashed border-muted/10 rounded-2xl">
                        NODE INACTIVE DURING CALL
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="border-t border-muted/5 bg-muted/5 p-0">
                    <Button
                      variant="ghost"
                      className="w-full h-16 rounded-none gap-3 font-black text-[10px] uppercase tracking-[0.3em] group-hover:bg-primary/5 transition-all text-muted-foreground/70 hover:text-primary"
                    >
                      AUDIT FULL RESULTS{" "}
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                    </Button>
                  </CardFooter>
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl -mb-12 -mr-12 group-hover:bg-primary/10 transition-colors" />
                </Card>
              );
            })
          ) : (
            <div className="col-span-full py-32 text-center border-2 border-dashed rounded-[2.5rem] bg-muted/5 border-muted/20">
              <div className="h-16 w-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <HistoryIcon className="h-8 w-8 text-muted-foreground/40 animate-pulse" />
              </div>
              <p className="text-muted-foreground/40 font-black uppercase tracking-[0.4em] italic text-xs">
                Archival history loading...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
