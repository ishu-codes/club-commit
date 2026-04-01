"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Users,
  TrendingUp,
  Heart,
  Trophy,
  Activity,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  Target,
  DollarSign,
  ChevronRight,
  TrendingDown,
  LayoutGrid,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { adminFetchers } from "@/fetchers/admin";

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: adminFetchers.stats,
    staleTime: 1000 * 60 * 5, // 5 min
  });

  if (isLoading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <Skeleton className="h-12 w-64 rounded-full" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-3xl" />
          ))}
        </div>
        <Skeleton className="h-[400px] w-full rounded-3xl" />
      </div>
    );
  }

  const statCards = [
    {
      label: "Committed Members",
      value: stats?.users?.total || 0,
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10",
      trend: "+12%",
    },
    {
      label: "Platform Stakes",
      value: `$${(stats?.subscriptions?.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: "text-primary",
      bg: "bg-primary/10",
      trend: "+8%",
    },
    {
      label: "Strategic Partners",
      value: stats?.charities?.total || 0,
      icon: Heart,
      color: "text-primary",
      bg: "bg-primary/10",
      trend: "Balanced",
    },
    {
      label: "Capital Distributed",
      value: `$${(stats?.winners?.totalPaid || 0).toLocaleString()}`,
      icon: Trophy,
      color: "text-primary",
      bg: "bg-primary/10",
      trend: "+24%",
    },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 slide-in-from-bottom-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase leading-none underline decoration-primary/20 decoration-8 underline-offset-[12px]">
            OPERATIONAL Hub
          </h1>
          <p className="text-muted-foreground mt-8 font-medium text-lg opacity-80">
            Real-time terminal for platform performance and member commitment forensics.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-muted/30 p-3 rounded-[2rem] border-2 border-muted/20 shadow-xl backdrop-blur-md">
          <div className="px-6 py-1 flex flex-col justify-center border-r border-muted-foreground/10">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] leading-none mb-2">
              SYSTEM STATUS
            </span>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
              <span className="text-xs font-black text-foreground tracking-widest uppercase">OPTIMIZED</span>
            </div>
          </div>
          <Button className="bg-foreground text-background hover:bg-foreground/90 font-black text-xs h-12 px-8 rounded-2xl shadow-lg transition-all active:scale-95 uppercase tracking-widest">
            <Zap className="h-4 w-4 mr-2 fill-current" /> Initialize Data Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statCards.map((card, i) => (
          <Card
            key={i}
            className="border-none shadow-sm rounded-[2rem] bg-background border-2 border-muted/5 group hover:border-primary/20 transition-all hover:-translate-y-2 hover:shadow-2xl"
          >
            <CardHeader className="p-8 pb-4">
              <div
                className={cn(
                  "h-14 w-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:rotate-12",
                  card.bg,
                )}
              >
                <card.icon className={cn("h-8 w-8", card.color)} />
              </div>
              <CardTitle className="text-muted-foreground font-black uppercase text-[10px] tracking-[0.3em]">
                {card.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-4xl font-black tracking-tighter uppercase">{card.value}</p>
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary border-none font-black text-[10px] px-3 py-1 rounded-full"
                >
                  {card.trend}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Target Progress */}
        <Card className="lg:col-span-2 border-none shadow-lg rounded-[2.5rem] bg-background border-2 border-muted/10 flex flex-col overflow-hidden relative">
          <CardHeader className="p-12 pb-6 relative z-10">
            <div className="flex items-center justify-between mb-8">
              <Badge className="bg-foreground text-background font-black text-[10px] uppercase tracking-[0.2em] border-none px-5 py-2 rounded-full">
                MISSION IMPACT PROTOCOL
              </Badge>
              <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-5xl font-black tracking-tighter uppercase leading-none">
              Scalability Baseline
            </CardTitle>
            <CardDescription className="text-lg font-medium mt-4">
              Targeting $250,000 in total strategic capital distribution by YE2026.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-12 pt-0 flex-1 flex flex-col justify-center space-y-12 relative z-10">
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">
                    RECOVERED CAPITAL
                  </p>
                  <p className="text-7xl font-black text-primary leading-none tracking-tighter">
                    ${(stats?.winners?.totalPaid || 0).toLocaleString()}
                  </p>
                </div>
                <div className="text-right space-y-2">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">
                    MISSION DELTA
                  </p>
                  <p className="text-3xl font-black text-muted-foreground leading-none tracking-tighter opacity-40">
                    ${(250000 - (stats?.winners?.totalPaid || 0)).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="relative">
                <Progress
                  value={((stats?.winners?.totalPaid || 0) / 250000) * 100}
                  className="h-6 rounded-full bg-muted/20"
                />
                <div className="absolute inset-0 bg-primary/5 rounded-full animate-pulse pointer-events-none" />
              </div>
              <div className="flex justify-between text-[10px] font-black text-muted-foreground/40 tracking-[0.4em] uppercase">
                <span>INITIAL OPS (0%)</span>
                <span>TERMINAL OBJECTIVE (100%)</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-12 pt-0 relative z-10">
            <Button
              variant="outline"
              className="w-full h-16 rounded-2xl font-black border-2 border-muted/10 hover:bg-foreground hover:text-background hover:border-foreground tracking-widest gap-3 transition-all uppercase text-xs"
            >
              GENERATE FULL PERFORMANCE AUDIT <BarChart3 className="h-5 w-5" />
            </Button>
          </CardFooter>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -mb-48 -mr-48 pointer-events-none" />
        </Card>

        {/* Strategic Distribution Breakdown */}
        <Card className="border-none shadow-2xl rounded-[2.5rem] bg-foreground text-background overflow-hidden relative group">
          <CardHeader className="p-10 relative z-10">
            <CardTitle className="text-background/40 font-black uppercase text-[10px] tracking-[0.3em] mb-4">
              Capital Allocation Logic
            </CardTitle>
            <h3 className="text-3xl font-black tracking-tighter uppercase leading-[1.1]">
              STRATEGIC EQUITY DISTRIBUTION
            </h3>
          </CardHeader>
          <CardContent className="p-10 pt-0 relative z-10 space-y-10">
            <div className="space-y-8">
              {[
                { label: "Medical Infrastructure", percent: 42, color: "bg-primary" },
                { label: "Environmental Recovery", percent: 28, color: "bg-primary" },
                { label: "Civic Alignment", percent: 20, color: "bg-primary" },
                { label: "Operational Surplus", percent: 10, color: "bg-primary/40" },
              ].map((item, i) => (
                <div key={i} className="space-y-3 group/item">
                  <div className="flex justify-between items-end">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-background/60 group-hover/item:text-background transition-colors">
                      {item.label}
                    </p>
                    <p className="text-2xl font-black leading-none tracking-tighter">{item.percent}%</p>
                  </div>
                  <div className="h-2 w-full bg-background/10 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-1000 ease-out group-hover:opacity-80",
                        item.color,
                      )}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-[100px] transition-opacity duration-1000 group-hover:opacity-60 pointer-events-none -translate-y-1/2 translate-x-1/2" />
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <Card className="border-none shadow-sm rounded-[2rem] bg-background border-2 border-muted/10 overflow-hidden relative group">
          <CardHeader className="p-10 relative z-10">
            <CardTitle className="text-2xl font-black flex items-center gap-4 uppercase tracking-tighter">
              <div className="h-12 w-12 bg-primary/10 rounded-[1rem] flex items-center justify-center transition-transform group-hover:rotate-12">
                <Users className="h-7 w-7 text-primary" />
              </div>
              Identity Registry
            </CardTitle>
            <CardDescription className="text-base font-medium mt-2">
              Manage member profiles and clearance levels.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-10 pt-0 relative z-10">
            <p className="text-sm font-medium text-muted-foreground mb-10 leading-relaxed border-l-4 border-primary/20 pl-6">
              Terminal oversight of {stats?.users?.total || 0} active nodes and {stats?.users?.totalAdmins || 0} system
              administrators with full write-access.
            </p>
            <Button
              className="w-full bg-foreground text-background hover:bg-primary hover:text-primary-foreground rounded-2xl h-16 font-black text-sm uppercase tracking-widest gap-3 shadow-xl transition-all"
              onClick={() => (window.location.href = "/admin/users")}
            >
              ACCESS DATA REPOSITORY <ArrowUpRight className="h-5 w-5" />
            </Button>
          </CardContent>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
        </Card>

        <Card className="border-none shadow-sm rounded-[2rem] bg-background border-2 border-muted/10 overflow-hidden relative group">
          <CardHeader className="p-10 relative z-10">
            <CardTitle className="text-2xl font-black flex items-center gap-4 uppercase tracking-tighter">
              <div className="h-12 w-12 bg-primary/10 rounded-[1rem] flex items-center justify-center transition-transform group-hover:rotate-12">
                <LayoutGrid className="h-7 w-7 text-primary" />
              </div>
              Strategic Partners
            </CardTitle>
            <CardDescription className="text-base font-medium mt-2">
              Audit performance of charitable delivery targets.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-10 pt-0 relative z-10">
            <p className="text-sm font-medium text-muted-foreground mb-10 leading-relaxed border-l-4 border-primary/20 pl-6">
              Monitoring {stats?.charities?.total || 0} high-impact endpoints with established distribution protocols
              and verified impact telemetry.
            </p>
            <Button
              variant="outline"
              className="w-full rounded-2xl h-16 font-black text-sm uppercase tracking-widest gap-3 border-2 border-muted/10 hover:border-primary hover:bg-primary/5 hover:text-primary transition-all shadow-sm"
              onClick={() => (window.location.href = "/admin/charities")}
            >
              PARTNER ANALYTICS <ArrowUpRight className="h-5 w-5" />
            </Button>
          </CardContent>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
        </Card>
      </div>
    </div>
  );
}
