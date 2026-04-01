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
import { z } from "zod";

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
  score: z.number().min(0, "Minimum score is 0.").max(50, "Maximum score is 50."),
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
      toast.success("Round recorded.");
      setIsOpen(false);
      form.reset();
    },
    onError: (err: any) => toast.error(err.message || "Failed to record round"),
  });

  const deleteMutation = useMutation({
    mutationFn: scoreFetchers.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Entry removed.");
    },
  });

  function onSubmit(values: z.infer<typeof scoreSchema>) {
    createMutation.mutate(values);
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="lg:col-span-2 h-40 rounded-xl" />
        </div>
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  const activeScores = dashboard?.scores.active || [];
  const recentScores = dashboard?.scores.recent || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance Ledger</h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">
            Log rounds and track your rolling average for draw eligibility.
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" /> Log Round
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-106.25 absolute top-1/2 left-1/2 rounded-xl">
            <DialogHeader>
              <DialogTitle>Record Performance</DialogTitle>
              <DialogDescription>
                Input your gross score and course details to update your rolling 5 index.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label
                  htmlFor="score"
                  className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                >
                  Gross Score
                </Label>
                <Input id="score" type="number" {...form.register("score")} className="rounded-lg" />
                {form.formState.errors.score && (
                  <p className="text-[10px] text-destructive font-bold">{form.formState.errors.score.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="courseName"
                  className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                >
                  Course Name
                </Label>
                <Input
                  id="courseName"
                  {...form.register("courseName")}
                  placeholder="e.g. Pinehurst No. 2"
                  className="rounded-lg"
                />
                {form.formState.errors.courseName && (
                  <p className="text-[10px] text-destructive font-bold">{form.formState.errors.courseName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="playedAt"
                  className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                >
                  Date Played
                </Label>
                <Input id="playedAt" type="date" {...form.register("playedAt")} className="rounded-lg" />
                {form.formState.errors.playedAt && (
                  <p className="text-[10px] text-destructive font-bold">{form.formState.errors.playedAt.message}</p>
                )}
              </div>
              <DialogFooter className="pt-2">
                <Button type="submit" className="w-full rounded-lg" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Recording..." : "Sync Score"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="rounded-xl border shadow-sm group">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold flex items-center gap-2 uppercase tracking-widest text-muted-foreground">
              <BarChart4 className="h-4 w-4 text-primary" /> Rolling Index
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-extrabold tracking-tight">{dashboard?.scores.average || 0}</span>
              <span className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">Strokes</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                <span className="text-muted-foreground">Protocol Load</span>
                <span className={cn("font-bold", activeScores.length >= 5 ? "text-emerald-600" : "text-primary")}>
                  {activeScores.length >= 5 ? "Qualified" : `${activeScores.length} / 5 Logged`}
                </span>
              </div>
              <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-700"
                  style={{ width: `${Math.min((activeScores.length / 5) * 100, 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 rounded-xl border shadow-sm bg-muted/5">
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
            <div className="flex gap-4">
              <div className="h-9 w-9 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs ring-1 ring-primary/20">
                1
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-widest">Rolling Logic</p>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  Your draw weight is derived from your 5 most recently logged performances.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="h-9 w-9 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs ring-1 ring-primary/20">
                2
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-widest">Registry Sync</p>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  Winners must provide verifiable scorecards from registered club systems or handicap mobile
                  applications.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          <History className="h-4 w-4" /> Round Logs
        </h2>
        <Card className="rounded-xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/30 text-muted-foreground uppercase text-[10px] font-semibold tracking-widest border-b">
                <tr>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Score</th>
                  <th className="px-6 py-3">Course Registry</th>
                  <th className="px-6 py-3 text-right">Settled</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y relative">
                {recentScores.map((score, index) => {
                  const isActive = index < 5;
                  return (
                    <tr
                      key={score.id}
                      className={cn(
                        "transition-colors",
                        isActive ? "hover:bg-muted/5 font-medium" : "opacity-40 grayscale",
                      )}
                    >
                      <td className="px-6 py-4">
                        <Badge
                          variant={isActive ? "default" : "outline"}
                          className="text-[9px] font-bold h-4 px-1.5 uppercase leading-none border-none"
                        >
                          {isActive ? "Active" : "Archived"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xl font-bold tabular-nums">{score.score}</span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-xs truncate max-w-[200px] uppercase tracking-tight">
                        {score.courseName}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-xs text-right font-medium">
                        {new Date(score.playedAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-md hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => {
                            if (confirm("Delete round record? This will recompute your rolling average index.")) {
                              deleteMutation.mutate(score.id);
                            }
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {!recentScores.length && (
              <div className="py-24 text-center">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-muted mb-4">
                  <Target className="h-6 w-6 text-muted-foreground/40" />
                </div>
                <h3 className="text-lg font-semibold">No rounds recorded</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-4">
                  You need to log your golf scores here to begin tracking your rolling 5 index.
                </p>
                <Button size="sm" variant="outline" onClick={() => setIsOpen(true)}>
                  Log your first score
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
