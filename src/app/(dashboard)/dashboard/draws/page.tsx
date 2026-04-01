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
  History as HistoryIcon,
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
      <div className="space-y-6 animate-in fade-in duration-500">
        <Skeleton className="h-48 w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const upcomingDraws = draws?.filter((d) => d.status === "OPEN") || [];
  const pastDraws = draws?.filter((d) => d.status !== "OPEN") || [];
  const entries = dashboard?.draws.entries || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Competitions</h1>
        <p className="text-muted-foreground mt-1 text-sm font-medium">Verify your eligibility and enter active prize cycles.</p>
      </div>

      {upcomingDraws.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-3 overflow-hidden border shadow-sm rounded-xl">
            <CardHeader className="bg-muted/10 pb-6 border-b">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-primary text-primary-foreground font-bold text-[10px] uppercase px-2 h-5">Live Now</Badge>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Ends Soon
                    </span>
                  </div>
                  <CardTitle className="text-3xl font-bold">
                    {new Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date(0, upcomingDraws[0].month - 1))}
                    <span className="text-primary ml-2 uppercase opacity-80">{upcomingDraws[0].year}</span>
                  </CardTitle>
                  <CardDescription className="text-sm font-medium">Active recovery fund distribution cycle.</CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Prize Pool</p>
                  <div className="text-4xl font-bold text-primary tracking-tight">&#8377;{upcomingDraws[0].prizePool}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/20 border flex flex-col justify-center">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Entry Protocol</p>
                  <p className="font-semibold text-sm">
                    {upcomingDraws[0].drawType === "ALGORITHM" ? "Performance Weighted" : "Random Selection"}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/20 border flex flex-col justify-center">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">Total Entries</p>
                  <p className="font-semibold text-sm">
                    {upcomingDraws[0]._count?.entries || 0} Registered Competitors
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/5 border-t py-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm">
                {entries.some((e: any) => e.drawId === upcomingDraws[0].id) ? (
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest">
                    <CheckCircle2 className="h-4 w-4" /> Participation Verified
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase">
                    <Info className="h-4 w-4" /> Entry requires active stake
                  </div>
                )}
              </div>
              <Button
                size="sm"
                className="w-full sm:w-auto font-bold rounded-lg px-8 h-9"
                disabled={entries.some((e: any) => e.drawId === upcomingDraws[0].id) || enterMutation.isPending}
                onClick={() => enterMutation.mutate(upcomingDraws[0].id)}
              >
                {entries.some((e: any) => e.drawId === upcomingDraws[0].id) ? "Successfully Entered" : "Enter Competition"}
              </Button>
            </CardFooter>
          </Card>

          <Card className="rounded-xl border shadow-sm bg-muted/5 flex flex-col">
            <CardHeader className="pb-4">
              <CardTitle className="text-xs font-bold flex items-center gap-2 uppercase tracking-widest text-muted-foreground">
                <Ticket className="h-4 w-4 text-primary" /> Status Audit
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 flex-1">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground font-medium">Monthly Stake</span>
                  {dashboard?.subscription ? (
                    <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-100 text-[9px] font-bold uppercase">Active</Badge>
                  ) : (
                    <Badge variant="outline" className="text-[9px] font-bold uppercase text-red-500 border-red-100 bg-red-50/50">Missing</Badge>
                  )}
                </div>
                <Separator />
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground font-medium">Verified Scores</span>
                  <span className="font-bold">{dashboard?.scores.active.length || 0} / 5</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground font-medium">Ref Seed</span>
                  <span className="font-bold text-primary">{dashboard?.scores.average || "0.00"}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2 pb-6 px-6">
              <Button variant="outline" size="sm" className="w-full text-xs font-bold rounded-lg border-primary/20 hover:bg-primary/5 text-primary" asChild>
                <Link href="/dashboard/scores">Log Round</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      <div className="space-y-4 pt-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <HistoryIcon className="h-4 w-4" /> Performance History
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastDraws.length > 0 ? (
            pastDraws.map((draw) => {
              const entry = entries.find((e: any) => e.drawId === draw.id);
              return (
                <Card key={draw.id} className="overflow-hidden border shadow-sm rounded-xl group transition-all hover:border-primary/20">
                  <CardHeader className="bg-muted/10 pb-4 border-b">
                    <div className="flex items-center justify-between mb-1">
                      <CardTitle className="text-lg font-bold">
                        {new Intl.DateTimeFormat("en-US", { month: "short" }).format(new Date(0, draw.month - 1))}
                        <span className="text-primary ml-1.5">{draw.year}</span>
                      </CardTitle>
                      <Badge variant="outline" className="text-[9px] h-4 font-bold border-muted-foreground/20 leading-none">
                        {draw.status}
                      </Badge>
                    </div>
                    <p className="text-xl font-bold text-foreground tracking-tight">&#8377;{draw.prizePool.toLocaleString()}</p>
                  </CardHeader>
                  <CardContent className="py-4">
                    {entry ? (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground font-medium">Logged Seed</span>
                        <span className="font-bold text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10">{entry.entryScore}</span>
                      </div>
                    ) : (
                      <div className="py-2 text-center text-[10px] text-muted-foreground/40 font-bold uppercase tracking-widest border border-dashed rounded-md bg-muted/5">
                        No Participation
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-0 pb-6 px-6">
                    <Button variant="ghost" size="sm" className="w-full h-8 text-[10px] font-bold uppercase tracking-widest gap-2 bg-muted/30 hover:bg-primary/10 hover:text-primary transition-all">
                      Audit Results <ArrowRight className="h-3 w-3" />
                    </Button>
                  </CardFooter>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full py-16 text-center border-2 border-dashed rounded-xl bg-muted/5">
              <HistoryIcon className="h-8 w-8 text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-muted-foreground font-semibold text-xs uppercase tracking-widest opacity-40">History Loading...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
