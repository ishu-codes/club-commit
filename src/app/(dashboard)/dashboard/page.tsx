"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Trophy, TrendingUp, Award, Heart, ChevronRight, ArrowUpRight, Ticket } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { dashboardFetchers } from "@/fetchers/dashboard";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: dashboardFetchers.get,
    staleTime: 1000 * 60 * 5, // 5 min
  });
  const { data: session } = useSession();

  if (isLoading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="lg:col-span-2 h-100 rounded-2xl" />
          <Skeleton className="h-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  const stats = [
    { name: "Rolling Average", value: dashboard?.scores.average || 0, icon: TrendingUp, color: "text-primary" },
    { name: "Total Winnings", value: `$${dashboard?.winnings.totalWon || 0}`, icon: Award, color: "text-chart-4" },
    { name: "Active Draws", value: dashboard?.draws.upcoming.length || 0, icon: Trophy, color: "text-primary" },
    {
      name: "Charity Impact",
      value: dashboard?.subscription ? "Subscribed" : "None",
      icon: Heart,
      color: "text-destructive",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Welcome back, {session?.user.name.split(" ")[0] ?? "Player"}
        </h1>
        <p className="text-muted-foreground mt-1">Here&apos;s your personal impact and performance summary.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm transition-all hover:shadow-md group">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 text-muted-foreground uppercase tracking-widest text-[10px] font-bold">
              <span>{stat.name}</span>
              <stat.icon className={cn("h-4 w-4 transition-transform group-hover:scale-110", stat.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold tabular-nums">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Scores */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl">Recent Rounds</CardTitle>
              <CardDescription>Your last 5 attempts at greatness</CardDescription>
            </div>
            <Link href="/dashboard/scores">
              <Button variant="ghost" size="sm" className="gap-1 text-primary">
                View All <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboard?.scores.recent.length ? (
                dashboard.scores.recent.slice(0, 5).map((score) => (
                  <div
                    key={score.id}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-accent/50 transition-colors border group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-black text-primary">
                        {score.score}
                      </div>
                      <div>
                        <p className="font-bold">{score.courseName}</p>
                        <p className="text-xs text-muted-foreground">{new Date(score.playedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                  </div>
                ))
              ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-2xl bg-muted/20">
                  <p className="text-muted-foreground">No rounds logged yet. Hit the links!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Side Widgets */}
        <div className="space-y-8">
          {/* Draw Widget */}
          <Card className="bg-accent-foreground text-background border-none shadow-xl overflow-hidden relative group">
            <CardHeader className="pb-2 relative z-10">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Ticket className="h-5 w-5 text-primary" /> Monthly Draw
              </CardTitle>
              <CardDescription className="text-background/60">
                Next draw in {dashboard?.draws.upcoming[0]?.month || 0} months
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-primary">
                  ${dashboard?.draws.upcoming[0]?.prizePool || 0}
                </span>
                <span className="text-background/40 font-bold text-xs uppercase tracking-tighter">Prize Pool</span>
              </div>
              <Separator className="bg-background/10" />
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-background/40">Eligibility</span>
                  <Badge
                    variant={dashboard?.subscription ? "secondary" : "destructive"}
                    className="text-[10px] uppercase font-black"
                  >
                    {dashboard?.subscription ? "Qualified" : "Missing"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-background/40">Total Entries</span>
                  <span className="font-black text-background/80">
                    {dashboard?.draws.upcoming[0]?._count?.entries || 0} Participating
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="relative z-10 pt-0">
              <Link href="/dashboard/draws" className="w-full">
                <Button className="w-full bg-background text-foreground hover:bg-background/90 font-bold border-none">
                  Enter Monthly Draw
                </Button>
              </Link>
            </CardFooter>
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 transition-all group-hover:bg-primary/40" />
          </Card>

          {/* Impact Summary */}
          <Card className="border-none shadow-sm bg-linear-to-br from-destructive/5 to-transparent border-l-4 border-destructive">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Heart className="h-5 w-5 text-destructive" /> Your Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium text-foreground/80">
                {dashboard?.subscription
                  ? `Supporting: ${dashboard.subscription.charity?.name}`
                  : "Join the cause to start making an impact."}
              </p>
              {dashboard?.subscription && (
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Your subscription generates automated donations to verified charity partners every month.
                </p>
              )}
            </CardContent>
            <CardFooter>
              <Link href="/dashboard/charity" className="w-full">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-destructive/20 text-destructive hover:bg-destructive/10 transition-colors"
                >
                  Change Charity
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
