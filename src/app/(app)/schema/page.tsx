import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import backendConfig from '../../../../docs/backend.json';
import { Database } from 'lucide-react';
import SyncCvmClient from './sync-cvm-client';

export default function SchemaPage() {
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

      <SyncCvmClient />

      <Card className="mt-8">
        <CardHeader>
            <CardTitle>Conteúdo de backend.json</CardTitle>
            <CardDescription>
                A planta baixa que define a organização dos dados no Firestore.
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
