import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Zap } from "lucide-react";

type ProFeatureGateProps = {
  title: string;
  description: string;
};

export default function ProFeatureGate({ title, description }: ProFeatureGateProps) {
  return (
    <div className="max-w-2xl mx-auto mt-10">
      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit mb-4">
            <Zap className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>Funcionalidade do Plano Pro</CardTitle>
          <CardDescription>
            A página de "{title}" é um recurso exclusivo para assinantes do plano Pro.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{description}</p>
          <Button asChild size="lg">
            <Link href="/pricing">Ver Planos e Fazer Upgrade</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
