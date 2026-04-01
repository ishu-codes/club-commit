import Link from "next/link";
import { Trophy, Heart, Users, ArrowRight, CheckCircle2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="container relative z-10">
            <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
              <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
                <Heart className="mr-1 h-4 w-4" />
                <span>Golf with a Purpose</span>
              </div>
              <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight">
                Your Game, Their <span className="text-primary italic">Future.</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
                The golf platform where every hole played helps a child thrive. Subcribe, enter your scores, and win big
                while supporting premium charities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/sign-up">
                  <Button size="lg" className="px-8 h-14 text-lg gap-2">
                    Start Winning & Giving <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button size="lg" variant="outline" className="px-8 h-14 text-lg">
                    How it Works
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 w-full max-w-3xl border-t mt-12">
                <div className="flex flex-col">
                  <span className="text-3xl font-bold">$1.2M+</span>
                  <span className="text-sm text-muted-foreground uppercase tracking-wider">Donated</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold">24k+</span>
                  <span className="text-sm text-muted-foreground uppercase tracking-wider">Members</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold">150k+</span>
                  <span className="text-sm text-muted-foreground uppercase tracking-wider">Scores Logged</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold">$500k+</span>
                  <span className="text-sm text-muted-foreground uppercase tracking-wider">Prizes Won</span>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-primary/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-0 right-0 translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[128px]" />
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 bg-zinc-50 dark:bg-zinc-950">
          <div className="container">
            <div className="flex flex-col items-center text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-5xl font-bold">Simple Way to Make Impact</h2>
              <p className="text-muted-foreground max-w-2xl text-lg">
                Joining ClubCommit is easy. You play the game you love, we handle the giving and the rewards.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "1. Subscribe",
                  desc: "Join our community with a monthly or yearly plan. 10% or more of your fee goes directly to charities.",
                  icon: <Trophy className="h-10 w-10 text-primary" />,
                },
                {
                  title: "2. Track Scores",
                  desc: "Enter your Stableford scores after each round. We keep track of your performance on our leaderboard.",
                  icon: <Users className="h-10 w-10 text-primary" />,
                },
                {
                  title: "3. Win & Give",
                  desc: "Participate in monthly draws. The better you play, the higher your chances in algorithm-based draws.",
                  icon: <Heart className="h-10 w-10 text-primary" />,
                },
              ].map((step, i) => (
                <Card key={i} className="border-none shadow-sm bg-background">
                  <CardHeader className="items-center text-center pb-2">
                    <div className="mb-4 rounded-2xl bg-primary/5 p-4 ring-1 ring-primary/10 font-bold">
                      {step.icon}
                    </div>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-muted-foreground">{step.desc}</CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Charities Section */}
        <section id="charities" className="py-24">
          <div className="container">
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-4">
              <div className="space-y-4 text-left max-w-2xl">
                <h2 className="text-3xl md:text-5xl font-bold">The Lives You're Changing</h2>
                <p className="text-muted-foreground text-lg">
                  We partner with high-impact charities dedicated to youth development through sport and education.
                </p>
              </div>
              <Button variant="ghost" className="gap-2">
                View all partners <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "First Tee",
                  desc: "Building game-changers by providing educational programs that build character.",
                  image: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800",
                },
                {
                  name: "Golf Fights Cancer",
                  desc: "Leveraging the golf community to fund research and raise awareness.",
                  image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800",
                },
                {
                  name: "Folds of Honor",
                  desc: "Providing educational scholarships to families of fallen military members.",
                  image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800",
                },
              ].map((charity, i) => (
                <div key={i} className="group relative overflow-hidden rounded-3xl bg-zinc-100 aspect-[4/5]">
                  <img
                    src={charity.image}
                    alt={charity.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end">
                    <h3 className="text-2xl font-bold text-white mb-2">{charity.name}</h3>
                    <p className="text-zinc-300 text-sm line-clamp-2">{charity.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 bg-primary text-primary-foreground overflow-hidden relative">
          <div className="container relative z-10">
            <div className="flex flex-col items-center text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-5xl font-bold">Join the Movement</h2>
              <p className="text-primary-foreground/80 max-w-2xl text-lg">
                Choose a plan that fits your game and your heart.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="bg-background text-foreground border-none shadow-2xl relative overflow-hidden">
                <CardHeader className="pb-8">
                  <div className="w-12 h-1 bg-primary mb-4" />
                  <CardTitle className="text-3xl font-bold">Monthly Impact</CardTitle>
                  <CardDescription>Perfect for seasonal players</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-baseline">
                    <span className="text-5xl font-extrabold tracking-tight">$9.99</span>
                    <span className="text-muted-foreground ml-1">/month</span>
                  </div>
                  <ul className="space-y-3">
                    {[
                      "Enter unlimited scores",
                      "Automatic monthly draw entry",
                      "Support your favorite charity",
                      "Dashboard access",
                      "Digital member profile",
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/sign-up?plan=monthly" className="block pt-4">
                    <Button className="w-full h-12 text-lg">Start Monthly</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 text-white border-none shadow-2xl relative">
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-xs font-bold uppercase tracking-widest rounded-bl-xl">
                  Best Value
                </div>
                <CardHeader className="pb-8">
                  <div className="w-12 h-1 bg-primary mb-4" />
                  <CardTitle className="text-3xl font-bold">Annual Hero</CardTitle>
                  <CardDescription className="text-zinc-400">For the committed golfer</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-baseline text-white">
                    <span className="text-5xl font-extrabold tracking-tight">$99.99</span>
                    <span className="text-zinc-400 ml-1">/year</span>
                  </div>
                  <p className="text-sm text-primary font-medium italic">Save 20% compared to monthly</p>
                  <ul className="space-y-3 text-zinc-300">
                    {[
                      "Everything in Monthly",
                      "12 Month Draw entries",
                      "Special annual Hero badge",
                      "Prepaid charity impact",
                      "Priority draw placement",
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 font-medium">
                        <Star className="h-5 w-5 text-primary fill-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/sign-up?plan=yearly" className="block pt-4">
                    <Button className="w-full h-12 text-lg bg-primary hover:bg-primary/90 text-primary-foreground border-none">
                      Become an Annual Hero
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-[80px]" />
        </section>
      </main>

      <footer className="bg-zinc-950 text-zinc-400 py-12 border-t border-zinc-800">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-white">
                <Trophy className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold tracking-tight">ClubCommit</span>
              </div>
              <p className="max-w-xs text-sm">
                The world's first charity-first golf subscription platform. Bridging the gap between the game we love
                and the causes that matter.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h4 className="text-white font-bold uppercase text-xs tracking-widest">Platform</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="#how-it-works" className="hover:text-primary transition-colors">
                      How it works
                    </Link>
                  </li>
                  <li>
                    <Link href="#pricing" className="hover:text-primary transition-colors">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link href="/draws" className="hover:text-primary transition-colors">
                      Draw Results
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-white font-bold uppercase text-xs tracking-widest">Charity</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="#charities" className="hover:text-primary transition-colors">
                      Partner Charities
                    </Link>
                  </li>
                  <li>
                    <Link href="/impact" className="hover:text-primary transition-colors">
                      Our Impact
                    </Link>
                  </li>
                  <li>
                    <Link href="/apply" className="hover:text-primary transition-colors">
                      Apply as Charity
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-white font-bold uppercase text-xs tracking-widest">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/privacy" className="hover:text-primary transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="hover:text-primary transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
            <p>© {new Date().getFullYear()} ClubCommit. All rights reserved.</p>
            <p>Made with ❤️ for the game by Ishu.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
