import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Mapeia o código de tesouro direto para seu nome popular com código entre parênteses
 * @param titulo - Código do tesouro (ex: "LFT", "LTN", "NTN-B", "NTN-F", "NTN-C")
 * @returns Nome popular com código entre parênteses
 */
export function getTreasuryDisplayName(titulo: string): string {
  const titleMap: Record<string, string> = {
    'LFT': 'Tesouro Selic (LFT)',
    'LTN': 'Tesouro Prefixado (LTN)',
    'NTN-B': 'Tesouro IPCA+ (NTN-B)',
    'NTN-F': 'Tesouro Prefixado com Juros Semestrais (NTN-F)',
    'NTN-C': 'Tesouro IGP-M (NTN-C)',
  };
  return titleMap[titulo] || titulo;
}

/**
 * Verifica se um tesouro é pós-fixado (rendimento acompanha SELIC)
 * @param titulo - Código do tesouro
 * @returns true se é pós-fixado (LFT), false caso contrário
 */
export function isTreasuryPostFixed(titulo: string): boolean {
  return titulo === 'LFT';
}

/**
 * Retorna a descrição do índice de um tesouro
 * @param titulo - Código do tesouro
 * @returns Descrição do índice/tipo
 */
export function getTreasuryType(titulo: string): string {
  const typeMap: Record<string, string> = {
    'LFT': 'SELIC',
    'LTN': 'Prefixado',
    'NTN-B': 'IPCA+',
    'NTN-F': 'Prefixado (Semi-anual)',
    'NTN-C': 'IGP-M',
  };
  return typeMap[titulo] || titulo;
}
