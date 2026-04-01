"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Trophy,
  Plus,
  Play,
  History,
  Users,
  Calendar,
  Ticket,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Clock,
  ArrowRight,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { drawFetchers } from "@/fetchers/draw";

const drawSchema = z.object({
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(2024).max(2030),
  drawType: z.enum(["ALGORITHM", "RANDOM"]),
});

export default function AdminDrawsPage() {
  const queryClient = useQueryClient();
  const [isAddOpen, setIsAddOpen] = useState(false);

  const { data: draws, isLoading } = useQuery({
    queryKey: ["admin", "draws"],
    queryFn: () => drawFetchers.list(),
    staleTime: 1000 * 60 * 5, // 5 min
  });

  const form = useForm<z.infer<typeof drawSchema>>({
    resolver: zodResolver(drawSchema),
    defaultValues: {
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      drawType: "ALGORITHM",
    },
  });

  const createMutation = useMutation({
    mutationFn: drawFetchers.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "draws"] });
      toast.success("Draw scheduled successfully.");
      setIsAddOpen(false);
      form.reset();
    },
    onError: (err: any) => toast.error(err.message || "Failed to schedule draw"),
  });

  const runMutation = useMutation({
    mutationFn: drawFetchers.run,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "draws"] });
      toast.success(`Draw executed! Winner selected.`);
    },
    onError: (err: any) => toast.error(err.message || "Execution failed"),
  });

  if (isLoading) {
    return (
      <div className="space-y-12 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
          <Skeleton className="h-12 w-96 rounded-full" />
          <Skeleton className="h-14 w-48 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-[400px] rounded-[2.5rem]" />
          <Skeleton className="h-[400px] rounded-[2.5rem]" />
        </div>
      </div>
    );
  }

  const openDraws = draws?.filter((d) => d.status === "OPEN") || [];
  const completedDraws = draws?.filter((d) => d.status === "COMPLETED") || [];

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight underline decoration-primary/20 decoration-4 underline-offset-8">
            Cycle Control Center
          </h1>
          <p className="text-muted-foreground mt-4 font-medium">
            Orchestration terminal for monthly prize pool distribution protocols.
          </p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-2xl px-10 shadow-xl shadow-primary/20 hover:shadow-primary/40 gap-3 font-black h-14 text-sm tracking-tight">
              <Plus className="h-5 w-5" /> INITIALIZE NEW CYCLE
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl">
            <DialogHeader className="bg-foreground text-background p-10">
              <DialogTitle className="text-3xl font-black uppercase tracking-tight">PARAMETRIC SETUP</DialogTitle>
              <DialogDescription className="text-background/60 font-medium text-lg mt-2">
                Configure a future prize cycle with performance-weighted logic.
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={form.handleSubmit((v) => createMutation.mutate(v as any))}
              className="p-10 space-y-8 bg-background"
            >
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                    RECOVERY MONTH
                  </Label>
                  <Input
                    type="number"
                    {...form.register("month")}
                    className="h-14 text-xl font-black rounded-2xl bg-muted/20 border-none"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                    RECOVERY YEAR
                  </Label>
                  <Input
                    type="number"
                    {...form.register("year")}
                    className="h-14 text-xl font-black rounded-2xl bg-muted/20 border-none"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                  SELECTION PROTOCOL
                </Label>
                <Select
                  onValueChange={(v) => form.setValue("drawType", v as any)}
                  defaultValue={form.getValues("drawType")}
                >
                  <SelectTrigger className="h-14 text-sm font-black rounded-2xl bg-muted/20 border-none uppercase tracking-widest px-6">
                    <SelectValue placeholder="Protocol Variant" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-muted/50 p-2">
                    <SelectItem
                      value="ALGORITHM"
                      className="font-black text-[10px] uppercase tracking-widest py-3 hover:bg-primary/5 cursor-pointer rounded-xl"
                    >
                      ALGORITHM (SCORE-WEIGHTED)
                    </SelectItem>
                    <SelectItem
                      value="RANDOM"
                      className="font-black text-[10px] uppercase tracking-widest py-3 hover:bg-primary/5 cursor-pointer rounded-xl"
                    >
                      RANDOM (PARITY BASIS)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-primary/5 p-6 rounded-2xl flex gap-4 text-primary text-[10px] font-black uppercase tracking-widest leading-relaxed border border-primary/10">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>Cycle initialization immediately opens node registration for all qualified global members.</span>
              </div>

              <DialogFooter className="pt-4">
                <Button
                  type="submit"
                  className="w-full h-20 text-2xl font-black rounded-2xl shadow-2xl shadow-primary/20 transition-all hover:scale-[1.01]"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? "COMPILING SYSTEM..." : "DEPLOY CYCLE"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Draws Grid */}
      <div className="space-y-8">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 flex items-center gap-3">
          <Clock className="h-4 w-4 text-primary opacity-50" /> ACTIVE RECOVERY PROTOCOLS
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {openDraws.length ? (
            openDraws.map((draw) => (
              <Card
                key={draw.id}
                className="border-none shadow-2xl overflow-hidden rounded-[2.5rem] bg-foreground text-background group relative"
              >
                <CardHeader className="p-10 pb-6 relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <Badge className="bg-primary text-primary-foreground border-none font-black text-[10px] px-4 py-1.5 uppercase tracking-widest rounded-full">
                      REGISTRATION LIVE
                    </Badge>
                    <p className="text-background/40 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                      <Calendar className="h-4 w-4" />{" "}
                      {new Date(0, draw.month - 1).toLocaleString("default", { month: "long" })} {draw.year}
                    </p>
                  </div>
                  <CardTitle className="text-5xl font-black tracking-tighter uppercase leading-none drop-shadow-xl opacity-90">
                    OP-CYCLE #{draw.id.slice(-4).toUpperCase()}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-10 pt-4 space-y-10 relative z-10">
                  <div className="flex items-baseline gap-3">
                    <span className="text-7xl font-black text-primary tracking-tighter">
                      ${draw.prizePool?.toLocaleString() || "---"}
                    </span>
                    <span className="text-background/30 font-black text-[10px] uppercase tracking-[0.2em]">
                      Current Reservoir
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-8 bg-background/5 p-8 rounded-[2rem] border border-background/10 backdrop-blur-sm">
                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-background/30 uppercase tracking-[0.3em]">
                        FIELD OCCUPANCY
                      </p>
                      <p className="text-2xl font-black text-background/80 tracking-tight">
                        {draw._count?.entries || 0} Members Registered
                      </p>
                    </div>
                    <div className="space-y-2 text-right">
                      <p className="text-[10px] font-black text-background/30 uppercase tracking-[0.3em]">
                        ENGINE TYPE
                      </p>
                      <p className="text-2xl font-black text-background/80 tracking-tight">{draw.drawType}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-0 border-t border-background/10 bg-background/5 overflow-hidden">
                  <Button
                    className="w-full h-24 rounded-none text-2xl font-black gap-4 bg-transparent text-background/80 hover:bg-primary hover:text-primary-foreground transition-all border-none"
                    disabled={runMutation.isPending || (draw._count?.entries || 0) === 0}
                    onClick={() => {
                      if (
                        confirm(
                          "INITIALIZE ENGINE EXECUTION: Finalize entries and select winner? This action is terminal.",
                        )
                      ) {
                        runMutation.mutate(draw.id);
                      }
                    }}
                  >
                    <Play className="h-7 w-7 fill-current" />{" "}
                    {runMutation.isPending ? "SYSTEM CALCULATING..." : "TRIGGER RECOVERY ENGINE"}
                  </Button>
                </CardFooter>
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none transition-opacity group-hover:opacity-40" />
              </Card>
            ))
          ) : (
            <div className="col-span-full py-40 text-center border-4 border-dashed rounded-[3rem] bg-muted/5 border-muted/10 group">
              <Trophy className="h-16 w-16 text-muted-foreground/10 mx-auto mb-8 animate-pulse group-hover:text-primary/20 transition-colors" />
              <p className="text-muted-foreground font-black uppercase tracking-[0.3em] text-sm">
                No active registration protocols detected.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* History */}
      <div className="space-y-8">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 flex items-center gap-3">
          <History className="h-4 w-4 text-primary opacity-50" /> ARCHIVAL LEDGER
        </h2>
        <Card className="border-none shadow-sm overflow-hidden rounded-[2rem] bg-background border-2 border-muted/10">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/30 text-muted-foreground uppercase text-[10px] font-black tracking-[0.3em] border-b border-muted/10">
                  <tr>
                    <th className="px-10 py-6">TARGET CYCLE</th>
                    <th className="px-10 py-6">TOTAL RESERVOIR</th>
                    <th className="px-10 py-6">ENGINE OUTCOME</th>
                    <th className="px-10 py-6">CALIBRATION DATE</th>
                    <th className="px-10 py-6 text-right">SYSTEM AUDIT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-muted/10">
                  {completedDraws.map((draw) => (
                    <tr key={draw.id} className="hover:bg-muted/5 transition-all group">
                      <td className="px-10 py-8 font-black uppercase text-lg tracking-tighter group-hover:text-primary transition-colors">
                        {new Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date(0, draw.month - 1))}{" "}
                        {draw.year}
                      </td>
                      <td className="px-10 py-8 font-black text-primary text-xl tracking-tighter">
                        ${draw.prizePool.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-4">
                          <Badge className="bg-muted/50 text-muted-foreground border border-muted-foreground/20 font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full">
                            {draw.drawType}
                          </Badge>
                          <span className="text-xs text-muted-foreground/60 font-bold underline underline-offset-4 decoration-primary/10">
                            Winner Resolved
                          </span>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-muted-foreground/60 font-black text-xs tabular-nums uppercase tracking-widest">
                        {draw.drawnAt ? new Date(draw.drawnAt).toLocaleDateString() : "---"}
                      </td>
                      <td className="px-10 py-8 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="font-black text-[10px] uppercase tracking-widest gap-2 h-10 px-6 rounded-xl bg-muted/20 border border-transparent hover:border-primary/20 hover:bg-primary/5 hover:text-primary transition-all"
                        >
                          LOGS <ChevronRight className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!completedDraws.length && (
                <div className="py-24 text-center font-black text-muted-foreground/20 uppercase tracking-[0.4em] text-xs bg-muted/5">
                  SYSTEM LEDGER CONTAINS ZERO ARCHIVAL RECORDS.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
