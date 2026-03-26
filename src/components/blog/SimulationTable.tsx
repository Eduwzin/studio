'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "../ui/alert";

type Scenario = {
  label: string;
  rate: (cdi: number, selic: number) => number;
  // Usamos um booleano para determinar se o imposto deve ser aplicado.
  // true para CDB/Tesouro; false para LCI/LCA/Poupança.
  isTaxable: boolean;
};

type SimulationTableProps = {
  cdiRate: number;
  selicRate: number;
  initialInvestment: number;
  monthlyInvestment?: number;
  scenarios: Scenario[];
  terms: number[]; // In months
  showDifference?: boolean;
};

// --- Funções de Cálculo ---

const aliquotaIR = (meses: number) => {
  if (meses <= 6) return 0.225;
  if (meses <= 12) return 0.2;
  if (meses <= 24) return 0.175;
  return 0.15;
};

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

// Calcula o rendimento bruto (Valor Futuro - Principal)
const calculateGrossYield = (
    initial: number,
    monthly: number,
    termMonths: number,
    annualRate: number
) => {
    const monthlyRate = Math.pow(1 + annualRate, 1 / 12) - 1;
    const n = termMonths;
    if (monthlyRate === 0) {
        const fv = initial + monthly * n;
        return fv - (initial + monthly * n); // 0
    }
    const fv = initial * Math.pow(1 + monthlyRate, n) + monthly * ((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate);
    return fv - (initial + monthly * n);
}

export default function SimulationTable({
  cdiRate,
  selicRate,
  initialInvestment,
  monthlyInvestment = 0,
  scenarios,
  terms,
  showDifference = false,
}: SimulationTableProps) {

  const results = terms.map(term => {
    const termYields: { [label: string]: number } = {};
    scenarios.forEach(scenario => {
      const annualRate = scenario.rate(cdiRate, selicRate);
      
      const grossYield = calculateGrossYield(initialInvestment, monthlyInvestment, term, annualRate);
      
      let finalYield = grossYield;
      if (scenario.isTaxable) {
        const ir = grossYield * aliquotaIR(term);
        finalYield = grossYield - ir;
      }
      
      termYields[scenario.label] = finalYield;
    });

    if (showDifference && scenarios.length === 2) {
        const diff = termYields[scenarios[1].label] - termYields[scenarios[0].label];
        termYields['Diferença'] = diff;
    }

    return { term, yields: termYields };
  });

  const headers = scenarios.map(s => s.label);
  if (showDifference && scenarios.length === 2) {
      headers.push('Diferença');
  }

  if (!cdiRate || !selicRate) {
    return (
        <Alert variant="destructive">
            <AlertDescription>
                Não foi possível carregar os dados de mercado para gerar a simulação. Tente recarregar a página.
            </AlertDescription>
        </Alert>
    )
  }
  
  const getPoupancaRateValue = (selic: number) => {
      return selic > 8.5 ? 6.17 : selic * 0.70;
  }

  return (
    <div className="overflow-x-auto my-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Prazo</TableHead>
            {headers.map(header => (
              <TableHead key={header} className="text-right">{header.replace('{{poupancaRate}}', getPoupancaRateValue(selicRate).toFixed(2))}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map(({ term, yields }) => (
            <TableRow key={term}>
              <TableCell>{term} meses</TableCell>
              {headers.map(header => (
                <TableCell key={header} className="text-right">
                  {formatCurrency(yields[header])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
