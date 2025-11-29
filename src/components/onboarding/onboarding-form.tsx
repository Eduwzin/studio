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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { analyzeUserProfile } from "@/lib/actions";
import { useState } from "react";
import { BrainCircuit, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

const formSchema = z.object({
  age: z.coerce.number().min(18, { message: "Você deve ter pelo menos 18 anos." }).max(100),
  income: z.coerce.number().min(0, { message: "A renda deve ser um número positivo." }),
  investmentAmount: z.coerce.number().min(100, { message: "O investimento mínimo é de $100." }),
  riskTolerance: z.enum(["low", "medium", "high"]),
  investmentExperience: z.enum(["none", "beginner", "intermediate", "expert"]),
  financialGoals: z.string().min(10, { message: "Por favor, descreva seus objetivos em pelo menos 10 caracteres." }),
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: 25,
      income: 50000,
      investmentAmount: 1000,
      financialGoals: "Crescimento a longo prazo para aposentadoria.",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setAnalysisResult(null);
    try {
        const result = await analyzeUserProfile(values);
        setAnalysisResult(result);
        toast({
            title: "Análise Concluída!",
            description: "Criamos uma estratégia personalizada para você.",
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

  return (
    <div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                    <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Idade</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="25" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="income"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Renda Anual</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="50000" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="investmentAmount"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Valor do Investimento Inicial</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="1000" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid md:grid-cols-2 gap-8">
                    <FormField
                        control={form.control}
                        name="riskTolerance"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Tolerância ao Risco</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione sua tolerância ao risco" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                <SelectItem value="low">Baixa</SelectItem>
                                <SelectItem value="medium">Média</SelectItem>
                                <SelectItem value="high">Alta</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                Quão confortável você está com as flutuações do mercado?
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="investmentExperience"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Experiência de Investimento</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione seu nível de experiência" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                <SelectItem value="none">Nenhuma</SelectItem>
                                <SelectItem value="beginner">Iniciante</SelectItem>
                                <SelectItem value="intermediate">Intermediária</SelectItem>
                                <SelectItem value="expert">Especialista</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                Qual é a sua experiência com investimentos?
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                
                 <FormField
                    control={form.control}
                    name="financialGoals"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Metas Financeiras</FormLabel>
                        <FormControl>
                            <Input placeholder="ex: Economizar para a aposentadoria, comprar uma casa..." {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analisando...
                        </>
                    ) : (
                         <>
                            <BrainCircuit className="mr-2 h-4 w-4" />
                            Analisar Meu Perfil
                        </>
                    )}
                </Button>
            </form>
        </Form>
        {analysisResult && (
            <Card className="mt-8 bg-secondary">
                <CardHeader>
                    <CardTitle>Sua Estratégia Personalizada</CardTitle>
                    <CardDescription>Com base no seu perfil, aqui está a recomendação da nossa IA.</CardDescription>
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
