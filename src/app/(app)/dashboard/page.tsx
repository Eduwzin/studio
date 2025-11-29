import DashboardClient from "@/components/dashboard/dashboard-client";

export default function DashboardPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold font-headline mb-2">Welcome Back, Investor!</h1>
            <p className="text-muted-foreground mb-8">Here's a snapshot of your investment journey. Use our AI tools to plan your next move.</p>
            <DashboardClient />
        </div>
    )
}
