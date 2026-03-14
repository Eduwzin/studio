'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
  CartesianGrid,
} from 'recharts';
import { cn } from '@/lib/utils';
import { Calculator } from 'lucide-react';

const PERFIS = {
  conservador: {
    label: 'Conservador',
    taxas: { pessimista: 0.07, neutro: 0.11, otimista: 0.14 },
    alocacao: ['Tesouro Selic 35%', 'CDB / LCI 30%', 'Tesouro IPCA+ 20%', 'FIIs 10%', 'Ações 5%'],
  },
  moderado: {
    label: 'Moderado',
    taxas: { pessimista: 0.09, neutro: 0.14, otimista: 0.20 },
    alocacao: ['CDB / LCI 25%', 'Tesouro IPCA+ 20%', 'FIIs 20%', 'Ações BR 25%', 'Internacional 10%'],
  },
  agressivo: {
    label: 'Agressivo',
    taxas: { pessimista: 0.08, neutro: 0.18, otimista: 0.3 },
    alocacao: ['Ações BR 35%', 'BDRs / ETFs 20%', 'FIIs 15%', 'Cripto 15%', 'Renda fixa 15%'],
  },
};

type Perfil = keyof typeof PERFIS;

const taxaMensal = (taxaAnual: number) => Math.pow(1 + taxaAnual, 1 / 12) - 1;

const calcFV = (pv: number, pmt: number, taxaAnual: number, anos: number) => {
  const r = taxaMensal(taxaAnual);
  const n = anos * 12;
  if (r === 0) return pv + pmt * n;
  const fator = Math.pow(1 + r, n);
  return pv * fator + pmt * ((fator - 1) / r);
};

const aliquotaIR = (meses: number) => {
  if (meses <= 180) return 0.225;
  if (meses <= 360) return 0.2;
  if (meses <= 720) return 0.175;
  return 0.15;
};

const calcIR = (fvBruto: number, totalInvestido: number, anos: number) => {
  const ganho = Math.max(0, fvBruto - totalInvestido);
  return ganho * aliquotaIR(anos * 12);
};

const deflacionar = (valor: number, anos: number, ipcaAnual: number) => {
  return valor / Math.pow(1 + ipcaAnual, anos);
};

const fmtBRL = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
};

const fmtAbrev = (valor: number) => {
  if (Math.abs(valor) >= 1e6) return `R$${(valor / 1e6).toFixed(1)}M`;
  if (Math.abs(valor) >= 1e3) return `R$${(valor / 1e3).toFixed(0)}k`;
  return `R$${Math.round(valor)}`;
};


export default function SimuladorClient() {
  const [perfil, setPerfil] = useState<Perfil>('conservador');
  const [aporteInicial, setAporteInicial] = useState(10000);
  const [aporteMensal, setAporteMensal] = useState(500);
  const [prazo, setPrazo] = useState(10);
  const [ipca, setIpca] = useState(4.5);
  const [usarIR, setUsarIR] = useState(true);
  const [usarInflacao, setUsarInflacao] = useState(true);
  const [resultados, setResultados] = useState<any>(null);

  const calcular = useCallback(() => {
    const pv = aporteInicial || 0;
    const pmt = aporteMensal || 0;
    const anos = prazo || 1;
    const ipcaAnual = ipca / 100 || 0;

    const cfg = PERFIS[perfil];
    const totalInv = pv + pmt * anos * 12;

    const cenario = (taxa: number) => {
      const fvBruto = calcFV(pv, pmt, taxa, anos);
      const ir = usarIR ? calcIR(fvBruto, totalInv, anos) : 0;
      const liquido = fvBruto - ir;
      const real = deflacionar(liquido, anos, ipcaAnual);
      return { fvBruto, ir, liquido, real, exibir: usarInflacao ? real : liquido };
    };

    const cenP = cenario(cfg.taxas.pessimista);
    const cenN = cenario(cfg.taxas.neutro);
    const cenO = cenario(cfg.taxas.otimista);
    
    const serieAnual = (taxa: number) => {
        return Array.from({ length: anos + 1 }, (_, y) => {
            if (y === 0) return Math.round(pv);
            const inv = pv + pmt * y * 12;
            const fvB = calcFV(pv, pmt, taxa, y);
            const liq = fvB - (usarIR ? calcIR(fvB, inv, y) : 0);
            const real = deflacionar(liq, y, ipcaAnual);
            return Math.round(usarInflacao ? real : liq);
        });
    };

    const tabela = Array.from({ length: anos }, (_, i) => {
        const y = i + 1;
        const inv = pv + pmt * y * 12;
        const fvB = calcFV(pv, pmt, cfg.taxas.neutro, y);
        const ganho = Math.max(0, fvB - inv);
        const ir = usarIR ? calcIR(fvB, inv, y) : 0;
        const liq = fvB - ir;
        const real = deflacionar(liq, y, ipcaAnual);
        return { ano: y, investido: inv, fvBruto: fvB, ganho, ir, fvLiquido: liq, fvReal: real };
    });

    const dataGraficoLinhas = Array.from({ length: anos + 1 }, (_, i) => ({
      name: i === 0 ? 'Início' : `Ano ${i}`,
      investido: pv + pmt * i * 12,
      pessimista: serieAnual(cfg.taxas.pessimista)[i],
      neutro: serieAnual(cfg.taxas.neutro)[i],
      otimista: serieAnual(cfg.taxas.otimista)[i],
    }));
    
    const dataGraficoBarras = [
        { name: 'Investido', pessimista: totalInv, neutro: totalInv, otimista: totalInv },
        { name: 'Rendimento', pessimista: cenP.liquido - totalInv, neutro: cenN.liquido - totalInv, otimista: cenO.liquido - totalInv },
        { name: 'IR Pago', pessimista: cenP.ir, neutro: cenN.ir, otimista: cenO.ir },
    ];


    setResultados({ cenP, cenN, cenO, totalInv, cfg, anos, ipcaAnual, tabela, dataGraficoLinhas, dataGraficoBarras });
  }, [aporteInicial, aporteMensal, prazo, ipca, usarIR, usarInflacao, perfil]);

  useEffect(() => {
    calcular();
  }, [calcular]);

  return (
    <div className="max-w-4xl mx-auto">
        <header className="mb-8">
            <h1 className="text-3xl font-bold font-headline mb-2 flex items-center gap-3">
            <Calculator className="text-primary" />
            Simulador de Investimentos
            </h1>
            <p className="text-muted-foreground">
            Juros compostos mensais · IR regressivo · IPCA · 3 cenários
            </p>
        </header>

        <Card>
            <CardContent className="pt-6">
                 <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Perfil do investidor</Label>
                 <div className="grid grid-cols-3 gap-2 mt-2">
                    {(Object.keys(PERFIS) as Perfil[]).map(p => (
                        <Button key={p} variant={perfil === p ? 'default' : 'outline'} onClick={() => setPerfil(p)}>
                            {PERFIS[p].label}
                        </Button>
                    ))}
                 </div>
            </CardContent>
             <CardContent>
                 <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Parâmetros</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                    <div className="space-y-2">
                        <Label htmlFor="ini">Aporte inicial (R$)</Label>
                        <Input id="ini" type="number" value={aporteInicial} onChange={e => setAporteInicial(Number(e.target.value))} min="0" step="1000"/>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="men">Aporte mensal (R$)</Label>
                        <Input id="men" type="number" value={aporteMensal} onChange={e => setAporteMensal(Number(e.target.value))} min="0" step="100"/>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="prz">Prazo (anos)</Label>
                        <Input id="prz" type="number" value={prazo} onChange={e => setPrazo(Number(e.target.value))} min="1" max="40"/>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="ipc">IPCA anual (%)</Label>
                        <Input id="ipc" type="number" value={ipca} onChange={e => setIpca(Number(e.target.value))} min="0" step="0.5"/>
                    </div>
                </div>
            </CardContent>
             <CardContent className="flex items-center gap-6">
                <div className="flex items-center space-x-2">
                    <Switch id="btn-ir" checked={usarIR} onCheckedChange={setUsarIR} />
                    <Label htmlFor="btn-ir">Incluir IR regressivo</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Switch id="btn-inf" checked={usarInflacao} onCheckedChange={setUsarInflacao} />
                    <Label htmlFor="btn-inf">Ajustar pela inflação</Label>
                </div>
            </CardContent>
        </Card>

        {resultados && (
            <>
            <div className="my-6">
                 <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Alocação sugerida — {resultados.cfg.label}</Label>
                 <div className="flex flex-wrap gap-2 mt-2">
                    {resultados.cfg.alocacao.map((tag: string) => (
                        <div key={tag} className="text-xs font-medium bg-secondary text-secondary-foreground py-1 px-2.5 rounded-full">{tag}</div>
                    ))}
                 </div>
            </div>

            <Separator className="my-8" />
            
            <div>
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Resumo — Cenário Neutro</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                    <MetricCard label="Total investido" value={fmtBRL(resultados.totalInv)} sub="saiu do seu bolso" />
                    <MetricCard label="FV bruto" value={fmtBRL(resultados.cenN.fvBruto)} sub="antes do IR" />
                    <MetricCard label="IR pago" valueClassName="text-destructive" value={fmtBRL(resultados.cenN.ir)} sub={usarIR ? `${(aliquotaIR(resultados.anos * 12) * 100).toFixed(1)}% sobre o ganho` : 'desligado'} />
                    <MetricCard label="Patrimônio final" valueClassName="text-green-600" value={fmtBRL(resultados.cenN.exibir)} sub={usarInflacao ? 'poder de compra hoje' : 'valor nominal'} className="border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/30" />
                </div>
            </div>

            <div className="mt-8">
                 <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Projeção de Patrimônio Final em 3 Cenários</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <MetricCard label="Pessimista" valueClassName="text-destructive" value={fmtBRL(resultados.cenP.exibir)} sub={`${(resultados.cfg.taxas.pessimista * 100).toFixed(0)}% a.a. bruto`} />
                    <MetricCard label="Neutro" value={fmtBRL(resultados.cenN.exibir)} sub={`${(resultados.cfg.taxas.neutro * 100).toFixed(0)}% a.a. bruto`} />
                    <MetricCard label="Otimista" valueClassName="text-green-600" value={fmtBRL(resultados.cenO.exibir)} sub={`${(resultados.cfg.taxas.otimista * 100).toFixed(0)}% a.a. bruto`} />
                </div>
            </div>

            <div className="mt-8">
                 <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Evolução do Patrimônio</Label>
                 <ResponsiveContainer width="100%" height={250} className="mt-2">
                    <LineChart data={resultados.dataGraficoLinhas}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false}/>
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => fmtAbrev(value as number)} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{fontSize: "12px"}}/>
                        <Line type="monotone" dataKey="otimista" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="neutro" stroke="hsl(var(--muted-foreground))" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="pessimista" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="investido" name="Total Investido" stroke="hsl(var(--border))" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                    </LineChart>
                 </ResponsiveContainer>
            </div>
             <div className="mt-8">
                 <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Composição Final (Cenário Neutro)</Label>
                 <ResponsiveContainer width="100%" height={180} className="mt-2">
                    <BarChart data={[resultados.cenN]} layout="vertical" stackOffset="expand">
                         <XAxis type="number" hide domain={[0, 1]}/>
                         <YAxis type="category" dataKey="name" hide />
                         <Tooltip content={<CompositionTooltip totalBruto={resultados.cenN.fvBruto} />} />
                         <Bar dataKey={(data) => data.fvBruto - data.ir - resultados.totalInv} name="Rendimento Líquido" stackId="a" fill="hsl(var(--chart-2))" radius={[4, 0, 0, 4]} />
                         <Bar dataKey={(data) => resultados.totalInv} name="Total Investido" stackId="a" fill="hsl(var(--muted))" />
                         <Bar dataKey="ir" name="IR Pago" stackId="a" fill="hsl(var(--chart-3))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                 </ResponsiveContainer>
             </div>

            <Separator className="my-8" />
            
            <Tabs defaultValue="tabela" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="tabela">Tabela Anual</TabsTrigger>
                    <TabsTrigger value="formula">Fórmulas</TabsTrigger>
                    <TabsTrigger value="validacao">Validação</TabsTrigger>
                </TabsList>
                <TabsContent value="tabela">
                    <Card className="mt-4">
                        <CardContent className="p-0">
                             <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Ano</TableHead>
                                            <TableHead className="text-right">Investido</TableHead>
                                            <TableHead className="text-right">FV Bruto</TableHead>
                                            <TableHead className="text-right">Ganho</TableHead>
                                            <TableHead className="text-right">IR</TableHead>
                                            <TableHead className="text-right">FV Líquido</TableHead>
                                            <TableHead className="text-right">FV Real</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {resultados.tabela.map((row: any) => (
                                            <TableRow key={row.ano}>
                                                <TableCell>{row.ano}</TableCell>
                                                <TableCell className="text-right">{fmtBRL(row.investido)}</TableCell>
                                                <TableCell className="text-right">{fmtBRL(row.fvBruto)}</TableCell>
                                                <TableCell className="text-right">{fmtBRL(row.ganho)}</TableCell>
                                                <TableCell className="text-right text-destructive">{fmtBRL(row.ir)}</TableCell>
                                                <TableCell className="text-right text-green-600">{fmtBRL(row.fvLiquido)}</TableCell>
                                                <TableCell className="text-right">{fmtBRL(row.fvReal)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                 <TabsContent value="formula">
                     <InfoBox>
                        <p className="font-semibold">Fórmula principal (juros compostos + aportes mensais):</p>
                        <code className="my-2">FV = PV × (1+r)^n + PMT × [(1+r)^n − 1] / r</code>
                        <p className="font-semibold mt-4">Taxa mensal equivalente (nunca divida por 12!):</p>
                        <code className="my-2">r = (1 + taxa_anual)^(1/12) − 1</code>
                        <p className="text-sm text-muted-foreground">Ex: 11% a.a. → r = (1,11)^(1/12) − 1 = <strong>0,8735% ao mês</strong></p>
                        <p className="font-semibold mt-4">IR regressivo (Receita Federal) — só sobre o ganho:</p>
                        <p className="text-sm text-muted-foreground">Até 180 dias: 22,5% | 181–360: 20% | 361–720: 17,5% | +720 dias: <strong>15%</strong></p>
                        <code className="my-2">IR = (FV_bruto − total_investido) × alíquota</code>
                        <p className="font-semibold mt-4">Deflação pelo IPCA:</p>
                        <code className="mt-2">FV_real = FV_líquido / (1 + IPCA)^anos</code>
                    </InfoBox>
                </TabsContent>
                <TabsContent value="validacao">
                    <InfoBox>
                        <p className="font-semibold mb-4">Validação passo a passo — cenário neutro ({ (resultados.cfg.taxas.neutro * 100).toFixed(0) }% a.a.)</p>
                        <ol className="list-decimal list-inside space-y-2 text-sm">
                            <li><strong>Taxa mensal:</strong> r = (1 + {resultados.cfg.taxas.neutro})^{1/12} − 1 = <strong>{(taxaMensal(resultados.cfg.taxas.neutro) * 100).toFixed(4)}%</strong></li>
                            <li><strong>Meses:</strong> {resultados.anos} anos × 12 = <strong>{resultados.anos * 12} meses</strong></li>
                            <li><strong>Fator de crescimento:</strong> (1 + r)^{resultados.anos * 12} = <strong>{Math.pow(1 + taxaMensal(resultados.cfg.taxas.neutro), resultados.anos * 12).toFixed(6)}</strong></li>
                            <li><strong>Parcela do aporte inicial:</strong> {fmtBRL(aporteInicial)} × {Math.pow(1 + taxaMensal(resultados.cfg.taxas.neutro), resultados.anos * 12).toFixed(4)} = <strong>{fmtBRL(aporteInicial * Math.pow(1 + taxaMensal(resultados.cfg.taxas.neutro), resultados.anos * 12))}</strong></li>
                            <li><strong>Parcela dos aportes mensais:</strong> {fmtBRL(aporteMensal)} × (fator − 1) / r = <strong>{fmtBRL(aporteMensal * ((Math.pow(1 + taxaMensal(resultados.cfg.taxas.neutro), resultados.anos * 12) - 1) / taxaMensal(resultados.cfg.taxas.neutro)))}</strong></li>
                            <li><strong>FV bruto total:</strong> ... = <strong>{fmtBRL(resultados.cenN.fvBruto)}</strong></li>
                            <li><strong>Total investido:</strong> {fmtBRL(aporteInicial)} + ({fmtBRL(aporteMensal)} × {resultados.anos * 12}) = <strong>{fmtBRL(resultados.totalInv)}</strong></li>
                            <li><strong>Ganho bruto:</strong> {fmtBRL(resultados.cenN.fvBruto)} − {fmtBRL(resultados.totalInv)} = <strong>{fmtBRL(resultados.cenN.fvBruto - resultados.totalInv)}</strong></li>
                            <li><strong>IR ({(aliquotaIR(resultados.anos * 12) * 100).toFixed(1)}%):</strong> {fmtBRL(resultados.cenN.fvBruto - resultados.totalInv)} × {aliquotaIR(resultados.anos * 12)} = <strong>{fmtBRL(resultados.cenN.ir)}</strong></li>
                            <li><strong>Patrimônio líquido:</strong> {fmtBRL(resultados.cenN.fvBruto)} − {fmtBRL(resultados.cenN.ir)} = <strong>{fmtBRL(resultados.cenN.liquido)}</strong></li>
                            <li><strong>Valor real (IPCA {(resultados.ipcaAnual * 100).toFixed(1)}% a.a.):</strong> {fmtBRL(resultados.cenN.liquido)} ÷ (1 + {resultados.ipcaAnual})^{resultados.anos} = <strong>{fmtBRL(resultados.cenN.real)}</strong></li>
                        </ol>
                    </InfoBox>
                </TabsContent>
            </Tabs>
            </>
        )}

    </div>
  );
}

const MetricCard = ({ label, value, sub, className, valueClassName }: { label: string, value: string, sub?: string, className?: string, valueClassName?: string }) => (
    <Card className={cn('text-left', className)}>
        <CardHeader className="p-4">
            <CardDescription>{label}</CardDescription>
            <CardTitle className={cn('text-xl', valueClassName)}>{value}</CardTitle>
            {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
        </CardHeader>
    </Card>
);

const InfoBox = ({ children }: { children: React.ReactNode}) => (
    <div className="mt-4 p-4 bg-muted/50 rounded-lg border text-foreground/80">
        {children}
    </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-background border rounded-lg shadow-lg text-sm">
        <p className="font-bold">{label}</p>
        {payload.map((p: any) => (
          <p key={p.dataKey} style={{ color: p.color }}>
            {p.dataKey === 'investido' ? 'Total Investido' : p.dataKey.charAt(0).toUpperCase() + p.dataKey.slice(1)}: {fmtBRL(p.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const CompositionTooltip = ({ active, payload, label, totalBruto }: any) => {
  if (active && payload && payload.length) {
    const percent = (value: number) => ((value / totalBruto) * 100).toFixed(1) + '%';
    return (
      <div className="p-2 bg-background border rounded-lg shadow-lg text-sm">
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.fill }}>
            {p.name}: {fmtBRL(p.value)} ({percent(p.value)})
          </p>
        ))}
      </div>
    );
  }
  return null;
};
