import DashboardClient from "@/components/dashboard/dashboard-client";

export default function DashboardPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold font-headline mb-2">Bem-vindo de volta, Investidor!</h1>
            <p className="text-muted-foreground mb-8">Aqui está um resumo da sua jornada de investimento. Use nossas ferramentas de IA para planejar seu próximo movimento.</p>
            <DashboardClient />
        </div>
    )
}
