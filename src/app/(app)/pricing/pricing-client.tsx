'use client';

import { useState } from 'react';
import { useUser, useFirestore, useDoc, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Loader2, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const plans = {
    starter: {
        name: 'Starter',
        price: 'R$0',
        priceDescription: 'Para sempre',
        description: 'Comece sua jornada de investimentos com as ferramentas essenciais.',
        features: [
            'Definição do perfil de investidor',
            'Geração de carteira inicial',
            'Acesso à watchlist de ativos',
            'Portal de notícias do mercado',
            'Acesso ao blog e aulas básicas',
            'Atualização mensal da carteira',
        ]
    },
    pro: {
        name: 'Pro',
        price: 'R$19,90',
        priceDescription: 'por mês',
        description: 'Desbloqueie todo o poder da IA para otimizar seus investimentos.',
        features: [
            'Tudo do plano Starter',
            'Recomendações de ativos com IA',
            'Análise de mercado personalizada',
            'Recomendações baseadas na sua carteira',
            'Acesso a todas as aulas',
            'Atualização semanal da carteira',
        ],
        popular: true,
    },
    enterprise: {
        name: 'Enterprise',
        price: 'R$199',
        priceDescription: 'por mês',
        description: 'Uma solução B2B para consultores e empresas gerenciarem clientes.',
        features: [
            'Acesso multi-cliente',
            'Visualização de carteiras vinculadas',
            'Acompanhamento de informações',
            'Canal de intermediação com especialista',
        ],
        isB2B: true,
    }
}

export default function PricingClient() {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isUpgrading, setIsUpgrading] = useState(false);

    const userProfileRef = useMemoFirebase(() => {
        if (!user) return null;
        return doc(firestore, `users/${user.uid}/userProfiles/${user.uid}`);
    }, [user, firestore]);

    const { data: userProfile, isLoading: isLoadingProfile } = useDoc<any>(userProfileRef);

    const currentPlan = userProfile?.plan || 'starter';

    const handleUpgradePro = () => {
        if (!userProfileRef) return;
        setIsUpgrading(true);

        updateDocumentNonBlocking(userProfileRef, { plan: 'pro' });

        toast({
            title: 'Upgrade para o Plano Pro!',
            description: 'Parabéns! Você agora tem acesso a todas as funcionalidades Pro.',
        });
        
        // A interface será atualizada automaticamente pelo listener do useDoc
        // um pequeno delay para o feedback visual do botão
        setTimeout(() => setIsUpgrading(false), 1000);
    }
    
    if (isLoadingProfile) {
        return (
             <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
             </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto">
            <header className="text-center mb-12">
                <h1 className="text-3xl font-bold font-headline mb-2 flex items-center justify-center gap-3">
                    <CreditCard className="text-primary" />
                    Nossos Planos
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Escolha o plano que melhor se adapta à sua jornada de investidor. Comece de graça e evolua quando estiver pronto.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {Object.entries(plans).map(([key, plan]) => {
                    const isCurrent = currentPlan === key;
                    const isPro = key === 'pro';

                    return (
                        <Card key={key} className={cn(
                            "flex flex-col h-full",
                             isPro && "border-primary shadow-lg lg:scale-105"
                        )}>
                            <CardHeader className="text-center">
                                {plan.popular && <Badge className="w-fit mx-auto mb-2">Mais Popular</Badge>}
                                {plan.isB2B && <Badge variant="secondary" className="w-fit mx-auto mb-2">Para Empresas</Badge>}
                                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                <CardDescription>{plan.description}</CardDescription>
                                <div className="pt-4">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    <span className="text-muted-foreground">/{plan.priceDescription}</span>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <ul className="space-y-3 text-sm">
                                    {plan.features.map(feature => (
                                        <li key={feature} className="flex items-start">
                                            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                                            <span className="text-muted-foreground">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardContent>
                                {key === 'starter' && (
                                    <Button variant="outline" className="w-full" disabled>
                                        {isCurrent ? 'Seu Plano Atual' : 'Plano Gratuito'}
                                    </Button>
                                )}
                                {key === 'pro' && (
                                    isCurrent ? (
                                        <Button variant="outline" className="w-full" disabled>Seu Plano Atual</Button>
                                    ) : (
                                        <Button className="w-full" onClick={handleUpgradePro} disabled={isUpgrading}>
                                            {isUpgrading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                                            {currentPlan === 'starter' ? 'Fazer Upgrade para Pro' : 'Mudar para Pro'}
                                        </Button>
                                    )
                                )}
                                {key === 'enterprise' && (
                                    <Button variant="secondary" className="w-full">
                                        Entrar em Contato
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    );
}
