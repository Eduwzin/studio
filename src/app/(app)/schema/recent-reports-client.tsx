'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table as TableIcon, Loader2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type FiiCvmReport } from '@/lib/actions';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';

export default function RecentReportsClient() {
  const firestore = useFirestore();

  const reportsQuery = useMemoFirebase(() => {
    // Firestore might not be available on first render, so we guard against it.
    if (!firestore) return null;
    const reportsRef = collection(firestore, 'fii-reports-cvm');
    return query(reportsRef, orderBy('dataReferencia', 'desc'), limit(20));
  }, [firestore]);

  const { data: recentReports, isLoading, error } = useCollection<FiiCvmReport>(reportsQuery);

  return (
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
        {isLoading && (
            <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-4 text-muted-foreground">Buscando relatórios...</p>
            </div>
        )}
        {error && !isLoading && (
            <Alert variant="destructive">
                <AlertTitle>Erro ao carregar</AlertTitle>
                <AlertDescription>Não foi possível carregar os relatórios. Verifique as permissões do Firestore.</AlertDescription>
            </Alert>
        )}
        {!isLoading && !error && recentReports && recentReports.length > 0 && (
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
        )}
        {!isLoading && !error && (!recentReports || recentReports.length === 0) && (
           <p className="text-sm text-muted-foreground text-center py-8">Nenhum relatório encontrado. Sincronize um arquivo acima para ver os dados aqui.</p>
        )}
      </CardContent>
    </Card>
  );
}
