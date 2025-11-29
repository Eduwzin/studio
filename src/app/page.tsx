import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { BookOpen, Bot, LineChart, Target } from "lucide-react";
import Link from "next/link";
import Image from 'next/image';
import { placeholderImages } from "@/lib/content";

export default function Home() {
  const heroImage = placeholderImages.find(p => p.id === 'hero');

  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Logo />
      </header>
      <main className="flex-grow">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-headline font-bold text-foreground mb-4">
              Invest with confidence.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Your AI-powered guide to financial growth. SafeStart Invest helps beginners navigate the world of investments with personalized strategies, educational resources, and continuous support.
            </p>
            <Button asChild size="lg">
              <Link href="/onboarding">Get Started for Free</Link>
            </Button>
          </div>
        </section>

        {heroImage && (
           <section className="container mx-auto px-4 sm:px-6 lg:px-8">
             <div className="relative aspect-[2/1] md:aspect-[3/1] rounded-xl overflow-hidden shadow-2xl">
                <Image 
                  src={heroImage.imageUrl} 
                  alt={heroImage.description} 
                  fill
                  className="object-cover"
                  data-ai-hint={heroImage.imageHint}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
             </div>
           </section>
        )}

        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <h2 className="text-3xl font-bold text-center mb-12 font-headline">Features Designed for Your Success</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Bot className="h-8 w-8 text-primary" />}
              title="AI-Powered Analysis"
              description="Our AI analyzes your profile to create a personalized investment strategy just for you."
            />
            <FeatureCard
              icon={<Target className="h-8 w-8 text-primary" />}
              title="Custom Portfolios"
              description="Receive a tailored portfolio allocation designed to meet your financial goals and risk tolerance."
            />
            <FeatureCard
              icon={<BookOpen className="h-8 w-8 text-primary" />}
              title="Educational Trails"
              description="Learn the fundamentals of investing with our easy-to-follow educational content."
            />
            <FeatureCard
              icon={<LineChart className="h-8 w-8 text-primary" />}
              title="Continuous Monitoring"
              description="We keep an eye on your investments and suggest improvements as market conditions change."
            />
          </div>
        </section>
      </main>
      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} SafeStart Invest. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="text-center">
      <CardHeader>
        <div className="mx-auto bg-secondary rounded-full p-3 w-fit mb-4">
          {icon}
        </div>
        <CardTitle className="font-headline">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
