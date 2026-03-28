
import type { ImagePlaceholder } from './placeholder-images';
import data from './placeholder-images.json';

export const placeholderImages: ImagePlaceholder[] = data.placeholderImages;

// --- ESTRUTURA DE CONTEÚDO --
// Permite blocos de HTML estático e componentes dinâmicos

export type HtmlContentBlock = {
  type: 'html';
  content: string;
};

export type SimulationTableBlock = {
  type: 'simulationTable';
  // Parâmetros para o componente de simulação
  initialInvestment: number;
  monthlyInvestment?: number;
  scenarios: {
    label: string;
    // A lógica da taxa é armazenada como string no Firestore
    rate: (cdi: number, selic: number) => number; 
    isTaxable: boolean;
  }[];
  terms: number[]; // Prazos em meses (ex: 6, 12, 24)
  showDifference?: boolean; // Se deve mostrar a coluna de diferença
};

export type ArticleContent = (HtmlContentBlock | SimulationTableBlock)[];

// --- TIPO PRINCIPAL DO ARTIGO ---

export type Article = {
  slug: string;
  title: string;
  excerpt: string; // 'description' foi renomeado para 'excerpt'
  date?: string; // 'lastUpdated' foi renomeado para 'date'
  imageId?: string;
  content: ArticleContent; // Modificado para aceitar múltiplos blocos
  conclusion?: string;
  seoTitle?: string;
  seoDescription?: string;
  faq?: { question: string; answer: string }[];
  category?: string;
  subcategory?: string;
  pillar?: string;
  cluster?: string;
  tags?: string[];
  disclaimer?: string;
  lastUpdated?: any; // Para o timestamp do Firestore
  readingTime?: string;
  author?: string;
  internalLinks?: { anchor: string; slug: string }[];
  cta?: {
    primary: { text: string; url: string };
    secondary?: { text: string; url: string };
  };
};

export const defaultDisclaimer = "Este conteúdo é educativo e não constitui recomendação de investimento. Rentabilidades são referências e variam conforme o produto e o emissor. Consulte um profissional certificado para orientação personalizada.";
