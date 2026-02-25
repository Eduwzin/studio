
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Loader2, Zap, BrainCircuit, TrendingUp, Shield, BarChart, FilePieChart, Beaker, ShieldCheck } from 'lucide-react';
import { monitorPortfolio } from '@/lib/actions';
import type { MonitorPortfolioOutput } from '@/lib/actions';
import { cn } from '@/lib/utils';
import type { StockInfo, DollarInfo } from '@/services/brapi';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import ChatWidget from '@/components/monitoramento/chat-widget';

type Trend = 'alta' | 'queda' | 'estavel';

type MonitoramentoClientProps = {
    selicRate: number;
    ipcaRate: number;
    projectedCurrentYearSelic: number;
    projectedNextYearSelic: number;
    projectedIpcaRate: number;
    ipcaTrend: Trend;
    ifixData: StockInfo | null;
    ibovData: StockInfo | null;
    dollarInfo: DollarInfo;
    ibovChange1d: number;
    ibovChange30d: number;
    ibovChange365d: number;
};

export default function MonitoramentoClient({ 
    selicRate, 
    ipcaRate, 
    projectedCurrentYearSelic,
    projectedNextYearSelic,
    projectedIpcaRate, 
    ipcaTrend, 
    ifixData, 
    ibovData, 
    dollarInfo,
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
      });
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro ao gerar a análise. Por favor, tente novamente.');
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

    const getScenarioIcon = (scenario?: string) => {
        if (!scenario) return <Zap className="text-primary" />;
        if (scenario.includes('juros em queda')) return <TrendingUp className="text-green-500" />;
        if (scenario.includes('juros altos')) return <Shield className="text-blue-500" />;
        if (scenario.includes('renda variável')) return <BarChart className="text-purple-500" />;
        if (scenario.includes('proteção')) return <Shield className="text-yellow-500" />;
        return <Zap className="text-primary" />;
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

  const formatPercent = (value: number, decimals = 2) => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(decimals)}%`;
  }

  const userProfileContextString = `Perfil de risco: ${userProfile?.perfilDeInvestimento?.avaliacaoDeRisco}, Horizonte: ${userProfile?.perfilDeInvestimento?.horizonteDeInvestimento}`;
  const marketContextString = `SELIC atual: ${selicRate}%, Projeção SELIC (ano seguinte): ${projectedNextYearSelic}%. IPCA (12m): ${ipcaRate}%. Dólar: ${dollarInfo.currentRate.toFixed(2)}. IBOV (1A): ${formatPercent(ibovChange365d)}`;


  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline mb-2 flex items-center gap-3">
          <ShieldCheck className="text-primary" />
          Minha Carteira
        </h1>
        <p className="text-muted-foreground">
          Analise o cenário macroeconômico atual e receba orientações personalizadas da nossa IA para manter sua carteira de investimentos saudável e alinhada.
        </p>
      </header>
      
      <Card className="text-center">
        <CardHeader>
            <CardTitle>Análise Contínua do seu Portfólio</CardTitle>
            <CardDescription className="text-sm space-y-1">
                <p>Clique no botão para que nossa IA analise os dados de mercado e gere uma recomendação de aporte.</p>
                <p className="font-semibold">
                    SELIC: <span className="text-primary">{selicRate.toFixed(2)}%</span>
                    &nbsp;&bull;&nbsp;
                    Projeção {new Date().getFullYear()}: <span className="text-primary">{projectedCurrentYearSelic.toFixed(2)}%</span>
                    &nbsp;&bull;&nbsp;
                    Projeção {new Date().getFullYear() + 1}: <span className="text-primary">{projectedNextYearSelic.toFixed(2)}%</span>
                </p>
                <p className="font-semibold">
                    Inflação (12m): <span className="text-primary">{ipcaRate.toFixed(2)}%</span>
                    &nbsp;&bull;&nbsp;
                    Projeção (Focus): <span className="text-primary">{projectedIpcaRate.toFixed(2)}%</span>
                    &nbsp;&bull;&nbsp;
                    Dólar: <span className="text-primary">R$ {dollarInfo.currentRate.toFixed(2)}</span>
                </p>
                 <p className="font-semibold">
                    IBOV (1D): <span className={cn(ibovChange1d >= 0 ? "text-green-600" : "text-red-600")}>{formatPercent(ibovChange1d)}</span>
                    &nbsp;&bull;&nbsp;
                    IBOV (30D): <span className={cn(ibovChange30d >= 0 ? "text-green-600" : "text-red-600")}>{formatPercent(ibovChange30d)}</span>
                    &nbsp;&bull;&nbsp;
                    IBOV (1A): <span className={cn(ibovChange365d >= 0 ? "text-green-600" : "text-red-600")}>{formatPercent(ibovChange365d)}</span>
                </p>
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

      {userProfile && (
        <ChatWidget 
            userProfileContext={userProfileContextString}
            marketContext={analysis ? `Análise gerada: ${analysis.cenarioDetectado}. ${analysis.explicacaoCenario}` : marketContextString}
        />
      )}

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
                                <pre className="text-xs whitespace-pre-wrap max-h-60 overflow-y-auto">
                                    <code>{JSON.stringify({ selicRate, ipcaRate, projectedCurrentYearSelic, projectedNextYearSelic, projectedIpcaRate, ipcaTrend, ifixData, ibovData, dollarInfo, ibovChange1d, ibovChange30d, ibovChange365d }, null, 2)}</code>
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
