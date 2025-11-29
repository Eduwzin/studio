'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { analyzeUserProfile } from '@/lib/actions';
import { useState } from 'react';
import {
  BrainCircuit,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Shield,
  BarChart,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useUser } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Input } from '../ui/input';

const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

const questions = [
  {
    id: 'age',
    title: 'Qual a sua idade?',
    description: 'Sua idade nos ajuda a entender seu horizonte de investimento.',
    type: 'number'
  },
  {
    id: 'objective',
    title: 'O que você espera dos seus investimentos?',
    description: 'Isso nos ajuda a entender seu objetivo e o risco que você aceita.',
    options: [
      { value: 'security', label: 'Quero segurança e não perder dinheiro' },
      { value: 'conservative_growth', label: 'Quero ganhar um pouco mais, mas sem arriscar muito' },
      { value: 'growth', label: 'Quero fazer meu dinheiro crescer, mesmo que oscile' },
      { value: 'high_yield', label: 'Quero alta rentabilidade, aceito riscos' },
    ],
  },
  {
    id: 'timeframe',
    title: 'Quando você pretende usar esse dinheiro?',
    description: 'O prazo do seu investimento influencia o risco que podemos assumir.',
    options: [
      { value: 'short_term', label: 'Nos próximos meses' },
      { value: 'medium_term_1_3', label: 'Entre 1 e 3 anos' },
      { value: 'medium_term_3_5', label: 'Entre 3 e 5 anos' },
      { value: 'long_term', label: 'Só daqui a bastante tempo (mais de 5 anos)' },
    ],
  },
  {
    id: 'loss_tolerance',
    title: 'Como você se sentiria se seu investimento caísse um pouco?',
    description: 'Sua reação a perdas temporárias é um indicador importante.',
    options: [
      { value: 'very_worried', label: 'Eu ficaria muito preocupado e tiraria o dinheiro' },
      { value: 'uncomfortable', label: 'Eu ficaria desconfortável, mas manteria' },
      { value: 'understand', label: 'Eu entenderia que faz parte' },
      { value: 'invest_more', label: 'Eu aproveitaria para investir mais' },
    ],
  },
  {
    id: 'income_stability',
    title: 'O quão estável é sua renda mensal?',
    description: 'Se sua renda é incerta, um perfil mais conservador pode ser melhor.',
    options: [
      { value: 'unstable', label: 'Nada estável' },
      { value: 'somewhat_unstable', label: 'Pouco estável' },
      { value: 'stable', label: 'Estável' },
      { value: 'very_stable', label: 'Muito estável' },
    ],
  },
  {
    id: 'liquidity_need',
    title: 'Você pode deixar esse dinheiro parado ou pode precisar dele rápido?',
    description: 'Isso nos ajuda a entender sua necessidade de liquidez.',
    options: [
      { value: 'any_moment', label: 'Posso precisar dele a qualquer momento' },
      { value: 'can_wait', label: 'Posso esperar um pouco' },
      { value: 'long_time', label: 'Posso deixar por bastante tempo' },
      { value: 'very_long_time', label: 'Não preciso mexer nesse dinheiro por muitos anos' },
    ],
  },
  {
    id: 'experience',
    title: 'Você já investiu antes?',
    description: 'Sua experiência real nos ajuda a moldar a estratégia.',
    options: [
      { value: 'never', label: 'Nunca' },
      { value: 'simple', label: 'Já investi em algo simples (como poupança ou CDB)' },
      { value: 'diverse', label: 'Já investi em outras coisas (ações, FIIs, ETFs)' },
      { value: 'risky', label: 'Já investi até em coisas mais arriscadas (cripto, day trade etc.)' },
    ],
  },
  {
    id: 'reaction_to_loss',
    title: 'O que você faria se seus investimentos caíssem 10% em um mês?',
    description: 'Seu comportamento real sob pressão é a chave.',
    options: [
      { value: 'sell_all', label: 'Venderia tudo' },
      { value: 'wait', label: 'Esperaria a recuperação' },
      { value: 'hold_and_contribute', label: 'Manteria e continuaria aportando' },
      { value: 'buy_more', label: 'Compraria mais porque está barato' },
    ],
  },
  {
    id: 'risk_profile_sentence',
    title: 'Qual dessas frases se parece mais com você?',
    description: 'Esta pergunta nos ajuda a confirmar seu perfil de investidor.',
    options: [
      { value: 'security_over_gains', label: 'Prefiro ganhar menos, mas ter mais segurança' },
      {
        value: 'some_risk_for_better_gains',
        label: 'Aceito um pouco de risco para ter ganhos melhores',
      },
      { value: 'accept_swings_for_good_returns', label: 'Aceito oscilações para buscar bons retornos' },
      {
        value: 'highest_returns_with_high_risk',
        label: 'Quero os maiores retornos possíveis, mesmo com risco alto',
      },
    ],
  },
];

const formSchema = z.object({
  age: z.coerce.number().min(18, { message: 'Você deve ter pelo menos 18 anos.' }).max(120, { message: 'Por favor, insira uma idade válida.' }),
  objective: z.string({ required_error: 'Por favor, selecione uma opção.' }),
  timeframe: z.string({ required_error: 'Por favor, selecione uma opção.' }),
  loss_tolerance: z.string({ required_error: 'Por favor, selecione uma opção.' }),
  income_stability: z.string({ required_error: 'Por favor, selecione uma opção.' }),
  liquidity_need: z.string({ required_error: 'Por favor, selecione uma opção.' }),
  experience: z.string({ required_error: 'Por favor, selecione uma opção.' }),
  reaction_to_loss: z.string({ required_error: 'Por favor, selecione uma opção.' }),
  risk_profile_sentence: z.string({ required_error: 'Por favor, selecione uma opção.' }),
});

type AnalysisResult = {
  investmentStrategy: string;
  assetAllocation: string;
  riskAssessment: string;
};

export default function OnboardingForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { user } = useUser();
  const firestore = useFirestore();
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: '' as any, // Initialize with an empty string
    },
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

    const { age, ...questionnaireAnswers } = values;

    const fullUserProfile = `
      - Idade: ${values.age}
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
        age: values.age,
        investmentAmount: 0,
        income: 0,
        riskTolerance: '',
        financialGoals: '',
        investmentExperience: fullUserProfile,
      });
      setAnalysisResult(result);

      if (user) {
        const userProfileRef = doc(firestore, `users/${user.uid}/userProfiles/${user.uid}`);
        const profileData = {
          id: user.uid,
          personalInfo: {
            email: user.email,
            firstName: user.displayName?.split(' ')[0] ?? '',
            lastName: user.displayName?.split(' ')[1] ?? '',
            age: values.age,
            income: 0,
          },
          investmentProfile: {
            investmentAmount: 0,
            riskAssessment: result.riskAssessment,
            investmentStrategy: result.investmentStrategy,
            assetAllocation: result.assetAllocation,
            investmentHorizon: values.timeframe,
            financialGoals: values.objective,
            investmentExperience: values.experience,
            questionnaireAnswers: questionnaireAnswers,
          }
        };
        setDocumentNonBlocking(userProfileRef, profileData, { merge: true });
      }

      toast({
        title: 'Análise Concluída!',
        description: 'Criamos uma estratégia personalizada para você e salvamos no seu perfil.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Falha na Análise',
        description: 'Ocorreu um erro ao processar seu perfil. Por favor, tente novamente.',
      });
    } finally {
      setLoading(false);
    }
  }

  const currentQuestion = questions[currentStep];

  const getProfileIcon = (profile: string) => {
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

  const allocationData = (analysisResult?.assetAllocation || '')
    .split(',')
    .map((item: string) => {
      const parts = item.trim().split(':');
      if (parts.length !== 2) return null;
      const name = parts[0];
      const valueString = parts[1].replace('%', '').trim();
      const value = parseInt(valueString);
      if (isNaN(value)) return null;
      return { name, value };
    })
    .filter((item: any): item is { name: string; value: number } => item !== null && item.value > 0);

  const chartConfig = allocationData.reduce((acc: any, item: any) => {
    acc[item.name] = { label: item.name };
    return acc;
  }, {});

  return (
    <div>
      {!analysisResult ? (
        <Form {...form}>
          <form onSubmit={e => e.preventDefault()} className="space-y-8">
            <Progress value={((currentStep + 1) / questions.length) * 100} className="mb-8" />
            <FormField
              control={form.control}
              name={currentQuestion.id as keyof z.infer<typeof formSchema>}
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-xl font-bold">{currentQuestion.title}</FormLabel>
                  <FormDescription>{currentQuestion.description}</FormDescription>
                  <FormControl>
                    {currentQuestion.type === 'number' ? (
                        <Input type="number" {...field} onChange={e => field.onChange(e.target.value === '' ? '' : Number(e.target.value))} placeholder="Sua idade"/>
                    ) : (
                        <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-2"
                        >
                        {currentQuestion.options?.map(option => (
                            <FormItem
                            className="flex items-center space-x-3 space-y-0"
                            key={option.value}
                            >
                            <FormControl>
                                <RadioGroupItem value={option.value} />
                            </FormControl>
                            <FormLabel className="font-normal">{option.label}</FormLabel>
                            </FormItem>
                        ))}
                        </RadioGroup>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0 || loading}
              >
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
        <div className="space-y-6 animate-in fade-in-50">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit mb-2">
                {getProfileIcon(analysisResult.riskAssessment)}
              </div>
              <CardDescription>Seu perfil de investidor é</CardDescription>
              <CardTitle className="text-4xl">{analysisResult.riskAssessment}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Carteira Recomendada</CardTitle>
              <CardDescription>{analysisResult.investmentStrategy}</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                    <Pie
                      data={allocationData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius="60%"
                      strokeWidth={5}
                    >
                      {allocationData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-4">
                {allocationData.map((item, index) => (
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
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
