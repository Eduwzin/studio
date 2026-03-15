'use client';

import { useEffect, useState } from 'react';
import { getStockInfo, getFiiCvmReportByCnpj } from '@/lib/actions';
import type { StockInfo } from '@/services/brapi';
import type { FiiCvmReport } from '@/lib/actions'; // Import type
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; // Add CardDescription
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import WatchlistButton from '@/components/watchlist/WatchlistButton';

const DetailItem = ({ label, value, subValue }: { label: string; value: React.ReactNode, subValue?: string }) => (
    <div className="flex justify-between items-center border-b py-3 last:border-none">
        <span className="text-muted-foreground">{label}</span>
        <div className="font-semibold text-right">
            {value}
            {subValue && <span className="ml-2 text-xs font-normal text-muted-foreground">{subValue}</span>}
        </div>
    </div>
);

const formatCurrency = (value: any) => {
    if (value === null || value === undefined) return 'N/A';
    const num = Number(value);
    if (isNaN(num)) return 'N/A';
    return `R$ ${num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const formatBigNumber = (value: any) => {
    if (value === null || value === undefined) return 'N/A';
    const num = Number(value);
    if (isNaN(num)) return 'N/A';
    if (num >= 1e12) return `R$ ${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `R$ ${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `R$ ${(num / 1e6).toFixed(2)}M`;
    return `R$ ${num.toLocaleString('pt-BR')}`;
}

const formatPercentage = (value: any) => {
    if (value === null || value === undefined) return 'N/A';
    const num = Number(value);
    if (isNaN(num)) return 'N/A';
    // A API da Brapi para dividendYield retorna um número (e.g. 8.64 para 8.64%), então não multiplicamos por 100
    return `${num.toFixed(2)}%`;
}

const formatSimpleNumber = (value: any) => {
    if (value === null || value === undefined) return 'N/A';
    const num = Number(value);
    if (isNaN(num)) return 'N/A';
    return num.toFixed(2);
};


export default function TickerDetails({ ticker, sector, type }: { ticker: string; sector?: string, type: string }) {
  const [data, setData] = useState<StockInfo | null>(null);
  const [cvmData, setCvmData] = useState<FiiCvmReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setCvmData(null); // Reset CVM data on new ticker fetch
      const stockData = await getStockInfo(ticker);
      setData(stockData);
      console.log("STOCKDATA:", stockData)
      // If it's a FII (type 'fund') and we received a CNPJ, fetch the CVM report
      if (type === 'fund' && stockData?.cnpj) {
        const report = await getFiiCvmReportByCnpj(stockData.cnpj);
        setCvmData(report);
      }
      
      setLoading(false);
    }
    fetchData();
  }, [ticker, type]);

  if (loading) {
    return <div className="flex justify-center items-center p-8"><Loader2 className="animate-spin text-primary h-8 w-8" /></div>;
  }

  if (!data) {
    return <Alert variant="destructive"><AlertTitle>Erro</AlertTitle><AlertDescription>Não foi possível carregar os detalhes para {ticker}. Tente novamente mais tarde.</AlertDescription></Alert>;
  }
  
  const isPositiveChange = Number(data.regularMarketChangePercent ?? 0) >= 0;

  return (
    <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg bg-muted/50 border gap-4">
            <div>
                <p className="text-sm text-muted-foreground">Preço Atual</p>
                <p className="text-3xl font-bold">
                    {data.currency} {Number(data.regularMarketPrice)?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? 'N/A'}
                </p>
            </div>
            <div className={cn('text-right', isPositiveChange ? 'text-green-600' : 'text-red-600')}>
                <p className="font-semibold text-lg">
                    {isPositiveChange ? '▲' : '▼'} 
                    {Number(data.regularMarketChangePercent ?? 0).toFixed(2)}%
                </p>
                <p className="text-sm">
                    {isPositiveChange ? '+' : ''}{Number(data.regularMarketChange)?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? 'N/A'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                    Atualizado em {new Date(data.regularMarketTime).toLocaleString('pt-BR')}
                </p>
            </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
                <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                        <CardTitle className="text-lg">Dados da Empresa</CardTitle>
                    </div>
                    <WatchlistButton ticker={data.symbol} />
                </CardHeader>
                <CardContent className="text-sm">
                    <DetailItem label="Razão Social" value={data.longName} />
                    <DetailItem label="Valor de Mercado" value={formatBigNumber(data.marketCap)} />
                    {sector && <DetailItem label="Setor" value={sector} />}
                    {data.cnpj && <DetailItem label="CNPJ" value={data.cnpj} />}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Indicadores Chave</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                    <DetailItem label="P/L" value={formatSimpleNumber(data.priceEarnings)} subValue="TTM" />
                    <DetailItem label="P/VP" value={formatSimpleNumber(data.priceToBook)} subValue="TTM" />
                    <DetailItem label="Dividend Yield" value={formatPercentage(data.dividendYield)} subValue="TTM" />
                    <DetailItem label="LPA" value={formatCurrency(data.earningsPerShare)} subValue="TTM" />
                    <DetailItem label="VPA" value={formatCurrency(data.bookValue)} subValue="Atual" />
                </CardContent>
            </Card>

            {cvmData && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Dados do Relatório CVM</CardTitle>
                        <CardDescription>Último informe ({cvmData.dataReferencia})</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm">
                        <DetailItem label="Patrimônio Líquido" value={formatBigNumber(cvmData.patrimonioLiquido)} />
                        <DetailItem label="Valor Patrimonial/Cota" value={formatCurrency(cvmData.valorPatrimonialCota)} />
                        <DetailItem label="Rendimento/Cota (mês)" value={formatCurrency(cvmData.rendimentosMes)} />
                        <DetailItem label="Total de Cotas" value={cvmData.quantidadeCotas.toLocaleString('pt-BR')} />
                    </CardContent>
                </Card>
            )}
        </div>
    </div>
  );
}

    