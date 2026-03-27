'use client';

import { useState } from 'react';
import type { AvailableTicker, TreasuryAsset, AvailableTickersResponse } from "@/services/brapi";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { List, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import TickerDetails from '@/components/ativos/ticker-details';
import TreasuryList from '@/components/ativos/treasury-list';

function TickerList({
  tickers,
  filter,
}: {
  tickers: AvailableTicker[];
  filter: string;
}) {
  const filteredTickers = tickers.filter(
    (ticker) =>
      (ticker?.stock && ticker.stock.toLowerCase().includes(filter.toLowerCase())) ||
      (ticker?.name && ticker.name.toLowerCase().includes(filter.toLowerCase()))
  );

  if (filteredTickers.length === 0) {
    return <div className="text-center text-muted-foreground py-10">Nenhum ativo encontrado para o filtro selecionado.</div>;
  }

  return (
    <Accordion type="single" collapsible className="w-full space-y-2">
      {filteredTickers.map((ticker) => (
        <AccordionItem value={ticker.stock} key={ticker.stock} className="border-b-0">
          <AccordionTrigger className="p-4 bg-card rounded-lg border hover:no-underline hover:bg-muted/50 transition-colors data-[state=open]:rounded-b-none data-[state=open]:border-b-0">
            <div className="flex items-center gap-4 w-full">
              <Image 
                src={ticker.logo} 
                alt={`Logo de ${ticker.name}`} 
                width={32} 
                height={32} 
                className="rounded-full object-contain bg-white"
                unoptimized
              />
              <div className="text-left flex-1 overflow-hidden">
                <p className="font-bold text-base">{ticker.stock}</p>
                <p className="text-sm text-muted-foreground truncate">{ticker.name}</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-4 border border-t-0 rounded-b-lg bg-card">
            <TickerDetails ticker={ticker.stock} sector={ticker.sector} type={ticker.type} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

type AtivosClientProps = {
    initialData: AvailableTickersResponse;
}

export default function AtivosClient({ initialData }: AtivosClientProps) {
  const [stocks] = useState<AvailableTicker[]>(initialData.stocks);
  const [fiis] = useState<AvailableTicker[]>(initialData.fiis);
  const [bdrs] = useState<AvailableTicker[]>(initialData.bdrs);
  const [cryptos] = useState<AvailableTicker[]>(initialData.cryptos || []);
  const [treasuryAssets] = useState<TreasuryAsset[]>(initialData.treasuryAssets || []);
  const [filter, setFilter] = useState("");

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline mb-2 flex items-center gap-3">
          <List className="text-primary" />
          Lista de Ativos Disponíveis
        </h1>
        <p className="text-muted-foreground">
          Visualize e explore os ativos (ações, FIIs, BDRs, Criptomoedas e Tesouro Direto) disponíveis. Clique em um ativo para ver mais detalhes.
        </p>
      </header>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar por ticker, nome ou título do tesouro..."
          className="w-full pl-10"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <Tabs defaultValue="stocks" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="stocks">Ações ({stocks.length})</TabsTrigger>
          <TabsTrigger value="fiis">FIIs ({fiis.length})</TabsTrigger>
          <TabsTrigger value="bdrs">BDRs ({bdrs.length})</TabsTrigger>
          <TabsTrigger value="cryptos">Criptos ({cryptos.length})</TabsTrigger>
          <TabsTrigger value="treasury">Tesouro ({treasuryAssets.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="stocks">
           <TickerList tickers={stocks} filter={filter} />
        </TabsContent>
        <TabsContent value="fiis">
           <TickerList tickers={fiis} filter={filter} />
        </TabsContent>
        <TabsContent value="bdrs">
           <TickerList tickers={bdrs} filter={filter} />
        </TabsContent>
        <TabsContent value="cryptos">
           <TickerList tickers={cryptos} filter={filter} />
        </TabsContent>
        <TabsContent value="treasury">
           <TreasuryList assets={treasuryAssets} filter={filter} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
