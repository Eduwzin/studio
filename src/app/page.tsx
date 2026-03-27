import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PublicHeader } from "@/components/public-header";
import { BookOpen, Bot, LineChart, Target } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicHeader />
      <main className="flex-grow">
        <section className="bg-background">
          <div className="container mx-auto px-4 py-16 md:py-24 text-center">
            <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4">
              Invista com confiança.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Seu guia de crescimento financeiro com inteligência artificial. O SafeStart Invest ajuda iniciantes a navegar no mundo dos investimentos com estratégias personalizadas, recursos educacionais e suporte contínuo.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg">
                  <Link href="/signup">Comece de Graça</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                    <Link href="/login">Já tenho conta</Link>
                </Button>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
          <div className="aspect-video max-w-4xl mx-auto rounded-lg overflow-hidden shadow-2xl">
            <video
              src="/grok-video-ae51d75e-d66a-4d0e-8235-44d4938470e8.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        <section className="bg-muted">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <h2 className="text-3xl font-bold text-center mb-12 font-headline">Recursos Desenhados para o Seu Sucesso</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <FeatureCard
                    icon={<Bot className="h-8 w-8 text-primary" />}
                    title="Análise com IA"
                    description="Nossa IA analisa seu perfil para criar uma estratégia de investimento personalizada só para você."
                    />
                    <FeatureCard
                    icon={<Target className="h-8 w-8 text-primary" />}
                    title="Portfólios Personalizados"
                    description="Receba uma alocação de portfólio sob medida, projetada para atender às suas metas financeiras e tolerância ao risco."
                    />
                    <FeatureCard
                    icon={<BookOpen className="h-8 w-8 text-primary" />}
                    title="Trilhas Educacionais"
                    description="Aprenda os fundamentos do investimento com nosso conteúdo educacional fácil de seguir."
                    />
                    <FeatureCard
                    icon={<LineChart className="h-8 w-8 text-primary" />}
                    title="Monitoramento Contínuo"
                    description="Ficamos de olho nos seus investimentos e sugerimos melhorias conforme as condições do mercado mudam."
                    />
                </div>
            </div>
        </section>
      </main>
      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} SafeStart Invest. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="text-center bg-card">
      <CardHeader>
        <div className="mx-auto bg-secondary rounded-full p-3 w-fit mb-4">
          {icon}
        </div>
        <CardTitle className="font-headline">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
