import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import backendConfig from '../../../../docs/backend.json';
import { Database, Info } from 'lucide-react';
import SyncCvmClient from './sync-cvm-client';
import RecentReportsClient from './recent-reports-client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';


export default async function SchemaPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline mb-2 flex items-center gap-3">
            <Database className="text-primary" />
            Área de Administração
        </h1>
        <p className="text-muted-foreground">
            Esta área é para tarefas de desenvolvimento e administração, como visualizar a estrutura do banco de dados e executar rotinas de importação de dados.
        </p>
      </header>

      <Alert className="mb-8">
        <Info className="h-4 w-4" />
        <AlertTitle>Como a Sincronização Funciona</AlertTitle>
        <AlertDescription>
            <ol className="list-decimal list-inside space-y-1">
                <li>Você faz o upload de um arquivo .zip da CVM usando o formulário abaixo.</li>
                <li>O sistema processa este arquivo e salva cada registro como um documento no banco de dados <strong>Cloud Firestore</strong>, dentro de uma coleção chamada <code>fii-reports-cvm</code>.</li>
                <li>A tabela "Relatórios Recentes" lê diretamente dessa coleção para exibir os dados que você acabou de enviar.</li>
            </ol>
        </AlertDescription>
      </Alert>

      <SyncCvmClient />

      {/* Seção para exibir os relatórios do Firestore */}
      <RecentReportsClient />

      <Card className="mt-8">
        <CardHeader>
            <CardTitle>Conteúdo de backend.json</CardTitle>
            <CardDescription>
                A planta baixa que define a organização dos dados no Firestore, incluindo a coleção <code>fii-reports-cvm</code>.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <pre className="text-xs whitespace-pre-wrap max-h-[600px] overflow-y-auto bg-muted p-4 rounded-md">
                <code>{JSON.stringify(backendConfig, null, 2)}</code>
            </pre>
        </CardContent>
      </Card>
    </div>
  );
}
