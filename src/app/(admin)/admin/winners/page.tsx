"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Trophy,
  CheckCircle2,
  Clock,
  Search,
  MoreVertical,
  ExternalLink,
  ShieldCheck,
  Ban,
  ArrowUpRight,
  Filter,
  ArrowRight,
  Layout,
  UserCheck,
  History as HistoryIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { winnerFetchers } from "@/fetchers/winner";

export default function AdminWinnersPage() {
  const queryClient = useQueryClient();
  const [selectedWinner, setSelectedWinner] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const { data: winners, isLoading } = useQuery({
    queryKey: ["admin", "winners"],
    queryFn: winnerFetchers.list,
    staleTime: 1000 * 60 * 5, // 5 min
  });

  const verifyMutation = useMutation({
    mutationFn: (id: string) => winnerFetchers.verify(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "winners"] });
      toast.success("Winner identity and performance verified.");
      setIsPreviewOpen(false);
    },
  });

  const payMutation = useMutation({
    mutationFn: (id: string) => winnerFetchers.pay(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "winners"] });
      toast.success("Payout marked as complete.");
      setIsPreviewOpen(false);
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-12 animate-in fade-in duration-500">
        <Skeleton className="h-12 w-64 rounded-full" />
        <Skeleton className="h-16 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-80 rounded-[2.5rem]" />
          ))}
        </div>
      </div>
    );
  }

  const pendingReview = winners?.filter((w) => w.status === "PROOFS_UPLOADED") || [];
  const awaitingPayout = winners?.filter((w) => w.status === "VERIFIED") || [];
  const completed = winners?.filter((w) => w.status === "PAID") || [];

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight underline decoration-primary/20 decoration-4 underline-offset-8">
            Audit & Settlement
          </h1>
          <p className="text-muted-foreground mt-4 font-medium">
            Terminal oversight for member verification and prize disbursement protocols.
          </p>
        </div>
        <div className="flex items-center gap-6 bg-muted/20 px-8 py-4 rounded-[2rem] border border-muted-foreground/10">
          <div className="flex -space-x-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-12 w-12 rounded-full border-4 border-background bg-muted flex items-center justify-center overflow-hidden shadow-lg"
              >
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="" />
              </div>
            ))}
          </div>
          <div className="space-y-0.5">
            <p className="text-xl font-black tracking-tighter leading-none">{winners?.length || 0}</p>
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] leading-none">
              Total Registry Entries
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="bg-muted/30 p-2 rounded-[2rem] h-20 w-full lg:w-max flex gap-3 border border-muted-foreground/10">
          <TabsTrigger
            value="pending"
            className="rounded-[1.5rem] px-10 h-full font-black text-sm tracking-tight data-[state=active]:bg-foreground data-[state=active]:text-background shadow-xl transition-all uppercase gap-4"
          >
            Forensic Reviews
            <Badge
              variant="secondary"
              className={cn(
                "px-3 h-6 text-[10px] border-none font-black rounded-full transition-colors",
                pendingReview.length > 0
                  ? "bg-primary text-primary-foreground animate-pulse"
                  : "bg-muted-foreground/20 text-muted-foreground",
              )}
            >
              {pendingReview.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="payouts"
            className="rounded-[1.5rem] px-10 h-full font-black text-sm tracking-tight data-[state=active]:bg-foreground data-[state=active]:text-background shadow-xl transition-all uppercase gap-4"
          >
            Pending Payouts
            <Badge
              variant="secondary"
              className={cn(
                "px-3 h-6 text-[10px] border-none font-black rounded-full transition-colors",
                awaitingPayout.length > 0
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted-foreground/20 text-muted-foreground",
              )}
            >
              {awaitingPayout.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="rounded-[1.5rem] px-10 h-full font-black text-sm tracking-tight data-[state=active]:bg-foreground data-[state=active]:text-background shadow-xl transition-all uppercase"
          >
            Settled History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-12 space-y-10">
          {pendingReview.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {pendingReview.map((winner) => (
                <Card
                  key={winner.id}
                  className="border-none bg-background shadow-2xl rounded-[2.5rem] overflow-hidden border-2 border-muted/10 group hover:border-primary/20 transition-all hover:-translate-y-2"
                >
                  <CardHeader className="p-10 pb-6 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8 relative z-10">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">AWAITING AUDIT</p>
                      <Trophy className="h-6 w-6 text-primary opacity-20 group-hover:rotate-12 transition-transform" />
                    </div>
                    <CardTitle className="text-3xl font-black tracking-tighter uppercase leading-none relative z-10 group-hover:text-primary transition-colors">
                      {winner.user?.name || "Unknown Node"}
                    </CardTitle>
                    <CardDescription className="font-black text-muted-foreground/60 uppercase text-[9px] tracking-[0.3em] mt-3 relative z-10">
                      ENDPOINT: {winner.user?.email}
                    </CardDescription>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
                  </CardHeader>
                  <CardContent className="px-10 py-0 space-y-8">
                    <div className="flex items-baseline gap-3">
                      <span className="text-5xl font-black text-foreground tracking-tighter drop-shadow-sm">
                        ${winner.prizeAmount?.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">
                        ALLOCATION
                      </span>
                    </div>
                    <div className="aspect-video bg-muted/20 rounded-[2rem] border-4 border-dashed border-muted-foreground/10 overflow-hidden relative shadow-inner">
                      {winner.proofUrl ? (
                        <>
                          <img
                            src={winner.proofUrl}
                            className="object-cover w-full h-full cursor-zoom-in group-hover:scale-105 transition-transform duration-700"
                            alt="Evidence Source"
                            onClick={() => {
                              setSelectedWinner(winner);
                              setIsPreviewOpen(true);
                            }}
                          />
                          <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors" />
                        </>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground/30 font-black gap-2 uppercase text-[10px] tracking-widest text-center px-6">
                          <Layout className="h-10 w-10 opacity-20 mb-2" />
                          Evidence source empty or corrupted
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="p-10">
                    <Button
                      className="w-full h-16 bg-foreground text-background hover:bg-primary hover:text-primary-foreground font-black gap-4 rounded-2xl shadow-xl transition-all uppercase tracking-widest text-xs"
                      onClick={() => {
                        setSelectedWinner(winner);
                        setIsPreviewOpen(true);
                      }}
                    >
                      OPEN VERIFICATION TERMINAL <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="py-48 text-center rounded-[3rem] border-4 border-dashed border-muted/10 bg-muted/5 group">
              <UserCheck className="h-20 w-20 text-muted-foreground/10 mx-auto mb-8 animate-pulse group-hover:text-primary/20 transition-colors" />
              <p className="text-muted-foreground font-black uppercase tracking-[0.4em] text-sm">
                Forensic queue is currently cleared.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="payouts" className="mt-12 space-y-10">
          <Card className="border-none shadow-2xl overflow-hidden rounded-[2.5rem] bg-background border-2 border-muted/10">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/30 text-muted-foreground uppercase text-[10px] font-black tracking-[0.3em] border-b border-muted/10">
                    <tr>
                      <th className="px-12 py-8">VERIFIED IDENTITY</th>
                      <th className="px-12 py-8">CLEARED DISBURSEMENT</th>
                      <th className="px-12 py-8">AUDIT PROTOCOL</th>
                      <th className="px-12 py-8 text-right">SETTLEMENT EXECUTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-muted/10">
                    {awaitingPayout.map((winner) => (
                      <tr key={winner.id} className="hover:bg-muted/5 transition-all group">
                        <td className="px-12 py-10">
                          <div className="font-black text-xl leading-none tracking-tight group-hover:text-primary transition-colors uppercase">
                            {winner.user?.name}
                          </div>
                          <div className="text-[10px] font-black text-muted-foreground/60 mt-3 uppercase tracking-[0.2em]">
                            {winner.user?.email}
                          </div>
                        </td>
                        <td className="px-12 py-10">
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-black text-primary tracking-tighter">
                              ${winner.prizeAmount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                            <span className="text-[9px] font-black text-primary/40 uppercase">USD</span>
                          </div>
                        </td>
                        <td className="px-12 py-10">
                          <div className="inline-flex items-center gap-3 bg-primary/10 px-5 py-2.5 rounded-full border border-primary/20">
                            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                            <span className="text-[10px] font-black uppercase text-primary tracking-widest leading-none">
                              Security Cleared
                            </span>
                          </div>
                        </td>
                        <td className="px-12 py-10 text-right">
                          <Button
                            className="h-14 px-10 rounded-2xl bg-foreground text-background hover:bg-primary hover:text-primary-foreground font-black text-[11px] gap-4 shadow-xl transition-all uppercase tracking-[0.1em]"
                            onClick={() => {
                              if (confirm("INITIALIZE CAPITAL TRANSFER: Confirm terminal settlement of these funds?")) {
                                payMutation.mutate(winner.id);
                              }
                            }}
                          >
                            MARK AS FUNDED <CheckCircle2 className="h-5 w-5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!awaitingPayout.length && (
                  <div className="py-32 text-center font-black text-muted-foreground/20 uppercase tracking-[0.4em] text-xs bg-muted/5">
                    LEADERSHIP DIRECTIVE: ZERO VERIFIED PAYOUTS PENDING.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-12">
          <Card className="border-none shadow-2xl overflow-hidden rounded-[2.5rem] bg-background border-2 border-muted/10">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/30 text-muted-foreground uppercase text-[10px] font-black tracking-[0.3em] border-b border-muted/10">
                    <tr>
                      <th className="px-12 py-8">ARCHIVAL RECIPIENT</th>
                      <th className="px-12 py-8">SETTLED EQUITY</th>
                      <th className="px-12 py-8">TERMINAL CLEARANCE</th>
                      <th className="px-12 py-8 text-right">SYSTEM AUDIT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-muted/10">
                    {completed.map((winner) => (
                      <tr key={winner.id} className="hover:bg-muted/5 transition-all group">
                        <td className="px-12 py-10">
                          <div className="font-black text-lg leading-none tracking-tight opacity-70 group-hover:opacity-100 transition-opacity uppercase">
                            {winner.user?.name}
                          </div>
                          <div className="text-[9px] font-bold text-muted-foreground/40 mt-2 uppercase tracking-[0.2em]">
                            {winner.user?.email}
                          </div>
                        </td>
                        <td className="px-12 py-10">
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black text-primary tracking-tighter opacity-70 group-hover:opacity-100 transition-opacity">
                              ${winner.prizeAmount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        </td>
                        <td className="px-12 py-10 text-muted-foreground/40 font-black text-[10px] tabular-nums uppercase tracking-widest">
                          COMPLETED {new Date(winner.paidAt!).toLocaleDateString()}
                        </td>
                        <td className="px-12 py-10 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="font-black text-[10px] tracking-[0.2em] opacity-40 hover:opacity-100 hover:text-primary gap-2 h-10 px-6 rounded-xl bg-muted/10 transition-all uppercase"
                          >
                            AUDIT <ExternalLink className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {!completed.length && (
                <div className="py-32 text-center font-black text-muted-foreground/20 uppercase tracking-[0.4em] text-xs bg-muted/5">
                  SYSTEM LOGS CONTAIN ZERO ARCHIVAL SETTLEMENT RECORDS.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Verification Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={isPreviewOpen ? (v) => setIsPreviewOpen(v) : undefined}>
        <DialogContent className="max-w-4xl p-0 rounded-[3rem] overflow-hidden border-none shadow-3xl bg-background">
          <DialogHeader className="bg-foreground text-background p-12 relative overflow-hidden">
            <div className="relative z-10">
              <DialogTitle className="text-3xl font-black tracking-tighter uppercase leading-none">
                FORENSIC DATA ANALYZER
              </DialogTitle>
              <DialogDescription className="text-background/60 font-medium mt-3 text-lg">
                Cross-referencing telemetry for terminal score clearance.
              </DialogDescription>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32" />
          </DialogHeader>
          <div className="p-12 space-y-12 bg-background">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-10">
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">
                    NODE PARAMETERS
                  </p>
                  <div className="rounded-[1.5rem] border-2 border-muted/10 bg-muted/5 p-8 space-y-8 backdrop-blur-sm">
                    <div className="flex justify-between items-center pb-6 border-b border-muted/10">
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        Identity
                      </span>
                      <span className="text-xl font-black text-foreground tracking-tight uppercase">
                        {selectedWinner?.user?.name}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-6 border-b border-muted/10">
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        Allocation
                      </span>
                      <span className="text-3xl font-black text-primary tracking-tighter">
                        ${selectedWinner?.prizeAmount?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        Registry HEX
                      </span>
                      <span className="font-mono text-xs text-muted-foreground leading-none">
                        #{selectedWinner?.id.slice(-16).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-primary/5 p-8 rounded-[1.5rem] border border-primary/20 flex gap-6 text-primary text-xs font-bold leading-relaxed shadow-inner">
                  <ShieldCheck className="h-8 w-8 text-primary shrink-0 opacity-50" />
                  <span className="opacity-80 leading-snug">
                    Verification required: cross-reference evidence image with handicap registry or official club
                    systems before approving data load.
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">
                  EVIDENCE STREAM
                </p>
                <div className="aspect-[4/5] bg-muted/20 rounded-[2rem] border-4 border-dashed border-muted-foreground/10 overflow-hidden relative shadow-2xl group/evidence">
                  {selectedWinner?.proofUrl ? (
                    <>
                      <img
                        src={selectedWinner.proofUrl}
                        className="object-contain w-full h-full"
                        alt="High Resolution Telemetry"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-10 translate-y-full group-hover/evidence:translate-y-0 transition-transform duration-500">
                        <a
                          href={selectedWinner?.proofUrl}
                          target="_blank"
                          className="flex items-center justify-center gap-3 w-full h-14 bg-white text-black rounded-xl text-[11px] font-black uppercase tracking-widest shadow-2xl cursor-new-tab"
                        >
                          Open Raw Endpoint <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground/20 font-black gap-6 uppercase tracking-widest text-center p-12">
                      <HistoryIcon className="h-16 w-16 opacity-10 animate-spin-slow" />
                      Data Pool Exhausted
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <Button
                size="lg"
                variant="ghost"
                className="h-20 flex-1 font-black text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all rounded-2xl uppercase tracking-[0.2em] text-[10px]"
                onClick={() => toast.info("Rejection protocol not yet active. Contact node via identity registry.")}
                disabled={verifyMutation.isPending}
              >
                <Ban className="h-5 w-5 mr-3" /> REJECT DATA LOAD
              </Button>
              <Button
                size="lg"
                className="h-20 flex-[2] bg-primary text-primary-foreground hover:bg-primary/90 font-black text-2xl shadow-[0_20px_50px_rgba(var(--primary),0.3)] rounded-2xl active:scale-[0.98] transition-all uppercase tracking-tighter"
                disabled={
                  verifyMutation.isPending || selectedWinner?.status === "VERIFIED" || selectedWinner?.status === "PAID"
                }
                onClick={() => verifyMutation.mutate(selectedWinner.id)}
              >
                {verifyMutation.isPending ? "VALIDATING TELEMETRY..." : "COMMIT CLEARANCE"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
