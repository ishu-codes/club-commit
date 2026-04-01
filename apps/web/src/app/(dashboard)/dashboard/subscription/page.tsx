"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreditCard, CheckCircle2, Crown, Heart, ShieldCheck, Calendar, ArrowRight } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { dashboardFetchers } from "@/fetchers/dashboard";
import { charityFetchers } from "@/fetchers/charity";
import { subscriptionFetchers } from "@/fetchers/subscription";
import { cn } from "@/lib/utils";
import { SubscriptionPlan } from "@/types/subscription";

const plans = [
  {
    id: "MONTHLY" as SubscriptionPlan,
    name: "Monthly Access",
    price: "999",
    interval: "month",
    desc: "Flexible commitment for seasonal contributors.",
  },
  {
    id: "YEARLY" as SubscriptionPlan,
    name: "Annual Impact",
    price: "9,999",
    interval: "year",
    desc: "Maximum impact with two months complementary.",
  },
];

export default function SubscriptionPage() {
  const queryClient = useQueryClient();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>("MONTHLY");
  const [selectedCharityId, setSelectedCharityId] = useState<string>("");

  const { data: charities } = useQuery({
    queryKey: ["charities"],
    queryFn: charityFetchers.list,
    staleTime: 1000 * 60 * 5, // 5 min
  });

  const { data: dashboard, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: dashboardFetchers.get,
    staleTime: 1000 * 60 * 5, // 5 min
  });

  const subscribeMutation = useMutation({
    mutationFn: subscriptionFetchers.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Subscription activated.");
    },
    onError: (err: any) => toast.error(err.message || "Failed to activate"),
  });

  const cancelMutation = useMutation({
    mutationFn: subscriptionFetchers.cancel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Cancellation registered.");
    },
  });

  const activeSub = dashboard?.subscription;

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Active Membership</h1>
        <p className="text-muted-foreground mt-1 text-sm font-medium">Manage your tactical stake and impact targets.</p>
      </div>

      {activeSub ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 rounded-xl border shadow-sm overflow-hidden">
            <CardHeader className="pb-6 border-b bg-muted/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Crown className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl font-bold">Active {activeSub.plan} Protocol</CardTitle>
                </div>
                <Badge className="font-bold text-[10px] uppercase px-2 h-5">Verified</Badge>
              </div>
              <CardDescription className="text-xs mt-2 uppercase tracking-tight">
                Renewal programmed for {new Date(activeSub.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border bg-muted/20 flex flex-col justify-center">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Monthly Stake</p>
                  <p className="text-2xl font-bold tracking-tight">
                    &#8377; {activeSub.plan === "YEARLY" ? "833" : "999"}
                    <span className="text-xs font-normal text-muted-foreground ml-1">/mo</span>
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-muted/20 flex flex-col justify-center">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Commitment Weight</p>
                  <p className="text-2xl font-bold tracking-tight text-primary">
                    {activeSub.contributionPercent}% Distribution
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-lg border bg-background group">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                  <Heart className="h-5 w-5 fill-primary/10" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-0.5">Primary Recipient</p>
                  <p className="font-bold text-base">{activeSub.charity?.name || "System Default"}</p>
                </div>
                <Button variant="outline" size="sm" asChild className="h-8 text-[10px] uppercase font-bold px-4">
                  <Link href="/dashboard/charity">Recalibrate</Link>
                </Button>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/5 border-t py-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-[10px] text-muted-foreground flex items-center gap-2 font-bold uppercase tracking-widest">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Secure Protocol
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/5 font-bold text-[10px] uppercase h-8 border"
                onClick={() => {
                  if (confirm("Disconnect identity? Eligibility will cease at the end of the current term.")) {
                    cancelMutation.mutate();
                  }
                }}
              >
                Disconnect Node
              </Button>
            </CardFooter>
          </Card>

          <Card className="rounded-xl border shadow-sm h-fit">
            <CardHeader className="pb-4">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Active Load Benefits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              {[
                "Unlimited Performance Tracking",
                "Verified Prize Pool Eligibility",
                "Priority Social Impact Index",
                "Authenticated Network Identity",
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-3 text-xs font-medium text-foreground/70">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 opacity-40" />
                  <span>{benefit}</span>
                </div>
              ))}
            </CardContent>
            <Separator className="opacity-50" />
            <CardFooter className="pt-4 pb-6">
              <p className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground/30 leading-relaxed text-center w-full italic">
                Stake distributions are audited monthly.
              </p>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
          <Card className="overflow-hidden border shadow-sm rounded-xl">
            <CardHeader className="bg-muted/5 text-center py-10 border-b">
              <CardTitle className="text-3xl font-bold tracking-tight mb-2">Initialize Membership</CardTitle>
              <CardDescription className="text-muted-foreground font-medium text-sm">
                Commit your monthly stake to unlock full system protocols.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 md:p-10 space-y-10">
              <div className="space-y-4">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Select Temporal Cycle</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={cn(
                        "relative p-6 rounded-xl border-2 cursor-pointer transition-all flex flex-col group",
                        selectedPlan === plan.id
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-muted/50 hover:border-primary/20 bg-background",
                      )}
                    >
                      <div className="flex justify-between items-center mb-4">
                        <p className="font-bold text-base">{plan.name}</p>
                        {selectedPlan === plan.id && <CheckCircle2 className="h-4 w-4 text-primary" />}
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold tracking-tight">&#8377; {plan.price}</span>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">/ {plan.interval}</span>
                      </div>
                      <p className="text-xs text-muted-foreground font-medium mt-4 leading-relaxed">{plan.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Select Impact Target</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar border rounded-lg p-2 bg-muted/5">
                  {charities?.map((charity) => (
                    <div
                      key={charity.id}
                      onClick={() => setSelectedCharityId(charity.id)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                        selectedCharityId === charity.id ? "border-primary bg-primary/5" : "border-transparent bg-background/50 hover:bg-background",
                      )}
                    >
                      <div className={cn("h-4 w-4 rounded-full border-2 flex items-center justify-center", selectedCharityId === charity.id ? "border-primary bg-primary" : "border-muted")}>
                        {selectedCharityId === charity.id && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </div>
                      <span className={cn("font-bold text-[11px] uppercase tracking-tight", selectedCharityId === charity.id ? "text-primary" : "text-muted-foreground/60")}>
                        {charity.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/10 border-t p-8 flex flex-col gap-6">
              <Button
                className="w-full h-11 font-bold rounded-lg shadow-sm"
                disabled={!selectedCharityId || subscribeMutation.isPending}
                onClick={() => subscribeMutation.mutate({ plan: selectedPlan, charityId: selectedCharityId })}
              >
                {subscribeMutation.isPending ? "Connecting Protocol..." : "Activate Membership"}
              </Button>
              <div className="grid grid-cols-2 gap-4 w-full opacity-40">
                <div className="flex items-center justify-center gap-2 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                  <ShieldCheck className="h-3.5 w-3.5" /> SECURE GATEWAY
                </div>
                <div className="flex items-center justify-center gap-2 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                  <CreditCard className="h-3.5 w-3.5" /> INSTANT SYNC
                </div>
              </div>
            </CardFooter>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: ShieldCheck, title: "Identity Cleared", desc: "Transactions verified via SOC2 compliant infrastructure." },
              { icon: Heart, title: "Fluid Allocation", desc: "Modify your impact recipient at any point in the cycle." },
              { icon: Calendar, title: "Non-Custodial", desc: "No term locks. Disconnect your identity at your discretion." },
            ].map((feat, i) => (
              <div key={i} className="p-6 rounded-xl bg-card border shadow-sm space-y-3 text-center transition-all hover:border-primary/20">
                <feat.icon className="mx-auto h-5 w-5 opacity-40 text-primary" />
                <h4 className="font-bold text-xs uppercase tracking-widest">{feat.title}</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
