"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trophy, Upload, CheckCircle2, Clock, ImageIcon, TrophyIcon, ZapIcon, ShieldCheck } from "lucide-react";
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
// import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { winnerFetchers } from "@/fetchers/winner";
import { dashboardFetchers } from "@/fetchers/dashboard";
import { WinnerStatus } from "@/types/winner";

export default function WinningsPage() {
  const queryClient = useQueryClient();
  const [selectedWinnerId, setSelectedWinnerId] = useState<string | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [base64Image, setBase64Image] = useState<string | null>(null);

  const { data: myWinnings, isLoading: loadingWinnings } = useQuery({
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
      toast.success("Verification data submitted.");
      setIsUploadOpen(false);
      setBase64Image(null);
    },
    onError: (err: any) => toast.error(err.message || "Upload failed"),
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
      <div className="space-y-6 animate-in fade-in duration-500">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="lg:col-span-2 h-48 rounded-xl" />
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  const getStatusBadge = (status: WinnerStatus) => {
    switch (status) {
      case "PENDING_PROOF":
        return (
          <Badge variant="destructive" className="rounded-md px-2 text-[10px] font-bold uppercase tracking-wider">
            Proof Required
          </Badge>
        );
      case "PROOFS_UPLOADED":
        return (
          <Badge
            variant="secondary"
            className="rounded-md px-2 text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary"
          >
            Auditing
          </Badge>
        );
      case "VERIFIED":
        return (
          <Badge
            variant="secondary"
            className="rounded-md px-2 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600"
          >
            Verified
          </Badge>
        );
      case "PAID":
        return <Badge className="rounded-md px-2 text-[10px] font-bold uppercase tracking-wider">Paid</Badge>;
      default:
        return (
          <Badge variant="outline" className="rounded-md px-2 text-[10px] font-bold uppercase tracking-wider">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Prize Registry</h1>
        <p className="text-muted-foreground mt-2">Track allocations and verify your tournament recovery data.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-primary text-primary-foreground border-none shadow-lg rounded-xl overflow-hidden relative group">
          <CardHeader className="relative z-10">
            <CardTitle className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-80 flex items-center gap-2">
              <ZapIcon className="h-3 w-3" /> Total Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 pt-0">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold tracking-tight">&#8377;{dashboard?.winnings.totalWon || 0}</span>
              <span className="text-[10px] font-bold uppercase opacity-60">INR</span>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">Reserved</p>
                <p className="text-xl font-bold">{dashboard?.winnings.pendingPayments || 0}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">Cleared</p>
                <p className="text-xl font-bold">
                  {myWinnings?.list.filter((w) => w.status === "VERIFIED" || w.status === "PAID").length || 0}
                </p>
              </div>
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
        </Card>

        <Card className="lg:col-span-2 rounded-xl border shadow-sm flex flex-col">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold flex items-center gap-2 tracking-tight">
              <Trophy className="h-5 w-5 text-primary" /> Network Hall of Fame
            </CardTitle>
            <CardDescription className="text-xs">Peer performance indicators and impact highlights.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { name: "John D.", amount: 840, draw: "March 2026" },
                { name: "Sarah K.", amount: 910, draw: "February 2026" },
                { name: "Mike R.", amount: 760, draw: "January 2026" },
                { name: "Emma L.", amount: 620, draw: "Dec 2025" },
              ].map((w, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-md bg-background border flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                      #{i + 1}
                    </div>
                    <div>
                      <p className="text-xs font-bold">{w.name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-medium">{w.draw}</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-primary">&#8377; {w.amount}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-2 px-1">
          <Clock className="h-4 w-4 text-primary" />
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Verification Queue</h2>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {myWinnings?.list.length ? (
            myWinnings?.list.map((winner) => (
              <Card
                key={winner.id}
                className="rounded-xl border shadow-sm overflow-hidden group hover:border-primary/20 transition-all"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <div className="h-14 w-14 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                        <TrophyIcon
                          className={cn(
                            "h-6 w-6",
                            winner.status === "PAID" ? "text-primary fill-primary" : "text-muted-foreground",
                          )}
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <p className="font-bold text-sm uppercase tracking-tight">
                            {new Intl.DateTimeFormat("en-US", { month: "long" }).format(
                              new Date(0, winner.draw.month - 1),
                            )}{" "}
                            {winner.draw.year} Cycle
                          </p>
                          {getStatusBadge(winner.status)}
                        </div>
                        <p className="text-xs text-muted-foreground font-medium">
                          Allocation:{" "}
                          <span className="text-foreground font-bold">&#8377;{winner.amount.toLocaleString()}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {winner.status === "PENDING_PROOF" && (
                        <Dialog
                          open={isUploadOpen && selectedWinnerId === winner.id}
                          onOpenChange={(open) => {
                            setIsUploadOpen(open);
                            if (open) setSelectedWinnerId(winner.id);
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button size="sm" className="rounded-lg font-bold h-9 px-4 gap-2">
                              <Upload className="h-3.5 w-3.5" /> Submit Audit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="rounded-xl p-0 overflow-hidden border-none shadow-2xl max-w-md">
                            <DialogHeader className="bg-primary text-primary-foreground p-6">
                              <DialogTitle className="text-lg font-bold uppercase tracking-tight">
                                Evidence Submission
                              </DialogTitle>
                              <DialogDescription className="text-primary-foreground/70 text-xs">
                                Upload your club scorecard data for terminal verification.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="p-6 space-y-6">
                              <div className="space-y-3">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                  Select data log
                                </Label>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleFileChange}
                                  className="cursor-pointer h-10 text-xs rounded-lg border-dashed bg-muted/20"
                                />
                                {base64Image && (
                                  <div className="aspect-video rounded-lg overflow-hidden border bg-muted/10">
                                    <img src={base64Image} className="object-cover w-full h-full" alt="Preview" />
                                  </div>
                                )}
                              </div>
                              <div className="bg-muted/30 p-4 rounded-lg flex gap-3 items-start border">
                                <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
                                  Proofs are audited by system nodes and purged within 24 hours of clearance.
                                </p>
                              </div>
                            </div>
                            <DialogFooter className="p-6 pt-0">
                              <Button
                                className="w-full font-bold rounded-lg"
                                disabled={!base64Image || uploadProofMutation.isPending}
                                onClick={() => uploadProofMutation.mutate({ id: winner.id, proofUrl: base64Image! })}
                              >
                                {uploadProofMutation.isPending ? "Syncing..." : "Commit Data"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}

                      {winner.status === "PAID" && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          <span className="text-[10px] font-bold text-emerald-600 uppercase tabular-nums">
                            {new Date(winner.paidAt!).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="py-24 text-center border-2 border-dashed rounded-xl bg-muted/5 flex flex-col items-center justify-center space-y-4">
              <Trophy className="h-8 w-8 text-muted-foreground/20" />
              <div className="space-y-1">
                <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground/60">
                  No prize records found
                </p>
                <p className="text-xs text-muted-foreground/40 max-w-[200px] mx-auto">
                  Engage in cycles and commit data to initialize your registry.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
