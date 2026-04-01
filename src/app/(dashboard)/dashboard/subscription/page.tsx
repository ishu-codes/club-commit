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
    name: "Monthly Impact",
    price: "999",
    interval: "month",
    desc: "For seasonal players looking to make a difference.",
  },
  {
    id: "YEARLY" as SubscriptionPlan,
    name: "Annual Hero",
    price: "9,999",
    interval: "year",
    desc: "The committed golfer's choice. 2 months free.",
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
      toast.success("Subscription activated successfully!");
    },
    onError: (err: any) => toast.error(err.message || "Failed to subscribe"),
  });

  const cancelMutation = useMutation({
    mutationFn: subscriptionFetchers.cancel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Subscription cancelled");
    },
  });

  const activeSub = dashboard?.subscription;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-64 w-full rounded-3xl" />
        <Skeleton className="h-96 w-full rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight underline decoration-primary/20 decoration-4 underline-offset-8">
          Subscription Governance
        </h1>
        <p className="text-muted-foreground mt-4 font-medium">
          Manage your commitment levels and strategic funding targets.
        </p>
      </div>

      {activeSub ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-primary/20 bg-primary/5 shadow-xl rounded-3xl overflow-hidden relative border-2">
            <CardHeader className="pb-8 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 font-black text-2xl tracking-tight">
                  <Crown className="h-8 w-8 text-primary fill-primary animate-pulse" />
                  Active {activeSub.plan} Protocol
                </div>
                <Badge className="bg-primary text-primary-foreground border-none px-4 py-1.5 font-black uppercase tracking-widest text-[10px] rounded-full">
                  ESTABLISHED
                </Badge>
              </div>
              <CardDescription className="text-base font-medium mt-2">
                Next billing cycle initialized on{" "}
                <span className="font-bold text-foreground underline decoration-primary/20">
                  {new Date(activeSub.endDate).toLocaleDateString()}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-8 rounded-2xl shadow-sm border bg-background group hover:border-primary/20 transition-all">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">
                    Billing Rate
                  </p>
                  <p className="text-4xl font-black tracking-tighter">
                    &#8377; {activeSub.plan === "YEARLY" ? "8.33" : "9.99"}
                    <span className="text-sm font-medium text-muted-foreground">/mo</span>
                  </p>
                </div>
                <div className="p-8 rounded-2xl shadow-sm border bg-background group hover:border-destructive/20 transition-all">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">
                    Impact Coefficient
                  </p>
                  <p className="text-4xl font-black text-destructive tracking-tighter">
                    {activeSub.contributionPercent}%
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 p-8 rounded-2xl border-2 border-primary/10 bg-background/50 backdrop-blur-sm group">
                <div className="h-20 w-20 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:rotate-12 transition-transform">
                  <Heart className="h-10 w-10 fill-current" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Impact Target</p>
                  <p className="text-2xl font-black tracking-tight">{activeSub.charity?.name || "No primary target"}</p>
                  <Link
                    href="/dashboard/charity"
                    className="text-xs font-black text-primary hover:underline mt-2 flex items-center gap-1.5 uppercase tracking-widest"
                  >
                    MODIFY PARTNER <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-between border-t p-8 bg-background/30 rounded-b-3xl gap-4 relative z-10">
              <div className="text-xs text-muted-foreground flex items-center gap-2 font-bold uppercase tracking-widest">
                <ShieldCheck className="h-4 w-4 text-primary" /> SECURE END-TO-END ENCRYPTION ACTIVE
              </div>
              <Button
                variant="ghost"
                className="text-muted-foreground/60 hover:text-destructive hover:bg-destructive/5 font-black text-xs uppercase tracking-widest h-10 px-6 rounded-xl"
                onClick={() => {
                  if (
                    confirm(
                      "TERMINATE COMMITMENT: Are you sure you want to cancel your stake? Access will be revoked at the end of the current cycle.",
                    )
                  ) {
                    cancelMutation.mutate();
                  }
                }}
              >
                Terminate Protocol
              </Button>
            </CardFooter>
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          </Card>

          <Card className="border-none shadow-sm h-fit rounded-3xl bg-muted/5">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-black uppercase tracking-tight">OPERATIONAL BENEFITS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-0">
              {[
                "Unlimited Temporal Data Tracking",
                "Global Prize Draw Eligibility",
                "Priority impact Contribution",
                "Verified Humanitarian Beacon",
                "Member Network Access",
              ].map((benefit, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 text-xs font-bold uppercase tracking-tight text-foreground/70"
                >
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <span>{benefit}</span>
                </div>
              ))}
            </CardContent>
            <Separator className="bg-muted/10" />
            <CardFooter className="pt-6 text-[10px] uppercase font-black tracking-widest text-muted-foreground/50 leading-relaxed">
              "Every stroke in the system translates to real-world capital recovery for our strategic partners."
            </CardFooter>
          </Card>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-12 pb-12">
          <Card className="border-none shadow-2xl overflow-hidden rounded-[2.5rem]">
            <CardHeader className="bg-primary text-primary-foreground text-center py-16 px-10 relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-5xl font-black tracking-tighter uppercase leading-none">COMMIT TO THE MISSION</h2>
                <p className="text-primary-foreground/70 mt-6 text-xl font-medium max-w-xl mx-auto leading-relaxed">
                  Establish your monthly stake to unlock performance tracking and global draw eligibility.
                </p>
              </div>
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
            </CardHeader>
            <CardContent className="p-12 md:p-16 space-y-12 bg-background">
              <div className="flex flex-col gap-6">
                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                  01. TEMPORAL DURATION PROTOCOL
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={cn(
                        "relative p-10 rounded-[2rem] border-2 cursor-pointer transition-all duration-500 group",
                        selectedPlan === plan.id
                          ? "border-primary bg-primary/5 ring-4 ring-primary/5 shadow-2xl scale-[1.02]"
                          : "border-muted/10 hover:border-primary/20 bg-muted/5",
                      )}
                    >
                      {selectedPlan === plan.id && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-xl tracking-widest">
                          SELECTED
                        </div>
                      )}
                      <p className="font-black text-2xl uppercase tracking-tighter transition-colors group-hover:text-primary">
                        {plan.name}
                      </p>
                      <div className="flex items-baseline gap-1 mt-6 flex-wrap">
                        <span className="text-5xl font-black tracking-tighter">&#8377; {plan.price}</span>
                        <span className="text-xs self-end font-bold text-muted-foreground uppercase tracking-widest">
                          / {plan.interval}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground font-medium mt-6 leading-relaxed">{plan.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                  02. PRIMARY IMPACT TARGET
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-h-[350px] overflow-y-auto pr-6 custom-scrollbar">
                  {charities?.map((charity) => (
                    <div
                      key={charity.id}
                      onClick={() => setSelectedCharityId(charity.id)}
                      className={cn(
                        "flex items-center gap-5 p-6 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-md",
                        selectedCharityId === charity.id
                          ? "border-primary bg-primary/5"
                          : "border-muted/10 hover:border-primary/30 bg-muted/5",
                      )}
                    >
                      <div
                        className={cn(
                          "h-7 w-7 rounded-xl border-2 flex items-center justify-center transition-all",
                          selectedCharityId === charity.id
                            ? "border-primary bg-primary shadow-lg shadow-primary/20"
                            : "border-muted/20 bg-background",
                        )}
                      >
                        {selectedCharityId === charity.id && <CheckCircle2 className="h-4 w-4 text-white" />}
                      </div>
                      <span
                        className={cn(
                          "font-black text-sm uppercase tracking-tight transition-colors",
                          selectedCharityId === charity.id ? "text-primary" : "text-muted-foreground",
                        )}
                      >
                        {charity.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/10 flex flex-col p-12 md:p-16 gap-10 border-t">
              <Button
                className="w-full h-20 text-2xl font-black rounded-3xl shadow-2xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.98]"
                disabled={!selectedCharityId || subscribeMutation.isPending}
                onClick={() => subscribeMutation.mutate({ plan: selectedPlan, charityId: selectedCharityId })}
              >
                {subscribeMutation.isPending ? "PROCESSING SECURE PROTOCOL..." : "INITIALIZE MEMBERSHIP"}
              </Button>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full">
                <div className="flex items-center justify-center gap-3 text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">
                  <ShieldCheck className="h-5 w-5 text-primary" /> SOC2 COMPLIANT ENCRYPTION
                </div>
                <div className="flex items-center justify-center gap-3 text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">
                  <CreditCard className="h-5 w-5 text-primary" /> INSTANT DATA CLEARANCE
                </div>
              </div>
            </CardFooter>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: "Tax Efficient",
                desc: "Financial flows managed through verified secure gateways.",
                color: "text-primary",
                bg: "bg-primary/5",
              },
              {
                icon: Heart,
                title: "Tactical Choice",
                desc: "Recalibrate your impact target at any point in the cycle.",
                color: "text-destructive",
                bg: "bg-destructive/5",
              },
              {
                icon: Calendar,
                title: "Non-Custodial",
                desc: "No term requirements. Disconnect easily from your hub.",
                color: "text-chart-4",
                bg: "bg-chart-4/5",
              },
            ].map((feat, i) => (
              <div
                key={i}
                className="p-10 rounded-[2.5rem] bg-background space-y-4 text-center border-2 border-muted/10 group hover:border-primary/20 transition-all hover:shadow-xl"
              >
                <div
                  className={cn(
                    "mx-auto h-16 w-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-12",
                    feat.bg,
                    feat.color,
                  )}
                >
                  <feat.icon className="h-8 w-8" />
                </div>
                <h4 className="font-black text-xl uppercase tracking-tighter mt-4">{feat.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
