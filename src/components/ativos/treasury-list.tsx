'use client';

import Image from 'next/image';
import type { TreasuryAsset } from "@/services/brapi";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getTreasuryDisplayName, isTreasuryPostFixed, getTreasuryType, getTreasuryIndexPrefix } from "@/lib/utils";

function formatDate(dateStr: string): string {
  // Esperado formato: DD/MM/YYYY
  return dateStr;
}

function parseRate(rateStr: string | null): string {
  if (!rateStr) return 'N/A';
  // Formata a taxa para exibição (ex: "-0,0270" fica "-0,0270%")
  return `${rateStr}%`;
}

function TreasuryList({
  assets,
  filter,
}: {
  assets: TreasuryAsset[];
  filter: string;
}) {
  const filteredAssets = assets.filter(
    (asset) =>
      (asset.titulo && asset.titulo.toLowerCase().includes(filter.toLowerCase())) ||
      (getTreasuryDisplayName(asset.titulo).toLowerCase().includes(filter.toLowerCase())) ||
      (asset.vencimento && asset.vencimento.toLowerCase().includes(filter.toLowerCase()))
  );

  if (filteredAssets.length === 0) {
    return <div className="text-center text-muted-foreground py-10">Nenhum ativo de tesouro direto encontrado para o filtro selecionado.</div>;
  }

  return (
    <Accordion type="single" collapsible className="w-full space-y-2">
      {filteredAssets.map((asset) => (
        <AccordionItem 
          value={`${asset.titulo}-${asset.vencimento}`} 
          key={`${asset.titulo}-${asset.vencimento}`} 
          className="border-b-0"
        >
          <AccordionTrigger className="p-4 bg-card rounded-lg border hover:no-underline hover:bg-muted/50 transition-colors data-[state=open]:rounded-b-none data-[state=open]:border-b-0">
            <div className="flex items-center gap-4 w-full">
              <Image src="/tesourodiretoicone.png" alt="Tesouro Direto" width={32} height={32} className="h-8 w-8 flex-shrink-0" />
              <div className="text-left flex-1 overflow-hidden">
                <p className="font-bold text-base">{getTreasuryDisplayName(asset.titulo)}</p>
                <p className="text-sm text-muted-foreground">Vencimento: {formatDate(asset.vencimento)}</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-4 border border-t-0 rounded-b-lg bg-card space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Rentabilidade D-1 */}
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Rentabilidade D-1</p>
                <p className="text-lg font-bold">
                  {isTreasuryPostFixed(asset.titulo) 
                    ? `${getTreasuryIndexPrefix(asset.titulo)} + ${parseRate(asset.fechD1Taxa)}`
                    : parseRate(asset.fechD1Taxa)
                  }
                </p>
              </div>

              {/* Rentabilidade Atual (com source) */}
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">
                  {asset.source === 'última taxa' && 'Rentabilidade Atual'}
                  {asset.source === 'oferta venda' && 'Oferta de Venda'}
                  {asset.source === 'oferta compra' && 'Oferta de Compra'}
                </p>
                <p className="text-lg font-bold text-green-600">
                  {asset.ultimaTaxa 
                    ? asset.source === 'última taxa' 
                      ? isTreasuryPostFixed(asset.titulo)
                        ? `${getTreasuryIndexPrefix(asset.titulo)} + ${parseRate(asset.ultimaTaxa)}`
                        : parseRate(asset.ultimaTaxa)
                      : parseRate(asset.ofertaVenda || asset.ofertaCompra)
                    : 'N/A'
                  }
                </p>
              </div>
            </div>

            {/* Detalhes adicionais */}
            <div className="border-t pt-3 space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Tipo</span>
                <span className="font-semibold text-primary">{getTreasuryType(asset.titulo)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Código ISIN</span>
                <span className="font-mono font-semibold">{asset.isin}</span>
              </div>
              {asset.horario && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Última Atualização</span>
                  <span className="text-xs">{asset.horario}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Data de Vencimento</span>
                <span className="text-xs">{formatDate(asset.vencimento)}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export default TreasuryList;
