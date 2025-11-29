import OnboardingForm from "@/components/onboarding/onboarding-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function OnboardingPage() {
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
