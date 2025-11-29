'use client';

import OnboardingForm from "@/components/onboarding/onboarding-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { Loader2 } from "lucide-react";

function UserProfileDisplay({ profile }: { profile: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Seu Perfil de Investidor</CardTitle>
        <CardDescription>Estes são os detalhes e a estratégia personalizada que a IA criou para você.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem label="Idade" value={profile.age} />
          <InfoItem label="Renda Anual" value={`R$ ${profile.income.toLocaleString()}`} />
          <InfoItem label="Tolerância ao Risco" value={profile.riskTolerance} />
          <InfoItem label="Experiência" value={profile.investmentExperience} />
        </div>
        <InfoItem label="Metas Financeiras" value={profile.financialGoals} />
        <div className="space-y-4 pt-4 border-t">
            <h4 className="font-semibold text-foreground">Sua Estratégia Personalizada</h4>
            <InfoItem label="Estratégia de Investimento" value={profile.investmentStrategy} />
            <InfoItem label="Alocação de Ativos Recomendada" value={profile.assetAllocation} />
            <InfoItem label="Avaliação de Risco" value={profile.riskAssessment} />
        </div>
      </CardContent>
    </Card>
  )
}

function InfoItem({ label, value }: { label: string, value: string | number }) {
    return (
        <div className="text-sm">
            <p className="font-medium text-foreground">{label}</p>
            <p className="text-muted-foreground">{value}</p>
        </div>
    )
}


export default function OnboardingPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, `users/${user.uid}/userProfiles/${user.uid}`);
  }, [user, firestore]);

  const { data: userProfile, isLoading } = useDoc(userProfileRef);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (userProfile) {
    return (
      <div className="max-w-3xl mx-auto">
        <UserProfileDisplay profile={userProfile} />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
       <h1 className="text-3xl font-bold font-headline mb-2">Seu Perfil de Investidor</h1>
      <p className="text-muted-foreground mb-8">
        Conte-nos um pouco sobre você para que nossa IA possa criar a estratégia de investimento perfeita. Suas informações nos ajudam a adaptar as recomendações às suas metas financeiras e conforto com o risco.
      </p>
      <Card>
        <CardHeader>
            <CardTitle>Crie Seu Perfil</CardTitle>
            <CardDescription>Isso levará apenas alguns minutos.</CardDescription>
        </CardHeader>
        <CardContent>
            <OnboardingForm />
        </CardContent>
      </Card>
    </div>
  );
}
