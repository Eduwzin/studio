import { getStockInfo, StockInfo } from "@/services/brapi";
import { STOCK_TICKERS, ETF_TICKERS, FII_TICKERS } from "@/lib/stocks";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

async function fetchAllStockData(tickers: string[]): Promise<StockInfo[]> {
  const dataPromises = tickers.map((ticker) =>
    getStockInfo(ticker).catch((e) => null)
  );
  const results = await Promise.all(dataPromises);
  return results.filter((result): result is StockInfo => result !== null);
}

function StockTable({ title, data }: { title: string; data: StockInfo[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ativo</TableHead>
              <TableHead className="text-right">Preço</TableHead>
              <TableHead className="text-right">Variação (Dia)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((stock) => (
              <TableRow key={stock.symbol}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Image
                      src={stock.logourl}
                      alt={`${stock.shortName} logo`}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div>
                      <div className="font-medium">{stock.symbol}</div>
                      <div className="text-xs text-muted-foreground">
                        {stock.longName}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono">
                  R$ {stock.regularMarketPrice.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant={
                      stock.regularMarketChangePercent > 0
                        ? "default"
                        : "destructive"
                    }
                    className={cn(
                        "gap-1",
                        stock.regularMarketChangePercent > 0 && "bg-green-600 hover:bg-green-600/80",
                        stock.regularMarketChangePercent < 0 && "bg-red-600 hover:bg-red-600/80",
                        stock.regularMarketChangePercent === 0 && "bg-muted-foreground"
                    )}
                  >
                    {stock.regularMarketChangePercent > 0 ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : (
                      <ArrowDown className="h-3 w-3" />
                    )}
                    {stock.regularMarketChangePercent.toFixed(2)}%
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function AcoesTable({ title, data }: { title: string; data: StockInfo[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ativo</TableHead>
              <TableHead className="text-right">Preço</TableHead>
              <TableHead className="text-right">Variação (Dia)</TableHead>
              <TableHead className="text-right">P/L</TableHead>
              <TableHead className="text-right">DY (%)</TableHead>
              <TableHead className="text-right">P/VP</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((stock) => (
              <TableRow key={stock.symbol}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Image
                      src={stock.logourl}
                      alt={`${stock.shortName} logo`}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div>
                      <div className="font-medium">{stock.symbol}</div>
                      <div className="text-xs text-muted-foreground">
                        {stock.longName}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono">
                  R$ {stock.regularMarketPrice.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant={
                      stock.regularMarketChangePercent > 0
                        ? "default"
                        : "destructive"
                    }
                    className={cn(
                        "gap-1",
                        stock.regularMarketChangePercent > 0 && "bg-green-600 hover:bg-green-600/80",
                        stock.regularMarketChangePercent < 0 && "bg-red-600 hover:bg-red-600/80",
                        stock.regularMarketChangePercent === 0 && "bg-muted-foreground"
                    )}
                  >
                    {stock.regularMarketChangePercent > 0 ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : (
                      <ArrowDown className="h-3 w-3" />
                    )}
                    {stock.regularMarketChangePercent.toFixed(2)}%
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono">
                  {stock.priceEarnings?.toFixed(2) ?? 'N/A'}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {stock.dividendYield?.toFixed(2) ?? 'N/A'}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {stock.priceToBook?.toFixed(2) ?? 'N/A'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}


export default async function OportunidadesPage() {
  const [acoes, fiis, etfs] = await Promise.all([
    fetchAllStockData(STOCK_TICKERS),
    fetchAllStockData(FII_TICKERS),
    fetchAllStockData(ETF_TICKERS),
  ]);

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-2">Oportunidades de Mercado</h1>
      <p className="text-muted-foreground mb-8">
        Explore alguns dos ativos mais populares do mercado brasileiro.
      </p>

      <Tabs defaultValue="acoes" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
          <TabsTrigger value="acoes">Ações</TabsTrigger>
          <TabsTrigger value="fiis">FIIs</TabsTrigger>
          <TabsTrigger value="etfs">ETFs</TabsTrigger>
        </TabsList>
        <TabsContent value="acoes">
          <AcoesTable title="Ações em Destaque" data={acoes} />
        </TabsContent>
        <TabsContent value="fiis">
          <StockTable title="Fundos Imobiliários em Destaque" data={fiis} />
        </TabsContent>
        <TabsContent value="etfs">
          <StockTable title="ETFs em Destaque" data={etfs} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
