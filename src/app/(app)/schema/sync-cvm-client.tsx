'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { syncCvmDataAction } from '@/lib/actions';
import { Loader2, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { SyncCvmFiisOutput } from '@/lib/actions';

const formSchema = z.object({
  year: z.coerce.number().min(2020, "O ano deve ser 2020 ou mais recente.").max(new Date().getFullYear()),
  sourceUrl: z.string().url("Por favor, insira uma URL válida."),
});

// Helper to generate URL based on year
const getCvmUrlForYear = (year: number) => `https://dados.cvm.gov.br/dados/FII/DOC/INF_MENSAL/DADOS/inf_mensal_fii_${year}.zip`;

export default function SyncCvmClient() {
  const currentYear = new Date().getFullYear();
  const [result, setResult] = useState<SyncCvmFiisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      year: currentYear,
      sourceUrl: getCvmUrlForYear(currentYear),
    },
  });
  
  const yearValue = form.watch('year');
  
  useEffect(() => {
     if (yearValue >= 2020) {
        form.setValue('sourceUrl', getCvmUrlForYear(yearValue));
     }
  }, [yearValue, form]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await syncCvmDataAction(values);
      if (response.status === 'FAILED') {
        throw new Error(response.message);
      }
      setResult(response);
    } catch (e: any) {
      setError(e.message || 'Ocorreu um erro desconhecido durante a sincronização.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
            <RefreshCw />
            Sincronizar Dados de FIIs da CVM
        </CardTitle>
        <CardDescription>
          Execute o fluxo para baixar, tratar e salvar os informes mensais de Fundos de Investimento Imobiliário diretamente do site da CVM.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ano</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ex: 2024" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sourceUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL do Arquivo ZIP</FormLabel>
                  <FormControl>
                    <Input placeholder="https://dados.cvm.gov.br/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sincronizando...
                </>
              ) : (
                'Iniciar Sincronização'
              )}
            </Button>
          </form>
        </Form>

        {error && (
          <Alert variant="destructive" className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Falha na Sincronização</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <Alert className="mt-6" variant={result.status === 'SUCCESS' ? 'default' : 'destructive'}>
             {result.status === 'SUCCESS' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertTitle>
              {result.status === 'SUCCESS' ? 'Sincronização Concluída' : 'Sincronização Falhou ou Vazia'}
            </AlertTitle>
            <AlertDescription>
              <p>{result.message}</p>
              <p>Registros importados: {result.importedCount}</p>
              {result.storagePath && <p className="text-xs mt-2">Arquivo salvo em: {result.storagePath}</p>}
            </AlertDescription>
          </Alert>
        )}

      </CardContent>
    </Card>
  );
}
