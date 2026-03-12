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
import { Loader2, AlertCircle, CheckCircle, RefreshCw, Upload } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { SyncCvmFiisOutput } from '@/lib/actions';

const formSchema = z.object({
  file: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, 'Por favor, selecione um arquivo.')
    .refine((files) => files?.[0]?.type === 'application/zip' || files?.[0]?.type === 'application/x-zip-compressed', 'O arquivo deve ser um .zip.')
    .refine((files) => files?.[0]?.size <= 10 * 1024 * 1024, 'O arquivo deve ter no máximo 10MB.'),
});

// Helper para ler o arquivo como Data URL (Base64)
const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};


export default function SyncCvmClient() {
  const [result, setResult] = useState<SyncCvmFiisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  
  const fileRef = form.register("file");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const file = values.file[0];
      const fileContent = await readFileAsDataURL(file);

      const response = await syncCvmDataAction({
          fileName: file.name,
          fileContent: fileContent,
      });

      if (response.status === 'FAILED') {
        throw new Error(response.message);
      }
      setResult(response);
      form.reset(); // Limpa o formulário após sucesso
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
            Sincronizar Dados de FIIs da CVM (via Upload)
        </CardTitle>
        <CardDescription>
          Faça o upload do arquivo .zip baixado do site da CVM para processar e salvar os dados no Firestore.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Arquivo .zip da CVM</FormLabel>
                  <FormControl>
                    <div className="relative">
                       <Input type="file" accept=".zip" {...fileRef} />
                       <Upload className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    </div>
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
