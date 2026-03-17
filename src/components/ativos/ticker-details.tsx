'use client';

import { useEffect, useState } from 'react';
import { getStockInfo, getFiiCvmReportByCnpj, getCryptoInfo } from '@/lib/actions';
import type { StockInfo, CryptoInfo } from '@/services/brapi';
import type { FiiCvmReport } from '@/lib/actions'; // Import type
import { Loader2, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; // Add CardDescription
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import WatchlistButton from '@/components/watchlist/WatchlistButton';
import { Button } from '../ui/button';
import Link from 'next/link';


const DetailItem = ({ label, value, subValue }: { label: string; value: React.ReactNode, subValue?: string }) => (
    <div className="flex justify-between items-center border-b py-3 last:border-none">
        <span className="text-muted-foreground">{label}</span>
        <div className="font-semibold text-right">
            {value}
            {subValue && <span className="ml-2 text-xs font-normal text-muted-foreground">{subValue}</span>}
        </div>
    </div>
);

const formatCurrency = (value: any, currency = 'BRL') => {
    if (value === null || value === undefined) return 'N/A';
    const num = Number(value);
    if (isNaN(num)) return 'N/A';
    return `${currency === 'BRL' ? 'R$' : '$'} ${num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const formatBigNumber = (value: any, currency = 'BRL') => {
    if (value === null || value === undefined) return 'N/A';
    const num = Number(value);
    if (isNaN(num)) return 'N/A';
    const prefix = currency === 'BRL' ? 'R$' : '$';
    if (num >= 1e12) return `${prefix} ${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `${prefix} ${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${prefix} ${(num / 1e6).toFixed(2)}M`;
    return `${prefix} ${num.toLocaleString('pt-BR')}`;
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
  const [cryptoData, setCryptoData] = useState<CryptoInfo | null>(null);
  const [cvmData, setCvmData] = useState<FiiCvmReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setData(null);
      setCvmData(null);
      setCryptoData(null);

      try {
        if (type === 'crypto') {
            const cryptoInfo = await getCryptoInfo(ticker);
            setCryptoData(cryptoInfo);
        } else {
            const stockData = await getStockInfo(ticker);
            setData(stockData);
            if (type === 'fund' && stockData?.cnpj) {
                const report = await getFiiCvmReportByCnpj(stockData.cnpj);
                setCvmData(report);
            }
        }
      } catch (error) {
        console.error(`Erro ao buscar detalhes para ${ticker}:`, error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [ticker, type]);

  if (loading) {
    return <div className="flex justify-center items-center p-8"><Loader2 className="animate-spin text-primary h-8 w-8" /></div>;
  }

  if (!data && !cryptoData) {
    return <Alert variant="destructive"><AlertTitle>Erro</AlertTitle><AlertDescription>Não foi possível carregar os detalhes para {ticker}. Tente novamente mais tarde.</AlertDescription></Alert>;
  }

  if (cryptoData) {
    const isPositiveChange = Number(cryptoData.regularMarketChangePercent ?? 0) >= 0;
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg bg-muted/50 border gap-4">
                <div>
                    <p className="text-sm text-muted-foreground">Preço Atual</p>
                    <p className="text-3xl font-bold">
                        {formatCurrency(cryptoData.regularMarketPrice, cryptoData.currency)}
                    </p>
                </div>
                <div className={cn('text-right', isPositiveChange ? 'text-green-600' : 'text-red-600')}>
                    <p className="font-semibold text-lg">
                        {isPositiveChange ? '▲' : '▼'} 
                        {Number(cryptoData.regularMarketChangePercent ?? 0).toFixed(2)}%
                    </p>
                    <p className="text-sm">
                        {isPositiveChange ? '+' : ''}{formatCurrency(cryptoData.regularMarketChange, cryptoData.currency)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        Atualizado em {new Date(cryptoData.regularMarketTime).toLocaleString('pt-BR')}
                    </p>
                </div>
            </div>

             <Button asChild className="w-full" variant="outline">
                <Link href={`/acoes/${ticker}`}>
                    Análise Completa & Perfis de Investidor <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-start justify-between">
                        <div>
                            <CardTitle className="text-lg">Dados da Criptomoeda</CardTitle>
                        </div>
                        <WatchlistButton ticker={cryptoData.coin} />
                    </CardHeader>
                    <CardContent className="text-sm">
                        <DetailItem label="Nome" value={cryptoData.coinName} />
                        <DetailItem label="Market Cap" value={formatBigNumber(cryptoData.marketCap, cryptoData.currency)} />
                        <DetailItem label="Volume (24h)" value={formatBigNumber(cryptoData.regularMarketVolume, cryptoData.currency)} />
                        <DetailItem label="Range (24h)" value={cryptoData.regularMarketDayRange} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
  }
  
  const isPositiveChange = Number(data?.regularMarketChangePercent ?? 0) >= 0;

  return (
    <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg bg-muted/50 border gap-4">
            <div>
                <p className="text-sm text-muted-foreground">Preço Atual</p>
                <p className="text-3xl font-bold">
                    {data?.currency} {Number(data?.regularMarketPrice)?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? 'N/A'}
                </p>
            </div>
            <div className={cn('text-right', isPositiveChange ? 'text-green-600' : 'text-red-600')}>
                <p className="font-semibold text-lg">
                    {isPositiveChange ? '▲' : '▼'} 
                    {Number(data?.regularMarketChangePercent ?? 0).toFixed(2)}%
                </p>
                <p className="text-sm">
                    {isPositiveChange ? '+' : ''}{Number(data?.regularMarketChange)?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? 'N/A'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                    Atualizado em {new Date(data!.regularMarketTime).toLocaleString('pt-BR')}
                </p>
            </div>
        </div>

        <Button asChild className="w-full" variant="outline">
            <Link href={`/acoes/${ticker}`}>
                Análise Completa & Perfis de Investidor <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
        </Button>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
                <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                        <CardTitle className="text-lg">Dados da Empresa</CardTitle>
                    </div>
                    <WatchlistButton ticker={data!.symbol} />
                </CardHeader>
                <CardContent className="text-sm">
                    <DetailItem label="Razão Social" value={data!.longName} />
                    <DetailItem label="Valor de Mercado" value={formatBigNumber(data!.marketCap)} />
                    {sector && <DetailItem label="Setor" value={sector} />}
                    {data!.cnpj && <DetailItem label="CNPJ" value={data!.cnpj} />}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Indicadores Chave</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                    <DetailItem label="P/L" value={formatSimpleNumber(data!.priceEarnings)} subValue="TTM" />
                    <DetailItem label="P/VP" value={formatSimpleNumber(data!.priceToBook)} subValue="TTM" />
                    <DetailItem label="Dividend Yield" value={formatPercentage(data!.dividendYield)} subValue="TTM" />
                    <DetailItem label="LPA" value={formatCurrency(data!.earningsPerShare)} subValue="TTM" />
                    <DetailItem label="VPA" value={formatCurrency(data!.bookValue)} subValue="Atual" />
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
