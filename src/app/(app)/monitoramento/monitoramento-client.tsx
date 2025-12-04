'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Loader2, Zap, Newspaper, Shield, LineChart, Target, BrainCircuit } from 'lucide-react';
import { monitorPortfolio } from '@/lib/actions';
import type { MonitorPortfolioOutput } from '@/ai/flows/monitor-portfolio-flow';

type MonitoramentoClientProps = {
    selicRate: number;
    ipcaRate: number;
};

export default function MonitoramentoClient({ selicRate, ipcaRate }: MonitoramentoClientProps) {
  const { user } = useUser();
  const firestore = useFirestore();

  // Busca o perfil do usuário no Firestore
  const userProfileRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, `users/${user.uid}/userProfiles/${user.uid}`);
  }, [user, firestore]);
  const { data: userProfile, isLoading: isLoadingProfile } = useDoc(userProfileRef);

  const [analysis, setAnalysis] = useState<MonitorPortfolioOutput | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // O contexto macroeconômico agora usa a SELIC e IPCA reais e simula o resto
  const macroContext = {
      selicRate: selicRate,
      selicTrend: 'estavel' as const,
      ipca12m: ipcaRate,
      ipcaTrend: 'queda' as const,
      ifixChange: 2.5,
      ibovChange: 5.0,
      dollarRate: 5.15,
      marketSentiment: 'neutro' as const,
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

  const AnalysisResult = () => (
    <div className="space-y-6 mt-8 animate-in fade-in-50">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Newspaper className="text-primary" />
            Leitura do Cenário Atual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{analysis?.scenarioAnalysis}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="text-primary" />
            Como Isso Afeta Seu Perfil
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{analysis?.userProfileImpact}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="text-primary" />
            Próximos Passos Recomendados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{analysis?.recommendedNextSteps}</p>
        </CardContent>
      </Card>
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="text-primary" />
            Justificativa das Recomendações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{analysis?.recommendationRationale}</p>
        </CardContent>
      </Card>
    </div>
  );

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
            <CardDescription>Clique no botão abaixo para que nossa IA analise os dados mais recentes do mercado, incluindo a taxa SELIC de <span className="font-bold text-primary">{selicRate}%</span> e o IPCA acumulado de <span className="font-bold text-primary">{ipcaRate.toFixed(2)}%</span>, e forneça os próximos passos ideais para o seu perfil.</CardDescription>
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
                            Analisar e Recomendar Próximos Passos
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

    </div>
  );
}
