
import { redirect } from 'next/navigation';

export default function DashboardPage() {
    // Redireciona para a página de onboarding/perfil, que já tem a lógica 
    // para mostrar o perfil existente ou o formulário de criação.
    // Isso evita a tela intermediária "Gere seu portfólio".
    redirect('/onboarding');
}
