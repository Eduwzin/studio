'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { syncCvmDataAction } from '@/lib/actions';
import { Loader2, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { SyncCvmFiisOutput } from '@/lib/actions';

const formSchema = z.object({
  filename: z.string({ required_error: "Por favor, selecione um arquivo para importar." }),
});

type SyncCvmClientProps = {
    availableFiles: string[];
}

export default function SyncCvmClient({ availableFiles }: SyncCvmClientProps) {
  const [result, setResult] = useState<SyncCvmFiisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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
            Sincronizar Dados de FIIs da CVM (Manual)
        </CardTitle>
        <CardDescription>
          Selecione um arquivo CSV da pasta <code>src/data/cvm-reports</code> para importar os dados para o Firestore.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="filename"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Arquivo CSV</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um arquivo..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {availableFiles.length > 0 ? availableFiles.map(file => (
                            <SelectItem key={file} value={file}>{file}</SelectItem>
                        )) : (
                            <div className="p-4 text-sm text-muted-foreground">Nenhum arquivo CSV encontrado.</div>
                        )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading || availableFiles.length === 0}>
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
