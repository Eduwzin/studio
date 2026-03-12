'use client';

import { useState } from 'react';
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
  bucket: z.string().min(3, { message: 'Por favor, insira um nome de bucket válido.' }),
  file: z.string().min(5, { message: 'Por favor, insira um nome de arquivo válido (ex: nome.zip).' }).endsWith('.zip', { message: 'O arquivo deve ser um .zip' }),
});

export default function SyncCvmClient() {
  const [result, setResult] = useState<SyncCvmFiisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        bucket: '',
        file: '',
    }
  });
  
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
            Sincronizar Dados de FIIs da CVM (via GCS)
        </CardTitle>
        <CardDescription>
          Execute o fluxo de importação especificando o bucket do Google Cloud Storage e o nome do arquivo ZIP.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="bucket"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Bucket no Cloud Storage</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: meu-projeto-cvm-uploads" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Arquivo .zip no Bucket</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: inf_mensal_fii_geral_202405.zip" {...field} />
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
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
