'use client';

import OnboardingForm from '@/components/onboarding/onboarding-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Loader2, Shield, BarChart, TrendingUp, CheckCircle2, Edit } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

function UserProfileDisplay({ profile, onEdit }: { profile: any; onEdit: () => void }) {
  const getProfileIcon = (profile: string) => {
    if (!profile) return <CheckCircle2 className="h-8 w-8 text-primary" />;
    switch (profile.toLowerCase()) {
      case 'conservador':
        return <Shield className="h-8 w-8 text-primary" />;
      case 'moderado':
        return <BarChart className="h-8 w-8 text-primary" />;
      case 'arrojado':
        return <TrendingUp className="h-8 w-8 text-primary" />;
      default:
        return <CheckCircle2 className="h-8 w-8 text-primary" />;
    }
  };

  const allocationData = (profile.perfilDeInvestimento?.alocacaoDeAtivos || '')
    .split(',')
    .map((item: string) => {
      const parts = item.trim().split(':');
      if (parts.length !== 2) return null;
      const name = parts[0];
      const valueString = parts[1]?.replace('%', '').trim();
      const value = parseInt(valueString);
      if (isNaN(value)) return null;
      return { name, value };
    })
    .filter((item: any): item is { name: string; value: number } => item !== null && item.value > 0);

  const chartConfig = allocationData.reduce((acc: any, item: any) => {
    acc[item.name] = { label: item.name };
    return acc;
  }, {});

  const avaliacaoDeRisco = profile.perfilDeInvestimento?.avaliacaoDeRisco ?? 'N/A';
  const estrategiaDeInvestimento = profile.perfilDeInvestimento?.estrategiaDeInvestimento ?? 'Nenhuma estratégia definida.';

  return (
    <div className="space-y-6">
      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit mb-2">
            {getProfileIcon(avaliacaoDeRisco)}
          </div>
          <CardDescription>Seu perfil de investidor é</CardDescription>
          <CardTitle className="text-4xl">{avaliacaoDeRisco}</CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Carteira Recomendada</CardTitle>
          <CardDescription>{estrategiaDeInvestimento}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
            {allocationData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Pie data={allocationData} dataKey="value" nameKey="name" innerRadius="60%" strokeWidth={5}>
                    {allocationData.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Nenhuma alocação de ativos disponível.
              </div>
            )}
          </ChartContainer>
          {allocationData.length > 0 && (
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-4">
              {allocationData.map((item: any, index: number) => (
                <div key={item.name} className="flex items-center gap-2 text-sm">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                  />
                  <span className="font-medium">{item.name}:</span>
                  <span className="text-muted-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <div className="text-center">
        <Button onClick={onEdit} variant="outline">
          <Edit className="mr-2 h-4 w-4" />
          Refazer Análise
        </Button>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [isEditing, setIsEditing] = useState(false);

  const userProfileRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, `users/${user.uid}/userProfiles/${user.uid}`);
  }, [user, firestore]);

  const { data: userProfile, isLoading } = useDoc(userProfileRef);

  const handleProfileSaved = () => {
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (userProfile && userProfile.perfilDeInvestimento && !isEditing) {
    return (
      <div className="max-w-3xl mx-auto">
        <UserProfileDisplay profile={userProfile} onEdit={() => setIsEditing(true)} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold font-headline mb-2">Seu Perfil de Investidor</h1>
      <p className="text-muted-foreground mb-8">
        Conte-nos um pouco sobre você para que nossa IA possa criar a estratégia de investimento perfeita. Suas informações nos ajudam a adaptar as recomendações às suas metas financeiras e conforto com o risco.
      </p>
      <Card>
        <CardHeader>
          <CardTitle>Crie ou Atualize Seu Perfil</CardTitle>
          <CardDescription>Isso levará apenas alguns minutos.</CardDescription>
        </CardHeader>
        <CardContent>
          <OnboardingForm onProfileSaved={handleProfileSaved} />
        </CardContent>
      </Card>
    </div>
  );
}
