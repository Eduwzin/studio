"use client";

import { useState } from "react";
import {
  generatePersonalizedInvestmentPortfolio,
  recommendNextInvestmentSteps,
  simulatePortfolioPerformance,
  monitorInvestmentsForImprovements,
} from "@/lib/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  AreaChart,
  BarChart,
  BrainCircuit,
  Lightbulb,
  Loader2,
  PieChart as PieChartIcon,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

type Portfolio = {
  allocation: { name: string; value: number }[];
  summary: string;
};

type AIResult = {
  title: string;
  content: React.ReactNode;
};

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export default function DashboardClient() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const { toast } = useToast();

  const handlePortfolioGeneration = async () => {
    setLoading("generate");
    try {
      // In a real app, this would come from the onboarding step
      const userProfile =
        "Risk tolerance: medium, Financial goals: long-term growth, Investment experience: beginner.";
      const result = await generatePersonalizedInvestmentPortfolio({
        userProfile,
      });

      // Parse allocation string: "Stocks: 60%, Bonds: 30%, Real Estate: 10%"
      const allocation = result.portfolioAllocation
        .split(", ")
        .map((item) => {
          const [name, value] = item.split(": ");
          return { name, value: parseInt(value) };
        });

      setPortfolio({ allocation, summary: result.recommendationSummary });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate portfolio.",
      });
    } finally {
      setLoading(null);
    }
  };

  const handleSimulation = async () => {
    if (!portfolio) return;
    setLoading("simulate");
    try {
      const result = await simulatePortfolioPerformance({
        portfolioDescription: JSON.stringify(portfolio.allocation),
        marketConditions: "Stable market with slight upward trend.",
        investmentGoals: "Long-term growth.",
      });
      setAiResult({
        title: "Portfolio Performance Simulation",
        content: (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">Projected Performance</h4>
              <p className="text-sm text-muted-foreground">{result.projectedPerformance}</p>
            </div>
            <div>
              <h4 className="font-semibold">Suggested Improvements</h4>
              <p className="text-sm text-muted-foreground">{result.suggestedImprovements}</p>
            </div>
            <div>
              <h4 className="font-semibold">Risk Analysis</h4>
              <p className="text-sm text-muted-foreground">{result.riskAnalysis}</p>
            </div>
          </div>
        ),
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to run simulation.",
      });
    } finally {
      setLoading(null);
    }
  };
  
  const handleMonitoring = async () => {
    if (!portfolio) return;
    setLoading("monitor");
    try {
      const result = await monitorInvestmentsForImprovements({
        portfolio: JSON.stringify(portfolio.allocation),
        marketData: "Tech stocks are up 5%, bonds are stable.",
        userRiskProfile: "medium"
      });
       setAiResult({
        title: "Investment Monitoring Results",
        content: (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">Suggested Improvements</h4>
              <p className="text-sm text-muted-foreground">{result.suggestedImprovements}</p>
            </div>
            <div>
              <h4 className="font-semibold">Rationale</h4>
              <p className="text-sm text-muted-foreground">{result.rationale}</p>
            </div>
          </div>
        ),
      });
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to monitor investments.",
      });
    } finally {
        setLoading(null);
    }
  };

  const handleNextSteps = async () => {
    if (!portfolio) return;
    setLoading("steps");
     try {
      const result = await recommendNextInvestmentSteps({
        userProfile: "Risk tolerance: medium, Financial goals: long-term growth, Investment experience: beginner.",
        currentPortfolio: JSON.stringify(portfolio.allocation),
        marketConditions: "Slightly volatile market with opportunities in emerging tech."
      });
       setAiResult({
        title: "Recommended Next Steps",
        content: (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">Recommended Steps</h4>
              <p className="text-sm text-muted-foreground">{result.recommendedSteps}</p>
            </div>
            <div>
              <h4 className="font-semibold">Rationale</h4>
              <p className="text-sm text-muted-foreground">{result.rationale}</p>
            </div>
          </div>
        ),
      });
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get next steps.",
      });
    } finally {
        setLoading(null);
    }
  };


  if (!portfolio) {
    return (
      <Card className="text-center">
        <CardHeader>
          <CardTitle>Generate Your Personalized Portfolio</CardTitle>
          <CardDescription>
            Let our AI analyze your profile and create a custom investment plan
            to get you started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handlePortfolioGeneration} disabled={loading === "generate"}>
            {loading === "generate" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <BrainCircuit className="mr-2 h-4 w-4" />
            )}
            Generate with AI
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Your Portfolio Allocation</CardTitle>
          <CardDescription>{portfolio.summary}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full aspect-[2/1]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={portfolio.allocation}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="60%"
                  strokeWidth={5}
                >
                  {portfolio.allocation.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                      radius={[4, 4, 4, 4]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {portfolio.allocation.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                  }}
                />
                <span className="text-sm text-muted-foreground">
                  {item.name}: {item.value}%
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" /> AI Tools
            </CardTitle>
            <CardDescription>
              Analyze and improve your portfolio.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button onClick={handleSimulation} disabled={!!loading} variant="outline">
              {loading === "simulate" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <AreaChart className="mr-2 h-4 w-4" />
              )}
              Simulate Performance
            </Button>
             <Button onClick={handleMonitoring} disabled={!!loading} variant="outline">
              {loading === "monitor" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Monitor Assets
            </Button>
            <Button onClick={handleNextSteps} disabled={!!loading} variant="outline">
              {loading === "steps" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Lightbulb className="mr-2 h-4 w-4" />
              )}
              Recommend Next Steps
            </Button>
          </CardContent>
        </Card>
      </div>
      
       <Dialog open={!!aiResult} onOpenChange={() => setAiResult(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{aiResult?.title}</DialogTitle>
            <DialogDescription>
                Powered by SafeStart Invest AI
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 text-sm">
            {aiResult?.content}
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
