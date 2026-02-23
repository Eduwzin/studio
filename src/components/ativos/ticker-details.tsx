'use client';

import { useEffect, useState } from 'react';
import { getStockInfo } from '@/lib/actions';
import type { StockInfo } from '@/services/brapi';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const DetailItem = ({ label, value, subValue }: { label: string; value: React.ReactNode, subValue?: string }) => (
    <div className="flex justify-between items-center border-b py-3 last:border-none">
        <span className="text-muted-foreground">{label}</span>
        <div className="font-semibold text-right">
            {value}
            {subValue && <span className="ml-2 text-xs font-normal text-muted-foreground">{subValue}</span>}
        </div>
    </div>
);

const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) return 'N/A';
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const formatBigNumber = (value: number | null | undefined) => {
    if (value === null || value === undefined) return 'N/A';
    if (value >= 1e12) return `R$ ${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `R$ ${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `R$ ${(value / 1e6).toFixed(2)}M`;
    return `R$ ${value.toLocaleString('pt-BR')}`;
}

const formatPercentage = (value: number | null | undefined) => {
    if (value === null || value === undefined) return 'N/A';
    // A API da Brapi para dividendYield retorna um número (e.g. 8.64 para 8.64%), então não multiplicamos por 100
    return `${value.toFixed(2)}%`;
}

export default function TickerDetails({ ticker, sector }: { ticker: string; sector?: string }) {
  const [data, setData] = useState<StockInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const stockData = await getStockInfo(ticker);
      setData(stockData);
      setLoading(false);
    }
    fetchData();
  }, [ticker]);

  if (loading) {
    return <div className="flex justify-center items-center p-8"><Loader2 className="animate-spin text-primary h-8 w-8" /></div>;
  }

  if (!data) {
    return <Alert variant="destructive"><AlertTitle>Erro</AlertTitle><AlertDescription>Não foi possível carregar os detalhes para {ticker}. Tente novamente mais tarde.</AlertDescription></Alert>;
  }
  
  const isPositiveChange = (data.regularMarketChangePercent ?? 0) >= 0;

  return (
    <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg bg-muted/50 border gap-4">
            <div>
                <p className="text-sm text-muted-foreground">Preço Atual</p>
                <p className="text-3xl font-bold">
                    {data.currency} {data.regularMarketPrice?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
            </div>
            <div className={cn('text-right', isPositiveChange ? 'text-green-600' : 'text-red-600')}>
                <p className="font-semibold text-lg">
                    {isPositiveChange ? '▲' : '▼'} 
                    {(data.regularMarketChangePercent ?? 0).toFixed(2)}%
                </p>
                <p className="text-sm">
                    {isPositiveChange ? '+' : ''}{data.regularMarketChange?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                    Atualizado em {new Date(data.regularMarketTime).toLocaleString('pt-BR')}
                </p>
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Dados da Empresa</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                    <DetailItem label="Razão Social" value={data.longName} />
                    <DetailItem label="Valor de Mercado" value={formatBigNumber(data.marketCap)} />
                    {sector && <DetailItem label="Setor" value={sector} />}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Indicadores Chave</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                    <DetailItem label="P/L" value={data.priceEarnings?.toFixed(2) ?? 'N/A'} subValue="TTM" />
                    <DetailItem label="P/VP" value={data.priceToBook?.toFixed(2) ?? 'N/A'} subValue="TTM" />
                    <DetailItem label="Dividend Yield" value={data.dividendYield ? formatPercentage(data.dividendYield) : 'N/A'} subValue="TTM" />
                    <DetailItem label="LPA" value={formatCurrency(data.earningsPerShare)} subValue="TTM" />
                    <DetailItem label="VPA" value={formatCurrency(data.bookValue)} subValue="Atual" />
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
