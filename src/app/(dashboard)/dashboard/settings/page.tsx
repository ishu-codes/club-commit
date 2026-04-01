"use client";

import { useQuery } from "@tanstack/react-query";
import { UserIcon, Smartphone, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
// import { cn } from "@/lib/utils";
import { authFetchers, User } from "@/fetchers/auth";
import { useSession } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function SettingsPage() {
  const { data: user } = useQuery<User>({
    queryKey: ["auth", "me"],
    queryFn: authFetchers.me,
  });
  const { data: session } = useSession();

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account preferences and security protocols.</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 rounded-lg">
          <TabsTrigger value="profile" className="px-6">
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="px-6">
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="px-6">
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="rounded-xl border shadow-sm">
            <CardHeader>
              <CardTitle>Public Profile</CardTitle>
              <CardDescription>Your identity within the ClubCommit network.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                {/*<div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 relative group overflow-hidden">*/}
                <Avatar className="w-24 h-24 cursor-pointer transition-opacity hover:opacity-80 relative group overflow-hidden">
                  <AvatarImage src={session?.user.image ?? ""} alt="profile" />
                  <AvatarFallback className="text-3xl font-semibold bg-primary/10 text-primary">
                    {session?.user.name.charAt(0)}
                  </AvatarFallback>
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <span className="text-[10px] text-white font-bold uppercase">Change</span>
                  </div>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-semibold">{session?.user.name || "Member Node"}</p>
                  <p className="text-xs text-muted-foreground">{session?.user.email}</p>
                  <div className="pt-2">
                    <Badge variant="secondary" className="px-2 py-0 h-5 text-[10px] font-bold uppercase">
                      Active Status
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input
                    id="name"
                    defaultValue={user?.name || ""}
                    placeholder={session?.user.name ?? "User"}
                    className="rounded-lg h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Primary Endpoint (Email)</Label>
                  <Input
                    id="email"
                    defaultValue={user?.email || ""}
                    placeholder={session?.user.email ?? "email@example.com"}
                    disabled
                    className="rounded-lg h-10 bg-muted/30"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/5 py-4">
              <Button size="sm" className="ml-auto rounded-lg px-6 font-bold">
                Update Profile
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="rounded-xl border shadow-sm">
            <CardHeader>
              <CardTitle>Authentication</CardTitle>
              <CardDescription>Secure your access credentials.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold flex items-center gap-2">
                      <Lock className="h-4 w-4 text-primary" /> Multi-factor Auth
                    </p>
                    <p className="text-xs text-muted-foreground">Add an extra layer of security to your node.</p>
                  </div>
                  <Switch />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-primary" /> Session Isolation
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Automatically log out from inactive browser sessions.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border border-destructive/20 bg-destructive/5 shadow-sm">
            <CardHeader>
              <CardTitle className="text-destructive">Delete your account</CardTitle>
              <CardDescription>Permanently delete your account.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-destructive/70 font-medium leading-relaxed">
                Deletion of this account is irreversible.
              </p>
              <p className="text-xs text-destructive/70 font-medium leading-relaxed">
                All performance data, contribution history, and eligibility will be permanently removed from the
                ClubCommit registry.
              </p>
            </CardContent>
            <CardFooter className="border-t border-destructive/10 pt-4">
              <Button variant="destructive" size="sm" className="rounded-lg font-bold">
                Delete Account
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="rounded-xl border shadow-sm">
            <CardHeader>
              <CardTitle>Communication Hub</CardTitle>
              <CardDescription>Control how you receive system alerts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold">Draw Results</p>
                    <p className="text-xs text-muted-foreground">Receive alerts when draw cycles are finalized.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold">Impact Reports</p>
                    <p className="text-xs text-muted-foreground">Monthly summaries of your charitable contributions.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold">Network Updates</p>
                    <p className="text-xs text-muted-foreground">
                      News about new strategic partners and platform features.
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
