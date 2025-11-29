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
      // Em um aplicativo real, isso viria da etapa de onboarding
      const userProfile =
        "Tolerância ao risco: média, Metas financeiras: crescimento a longo prazo, Experiência de investimento: iniciante.";
      const result = await generatePersonalizedInvestmentPortfolio({
        userProfile,
      });

      // Parse allocation string: "Ações: 60%, Títulos: 30%, Imóveis: 10%"
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
        title: "Erro",
        description: "Falha ao gerar o portfólio.",
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
        marketConditions: "Mercado estável com leve tendência de alta.",
        investmentGoals: "Crescimento a longo prazo.",
      });
      setAiResult({
        title: "Simulação de Desempenho do Portfólio",
        content: (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">Desempenho Projetado</h4>
              <p className="text-sm text-muted-foreground">{result.projectedPerformance}</p>
            </div>
            <div>
              <h4 className="font-semibold">Melhorias Sugeridas</h4>
              <p className="text-sm text-muted-foreground">{result.suggestedImprovements}</p>
            </div>
            <div>
              <h4 className="font-semibold">Análise de Risco</h4>
              <p className="text-sm text-muted-foreground">{result.riskAnalysis}</p>
            </div>
          </div>
        ),
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao executar a simulação.",
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
        marketData: "Ações de tecnologia subiram 5%, títulos estão estáveis.",
        userRiskProfile: "médio"
      });
       setAiResult({
        title: "Resultados do Monitoramento de Investimentos",
        content: (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">Melhorias Sugeridas</h4>
              <p className="text-sm text-muted-foreground">{result.suggestedImprovements}</p>
            </div>
            <div>
              <h4 className="font-semibold">Justificativa</h4>
              <p className="text-sm text-muted-foreground">{result.rationale}</p>
            </div>
          </div>
        ),
      });
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao monitorar os investimentos.",
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
        userProfile: "Tolerância ao risco: média, Metas financeiras: crescimento a longo prazo, Experiência de investimento: iniciante.",
        currentPortfolio: JSON.stringify(portfolio.allocation),
        marketConditions: "Mercado ligeiramente volátil com oportunidades em tecnologia emergente."
      });
       setAiResult({
        title: "Próximos Passos Recomendados",
        content: (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">Passos Recomendados</h4>
              <p className="text-sm text-muted-foreground">{result.recommendedSteps}</p>
            </div>
            <div>
              <h4 className="font-semibold">Justificativa</h4>
              <p className="text-sm text-muted-foreground">{result.rationale}</p>
            </div>
          </div>
        ),
      });
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao obter os próximos passos.",
      });
    } finally {
        setLoading(null);
    }
  };


  if (!portfolio) {
    return (
      <Card className="text-center">
        <CardHeader>
          <CardTitle>Gere Seu Portfólio Personalizado</CardTitle>
          <CardDescription>
            Deixe nossa IA analisar seu perfil e criar um plano de investimento personalizado para você começar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handlePortfolioGeneration} disabled={loading === "generate"}>
            {loading === "generate" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <BrainCircuit className="mr-2 h-4 w-4" />
            )}
            Gerar com IA
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Sua Alocação de Portfólio</CardTitle>
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
              <TrendingUp className="h-5 w-5 text-primary" /> Ferramentas de IA
            </CardTitle>
            <CardDescription>
              Analise e melhore seu portfólio.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button onClick={handleSimulation} disabled={!!loading} variant="outline">
              {loading === "simulate" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <AreaChart className="mr-2 h-4 w-4" />
              )}
              Simular Desempenho
            </Button>
             <Button onClick={handleMonitoring} disabled={!!loading} variant="outline">
              {loading === "monitor" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Monitorar Ativos
            </Button>
            <Button onClick={handleNextSteps} disabled={!!loading} variant="outline">
              {loading === "steps" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Lightbulb className="mr-2 h-4 w-4" />
              )}
              Recomendar Próximos Passos
            </Button>
          </CardContent>
        </Card>
      </div>
      
       <Dialog open={!!aiResult} onOpenChange={() => setAiResult(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{aiResult?.title}</DialogTitle>
            <DialogDescription>
                Desenvolvido por SafeStart Invest AI
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
