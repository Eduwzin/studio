'use client';

import { useState } from 'react';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Lightbulb, BrainCircuit, TrendingUp, Shield, BarChart, FileText } from 'lucide-react';
import { suggestAssets, monitorPortfolio } from '@/lib/actions';
import type { SuggestAssetsOutput } from '@/ai/flows/suggest-assets-flow';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function OportunidadesClient() {
  const { user } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, `users/${user.uid}/userProfiles/${user.uid}`);
  }, [user, firestore]);
  const { data: userProfile, isLoading: isLoadingProfile } = useDoc(userProfileRef);

  const [suggestions, setSuggestions] = useState<SuggestAssetsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSuggestClick = async () => {
    if (!userProfile?.perfilDeInvestimento) {
      setError('Seu perfil de investidor não foi encontrado. Por favor, preencha o onboarding primeiro.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuggestions(null);

    try {
      // Passo 1: Obter a análise de mercado do Radar de Mercado (de forma silenciosa)
      const marketAnalysisResult = await monitorPortfolio({
        userProfile: {
          riskProfile: userProfile.perfilDeInvestimento.avaliacaoDeRisco,
          investmentHorizon: userProfile.perfilDeInvestimento.horizonteDeInvestimento,
          riskTolerance: userProfile.perfilDeInvestimento.experienciaDeInvestimento,
        },
        // Os dados de macroeconomia são buscados no lado do servidor dentro da action.
        // Se a action precisasse deles aqui, teríamos que buscá-los primeiro.
        macroContext: {} as any, // A action/flow busca os dados.
        projectedSelic: 0,
        projectedIpca: 0
      });

      // Passo 2: Usar a análise de mercado para gerar sugestões de ativos
      const result = await suggestAssets({
        riskProfile: userProfile.perfilDeInvestimento.avaliacaoDeRisco,
        marketAnalysis: `Cenário detectado: ${marketAnalysisResult.cenarioDetectado}. Justificativa: ${marketAnalysisResult.racionalRecomendacao}`,
      });

      setSuggestions(result);
    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro ao gerar as sugestões. A IA pode estar ocupada, por favor, tente novamente em alguns instantes.');
    } finally {
      setIsLoading(false);
    }
  };

  const getAssetTypeIcon = (type: string) => {
    switch (type) {
      case 'Ação': return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case 'FII': return <Shield className="h-5 w-5 text-green-500" />;
      case 'ETF': return <BarChart className="h-5 w-5 text-purple-500" />;
      default: return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold font-headline mb-2 flex items-center justify-center gap-3">
          <Lightbulb className="text-primary" />
          Oportunidades com IA
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Com base na análise de mercado e no seu perfil, nossa IA busca ativos que podem ser interessantes para sua carteira.
        </p>
      </header>

      <Card className="text-center">
        <CardHeader>
          <CardTitle>Gerar Sugestões de Ativos</CardTitle>
          <CardDescription>
            Clique no botão para que nossa IA analise o mercado e sugira oportunidades de investimento personalizadas para o seu perfil.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingProfile ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Carregando seu perfil...
            </Button>
          ) : (
            <Button onClick={handleSuggestClick} disabled={isLoading || !userProfile}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Buscando oportunidades...
                </>
              ) : (
                <>
                  <BrainCircuit className="mr-2 h-4 w-4" />
                  Gerar Sugestões de Ativos
                </>
              )}
            </Button>
          )}
           {!userProfile && !isLoadingProfile && (
             <p className="text-sm text-red-500 mt-2">Você precisa ter um perfil de investidor criado para gerar sugestões.</p>
           )}
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="mt-8">
          <AlertTitle>Erro na Análise</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {suggestions && suggestions.suggestions.length > 0 && (
        <div className="space-y-6 mt-8 animate-in fade-in-50">
           <h2 className="text-2xl font-bold text-center">Sugestões de Ativos para Você</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestions.suggestions.map((suggestion, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader>
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            {getAssetTypeIcon(suggestion.type)}
                            <CardTitle>{suggestion.ticker}</CardTitle>
                        </div>
                        <Badge variant="secondary">{suggestion.type}</Badge>
                    </div>
                  <CardDescription className="pt-1">{suggestion.name}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                    <Separator className="my-2"/>
                  <p className="text-sm text-muted-foreground italic">"{suggestion.rationale}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
       {suggestions && suggestions.suggestions.length === 0 && (
         <Alert className="mt-8">
          <AlertTitle>Nenhuma Sugestão Encontrada</AlertTitle>
          <AlertDescription>A IA não encontrou sugestões específicas no momento. Tente novamente mais tarde.</AlertDescription>
        </Alert>
       )}
    </div>
  );
}
