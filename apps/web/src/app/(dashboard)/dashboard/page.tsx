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
      <div className="space-y-6 animate-in fade-in duration-500">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-[400px] rounded-lg" />
          <Skeleton className="h-[400px] rounded-lg" />
        </div>
      </div>
    );
  }

  const stats = [
    { name: "Rolling Average", value: dashboard?.scores.average || 0, icon: TrendingUp, color: "text-primary" },
    {
      name: "Total Winnings",
      value: `₹ ${dashboard?.winnings.totalWon || 0}`,
      icon: Award,
      color: "text-primary",
    },
    { name: "Active Draws", value: dashboard?.draws.upcoming.length || 0, icon: Trophy, color: "text-primary" },
    {
      name: "Status",
      value: dashboard?.subscription ? "Active" : "Inactive",
      icon: Heart,
      color: "text-primary",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {session?.user.name.split(" ")[0] ?? "Player"}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm font-medium">Monitoring your golf journey and impact.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="rounded-xl border shadow-sm group">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{stat.name}</span>
              <stat.icon className={cn("h-4 w-4", stat.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tabular-nums">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 rounded-xl border shadow-sm h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Rounds</CardTitle>
              <CardDescription>Your latest tracked performances</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/scores" className="gap-1.5">
                View All <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {dashboard?.scores.recent.length ? (
                dashboard.scores.recent.slice(0, 5).map((score) => (
                  <div
                    key={score.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm shadow-sm ring-1 ring-primary/20">
                        {score.score}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{score.courseName}</p>
                        <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-tighter">
                          {new Date(score.playedAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                ))
              ) : (
                <div className="text-center py-16 border-2 border-dashed rounded-xl bg-muted/5">
                  <p className="text-sm font-medium text-muted-foreground">No rounds recorded yet.</p>
                  <Button variant="link" size="sm" asChild>
                    <Link href="/dashboard/scores">Log your first score</Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-xl border shadow-sm overflow-hidden bg-muted/5">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Ticket className="h-4 w-4 text-primary" /> Next Draw
                </CardTitle>
                <Badge
                  variant={dashboard?.subscription ? "default" : "outline"}
                  className="text-[10px] font-bold px-2 py-0.5"
                >
                  {dashboard?.subscription ? "QUALIFIED" : "NOT ELIGIBLE"}
                </Badge>
              </div>
              <CardDescription>
                Projected distribution in {dashboard?.draws.upcoming[0]?.month || 0} months
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Prize Pool</p>
                <div className="text-3xl font-bold tracking-tight text-primary">
                  &#8377; {dashboard?.draws.upcoming[0]?.prizePool?.toLocaleString() || 0}
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">Total Competitors</span>
                <span className="font-bold">{dashboard?.draws.upcoming[0]?._count?.entries || 0}</span>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button size="sm" className="w-full rounded-lg h-9 font-bold text-xs" asChild>
                <Link href="/dashboard/draws">Enter Competition</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="rounded-xl border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="h-4 w-4 text-primary" /> My Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm font-semibold leading-relaxed">
                {dashboard?.subscription
                  ? `Supporting: ${dashboard.subscription.charity?.name}`
                  : "Start making an impact today."}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                Your monthly contribution drives verified charitable results through our global network of partners.
              </p>
            </CardContent>
            <CardFooter className="pt-2">
              <Button variant="outline" size="sm" className="w-full text-xs font-bold" asChild>
                <Link href="/dashboard/charity">Update Preference</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
