"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { analyzeUserProfile } from "@/lib/actions";
import { useState } from "react";
import { BrainCircuit, Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { useUser } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { Progress } from "@/components/ui/progress";

const questions = [
  {
    id: "objective",
    title: "O que você espera dos seus investimentos?",
    description: "Isso nos ajuda a entender seu objetivo e o risco que você aceita.",
    options: [
      { value: "security", label: "Quero segurança e não perder dinheiro" },
      { value: "conservative_growth", label: "Quero ganhar um pouco mais, mas sem arriscar muito" },
      { value: "growth", label: "Quero fazer meu dinheiro crescer, mesmo que oscile" },
      { value: "high_yield", label: "Quero alta rentabilidade, aceito riscos" },
    ],
  },
  {
    id: "timeframe",
    title: "Quando você pretende usar esse dinheiro?",
    description: "O prazo do seu investimento influencia o risco que podemos assumir.",
    options: [
      { value: "short_term", label: "Nos próximos meses" },
      { value: "medium_term_1_3", label: "Entre 1 e 3 anos" },
      { value: "medium_term_3_5", label: "Entre 3 e 5 anos" },
      { value: "long_term", label: "Só daqui a bastante tempo (mais de 5 anos)" },
    ],
  },
  {
    id: "loss_tolerance",
    title: "Como você se sentiria se seu investimento caísse um pouco?",
    description: "Sua reação a perdas temporárias é um indicador importante.",
    options: [
      { value: "very_worried", label: "Eu ficaria muito preocupado e tiraria o dinheiro" },
      { value: "uncomfortable", label: "Eu ficaria desconfortável, mas manteria" },
      { value: "understand", label: "Eu entenderia que faz parte" },
      { value: "invest_more", label: "Eu aproveitaria para investir mais" },
    ],
  },
    {
    id: "income_stability",
    title: "O quão estável é sua renda mensal?",
    description: "Se sua renda é incerta, um perfil mais conservador pode ser melhor.",
    options: [
      { value: "unstable", label: "Nada estável" },
      { value: "somewhat_unstable", label: "Pouco estável" },
      { value: "stable", label: "Estável" },
      { value: "very_stable", label: "Muito estável" },
    ],
  },
  {
    id: "liquidity_need",
    title: "Você pode deixar esse dinheiro parado ou pode precisar dele rápido?",
    description: "Isso nos ajuda a entender sua necessidade de liquidez.",
    options: [
      { value: "any_moment", label: "Posso precisar dele a qualquer momento" },
      { value: "can_wait", label: "Posso esperar um pouco" },
      { value: "long_time", label: "Posso deixar por bastante tempo" },
      { value: "very_long_time", label: "Não preciso mexer nesse dinheiro por muitos anos" },
    ],
  },
  {
    id: "experience",
    title: "Você já investiu antes?",
    description: "Sua experiência real nos ajuda a moldar a estratégia.",
    options: [
      { value: "never", label: "Nunca" },
      { value: "simple", label: "Já investi em algo simples (como poupança ou CDB)" },
      { value: "diverse", label: "Já investi em outras coisas (ações, FIIs, ETFs)" },
      { value: "risky", label: "Já investi até em coisas mais arriscadas (cripto, day trade etc.)" },
    ],
  },
  {
    id: "reaction_to_loss",
    title: "O que você faria se seus investimentos caíssem 10% em um mês?",
    description: "Seu comportamento real sob pressão é a chave.",
    options: [
      { value: "sell_all", label: "Venderia tudo" },
      { value: "wait", label: "Esperaria a recuperação" },
      { value: "hold_and_contribute", label: "Manteria e continuaria aportando" },
      { value: "buy_more", label: "Compraria mais porque está barato" },
    ],
  },
    {
    id: "risk_profile_sentence",
    title: "Qual dessas frases se parece mais com você?",
    description: "Esta pergunta nos ajuda a confirmar seu perfil de investidor.",
    options: [
      { value: "security_over_gains", label: "Prefiro ganhar menos, mas ter mais segurança" },
      { value: "some_risk_for_better_gains", label: "Aceito um pouco de risco para ter ganhos melhores" },
      { value: "accept_swings_for_good_returns", label: "Aceito oscilações para buscar bons retornos" },
      { value: "highest_returns_with_high_risk", label: "Quero os maiores retornos possíveis, mesmo com risco alto" },
    ],
  },
];

const formSchema = z.object({
  objective: z.string({ required_error: "Por favor, selecione uma opção." }),
  timeframe: z.string({ required_error: "Por favor, selecione uma opção." }),
  loss_tolerance: z.string({ required_error: "Por favor, selecione uma opção." }),
  income_stability: z.string({ required_error: "Por favor, selecione uma opção." }),
  liquidity_need: z.string({ required_error: "Por favor, selecione uma opção." }),
  experience: z.string({ required_error: "Por favor, selecione uma opção." }),
  reaction_to_loss: z.string({ required_error: "Por favor, selecione uma opção." }),
  risk_profile_sentence: z.string({ required_error: "Por favor, selecione uma opção." }),
});

type AnalysisResult = {
    investmentStrategy: string;
    assetAllocation: string;
    riskAssessment: string;
}

export default function OnboardingForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { user } = useUser();
  const firestore = useFirestore();
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const handleNext = async () => {
    const fieldToValidate = questions[currentStep].id as keyof z.infer<typeof formSchema>;
    const isValid = await form.trigger(fieldToValidate);
    if (isValid) {
      if (currentStep < questions.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        await onSubmit(form.getValues());
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setAnalysisResult(null);

    const fullUserProfile = `
      - Objetivo: ${values.objective}
      - Prazo: ${values.timeframe}
      - Tolerância a perdas: ${values.loss_tolerance}
      - Estabilidade da renda: ${values.income_stability}
      - Necessidade de liquidez: ${values.liquidity_need}
      - Experiência: ${values.experience}
      - Reação a quedas: ${values.reaction_to_loss}
      - Frase que define o perfil: ${values.risk_profile_sentence}
    `;

    try {
        const result = await analyzeUserProfile({
            age: 0,
            investmentAmount: 0,
            income: 0,
            riskTolerance: '',
            financialGoals: '',
            investmentExperience: fullUserProfile
        });
        setAnalysisResult(result);
        
        if (user) {
          const userProfileRef = doc(firestore, `users/${user.uid}/userProfiles/${user.uid}`);
          const profileData = {
            id: user.uid,
            email: user.email,
            firstName: user.displayName?.split(' ')[0] ?? '',
            lastName: user.displayName?.split(' ')[1] ?? '',
            ...values,
            riskAssessment: result.riskAssessment,
            investmentStrategy: result.investmentStrategy,
            assetAllocation: result.assetAllocation,
            age: 0,
            income: 0,
            investmentAmount: 0,
            riskTolerance: '',
            investmentExperience: values.experience,
            financialGoals: values.objective,
          };
          setDocumentNonBlocking(userProfileRef, profileData, { merge: true });
        }
        
        toast({
            title: "Análise Concluída!",
            description: "Criamos uma estratégia personalizada para você e salvamos no seu perfil.",
        });
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Falha na Análise",
            description: "Ocorreu um erro ao processar seu perfil. Por favor, tente novamente.",
        });
    } finally {
        setLoading(false);
    }
  }

  const currentQuestion = questions[currentStep];

  return (
    <div>
        {!analysisResult ? (
        <Form {...form}>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
                <Progress value={((currentStep + 1) / questions.length) * 100} className="mb-8" />
                <FormField
                    control={form.control}
                    name={currentQuestion.id as keyof z.infer<typeof formSchema>}
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                        <FormLabel className="text-xl font-bold">{currentQuestion.title}</FormLabel>
                        <FormDescription>{currentQuestion.description}</FormDescription>
                        <FormControl>
                            <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-2"
                            >
                            {currentQuestion.options.map((option) => (
                                <FormItem className="flex items-center space-x-3 space-y-0" key={option.value}>
                                    <FormControl>
                                        <RadioGroupItem value={option.value} />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                        {option.label}
                                    </FormLabel>
                                </FormItem>
                            ))}
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={handlePrevious} disabled={currentStep === 0 || loading}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Anterior
                    </Button>

                    {currentStep < questions.length - 1 ? (
                        <Button type="button" onClick={handleNext} disabled={loading}>
                            Próximo
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button type="button" onClick={handleNext} disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Analisando...
                                </>
                            ) : (
                                <>
                                    <BrainCircuit className="mr-2 h-4 w-4" />
                                    Analisar e Salvar Perfil
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </form>
        </Form>
        ) : (
            <Card className="bg-secondary animate-in fade-in-50">
                <CardHeader>
                    <CardTitle>Sua Estratégia Personalizada</CardTitle>
                    <CardDescription>Com base no seu perfil, aqui está a recomendação da nossa IA. Seu perfil foi salvo.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div>
                        <h4 className="font-semibold text-foreground">Estratégia de Investimento</h4>
                        <p className="text-muted-foreground">{analysisResult.investmentStrategy}</p>
                    </div>
                     <div>
                        <h4 className="font-semibold text-foreground">Alocação de Ativos Recomendada</h4>
                        <p className="text-muted-foreground">{analysisResult.assetAllocation}</p>
                    </div>
                     <div>
                        <h4 className="font-semibold text-foreground">Avaliação de Risco</h4>
                        <p className="text-muted-foreground">{analysisResult.riskAssessment}</p>
                    </div>
                </CardContent>
            </Card>
        )}
    </div>
  );
}

    