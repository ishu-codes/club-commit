"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Heart,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Award,
  Info,
  LayoutGrid,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { charityFetchers } from "@/fetchers/charity";

const charitySchema = z.z.object({
  name: z.z.string().min(2, "Name is required"),
  description: z.z.string().min(10, "Description is too short. Be more descriptive about the impact."),
  website: z.z.string().url("Must be a valid URL").optional().or(z.z.literal("")),
  imageUrl: z.z.string().optional().or(z.z.literal("")),
});

export default function AdminCharitiesPage() {
  const queryClient = useQueryClient();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCharity, setEditingCharity] = useState<any>(null);
  const [search, setSearch] = useState("");

  const { data: charities, isLoading } = useQuery({
    queryKey: ["admin", "charities"],
    queryFn: charityFetchers.list,
    staleTime: 1000 * 60 * 5, // 5 min
  });

  const form = useForm<z.infer<typeof charitySchema>>({
    resolver: zodResolver(charitySchema),
    defaultValues: {
      name: "",
      description: "",
      website: "",
      imageUrl: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: charityFetchers.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "charities"] });
      toast.success("Charity partner established.");
      setIsAddOpen(false);
      form.reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (values: any) => charityFetchers.update(editingCharity.id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "charities"] });
      toast.success("Partner details updated.");
      setEditingCharity(null);
      setIsAddOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: charityFetchers.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "charities"] });
      toast.success("Partner removed from directory.");
    },
  });

  function onSubmit(values: z.infer<typeof charitySchema>) {
    if (editingCharity) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
  }

  const openEdit = (charity: any) => {
    setEditingCharity(charity);
    form.reset({
      name: charity.name,
      description: charity.description,
      website: charity.website || "",
      imageUrl: charity.imageUrl || "",
    });
    setIsAddOpen(true);
  };

  const filteredCharities = charities?.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight underline decoration-primary/20 decoration-4 underline-offset-8">
            Partner Ecosystem
          </h1>
          <p className="text-muted-foreground mt-4 font-medium italic">
            Strategic oversight of global non-profit funding nodes.
          </p>
        </div>
        <Button
          className="rounded-2xl px-10 shadow-xl shadow-primary/20 hover:shadow-primary/40 gap-3 font-black h-14 italic text-sm tracking-tight"
          onClick={() => {
            setEditingCharity(null);
            form.reset();
            setIsAddOpen(true);
          }}
        >
          <Plus className="h-5 w-5" /> INITIALIZE NEW PARTNER
        </Button>
      </div>

      <Card className="border-none shadow-2xl overflow-hidden rounded-[2.5rem] bg-background border-2 border-muted/10">
        <CardHeader className="bg-muted/5 border-b border-muted/10 p-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-black italic uppercase tracking-tighter">
                Strategic Directory
              </CardTitle>
              <CardDescription className="font-medium italic">
                System registry of active and archived impact targets.
              </CardDescription>
            </div>
            <div className="relative group">
              <Search className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Filter by identity or mission..."
                className="pl-12 w-full md:w-96 h-12 shadow-inner rounded-xl bg-background border-muted-foreground/10 focus-visible:ring-primary/20"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-10 space-y-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/30 text-muted-foreground uppercase text-[10px] font-black tracking-[0.3em] border-b border-muted/10">
                  <tr>
                    <th className="px-10 py-6">IDENTIFIED PARTNER</th>
                    <th className="px-10 py-6">ECONOMIC IMPACT</th>
                    <th className="px-10 py-6">VERIFICATION</th>
                    <th className="px-10 py-6 text-right">ADMIN CONTROL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-muted/10">
                  {filteredCharities?.map((charity) => (
                    <tr key={charity.id} className="hover:bg-muted/5 transition-all group">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-6">
                          <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center border-2 border-muted/20 group-hover:border-primary/20 group-hover:rotate-3 transition-all shadow-sm overflow-hidden shrink-0">
                            {charity.imageUrl ? (
                              <img src={charity.imageUrl} className="object-cover w-full h-full" alt="" />
                            ) : (
                              <Heart className="h-8 w-8 text-primary opacity-40 group-hover:opacity-100 transition-opacity" />
                            )}
                          </div>
                          <div>
                            <p className="font-black italic text-xl leading-none tracking-tight group-hover:text-primary transition-colors">
                              {charity.name}
                            </p>
                            <p className="text-xs text-muted-foreground font-medium mt-2 line-clamp-1 max-w-xs italic">
                              {charity.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="space-y-1">
                          <p className="text-2xl font-black text-primary italic leading-none tracking-tighter">
                            ${charity.totalReceived?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "0.00"}
                          </p>
                          <p className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest leading-none">
                            TOTAL RECOVERY
                          </p>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <a
                          href={charity.website}
                          target="_blank"
                          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-foreground bg-primary/10 hover:bg-primary px-4 py-2 rounded-full transition-all border border-primary/10 shadow-sm italic"
                        >
                          EXTERNAL AUDIT <ExternalLink className="h-3 w-3" />
                        </a>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <div className="flex justify-end gap-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-12 px-6 rounded-xl font-black italic text-xs uppercase tracking-widest gap-2 bg-muted/20 hover:bg-primary hover:text-primary-foreground"
                            onClick={() => openEdit(charity)}
                          >
                            <Edit2 className="h-4 w-4" /> Modify
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-12 w-12 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/20 transition-all"
                            onClick={() => {
                              if (confirm("ARCHIVE PARTNER: Permanently revoke active recognition for this cauase?")) {
                                deleteMutation.mutate(charity.id);
                              }
                            }}
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!filteredCharities?.length && (
                <div className="py-40 text-center flex flex-col items-center justify-center space-y-6 bg-muted/5">
                  <div className="h-24 w-24 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground/20 animate-pulse">
                    <LayoutGrid className="h-12 w-12" />
                  </div>
                  <div>
                    <p className="text-muted-foreground font-black italic text-2xl uppercase tracking-tighter">
                      Temporal Registry Empty
                    </p>
                    <p className="text-xs text-muted-foreground/60 font-medium tracking-[0.2em] uppercase">
                      No matching partners found in the current buffer.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="bg-foreground text-background p-10">
            <DialogTitle className="text-3xl font-black italic uppercase tracking-tight">
              {editingCharity ? "RECALIBRATE PARTNER" : "ESTABLISH PARTNER"}
            </DialogTitle>
            <DialogDescription className="text-background/60 font-medium italic text-lg mt-2">
              Define strategic parameters for impact node integration.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-10 space-y-8 bg-background">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                LEGAL IDENTITY
              </Label>
              <Input
                {...form.register("name")}
                placeholder="Primary Relief Node"
                className="h-14 text-xl font-black rounded-2xl bg-muted/20 border-none focus-visible:ring-primary/20"
              />
              {form.formState.errors.name && (
                <p className="text-xs text-destructive font-black italic tracking-tight">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                STRATEGIC OBJECTIVES
              </Label>
              <Textarea
                {...form.register("description")}
                placeholder="Outline tactical impact goals and verification protocols..."
                className="min-h-[150px] rounded-2xl bg-muted/20 border-none focus-visible:ring-primary/20 text-sm leading-relaxed p-6"
              />
              {form.formState.errors.description && (
                <p className="text-xs text-destructive font-black italic tracking-tight">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                  DOMAIN ENDPOINT
                </Label>
                <Input
                  {...form.register("website")}
                  placeholder="https://verified-impact.org"
                  className="h-12 rounded-xl border-muted-foreground/10 focus-visible:ring-primary/20"
                />
                {form.formState.errors.website && (
                  <p className="text-xs text-destructive font-black italic tracking-tight">
                    {form.formState.errors.website.message}
                  </p>
                )}
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                  VISUAL IDENTITY (URL)
                </Label>
                <Input
                  {...form.register("imageUrl")}
                  placeholder="https://..."
                  className="h-12 rounded-xl border-muted-foreground/10 focus-visible:ring-primary/20"
                />
              </div>
            </div>
            <DialogFooter className="pt-6">
              <Button
                type="submit"
                className="w-full h-20 text-2xl font-black italic rounded-2xl shadow-2xl shadow-primary/20 transition-all hover:scale-[1.01]"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending
                  ? "PROCESSING DATA LOAD..."
                  : editingCharity
                    ? "COMMIT RECALIBRATION"
                    : "FINALIZE INTEGRATION"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
