'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Loader2, Zap, BrainCircuit, TrendingUp, Shield, BarChart, FilePieChart, Beaker } from 'lucide-react';
import { monitorPortfolio } from '@/lib/actions';
import type { MonitorPortfolioOutput } from '@/ai/flows/monitor-portfolio-flow';
import { cn } from '@/lib/utils';
import type { StockInfo } from '@/services/brapi';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type Trend = 'alta' | 'queda' | 'estavel';

type MonitoramentoClientProps = {
    selicRate: number;
    ipcaRate: number;
    projectedSelicRate: number;
    selicTrend: Trend;
    projectedIpcaRate: number;
    ipcaTrend: Trend;
    ifixData: StockInfo | null;
    ibovData: StockInfo | null;
    dollarRate: number;
    ibovChange1d: number;
    ibovChange30d: number;
    ibovChange365d: number;
};

export default function MonitoramentoClient({ 
    selicRate, 
    ipcaRate, 
    projectedSelicRate, 
    selicTrend, 
    projectedIpcaRate, 
    ipcaTrend, 
    ifixData, 
    ibovData, 
    dollarRate,
    ibovChange1d,
    ibovChange30d,
    ibovChange365d 
}: MonitoramentoClientProps) {
  const { user } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, `users/${user.uid}/userProfiles/${user.uid}`);
  }, [user, firestore]);
  const { data: userProfile, isLoading: isLoadingProfile } = useDoc(userProfileRef);

  const [analysis, setAnalysis] = useState<MonitorPortfolioOutput | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const ifixChange = ifixData?.regularMarketChangePercent ?? 0;
  const ifixPointsChange = ifixData?.regularMarketChange ?? 0;
  
  const macroContext = {
      selicRate: selicRate,
      selicTrend: selicTrend,
      ipca12m: ipcaRate,
      ipcaTrend: ipcaTrend,
      ifixChange: ifixChange,
      ibovChange: ibovChange1d, // Mantém a mudança diária para contexto
      dollarRate: dollarRate,
      marketSentiment: 'neutro' as const, // Pode ser aprimorado no futuro
      ibovChange30d: ibovChange30d,
      ibovChange365d: ibovChange365d,
  };

  const handleAnalyzeClick = async () => {
    if (!userProfile) {
      setError('Seu perfil de investidor não foi encontrado. Por favor, preencha o onboarding primeiro.');
      return;
    }

    setIsLoadingAnalysis(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await monitorPortfolio({
        userProfile: {
          riskProfile: userProfile.perfilDeInvestimento?.avaliacaoDeRisco ?? 'moderado',
          investmentHorizon: userProfile.perfilDeInvestimento?.horizonteDeInvestimento ?? 'longo prazo',
          riskTolerance: userProfile.perfilDeInvestimento?.experienciaDeInvestimento ?? 'média',
        },
        macroContext: macroContext,
      });
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro ao gerar a análise. Por favor, tente novamente.');
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

    const getScenarioIcon = (scenario: string) => {
        switch (scenario) {
            case 'Otimista': return <TrendingUp className="text-green-500" />;
            case 'Pessimista': return <TrendingUp className="text-red-500 rotate-180" />;
            case 'Neutro': return <BarChart className="text-gray-500" />;
            case 'Cautela': return <Shield className="text-yellow-500" />;
            default: return <Zap className="text-primary" />;
        }
    }


  const AnalysisResult = () => (
    <div className="space-y-6 mt-8 animate-in fade-in-50">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    {getScenarioIcon(analysis!.cenarioDetectado)}
                    Cenário Detectado: {analysis?.cenarioDetectado}
                </CardTitle>
                <CardDescription>
                    {analysis?.explicacaoCenario}
                </CardDescription>
            </CardHeader>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <FilePieChart className="text-primary"/>
                    Alocação Recomendada para seu Aporte
                </CardTitle>
                <CardDescription>
                    Com base no cenário e no seu perfil, sugerimos a seguinte distribuição para seus próximos investimentos:
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-xl font-bold text-center text-foreground mb-4">{analysis?.alocacaoRecomendada}</p>
                <Alert>
                    <AlertTitle className="font-semibold">Racional da Recomendação</AlertTitle>
                    <AlertDescription>
                        {analysis?.racionalRecomendacao}
                    </AlertDescription>
                </Alert>
            </CardContent>
        </Card>
    </div>
  );

  const getTrendText = (trend: Trend) => {
    switch(trend) {
      case 'alta': return 'de alta';
      case 'queda': return 'de queda';
      case 'estavel': return 'de estabilidade';
    }
  }

  const formatPointsChange = (points: number) => {
      const sign = points > 0 ? '+' : '';
      return `${sign}${points.toFixed(2)}`;
  }
  
    const formatPercent = (value: number, decimals = 2) => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(decimals)}%`;
  }

  const debugData = {
    selicRate,
    ipcaRate,
    projectedSelicRate,
    selicTrend,
    projectedIpcaRate,
    ipcaTrend,
    dollarRate,
    ibovChange1d,
    ibovChange30d,
    ibovChange365d,
    ifixData,
    ibovData: {
      ...ibovData,
      historicalDataPrice: `O histórico de preços contém ${ibovData?.historicalDataPrice?.length ?? 0} registros. O primeiro é mostrado abaixo.`,
      firstHistoricalPoint: ibovData?.historicalDataPrice?.[0]
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline mb-2 flex items-center gap-3">
          <Zap className="text-primary" />
          Radar de Mercado
        </h1>
        <p className="text-muted-foreground">
          Analise o cenário macroeconômico atual e receba orientações personalizadas da nossa IA para manter sua carteira de investimentos saudável e alinhada.
        </p>
      </header>
      
      <Card className="text-center">
        <CardHeader>
            <CardTitle>Análise Contínua do seu Portfólio</CardTitle>
            <CardDescription>
                Clique no botão para que nossa IA analise os dados de mercado: 
                Dólar <span className="font-bold text-primary">R$ {dollarRate.toFixed(2)}</span>;
                SELIC atual de <span className="font-bold text-primary">{selicRate}%</span> (projeção: <span className="font-bold text-primary">{projectedSelicRate.toFixed(2)}%</span>, tendência {getTrendText(selicTrend)});
                IPCA acumulado de <span className="font-bold text-primary">{ipcaRate.toFixed(2)}%</span> (tendência {getTrendText(ipcaTrend)});
                IFIX (hoje): <span className={cn("font-bold", ifixChange > 0 ? 'text-green-600' : 'text-red-600')}>{formatPercent(ifixChange, 3)} / {formatPointsChange(ifixPointsChange)} pts</span>;
                IBOV (1D): <span className={cn("font-bold", ibovChange1d > 0 ? 'text-green-600' : 'text-red-600')}>{formatPercent(ibovChange1d)}</span>;
                IBOV (30D): <span className={cn("font-bold", ibovChange30d > 0 ? 'text-green-600' : 'text-red-600')}>{formatPercent(ibovChange30d)}</span>;
                IBOV (1A): <span className={cn("font-bold", ibovChange365d > 0 ? 'text-green-600' : 'text-red-600')}>{formatPercent(ibovChange365d)}</span>.
            </CardDescription>
        </CardHeader>
        <CardContent>
            {isLoadingProfile ? (
                 <Button disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Carregando perfil...
                </Button>
            ) : (
                <Button onClick={handleAnalyzeClick} disabled={isLoadingAnalysis}>
                    {isLoadingAnalysis ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analisando cenário...
                        </>
                    ) : (
                        <>
                            <BrainCircuit className="mr-2 h-4 w-4" />
                            Analisar e Recomendar Aporte
                        </>
                    )}
                </Button>
            )}
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="mt-8">
          <AlertTitle>Erro na Análise</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {analysis && <AnalysisResult />}

       <div className="mt-12">
            <Accordion type="single" collapsible>
                <AccordionItem value="debug-data">
                    <AccordionTrigger>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                           <Beaker className="h-4 w-4"/>
                           Dados Brutos da API (Depuração)
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <Card className="bg-muted/50">
                            <CardContent className="pt-6">
                                <pre className="text-xs whitespace-pre-wrap">
                                    <code>{JSON.stringify(debugData, null, 2)}</code>
                                </pre>
                            </CardContent>
                        </Card>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    </div>
  );
}
