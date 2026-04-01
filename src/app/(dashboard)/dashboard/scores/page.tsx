"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Trophy,
  History,
  Plus,
  ArrowUpRight,
  Calendar,
  ChevronRight,
  Target,
  CircleHelp,
  BarChart4,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { scoreFetchers } from "@/fetchers/score";
import { dashboardFetchers } from "@/fetchers/dashboard";

const scoreSchema = z.object({
  score: z.coerce.number().min(0, "Minimum score is 0.").max(50, "Maximum score is 50."),
  courseName: z.string().min(2, "Course name is required"),
  playedAt: z.string().min(1, "Date is required"),
});

export default function GolfScoresPage() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const { data: dashboard, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: dashboardFetchers.get,
    staleTime: 1000 * 60 * 5, // 5 min
  });

  const form = useForm<z.infer<typeof scoreSchema>>({
    resolver: zodResolver(scoreSchema),
    defaultValues: {
      score: 12,
      courseName: "",
      playedAt: new Date().toISOString().split("T")[0],
    },
  });

  const createMutation = useMutation({
    mutationFn: scoreFetchers.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Round logged successfully!");
      setIsOpen(false);
      form.reset();
    },
    onError: (err: any) => toast.error(err.message || "Failed to log round"),
  });

  const deleteMutation = useMutation({
    mutationFn: scoreFetchers.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Round removed");
    },
  });

  function onSubmit(values: z.infer<typeof scoreSchema>) {
    createMutation.mutate(values);
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-20 w-48 rounded-full" />
        <Skeleton className="h-64 w-full rounded-3xl" />
        <Skeleton className="h-96 w-full rounded-3xl" />
      </div>
    );
  }

  const activeScores = dashboard?.scores.active || [];
  const recentScores = dashboard?.scores.recent || [];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight underline decoration-primary/20 decoration-4 underline-offset-8">
            Your Performance
          </h1>
          <p className="text-muted-foreground mt-4 font-medium">Refine your game, maximize your charitable impact.</p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="">
              <Plus className="h-5 w-5" /> Log New Round
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-112.5 rounded-3xl">
            <DialogHeader>
              <DialogTitle className="tracking-tighter">New Round</DialogTitle>
              <DialogDescription className="">
                Submit your gross score to update your rolling average. 5 scores are required for full drawdown
                eligibility.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="score">Gross Score</Label>
                <Input id="score" type="number" {...form.register("score")} className="bg-muted/30" />
                {form.formState.errors.score && (
                  <p className="text-xs text-destructive font-bold">{form.formState.errors.score.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="courseName">Course Name</Label>
                <Input id="courseName" {...form.register("courseName")} placeholder="e.g. St Andrews Links" />
                {form.formState.errors.courseName && (
                  <p className="text-xs text-destructive font-bold">{form.formState.errors.courseName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="playedAt">Played On</Label>
                <Input id="playedAt" type="date" {...form.register("playedAt")} />
                {form.formState.errors.playedAt && (
                  <p className="text-xs text-destructive font-bold">{form.formState.errors.playedAt.message}</p>
                )}
              </div>
              <DialogFooter className="pt-4">
                <Button
                  type="submit"
                  className="w-full shadow-xl shadow-primary/10"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? "PROCESSING..." : "COMMIT SCORE"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Rolling Average Card */}
        <Card className="border-none bg-foreground text-background shadow-2xl relative overflow-hidden group rounded-3xl">
          <CardHeader className="relative z-10">
            <CardTitle className="text-background/40 uppercase tracking-[0.2em] text-[10px] font-black flex items-center gap-2">
              <BarChart4 className="h-3 w-3 text-primary" /> Rolling Average (Last 5)
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 pt-0">
            <div className="flex items-baseline gap-2">
              <span className="text-8xl font-black tracking-tighter group-hover:scale-105 transition-transform duration-700">
                {dashboard?.scores.average || 0}
              </span>
              <span className="text-background/20 font-black uppercase tracking-widest text-xs">Strokes</span>
            </div>
            <div className="mt-10 space-y-4">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="text-background/40">Eligibility Protocol</span>
                <Badge
                  variant={activeScores.length >= 5 ? "secondary" : "outline"}
                  className="px-3 h-5 border-background/10 bg-background/5 text-background font-black text-[9px] uppercase tracking-tighter"
                >
                  {activeScores.length >= 5 ? "FULLY QUALIFIED" : `${activeScores.length} / 5 DATA POINTS`}
                </Badge>
              </div>
              <div className="w-full bg-background/10 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-1000 ease-in-out"
                  style={{ width: `${Math.min((activeScores.length / 5) * 100, 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 transition-opacity group-hover:opacity-40" />
        </Card>

        {/* Explainer / Logic */}
        <Card className="lg:col-span-2 border-none shadow-sm bg-background border-l-8 border-primary rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-black uppercase tracking-tight text-xl">
              Governance & Logic
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4 p-6 rounded-2xl bg-muted/20 hover:bg-muted/30 transition-colors border group">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black group-hover:rotate-12 transition-transform">
                1
              </div>
              <div>
                <p className="font-black text-sm uppercase tracking-tight">Rolling 5 Logic</p>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed font-medium">
                  Your draw weight is computed from your 5 most recent rounds. This protocol ensures competitive balance
                  across the network.
                </p>
              </div>
            </div>
            <div className="flex gap-4 p-6 rounded-2xl bg-muted/20 hover:bg-muted/30 transition-colors border group">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black group-hover:rotate-12 transition-transform">
                2
              </div>
              <div>
                <p className="font-black text-sm uppercase tracking-tight">Identity Audit</p>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed font-medium">
                  Platform winners must submit verified scorecard data from club systems or recognized handicap
                  applications to trigger prize funding.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* history */}
      <div className="space-y-6">
        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-muted-foreground flex items-center gap-2">
          <History className="h-4 w-4" /> Temporal Round Registry
        </h2>
        <Card className="border-none shadow-sm overflow-hidden rounded-3xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-black tracking-widest border-b">
                <tr>
                  <th className="px-8 py-5">State</th>
                  <th className="px-8 py-5">Strokes</th>
                  <th className="px-8 py-5">Registry Course</th>
                  <th className="px-8 py-5">Entry Date</th>
                  <th className="px-8 py-5 text-right">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentScores.map((score, index) => {
                  const isActive = index < 5;
                  return (
                    <tr
                      key={score.id}
                      className={cn(
                        "transition-colors group",
                        isActive ? "hover:bg-muted/20" : "opacity-40 hover:opacity-100 bg-muted/5",
                      )}
                    >
                      <td className="px-8 py-6">
                        {isActive ? (
                          <Badge className="bg-primary/20 text-primary border-none text-[10px] font-black h-5 px-3 uppercase tracking-tighter">
                            ACTIVE DATA
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-[10px] font-bold h-5 px-3 uppercase tracking-tighter text-muted-foreground border-muted-foreground/10"
                          >
                            ARCHIVED
                          </Badge>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-2xl font-black tracking-tighter group-hover:text-primary transition-colors">
                          {score.score}
                        </span>
                      </td>
                      <td className="px-8 py-6 font-bold uppercase text-xs tracking-tight">{score.courseName}</td>
                      <td className="px-8 py-6 text-muted-foreground font-medium tabular-nums text-xs">
                        {new Date(score.playedAt).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/20 transition-all"
                          onClick={() => {
                            if (
                              confirm(
                                "DELETE REGISTRY ENTRY: This will permanently remove the data point and recompute your rolling average. Continue?",
                              )
                            ) {
                              deleteMutation.mutate(score.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {!recentScores.length && (
              <div className="py-32 text-center flex flex-col items-center justify-center space-y-6 bg-muted/5">
                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center text-muted-foreground/30">
                  <Target className="h-10 w-10" />
                </div>
                <div>
                  <p className="text-muted-foreground font-black text-xl uppercase tracking-tighter">
                    Empty Performance History
                  </p>
                  <p className="text-xs text-muted-foreground/60 font-medium tracking-wide">
                    Commit your first round score to establish your entry protocols.
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
