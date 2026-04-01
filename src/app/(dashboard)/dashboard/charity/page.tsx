"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, Search, CheckCircle2, Info, SearchIcon } from "lucide-react";
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
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

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
          <h1 className="text-3xl font-extrabold tracking-tight">Support a Cause</h1>
          <p className="text-muted-foreground mt-1 underline decoration-primary/20 decoration-2 underline-offset-4">
            Choose where your contributions go. You can change this at any time.
          </p>
        </div>
      </div>

      {/* Current Selection Highlight */}
      {dashboard?.subscription && (
        <Card className="border-primary/20 bg-primary/5 shadow-sm overflow-hidden relative group">
          <CardContent className="pt-6 relative z-10">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-2xl group-hover:scale-110 transition-transform">
                <Heart className="h-6 w-6 text-primary fill-primary" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">
                  Currently Supporting
                </p>
                <h2 className="text-xl font-bold tracking-tight">
                  {dashboard.subscription.charity?.name || "No charity selected"}
                </h2>
                <p className="text-sm text-balance text-muted-foreground mt-1 line-clamp-2">
                  {dashboard.subscription.charity?.description}
                </p>
              </div>
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" />
        </Card>
      )}

      {/* Search and Grid */}
      <div className="space-y-6">
        <InputGroup className="gap-2 pl-4 h-14 text-lg rounded-2xl shadow-sm border-muted-foreground/10 focus-visible:ring-primary/2">
          <InputGroupInput
            id="inline-start-input"
            placeholder="Search charities by name or cause..."
            className=""
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <InputGroupAddon align="inline-start">
            <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </InputGroupAddon>
        </InputGroup>

        {loadingCharities ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-64 rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCharities?.map((charity) => (
              <Card
                key={charity.id}
                className={cn(
                  "overflow-hidden flex flex-col transition-all border-2 rounded-3xl group",
                  currentCharityId === charity.id
                    ? "border-primary shadow-xl ring-4 ring-primary/5"
                    : "border-muted/10 hover:border-primary/30 hover:shadow-lg",
                )}
              >
                <div className="aspect-[16/10] relative overflow-hidden">
                  <img
                    src={
                      charity.imageUrl ||
                      `https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=60`
                    }
                    alt={charity.name}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                  {currentCharityId === charity.id && (
                    <div className="absolute inset-0 bg-primary/10 backdrop-blur-[2px] flex items-center justify-center">
                      <Badge className="px-4 py-1 bg-background text-primary border-none font-black uppercase text-[10px] tracking-widest shadow-xl">
                        Active Choice
                      </Badge>
                    </div>
                  )}
                </div>
                <CardHeader className="pb-2 space-y-1">
                  <CardTitle className="text-xl font-bold tracking-tight">{charity.name}</CardTitle>
                  <CardDescription className="line-clamp-2 min-h-[40px] leading-relaxed">
                    {charity.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mt-2">
                    <div className="h-9 w-9 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground/70 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <Heart className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest leading-none">Impact Verified</p>
                      <p className="font-bold text-foreground/80">
                        {charity.totalReceived > 0
                          ? `$${charity.totalReceived.toLocaleString()} Total Funding`
                          : "Ready for funding"}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 pb-6 px-6">
                  {currentCharityId === charity.id ? (
                    <Button
                      className="w-full gap-2 rounded-xl h-11 border-primary/20 text-primary font-bold"
                      variant="outline"
                      disabled
                    >
                      <CheckCircle2 className="h-4 w-4" /> CURRENTLY ACTIVE
                    </Button>
                  ) : (
                    <Button
                      className="w-full rounded-xl h-11 font-black tracking-tight shadow-lg shadow-primary/10"
                      onClick={() => updateCharityMutation.mutate(charity.id)}
                      disabled={updateCharityMutation.isPending || !dashboard?.subscription}
                    >
                      {updateCharityMutation.isPending ? "PROCESSING..." : "ACTIVATE COMMITMENT"}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {!dashboard?.subscription && (
        <Card className="rounded-3xl border-destructive/20 bg-destructive/5 p-8 flex flex-col md:flex-row gap-8 items-center text-destructive">
          <div className="h-16 w-16 rounded-2xl bg-destructive/10 flex items-center justify-center shrink-0">
            <Info className="h-8 w-8" />
          </div>
          <div className="space-y-2 flex-1 text-center md:text-left">
            <h4 className="font-black text-xl uppercase tracking-tight leading-none">Subscription Required</h4>
            <p className="text-sm font-medium leading-relaxed max-w-xl text-destructive/80">
              You must establish an active monthly stake to support a cause and gain eligibility for prize draws. Join
              the mission today.
            </p>
          </div>
          <Link href="/dashboard/subscription" className="w-full md:w-auto">
            <Button
              size="lg"
              className="w-full font-black rounded-2xl h-14 px-8 border-none shadow-xl shadow-primary/20"
            >
              UNLIMIT YOUR IMPACT
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
