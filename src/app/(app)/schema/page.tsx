import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import backendConfig from '../../../../docs/backend.json';
import { Database, Table as TableIcon } from 'lucide-react';
import SyncCvmClient from './sync-cvm-client';

// Importações do Firebase Admin para buscar dados no lado do servidor
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Importações dos componentes de Tabela do ShadCN
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Tipo para os dados do relatório, espelhando o que é salvo no Firestore
type FiiCvmReport = {
  id: string;
  cnpj: string;
  nomeFundo: string;
  dataReferencia: string;
  patrimonioLiquido: number;
  valorPatrimonialCota: number;
  quantidadeCotas: number;
  rendimentosMes: number | null;
};

// Função auxiliar para inicializar o Firebase Admin e obter o Firestore
const getDb = () => {
    if (!getApps().length) {
        // As credenciais são obtidas automaticamente do ambiente do Google Cloud
        initializeApp();
    }
    return getFirestore();
};

// Função para buscar os relatórios mais recentes do Firestore
async function getRecentReports(): Promise<FiiCvmReport[]> {
    try {
        const db = getDb();
        const reportsRef = db.collection('fii-reports-cvm');
        // Ordena por data de referência e limita a 20 resultados
        const snapshot = await reportsRef.orderBy('dataReferencia', 'desc').limit(20).get();

        if (snapshot.empty) {
            return [];
        }

        return snapshot.docs.map(doc => doc.data() as FiiCvmReport);
    } catch (error) {
        console.error("Falha ao buscar relatórios de FIIs do Firestore:", error);
        return []; // Retorna um array vazio em caso de erro
    }
}


export default async function SchemaPage() {
  // Busca os dados no servidor antes de renderizar a página
  const recentReports = await getRecentReports();

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

      {/* Nova seção para exibir os relatórios do Firestore */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
              <TableIcon />
              Relatórios de FIIs Recentes no Firestore
          </CardTitle>
          <CardDescription>
            Uma prévia dos últimos 20 relatórios que você sincronizou. Isso confirma que os dados estão sendo salvos corretamente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentReports.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fundo</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Valor Cota (R$)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.nomeFundo}</TableCell>
                    <TableCell>{report.dataReferencia}</TableCell>
                    <TableCell className="text-right">{report.valorPatrimonialCota.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
             <p className="text-sm text-muted-foreground text-center py-8">Nenhum relatório encontrado. Sincronize um arquivo acima para ver os dados aqui.</p>
          )}
        </CardContent>
      </Card>

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
