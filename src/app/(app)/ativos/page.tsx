import { getAvailableTickers } from "@/services/brapi";
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
import { List } from "lucide-react";

async function TickerTable({
  tickers,
  limit = 30,
}: {
  tickers: string[];
  limit?: number;
}) {
  const displayedTickers = tickers.slice(0, limit);

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticker</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedTickers.map((ticker) => (
              <TableRow key={ticker}>
                <TableCell className="font-medium">{ticker}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default async function AtivosPage() {
  const { stocks, fiis, bdrs } = await getAvailableTickers().catch(() => ({
    stocks: [],
    fiis: [],
    bdrs: [],
  }));

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
                Listando as primeiras 30 ações disponíveis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TickerTable tickers={stocks} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="fiis">
          <Card>
            <CardHeader>
              <CardTitle>Fundos Imobiliários (FIIs)</CardTitle>
              <CardDescription>
                Listando os primeiros 30 FIIs disponíveis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TickerTable tickers={fiis} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="bdrs">
          <Card>
            <CardHeader>
              <CardTitle>BDRs</CardTitle>
              <CardDescription>
                Listando os primeiros 30 BDRs disponíveis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TickerTable tickers={bdrs} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
