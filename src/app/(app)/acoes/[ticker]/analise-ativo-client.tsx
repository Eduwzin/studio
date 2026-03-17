'use client';

import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { StockInfo } from '@/services/brapi';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertCircle,
  BarChart,
  Lightbulb,
  Newspaper,
  Shield,
  TrendingUp,
  ChevronRight,
  Info
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { AnalyzeAssetForPageOutput } from '@/lib/actions';
import { Skeleton } from '@/components/ui/skeleton';


// Componente para o Hero Section
function HeroAtivo({ stock }: { stock: StockInfo }) {
  const isPositive = (stock.regularMarketChangePercent ?? 0) >= 0;
  return (
    <section className="bg-muted/50 border-b">
      <div className="container mx-auto px-4 py-12 text-center md:text-left">
        <div className="md:flex justify-between items-center">
            <div>
                <p className="text-lg font-semibold text-primary">{stock.symbol}</p>
                <h1 className="text-3xl md:text-4xl font-bold font-headline mt-1">
                    {stock.longName}: como diferentes perfis analisam esta ação
                </h1>
                <p className="text-muted-foreground mt-2 max-w-3xl mx-auto md:mx-0">
                    Esta é uma análise contextual e educacional sobre o ativo, baseada em dados e perfis de investidor, e não representa uma recomendação de compra ou venda.
                </p>
            </div>
            <div className="mt-6 md:mt-0 text-right flex-shrink-0">
                <p className={`text-3xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    R$ {stock.regularMarketPrice.toFixed(2)}
                </p>
                <p className={`font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? '+' : ''}{stock.regularMarketChange.toFixed(2)} ({isPositive ? '+' : ''}{stock.regularMarketChangePercent.toFixed(2)}%)
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                    Atualizado em {new Date(stock.regularMarketTime).toLocaleDateString('pt-BR')}
                </p>
            </div>
        </div>
      </div>
    </section>
  );
}

// Componente para o Resumo Rápido (agora dinâmico)
function ResumoAtivo({ summary }: { summary?: string }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Resumo Executivo do Ativo</CardTitle>
            </CardHeader>
            <CardContent>
                {summary ? (
                    <p className="text-muted-foreground">{summary}</p>
                ) : (
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}


// Componente para a Análise da IA (agora dinâmico)
function AnaliseContextualIA({ analysis }: { analysis?: string }) {
    return (
        <Card className="bg-primary/5 border-primary/20">
             <CardHeader>
                <CardTitle>Análise Contextual da IA</CardTitle>
                <CardDescription>Combinando dados fundamentalistas, macroeconomia e notícias.</CardDescription>
            </CardHeader>
            <CardContent>
                 {analysis ? (
                    <p className="text-muted-foreground italic">"{analysis}"</p>
                 ) : (
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                    </div>
                 )}
            </CardContent>
        </Card>
    );
}

// Componente para os dados fundamentalistas
function DadosFundamentalistas({ stock }: { stock: StockInfo }) {
  const data = [
    { label: 'P/L', value: stock.priceEarnings?.toFixed(2) ?? 'N/A' },
    { label: 'P/VP', value: stock.priceToBook?.toFixed(2) ?? 'N/A' },
    { label: 'Dividend Yield', value: `${stock.dividendYield?.toFixed(2) ?? 'N/A'}%` },
    { label: 'LPA', value: `R$ ${stock.earningsPerShare?.toFixed(2) ?? 'N/A'}` },
    { label: 'VPA', value: `R$ ${stock.bookValue?.toFixed(2) ?? 'N/A'}` },
    { label: 'Valor de Mercado', value: `R$ ${(stock.marketCap / 1e9).toFixed(2)} B` },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados Fundamentalistas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y">
          {data.map(item => (
            <div key={item.label} className="flex justify-between items-center py-3 first:pt-0 last:pb-0">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-semibold text-lg">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Componente para Contextos
function ContextosDeAnalise() {
    const contextos = [
        "Geração de renda com dividendos",
        "Exposição ao setor de energia e commodities",
        "Estratégias com maior tolerância à volatilidade",
        "Análises ligadas ao ciclo de preços do petróleo"
    ];
    return (
        <Card>
            <CardHeader>
                <CardTitle>Em quais contextos este ativo costuma ser analisado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {contextos.map(ctx => (
                    <div key={ctx} className="flex items-center gap-3">
                        <ChevronRight className="h-5 w-5 text-primary" />
                        <span className="text-muted-foreground">{ctx}</span>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

// Componente para Riscos
function RiscosEAtencao() {
    const riscos = [
        { title: "Influência Política", desc: "Decisões governamentais podem impactar a estratégia e os preços da empresa." },
        { title: "Volatilidade do Petróleo", desc: "O preço da ação é sensível às flutuações globais do preço do barril de petróleo." },
        { title: "Política de Dividendos", desc: "A distribuição de lucros pode ser alterada, afetando o retorno para o acionista." },
        { title: "Riscos Regulatórios", desc: "Mudanças nas regulações do setor de óleo e gás podem afetar a operação." },
    ];
    return (
        <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-3 text-destructive">
                    <AlertCircle />
                    Riscos e Pontos de Atenção
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {riscos.map(r => (
                    <div key={r.title}>
                        <h4 className="font-semibold">{r.title}</h4>
                        <p className="text-sm text-muted-foreground">{r.desc}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

// Componente para Bloco de Personalização
function BlocoPersonalizacao() {
    const { user } = useUser();
    const firestore = useFirestore();
    const userProfileRef = useMemoFirebase(() => {
        if (!user) return null;
        return doc(firestore, `users/${user.uid}/userProfiles/${user.uid}`);
    }, [user, firestore]);
    const { data: userProfile } = useDoc<any>(userProfileRef);

    if (!userProfile?.perfilDeInvestimento?.avaliacaoDeRisco) return null;

    return (
        <Card className="text-center">
            <CardHeader>
                <CardTitle>Análise para Seu Perfil</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">Seu perfil se aproxima mais do <strong className="text-primary">{userProfile.perfilDeInvestimento.avaliacaoDeRisco}</strong>. Veja acima como essa persona tende a interpretar a PETR4.</p>
            </CardContent>
        </Card>
    )
}

// Componente principal do lado do cliente
export default function AnaliseAtivoClient({ stockInfo, aiAnalysis }: { stockInfo: StockInfo; aiAnalysis: AnalyzeAssetForPageOutput | null }) {
  const personaIcons = {
    'Beagle Conservador': <Shield className="h-8 w-8 text-blue-500" />,
    'Beagle Moderado': <BarChart className="h-8 w-8 text-green-500" />,
    'Beagle Agressivo': <TrendingUp className="h-8 w-8 text-red-500" />,
    'Beagle Oportunista': <Lightbulb className="h-8 w-8 text-yellow-500" />,
  };
  
  const personaAnalysesWithIcons = aiAnalysis?.personaAnalyses.map(p => ({
    ...p,
    icon: personaIcons[p.title as keyof typeof personaIcons] || <Info />,
  }));

  return (
    <div>
      <HeroAtivo stock={stockInfo} />

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-8">
            <ResumoAtivo summary={aiAnalysis?.executiveSummary} />

            <h2 className="text-2xl font-bold font-headline">Como cada Beagle interpreta {stockInfo.symbol}</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {(personaAnalysesWithIcons || Array(4).fill(null)).map((p, index) => (
                <Card key={p?.title || index} className="flex flex-col">
                  <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                    {p ? (
                      <>
                        <div className="bg-muted p-3 rounded-full">{p.icon}</div>
                        <CardTitle>{p.title}</CardTitle>
                      </>
                    ) : (
                      <>
                        <Skeleton className="h-14 w-14 rounded-full" />
                        <Skeleton className="h-6 w-32" />
                      </>
                    )}
                  </CardHeader>
                  <CardContent className="flex-grow">
                    {p ? (
                      <p className="text-sm text-muted-foreground">{p.analysis}</p>
                    ) : (
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <AnaliseContextualIA analysis={aiAnalysis?.contextualAIAnalysis} />
            
            <ContextosDeAnalise />

            {/* Seção de Notícias (Placeholder) */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><Newspaper />Notícias e Leitura da Semana</CardTitle>
                    <CardDescription>As notícias mais recentes sobre o ativo e o setor.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground text-center py-4">Em breve: notícias relevantes e o resumo da semana aparecerão aqui.</p>
                </CardContent>
            </Card>

          </div>

          {/* Coluna Lateral */}
          <div className="space-y-8">
            <DadosFundamentalistas stock={stockInfo} />
            <RiscosEAtencao />
            <BlocoPersonalizacao />
          </div>
        </div>

        <Separator className="my-12" />

        {/* Links Internos e CTA */}
        <div className="text-center">
            <h2 className="text-2xl font-bold font-headline">Explore Mais</h2>
            <p className="text-muted-foreground mt-2 mb-6">Continue sua jornada de análise na plataforma.</p>
            <div className="flex flex-wrap justify-center gap-4">
                <Button variant="outline" asChild><Link href="/acoes/vale3">Analisar VALE3</Link></Button>
                <Button variant="outline" asChild><Link href="/acoes/itub4">Analisar ITUB4</Link></Button>
                <Button variant="secondary" asChild><Link href="/onboarding">Ver meu perfil completo</Link></Button>
            </div>
        </div>

      </div>
    </div>
  );
}
