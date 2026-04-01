"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, Search, CheckCircle2, Info } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { charityFetchers } from "@/fetchers/charity";
import { dashboardFetchers } from "@/fetchers/dashboard";
import { subscriptionFetchers } from "@/fetchers/subscription";

export default function CharityPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: charities, isLoading: loadingCharities } = useQuery({
    queryKey: ["charities"],
    queryFn: charityFetchers.list,
    staleTime: 1000 * 60 * 5, // 5 min
  });

  const { data: dashboard, isLoading: loadingDashboard } = useQuery({
    queryKey: ["dashboard"],
    queryFn: dashboardFetchers.get,
    staleTime: 1000 * 60 * 5, // 5 min
  });

  const updateCharityMutation = useMutation({
    mutationFn: subscriptionFetchers.updateCharity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Charity updated successfully");
    },
    onError: (err: any) => toast.error(err.message || "Failed to update charity"),
  });

  const currentCharityId = dashboard?.subscription?.charityId;

  const filteredCharities = charities?.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Support a Cause</h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">Choose where your contributions go. Change at any time.</p>
        </div>
      </div>

      {dashboard?.subscription && (
        <Card className="bg-muted/5 border shadow-sm rounded-xl overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-2.5 rounded-lg shrink-0">
                <Heart className="h-5 w-5 text-primary fill-primary/20" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-0.5">Currently Supporting</p>
                <h2 className="text-lg font-bold">{dashboard.subscription.charity?.name || "None selected"}</h2>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-1 max-w-2xl font-medium">
                  {dashboard.subscription.charity?.description || "Select a cause below to begin your impact journey."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search causes..."
            className="pl-9 h-9 rounded-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loadingCharities ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCharities?.map((charity) => (
              <Card
                key={charity.id}
                className={cn(
                  "overflow-hidden flex flex-col transition-all rounded-xl border shadow-sm group",
                  currentCharityId === charity.id ? "ring-2 ring-primary border-transparent" : "hover:border-primary/40",
                )}
              >
                <div className="aspect-[16/9] relative overflow-hidden bg-muted">
                  <img
                    src={charity.imageUrl || `https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=60`}
                    alt={charity.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  {currentCharityId === charity.id && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-primary text-primary-foreground border-none font-bold uppercase text-[9px] shadow-sm">
                        Selected
                      </Badge>
                    </div>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{charity.name}</CardTitle>
                  <CardDescription className="line-clamp-2 min-h-[40px] text-xs font-medium leading-relaxed">
                    {charity.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-4">
                  <div className="flex items-center gap-2.5 text-muted-foreground">
                    <Heart className="h-3.5 w-3.5 text-primary" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider leading-none text-muted-foreground/60">Impact Tracking</p>
                      <p className="text-xs font-semibold text-foreground/80 mt-1">
                        {charity.totalReceived > 0
                          ? `$${charity.totalReceived.toLocaleString()} Funding Goal`
                          : "Ready for first commit"}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 pb-6">
                  {currentCharityId === charity.id ? (
                    <Button
                      className="w-full gap-2 rounded-lg h-9 text-xs font-bold"
                      variant="secondary"
                      disabled
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Active Choice
                    </Button>
                  ) : (
                    <Button
                      className="w-full rounded-lg h-9 text-xs font-bold shadow-sm"
                      onClick={() => updateCharityMutation.mutate(charity.id)}
                      disabled={updateCharityMutation.isPending || !dashboard?.subscription}
                    >
                      {updateCharityMutation.isPending ? "Updating..." : "Activate Partner"}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {!dashboard?.subscription && (
        <Card className="rounded-xl border-destructive/20 bg-destructive/5 p-6 flex flex-col md:flex-row gap-6 items-center">
          <div className="h-12 w-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
            <Info className="h-6 w-6" />
          </div>
          <div className="space-y-1 flex-1 text-center md:text-left">
            <h4 className="text-sm font-bold text-destructive uppercase tracking-widest leading-none">Subscription Required</h4>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              Establishing a monthly stake is necessary to start supporting partners and gain eligibility for prize cycles.
            </p>
          </div>
          <Button size="sm" variant="destructive" asChild className="w-full md:w-auto font-bold shadow-md shadow-destructive/10">
            <Link href="/dashboard/subscription">Get Started</Link>
          </Button>
        </Card>
      )}
    </div>
  );
}
