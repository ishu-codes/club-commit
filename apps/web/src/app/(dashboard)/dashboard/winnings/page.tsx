"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Trophy,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Image as ImageIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { winnerFetchers } from "@/fetchers/winner";
import { dashboardFetchers } from "@/fetchers/dashboard";
import { WinnerStatus } from "@/types/winner";

export default function WinningsPage() {
  const queryClient = useQueryClient();
  const [selectedWinnerId, setSelectedWinnerId] = useState<string | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [base64Image, setBase64Image] = useState<string | null>(null);

  const { data: winnings, isLoading: loadingWinnings } = useQuery({
    queryKey: ["winners", "mine"],
    queryFn: winnerFetchers.mine,
    staleTime: 1000 * 60 * 5, // 5 min
  });

  const { data: dashboard, isLoading: loadingDashboard } = useQuery({
    queryKey: ["dashboard"],
    queryFn: dashboardFetchers.get,
    staleTime: 1000 * 60 * 5, // 5 min
  });

  const uploadProofMutation = useMutation({
    mutationFn: (values: { id: string; proofUrl: string }) => winnerFetchers.uploadProof(values.id, values.proofUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["winners", "mine"] });
      toast.success("Proof uploaded successfully! Admin will review it shortly.");
      setIsUploadOpen(false);
      setBase64Image(null);
    },
    onError: (err: any) => toast.error(err.message || "Failed to upload proof"),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loadingWinnings || loadingDashboard) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-48 w-full rounded-3xl" />
        <Skeleton className="h-96 w-full rounded-3xl" />
      </div>
    );
  }

  const getStatusBadge = (status: WinnerStatus) => {
    switch (status) {
      case "PENDING_PROOF":
        return (
          <Badge
            variant="outline"
            className="border-destructive/20 text-destructive bg-destructive/5 font-black text-[10px] uppercase tracking-widest px-3"
          >
            REQUIRED PROOF
          </Badge>
        );
      case "PROOFS_UPLOADED":
        return (
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary border-none font-black text-[10px] uppercase tracking-widest px-3 italic"
          >
            VERIFYING...
          </Badge>
        );
      case "VERIFIED":
        return (
          <Badge
            variant="secondary"
            className="bg-primary/20 text-primary border-none font-black text-[10px] uppercase tracking-widest px-3"
          >
            VERIFIED
          </Badge>
        );
      case "PAID":
        return (
          <Badge className="bg-primary text-primary-foreground border-none font-black text-[10px] uppercase tracking-widest px-3">
            PAID
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="font-black text-[10px] uppercase px-3">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight underline decoration-primary/20 decoration-4 underline-offset-8">
          Prize Management
        </h1>
        <p className="text-muted-foreground mt-4 font-medium italic">
          Securely claim and track your rewards from the global commitment pool.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Summary Card */}
        <Card className="border-none bg-foreground text-background shadow-2xl relative overflow-hidden group rounded-[2.5rem]">
          <CardHeader className="relative z-10 p-10">
            <CardTitle className="text-background/40 uppercase tracking-[0.3em] text-[10px] font-black flex items-center gap-3">
              <Zap className="h-4 w-4 text-primary" /> Total Equity Gained
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 pt-0 px-10 pb-12">
            <div className="flex items-baseline gap-3">
              <span className="text-8xl font-black italic tracking-tighter drop-shadow-2xl opacity-90">
                ${dashboard?.winnings.totalWon || 0}
              </span>
              <Badge className="bg-primary text-primary-foreground border-none font-black text-[10px] uppercase tracking-widest px-3 h-6">
                USD
              </Badge>
            </div>
            <div className="mt-10 flex items-center gap-10">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-background/40 uppercase tracking-widest leading-none">
                  PENDING DATA
                </p>
                <p className="text-3xl font-black italic text-background/80 leading-none tracking-tighter">
                  {dashboard?.winnings.pendingPayments || 0}
                </p>
              </div>
              <Separator orientation="vertical" className="h-12 bg-background/10" />
              <div className="space-y-2">
                <p className="text-[10px] font-black text-background/40 uppercase tracking-widest leading-none">
                  AUDITED
                </p>
                <p className="text-3xl font-black italic text-background/80 leading-none tracking-tighter">
                  {winnings?.filter((w) => w.status === "VERIFIED" || w.status === "PAID").length || 0}
                </p>
              </div>
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 transition-opacity group-hover:opacity-40" />
        </Card>

        {/* Hall of Fame / Global Motivation */}
        <Card className="lg:col-span-2 border-none shadow-sm bg-muted/5 rounded-[2.5rem] border-2 border-muted/10 group overflow-hidden">
          <CardHeader className="pb-4 p-10">
            <CardTitle className="text-xl font-black italic flex items-center gap-3 tracking-tight uppercase">
              <Trophy className="h-6 w-6 text-primary" /> Global Winners Circle
            </CardTitle>
            <CardDescription className="font-medium italic">
              Verified impact, distributed rewards. Participation leads to outcome.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-10 pb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "John D.", amount: 840, draw: "March 2026", impact: "Health" },
                { name: "Sarah K.", amount: 910, draw: "February 2026", impact: "Water" },
                { name: "Mike R.", amount: 760, draw: "January 2026", impact: "Ocean" },
                { name: "Emma L.", amount: 620, draw: "Dec 2025", impact: "Trees" },
              ].map((w, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-5 rounded-2xl bg-background border-2 border-muted/10 group-hover:border-primary/20 transition-all hover:scale-[1.02] hover:shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center font-black text-primary text-xs italic">
                      #{i + 1}
                    </div>
                    <div>
                      <p className="font-black italic text-sm tracking-tight">{w.name}</p>
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest leading-none mt-1.5">
                        {w.draw} • {w.impact}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black italic text-primary leading-none tracking-tighter">${w.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8">
        <h2 className="text-sm font-black italic tracking-[0.3em] uppercase text-muted-foreground flex items-center gap-3">
          <Clock className="h-5 w-5 text-primary opacity-50" /> INDIVIDUAL PRIZE REGISTRY
        </h2>
        <div className="grid grid-cols-1 gap-6">
          {winnings?.length ? (
            winnings.map((winner) => (
              <Card
                key={winner.id}
                className="border-none shadow-sm bg-background border-2 border-muted/10 group hover:border-primary/20 transition-all rounded-[1.5rem] overflow-hidden"
              >
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="flex items-center gap-8">
                      <div className="h-20 w-20 rounded-2xl bg-muted/30 flex items-center justify-center transition-transform group-hover:rotate-6">
                        <Trophy
                          className={cn(
                            "h-10 w-10",
                            winner.status === "PAID" ? "text-primary fill-primary" : "text-muted-foreground/30",
                          )}
                        />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-4 mb-3">
                          <p className="text-2xl font-black italic leading-none tracking-tight uppercase">
                            {new Intl.DateTimeFormat("en-US", { month: "long" }).format(
                              new Date(0, winner.draw.month - 1),
                            )}{" "}
                            {winner.draw.year} RECOVERY
                          </p>
                          {getStatusBadge(winner.status)}
                        </div>
                        <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] leading-none italic">
                          ALLOCATION:{" "}
                          <span className="text-foreground tracking-normal not-italic ml-2">
                            ${winner.amount.toLocaleString()} USD
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-5">
                      {winner.status === "PENDING_PROOF" && (
                        <Dialog
                          open={isUploadOpen && selectedWinnerId === winner.id}
                          onOpenChange={(open) => {
                            setIsUploadOpen(open);
                            if (open) setSelectedWinnerId(winner.id);
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button className="rounded-xl px-8 h-12 shadow-xl shadow-destructive/10 hover:shadow-destructive/20 gap-3 border-none font-black italic text-sm tracking-tight bg-destructive text-destructive-foreground hover:bg-destructive/90">
                              <Upload className="h-4 w-4" /> INITIALIZE AUDIT
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                            <DialogHeader className="bg-destructive text-destructive-foreground p-8">
                              <DialogTitle className="text-2xl font-black italic uppercase tracking-tight">
                                DATA VERIFICATION REQUIRED
                              </DialogTitle>
                              <DialogDescription className="text-destructive-foreground/80 font-medium italic">
                                Upload your temporal scorecard data from a club system or recognized handicap protocol
                                for terminal clearance.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="p-8 space-y-8 bg-background">
                              <div className="space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                  SELECT SOURCE IMAGE FILE
                                </Label>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleFileChange}
                                  className="cursor-pointer h-14 rounded-2xl border-2 border-dashed border-muted-foreground/10 flex items-center px-4"
                                />
                                {base64Image && (
                                  <div className="aspect-video relative rounded-3xl overflow-hidden border-4 border-primary/20 bg-muted/20 shadow-inner group/preview">
                                    <img
                                      src={base64Image}
                                      className="object-cover w-full h-full"
                                      alt="Registry Proof Preview"
                                    />
                                    <div className="absolute inset-0 bg-primary/10 backdrop-blur-[1px]" />
                                  </div>
                                )}
                              </div>
                              <div className="bg-muted/30 p-6 rounded-2xl flex gap-4 text-muted-foreground text-xs font-bold leading-relaxed italic border border-muted/20 leading-snug">
                                <ShieldCheck className="h-6 w-6 shrink-0 text-primary" />
                                <span>
                                  Registry proofs are only visible to system auditors and permanently purged
                                  post-clearance.
                                </span>
                              </div>
                            </div>
                            <DialogFooter className="p-8 pt-0 bg-background">
                              <Button
                                className="w-full h-16 text-lg font-black italic rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.01]"
                                disabled={!base64Image || uploadProofMutation.isPending}
                                onClick={() => uploadProofMutation.mutate({ id: winner.id, proofUrl: base64Image! })}
                              >
                                {uploadProofMutation.isPending ? "PROCESSING DATA LOAD..." : "COMMIT TO AUDIT"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}

                      {winner.status === "PROOFS_UPLOADED" && (
                        <div className="flex flex-col items-end gap-1">
                          <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] animate-pulse italic">
                            AUDIT IN PROGRESS
                          </p>
                          <p className="text-xs font-medium text-muted-foreground/60 italic">
                            Temporal data pending clearance
                          </p>
                        </div>
                      )}

                      {winner.status === "PAID" && (
                        <div className="bg-primary/5 px-6 py-3 rounded-2xl border border-primary/10 flex items-center gap-3">
                          <ShieldCheck className="h-5 w-5 text-primary" />
                          <div className="text-left">
                            <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">
                              FUNDED
                            </p>
                            <p className="text-xs font-bold text-foreground/70 mt-1">
                              {new Date(winner.paidAt!).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="py-40 text-center border-2 border-dashed rounded-[2.5rem] bg-muted/5 border-muted/10 flex flex-col items-center justify-center space-y-8">
              <div className="h-24 w-24 rounded-full bg-muted/20 flex items-center justify-center text-muted-foreground/20 animate-bounce">
                <Trophy className="h-12 w-12" />
              </div>
              <div className="space-y-3">
                <p className="text-muted-foreground font-black italic text-2xl uppercase tracking-tighter">
                  Temporal Cabinet Empty
                </p>
                <p className="text-sm font-medium text-muted-foreground/40 max-w-sm mx-auto leading-relaxed">
                  Establish consistent data loads and commit to the next draw to initialize your prize registry.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
