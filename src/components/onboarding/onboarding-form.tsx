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
    id: 'idade',
    title: 'Qual a sua idade?',
    description: 'Sua idade nos ajuda a entender seu horizonte de investimento.',
    type: 'number'
  },
  {
    id: 'objetivo_investimento',
    title: 'O que você espera dos seus investimentos?',
    description: 'Isso nos ajuda a entender seu objetivo e o risco que você aceita.',
    options: [
      { value: 'seguranca', label: 'Quero segurança e não perder dinheiro' },
      { value: 'crescimento_conservador', label: 'Quero ganhar um pouco mais, mas sem arriscar muito' },
      { value: 'crescimento', label: 'Quero fazer meu dinheiro crescer, mesmo que oscile' },
      { value: 'alto_rendimento', label: 'Quero alta rentabilidade, aceito riscos' },
    ],
  },
  {
    id: 'prazo_investimento',
    title: 'Quando você pretende usar esse dinheiro?',
    description: 'O prazo do seu investimento influencia o risco que podemos assumir.',
    options: [
      { value: 'curto_prazo', label: 'Nos próximos meses' },
      { value: 'medio_prazo_1_3', label: 'Entre 1 e 3 anos' },
      { value: 'medio_prazo_3_5', label: 'Entre 3 e 5 anos' },
      { value: 'longo_prazo', label: 'Só daqui a bastante tempo (mais de 5 anos)' },
    ],
  },
  {
    id: 'tolerancia_perda',
    title: 'Como você se sentiria se seu investimento caísse um pouco?',
    description: 'Sua reação a perdas temporárias é um indicador importante.',
    options: [
      { value: 'muito_preocupado', label: 'Eu ficaria muito preocupado e tiraria o dinheiro' },
      { value: 'desconfortavel', label: 'Eu ficaria desconfortável, mas manteria' },
      { value: 'entenderia', label: 'Eu entenderia que faz parte' },
      { value: 'investiria_mais', label: 'Eu aproveitaria para investir mais' },
    ],
  },
  {
    id: 'estabilidade_renda',
    title: 'O quão estável é sua renda mensal?',
    description: 'Se sua renda é incerta, um perfil mais conservador pode ser melhor.',
    options: [
      { value: 'instavel', label: 'Nada estável' },
      { value: 'pouco_instavel', label: 'Pouco estável' },
      { value: 'estavel', label: 'Estável' },
      { value: 'muito_estavel', label: 'Muito estável' },
    ],
  },
  {
    id: 'necessidade_liquidez',
    title: 'Você pode deixar esse dinheiro parado ou pode precisar dele rápido?',
    description: 'Isso nos ajuda a entender sua necessidade de liquidez.',
    options: [
      { value: 'qualquer_momento', label: 'Posso precisar dele a qualquer momento' },
      { value: 'pode_esperar', label: 'Posso esperar um pouco' },
      { value: 'muito_tempo', label: 'Posso deixar por bastante tempo' },
      { value: 'muitissimo_tempo', label: 'Não preciso mexer nesse dinheiro por muitos anos' },
    ],
  },
  {
    id: 'experiencia_investimento',
    title: 'Você já investiu antes?',
    description: 'Sua experiência real nos ajuda a moldar a estratégia.',
    options: [
      { value: 'nunca', label: 'Nunca' },
      { value: 'simples', label: 'Já investi em algo simples (como poupança ou CDB)' },
      { value: 'diversificado', label: 'Já investi em outras coisas (ações, FIIs, ETFs)' },
      { value: 'arriscado', label: 'Já investi até em coisas mais arriscadas (cripto, day trade etc.)' },
    ],
  },
  {
    id: 'reacao_a_perda',
    title: 'O que você faria se seus investimentos caíssem 10% em um mês?',
    description: 'Seu comportamento real sob pressão é a chave.',
    options: [
      { value: 'venderia_tudo', label: 'Venderia tudo' },
      { value: 'esperaria', label: 'Esperaria a recuperação' },
      { value: 'manteria_e_aportaria', label: 'Manteria e continuaria aportando' },
      { value: 'compraria_mais', label: 'Compraria mais porque está barato' },
    ],
  },
  {
    id: 'frase_perfil_risco',
    title: 'Qual dessas frases se parece mais com você?',
    description: 'Esta pergunta nos ajuda a confirmar seu perfil de investidor.',
    options: [
      { value: 'seguranca_acima_de_ganhos', label: 'Prefiro ganhar menos, mas ter mais segurança' },
      {
        value: 'risco_moderado_para_ganhos_melhores',
        label: 'Aceito um pouco de risco para ter ganhos melhores',
      },
      { value: 'aceita_oscilacoes_por_bons_retornos', label: 'Aceito oscilações para buscar bons retornos' },
      {
        value: 'maiores_retornos_com_alto_risco',
        label: 'Quero os maiores retornos possíveis, mesmo com risco alto',
      },
    ],
  },
];

const formSchema = z.object({
  idade: z.coerce.number().min(18, { message: 'Você deve ter pelo menos 18 anos.' }).max(120, { message: 'Por favor, insira uma idade válida.' }),
  objetivo_investimento: z.string({ required_error: 'Por favor, selecione uma opção.' }),
  prazo_investimento: z.string({ required_error: 'Por favor, selecione uma opção.' }),
  tolerancia_perda: z.string({ required_error: 'Por favor, selecione uma opção.' }),
  estabilidade_renda: z.string({ required_error: 'Por favor, selecione uma opção.' }),
  necessidade_liquidez: z.string({ required_error: 'Por favor, selecione uma opção.' }),
  experiencia_investimento: z.string({ required_error: 'Por favor, selecione uma opção.' }),
  reacao_a_perda: z.string({ required_error: 'Por favor, selecione uma opção.' }),
  frase_perfil_risco: z.string({ required_error: 'Por favor, selecione uma opção.' }),
});

type AnalysisResult = {
  estrategiaDeInvestimento: string;
  alocacaoDeAtivos: string;
  avaliacaoDeRisco: string;
};

type OnboardingFormProps = {
  onProfileSaved: () => void;
};

export default function OnboardingForm({ onProfileSaved }: OnboardingFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { user } = useUser();
  const firestore = useFirestore();
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idade: '' as any, 
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

    const { idade, ...respostasQuestionario } = values;
    
    const getLabel = (questionId: string, value: string | number) => {
        if (value === undefined || value === null) return 'não informado';
        const question = questions.find(q => q.id === questionId);
        if (!question || !question.options) return String(value);
        const option = question.options.find(o => o.value === value);
        return option ? option.label : String(value);
    };

    const fullUserProfile = `
      - Idade: ${getLabel('idade', values.idade)}
      - Objetivo do Investimento: ${getLabel('objetivo_investimento', values.objetivo_investimento)}
      - Prazo do Investimento: ${getLabel('prazo_investimento', values.prazo_investimento)}
      - Tolerância à Perda: ${getLabel('tolerancia_perda', values.tolerancia_perda)}
      - Estabilidade da Renda: ${getLabel('estabilidade_renda', values.estabilidade_renda)}
      - Necessidade de Liquidez: ${getLabel('necessidade_liquidez', values.necessidade_liquidez)}
      - Experiência com Investimentos: ${getLabel('experiencia_investimento', values.experiencia_investimento)}
      - Reação a Quedas de 10%: ${getLabel('reacao_a_perda', values.reacao_a_perda)}
      - Frase que Melhor Define o Perfil: ${getLabel('frase_perfil_risco', values.frase_perfil_risco)}
    `;

    try {
      const result = await analyzeUserProfile({
        age: values.idade,
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
          informacoesPessoais: {
            email: user.email,
            nome: user.displayName?.split(' ')[0] ?? '',
            sobrenome: user.displayName?.split(' ')[1] ?? '',
            idade: values.idade,
            renda: 0,
          },
          perfilDeInvestimento: {
            valorInvestimento: 0,
            avaliacaoDeRisco: result.avaliacaoDeRisco,
            estrategiaDeInvestimento: result.estrategiaDeInvestimento,
            alocacaoDeAtivos: result.alocacaoDeAtivos,
            horizonteDeInvestimento: values.prazo_investimento,
            metasFinanceiras: values.objetivo_investimento,
            experienciaDeInvestimento: values.experiencia_investimento,
            respostasQuestionario: respostasQuestionario,
          }
        };
        setDocumentNonBlocking(userProfileRef, profileData, { merge: true });
      }

      toast({
        title: 'Análise Concluída!',
        description: 'Criamos uma estratégia personalizada para você e salvamos no seu perfil.',
      });
      onProfileSaved();
    } catch (error: any) {
      console.error("Analysis Error:", error);
      toast({
        variant: 'destructive',
        title: 'Falha na Análise',
        description: error.message || 'Ocorreu um erro ao processar seu perfil. Por favor, tente novamente.',
      });
    } finally {
      setLoading(false);
    }
  }

  const getProfileIcon = (profile: string) => {
    if (!profile) return <CheckCircle2 className="h-8 w-8 text-primary" />;
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

  const allocationData = (analysisResult?.alocacaoDeAtivos || '')
    .split(',')
    .map((item: string) => {
      const parts = item.trim().split(':');
      if (parts.length !== 2) return null;
      const name = parts[0];
      const valueString = parts[1]?.replace('%', '').trim();
      const value = parseInt(valueString);
      if (isNaN(value)) return null;
      return { name, value };
    })
    .filter((item: any): item is { name: string; value: number } => item !== null && item.value > 0);

  const chartConfig = allocationData.reduce((acc: any, item: any) => {
    acc[item.name] = { label: item.name };
    return acc;
  }, {});

  if (loading && !analysisResult) {
    return (
        <div className="flex flex-col items-center justify-center text-center p-8 gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <h3 className="text-xl font-semibold">Analisando seu perfil...</h3>
            <p className="text-muted-foreground">Nossa IA está criando a melhor estratégia para você. Isso pode levar alguns segundos.</p>
        </div>
    );
  }

  return (
    <div>
      {!analysisResult ? (
        <Form {...form}>
          <form onSubmit={e => e.preventDefault()} className="space-y-8">
            <Progress value={((currentStep + 1) / questions.length) * 100} className="mb-8" />
            
            <div className="relative">
                {questions.map((question, index) => (
                <div key={question.id} style={{ display: currentStep === index ? 'block' : 'none' }}>
                    <FormField
                    control={form.control}
                    name={question.id as keyof z.infer<typeof formSchema>}
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                        <FormLabel className="text-xl font-bold">{question.title}</FormLabel>
                        <FormDescription>{question.description}</FormDescription>
                        <FormControl>
                            {question.type === 'number' ? (
                                <Input type="number" {...field} onChange={e => field.onChange(e.target.value === '' ? '' : Number(e.target.value))} placeholder="Sua idade"/>
                            ) : (
                                <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value}
                                className="flex flex-col space-y-2"
                                >
                                {question.options?.map(option => (
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
                </div>
                ))}
            </div>


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
                {getProfileIcon(analysisResult.avaliacaoDeRisco)}
              </div>
              <CardDescription>Seu perfil de investidor é</CardDescription>
              <CardTitle className="text-4xl">{analysisResult.avaliacaoDeRisco}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Carteira Recomendada</CardTitle>
              <CardDescription>{analysisResult.estrategiaDeInvestimento}</CardDescription>
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

    