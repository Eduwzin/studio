'use client';

import { useState } from 'react';
import type { AvailableTicker, AvailableTickersResponse } from "@/services/brapi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { List, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";

function TickerTable({
  tickers,
  filter,
}: {
  tickers: AvailableTicker[];
  filter: string;
}) {
  const filteredTickers = tickers.filter(
    (ticker) =>
      ticker.stock.toLowerCase().includes(filter.toLowerCase()) ||
      (ticker.name && ticker.name.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Ticker</TableHead>
              <TableHead>Nome</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTickers.map((ticker) => (
              <TableRow key={ticker.stock}>
                <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                        <Image 
                            src={ticker.logo} 
                            alt={`Logo de ${ticker.name}`} 
                            width={24} 
                            height={24} 
                            className="rounded-full object-contain"
                            unoptimized // Brapi URLs might not be on the allowed domains
                        />
                        <span>{ticker.stock}</span>
                    </div>
                </TableCell>
                <TableCell>{ticker.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

type AtivosClientProps = {
    initialData: AvailableTickersResponse;
}

export default function AtivosClient({ initialData }: AtivosClientProps) {
  const [stocks] = useState<AvailableTicker[]>(initialData.stocks);
  const [fiis] = useState<AvailableTicker[]>(initialData.fiis);
  const [bdrs] = useState<AvailableTicker[]>(initialData.bdrs);
  const [filter, setFilter] = useState("");

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline mb-2 flex items-center gap-3">
          <List className="text-primary" />
          Lista de Ativos Disponíveis
        </h1>
        <p className="text-muted-foreground">
          Visualize os ativos (ações, FIIs, BDRs) que a API da Brapi nos
          fornece. Usamos esses dados para alimentar nossa IA.
        </p>
      </header>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar por ticker ou nome..."
          className="w-full pl-10"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <Tabs defaultValue="stocks" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="stocks">Ações ({stocks.length})</TabsTrigger>
          <TabsTrigger value="fiis">FIIs ({fiis.length})</TabsTrigger>
          <TabsTrigger value="bdrs">BDRs ({bdrs.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="stocks">
          <Card>
            <CardHeader>
              <CardTitle>Ações (B3)</CardTitle>
              <CardDescription>
                Listando todas as {stocks.length} ações disponíveis na Brapi.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TickerTable tickers={stocks} filter={filter} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="fiis">
          <Card>
            <CardHeader>
              <CardTitle>Fundos Imobiliários (FIIs)</CardTitle>
              <CardDescription>
                Listando todos os {fiis.length} FIIs disponíveis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TickerTable tickers={fiis} filter={filter} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="bdrs">
          <Card>
            <CardHeader>
              <CardTitle>BDRs</CardTitle>
              <CardDescription>
                Listando todos os {bdrs.length} BDRs disponíveis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TickerTable tickers={bdrs} filter={filter} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
