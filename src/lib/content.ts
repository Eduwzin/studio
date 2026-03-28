
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

// O array blogArticles é mantido aqui temporariamente para permitir a re-importação.
// Após a importação bem-sucedida, ele será removido.
export const blogArticles: Article[] = [
  {
    "title": "CDB ou Poupança: qual a melhor opção para iniciantes?",
    "slug": "cdb-ou-poupanca",
    "excerpt": "CDB rende mais que a poupança em todos os cenários, com a mesma segurança (FGC). Veja o comparativo e entenda por que o CDB é melhor para sua reserva.",
    "date": "2026-03-20",
    "readingTime": "8 min",
    "category": "investimentos",
    "subcategory": "renda-fixa",
    "pillar": "pillar-1-investimentos",
    "cluster": "cdb",
    "author": "Equipe Bigwall",
    "seoTitle": "CDB ou Poupança: qual o melhor investimento para iniciantes?",
    "seoDescription": "CDB rende mais que a poupança em todos os cenários, com a mesma segurança (FGC). Veja o comparativo de rendimento, liquidez, IR e saiba quando usar cada um.",
    "disclaimer": "defaultDisclaimer",
    "content": [],
    "faq": [],
    "internalLinks": [],
    "cta": {
      "primary": { "text": "Veja os melhores investimentos para iniciantes", "url": "/melhores-investimentos-para-iniciantes" }
    }
  },
  {
    "title": "Tesouro Selic ou CDB: qual o melhor para a reserva?",
    "slug": "tesouro-selic-ou-cdb",
    "excerpt": "Ambos são excelentes para reserva de emergência. O Tesouro Selic é o mais seguro do país. O CDB pode render um pouco mais, mas exige atenção ao emissor.",
    "date": "2026-03-20",
    "readingTime": "9 min",
    "category": "investimentos",
    "subcategory": "renda-fixa",
    "pillar": "pillar-1-investimentos",
    "cluster": "reserva-de-emergencia",
    "author": "Equipe Bigwall",
    "seoTitle": "Tesouro Selic ou CDB: qual o melhor para a reserva de emergência?",
    "seoDescription": "Tesouro Selic ou CDB: qual a melhor opção para a reserva de emergência? Compare segurança, liquidez, rendimento, IR e veja onde seu dinheiro rende mais.",
    "disclaimer": "defaultDisclaimer",
    "content": [],
    "faq": [],
    "internalLinks": [],
    "cta": {
      "primary": { "text": "Veja o guia completo da reserva de emergência", "url": "/reserva-de-emergencia" }
    }
  },
  {
    "title": "O que é LCI? Vale a pena? (Guia Completo)",
    "slug": "o-que-e-lci",
    "excerpt": "LCI é um investimento de renda fixa isento de Imposto de Renda, ideal para objetivos de médio prazo. Entenda como funciona, a segurança e se vale a pena.",
    "date": "2026-03-20",
    "readingTime": "7 min",
    "category": "investimentos",
    "subcategory": "renda-fixa",
    "pillar": "pillar-1-investimentos",
    "cluster": "lci-lca",
    "author": "Equipe Bigwall",
    "seoTitle": "O que é LCI? Vale a pena? (Guia Completo para 2026)",
    "seoDescription": "Guia completo sobre LCI: o que é, como funciona, rendimento, segurança (FGC), liquidez, carência e comparação com CDB e LCA. Saiba se vale a pena.",
    "disclaimer": "defaultDisclaimer",
    "content": [],
    "faq": [],
    "internalLinks": [],
    "cta": {
      "primary": { "text": "Veja o guia completo de Renda Fixa", "url": "/guia-renda-fixa" }
    }
  },
  {
    "title": "O que é LCA? Vale a pena? (Guia Completo)",
    "slug": "o-que-e-lca",
    "excerpt": "LCA é um investimento de renda fixa isento de IR, muito parecido com a LCI, mas ligado ao agronegócio. Entenda a segurança, liquidez e se vale a pena.",
    "date": "2026-03-20",
    "readingTime": "7 min",
    "category": "investimentos",
    "subcategory": "renda-fixa",
    "pillar": "pillar-1-investimentos",
    "cluster": "lci-lca",
    "author": "Equipe Bigwall",
    "seoTitle": "O que é LCA? Vale a pena? (Guia Completo para 2026)",
    "seoDescription": "Guia completo sobre LCA: o que é, como funciona, rendimento, segurança (FGC), liquidez, carência e comparação com CDB e LCI. Saiba se vale a pena.",
    "disclaimer": "defaultDisclaimer",
    "content": [],
    "faq": [],
    "internalLinks": [],
    "cta": {
      "primary": { "text": "Veja o guia completo de Renda Fixa", "url": "/guia-renda-fixa" }
    }
  },
  {
    "title": "Renda Fixa ou Renda Variável: qual a diferença?",
    "slug": "renda-fixa-ou-renda-variavel",
    "excerpt": "Renda fixa tem retorno previsível; renda variável, não. Entenda a diferença de risco, retorno e quando usar cada uma na sua carteira de investimentos.",
    "date": "2026-03-20",
    "readingTime": "9 min",
    "category": "investimentos",
    "subcategory": "para-iniciantes",
    "pillar": "pillar-1-investimentos",
    "cluster": "comecar-a-investir",
    "author": "Equipe Bigwall",
    "seoTitle": "Renda Fixa ou Renda Variável: qual a diferença e por onde começar?",
    "seoDescription": "Renda Fixa vs Renda Variável: entenda a diferença de risco, retorno e liquidez. Saiba qual é a melhor opção para iniciantes e como combinar as duas.",
    "disclaimer": "defaultDisclaimer",
    "content": [],
    "faq": [],
    "internalLinks": [],
    "cta": {
      "primary": { "text": "Veja o guia completo para começar a investir", "url": "/como-comecar-a-investir" }
    }
  },
  {
    "title": "Guia Completo de Renda Fixa para Iniciantes",
    "slug": "guia-renda-fixa",
    "excerpt": "Aprenda tudo sobre Renda Fixa: Tesouro Direto, CDB, LCI, LCA, CRI e CRA. Entenda os riscos, a liquidez e como montar uma carteira segura e rentável.",
    "date": "2026-03-20",
    "readingTime": "12 min",
    "category": "investimentos",
    "subcategory": "renda-fixa",
    "pillar": "pillar-1-investimentos",
    "cluster": "renda-fixa-geral",
    "author": "Equipe Bigwall",
    "seoTitle": "Guia Completo de Renda Fixa para Iniciantes em 2026",
    "seoDescription": "Guia completo de Renda Fixa: Tesouro Direto (Selic, Prefixado, IPCA+), CDB, LCI, LCA, CRI, CRA e Debêntures. Aprenda tudo para investir com segurança.",
    "disclaimer": "defaultDisclaimer",
    "content": [],
    "faq": [],
    "internalLinks": [],
    "cta": {
      "primary": { "text": "Veja os melhores investimentos para iniciantes", "url": "/melhores-investimentos-para-iniciantes" }
    }
  },
  {
    "title": "CDB ou LCI/LCA: qual rende mais e qual o melhor?",
    "slug": "cdb-ou-lci",
    "excerpt": "CDB tem IR, LCI/LCA não. Mas qual rende mais no final? Veja o comparativo completo de rendimento líquido, liquidez, segurança e quando escolher cada um.",
    "date": "2026-03-20",
    "readingTime": "10 min",
    "category": "investimentos",
    "subcategory": "renda-fixa",
    "pillar": "pillar-1-investimentos",
    "cluster": "cdb",
    "author": "Equipe Bigwall",
    "seoTitle": "CDB ou LCI/LCA: qual rende mais e qual o melhor para 2026?",
    "seoDescription": "CDB ou LCI/LCA: qual o melhor? Calcule o rendimento líquido equivalente, compare a liquidez, o prazo, a segurança (FGC) e saiba qual escolher para seus objetivos.",
    "disclaimer": "defaultDisclaimer",
    "content": [],
    "faq": [],
    "internalLinks": [],
    "cta": {
      "primary": { "text": "Veja o guia completo de Renda Fixa", "url": "/guia-renda-fixa" }
    }
  },
  {
    "title": "O que é CDB e como funciona? (Guia Completo)",
    "slug": "o-que-e-cdb",
    "excerpt": "CDB é um dos investimentos mais simples e seguros, ideal para iniciantes. Entenda como funciona, os tipos (prefixado, pós, híbrido) e a segurança do FGC.",
    "date": "2026-03-20",
    "readingTime": "8 min",
    "category": "investimentos",
    "subcategory": "renda-fixa",
    "pillar": "pillar-1-investimentos",
    "cluster": "cdb",
    "author": "Equipe Bigwall",
    "seoTitle": "O que é CDB e como funciona? (Guia Completo para 2026)",
    "seoDescription": "Guia completo sobre CDB: o que é, como funciona o rendimento (prefixado, pós-fixado, híbrido), a liquidez diária, o IR e a segurança do FGC. É um bom investimento?",
    "disclaimer": "defaultDisclaimer",
    "content": [],
    "faq": [],
    "internalLinks": [],
    "cta": {
      "primary": { "text": "Compare CDB com Tesouro Selic", "url": "/tesouro-selic-ou-cdb" }
    }
  },
  {
    "title": "Como começar a investir do zero em 2026 (Guia Prático)",
    "slug": "como-comecar-a-investir",
    "excerpt": "Aprenda a começar a investir em 5 passos simples: defina objetivos, monte sua reserva, abra conta em corretora, escolha os produtos e invista com consistência.",
    "date": "2026-03-20",
    "readingTime": "12 min",
    "category": "educacao-financeira",
    "subcategory": "para-iniciantes",
    "pillar": "pillar-4-educacao-financeira",
    "cluster": "comecar-a-investir",
    "author": "Equipe Bigwall",
    "seoTitle": "Como começar a investir do zero em 2026 (Guia Prático)",
    "seoDescription": "Guia prático de como começar a investir do zero em 5 passos: defina objetivos, monte sua reserva de emergência, abra conta em corretora, escolha os ativos e invista.",
    "disclaimer": "defaultDisclaimer",
    "content": [],
    "faq": [],
    "internalLinks": [],
    "cta": {
      "primary": { "text": "Veja os melhores investimentos para iniciantes", "url": "/melhores-investimentos-para-iniciantes" }
    }
  },
  {
    "title": "O que é Tesouro Direto e como funciona? (Guia Completo)",
    "slug": "o-que-e-tesouro-direto",
    "excerpt": "Tesouro Direto é o investimento mais seguro do Brasil. Aprenda o que é, os tipos de títulos (Selic, Prefixado, IPCA+), como comprar e qual escolher.",
    "date": "2026-03-20",
    "readingTime": "10 min",
    "category": "investimentos",
    "subcategory": "renda-fixa",
    "pillar": "pillar-1-investimentos",
    "cluster": "tesouro-direto",
    "author": "Equipe Bigwall",
    "seoTitle": "O que é Tesouro Direto e como funciona? (Guia para 2026)",
    "seoDescription": "Guia completo sobre o Tesouro Direto: o que é, como funciona, os tipos de títulos (Tesouro Selic, Prefixado, IPCA+), taxas, IR e como investir passo a passo.",
    "disclaimer": "defaultDisclaimer",
    "content": [],
    "faq": [],
    "internalLinks": [],
    "cta": {
      "primary": { "text": "Compare Tesouro Selic com CDB", "url": "/tesouro-selic-ou-cdb" }
    }
  },
  {
    "title": "Reserva de Emergência: quanto guardar e onde investir",
    "slug": "reserva-de-emergencia",
    "excerpt": "Aprenda a calcular sua reserva de emergência (3 a 12 meses de custo de vida) e onde investir com segurança e liquidez: Tesouro Selic ou CDB de liquidez diária.",
    "date": "2026-03-20",
    "readingTime": "9 min",
    "category": "educacao-financeira",
    "subcategory": "planejamento-financeiro",
    "pillar": "pillar-4-educacao-financeira",
    "cluster": "reserva-de-emergencia",
    "author": "Equipe Bigwall",
    "seoTitle": "Reserva de Emergência: quanto guardar e onde investir (2026)",
    "seoDescription": "Guia completo da Reserva de Emergência: como calcular (3 a 12 meses do seu custo de vida), onde investir com segurança e liquidez (Tesouro Selic, CDB) e o que evitar.",
    "disclaimer": "defaultDisclaimer",
    "content": [],
    "faq": [],
    "internalLinks": [],
    "cta": {
      "primary": { "text": "Veja o guia de como começar a investir", "url": "/como-comecar-a-investir" }
    }
  },
  {
    "title": "Calculadora de Juros Compostos (com simulação)",
    "slug": "calculadora-juros-compostos",
    "excerpt": "Use nossa calculadora de juros compostos para simular o crescimento do seu patrimônio com aportes mensais e diferentes taxas de juros. Veja a mágica acontecer.",
    "date": "2026-03-20",
    "readingTime": "6 min",
    "category": "ferramentas",
    "subcategory": "calculadoras",
    "pillar": "pillar-3-ferramentas",
    "cluster": "juros-compostos",
    "author": "Equipe Bigwall",
    "seoTitle": "Calculadora de Juros Compostos (com simulação e gráfico)",
    "seoDescription": "Calculadora de juros compostos online e gratuita. Simule o crescimento do seu patrimônio com aportes mensais e veja o resultado em tabela e gráfico.",
    "disclaimer": "Este simulador é para fins educativos. A rentabilidade real pode variar.",
    "content": [],
    "faq": [],
    "internalLinks": [],
    "cta": {
      "primary": { "text": "Aprenda a começar a investir", "url": "/como-comecar-a-investir" }
    }
  },
  {
    "title": "O que são FIIs e como funcionam? (Guia Completo)",
    "slug": "o-que-sao-fiis",
    "excerpt": "Aprenda a investir em imóveis com pouco dinheiro através dos FIIs. Entenda o que são, os tipos (tijolo, papel, FOFs) e como receber aluguéis mensais.",
    "date": "2026-03-20",
    "readingTime": "11 min",
    "category": "investimentos",
    "subcategory": "renda-variavel",
    "pillar": "pillar-1-investimentos",
    "cluster": "fiis",
    "author": "Equipe Bigwall",
    "seoTitle": "O que são FIIs (Fundos Imobiliários) e como funcionam? Guia 2026",
    "seoDescription": "Guia completo de Fundos Imobiliários (FIIs): o que são, como funcionam, tipos (tijolo, papel, FOF), como analisar e como receber dividendos mensais isentos de IR.",
    "disclaimer": "defaultDisclaimer",
    "content": [],
    "faq": [],
    "internalLinks": [],
    "cta": {
      "primary": { "text": "Aprenda a analisar um FII", "url": "/como-analisar-um-fii" }
    }
  },
  {
    "title": "O que é ETF e como funciona? (Guia Completo)",
    "slug": "o-que-e-etf",
    "excerpt": "ETFs são fundos de índice negociados na bolsa. É a forma mais simples e barata de diversificar seus investimentos no Brasil e no exterior (S&P 500).",
    "date": "2026-03-20",
    "readingTime": "9 min",
    "category": "investimentos",
    "subcategory": "renda-variavel",
    "pillar": "pillar-1-investimentos",
    "cluster": "etfs",
    "author": "Equipe Bigwall",
    "seoTitle": "O que é ETF (Fundo de Índice) e como funciona? Guia 2026",
    "seoDescription": "Guia completo sobre ETFs: o que são, como funcionam, vantagens (diversificação, baixo custo), os principais tipos (BOVA11, SMAL11, IVVB11) e como investir.",
    "disclaimer": "defaultDisclaimer",
    "content": [],
    "faq": [],
    "internalLinks": [],
    "cta": {
      "primary": { "text": "Veja o guia de Renda Variável", "url": "/guia-renda-variavel" }
    }
  },
    {
    "title": "Melhores Investimentos para Iniciantes em 2026",
    "slug": "melhores-investimentos-para-iniciantes",
    "excerpt": "Quais são os melhores investimentos para quem está começando? Veja as opções mais indicadas com segurança, liquidez e rendimento acima da poupança.",
    "seoTitle": "Melhores Investimentos para Iniciantes em 2026",
    "seoDescription": "Conheça os melhores investimentos para iniciantes: Tesouro Selic, CDB, LCI e mais. Comparativo completo com segurança, liquidez, IR e rendimento.",
    "category": "investimentos",
    "subcategory": "para-iniciantes",
    "pillar": "pillar-1-investimentos",
    "cluster": "comecar-a-investir",
    "readingTime": "11 min",
    "lastUpdated": "2026-03-20",
    "author": "Equipe Bigwall",
    "content": [],
    "faq": [],
    "internalLinks": [],
    "cta": {
      "primary": { "text": "Veja como começar a investir do zero", "url": "/como-comecar-a-investir" },
      "secondary": { "text": "Conheça o guia completo de renda fixa", "url": "/guia-renda-fixa" }
    }
  },
  {
    "title": "Onde Posso Investir? Guia Completo das Opções em 2026",
    "slug": "onde-investir",
    "excerpt": "Descubra onde investir no Brasil: Tesouro Direto, CDB, LCI, ações, FIIs e mais. Veja como acessar cada produto e qual plataforma usar para começar.",
    "seoTitle": "Onde Posso Investir? Guia Completo das Opções em 2026",
    "seoDescription": "Onde investir no Brasil em 2026? Veja todas as opções disponíveis, como acessar cada produto, diferença entre banco e corretora e por onde começar.",
    "category": "investimentos",
    "subcategory": "para-iniciantes",
    "pillar": "pillar-1-investimentos",
    "cluster": "comecar-a-investir",
    "readingTime": "10 min",
    "lastUpdated": "2026-03-20",
    "author": "Equipe Bigwall",
    "content": [],
    "faq": [],
    "internalLinks": [],
    "cta": {
      "primary": { "text": "Veja os melhores investimentos para iniciantes", "url": "/melhores-investimentos-para-iniciantes" },
      "secondary": { "text": "Como começar a investir do zero", "url": "/como-comecar-a-investir" }
    }
  },
  {
    "title": "FIIs ou Ações: qual o melhor para dividendos?",
    "slug": "fii-ou-acao",
    "excerpt": "FIIs pagam aluguéis mensais isentos de IR. Ações podem pagar dividendos maiores, mas sem previsibilidade. Entenda os prós e contras de cada um para sua estratégia de renda.",
    "date": "2026-03-20",
    "readingTime": "9 min",
    "category": "investimentos",
    "subcategory": "renda-variavel",
    "pillar": "pillar-1-investimentos",
    "cluster": "fiis",
    "author": "Equipe Bigwall",
    "seoTitle": "FIIs ou Ações: qual o melhor para receber dividendos?",
    "seoDescription": "FIIs ou Ações: compare qual o melhor para uma estratégia de renda passiva com dividendos. Veja a frequência dos pagamentos, isenção de IR, risco e potencial de valorização.",
    "disclaimer": "defaultDisclaimer",
    "content": [],
    "faq": [],
    "internalLinks": [],
    "cta": {
      "primary": { "text": "O que são FIIs? (Guia Completo)", "url": "/o-que-sao-fiis" }
    }
  },
  {
    "title": "Guia de Renda Variável para Iniciantes",
    "slug": "guia-renda-variavel",
    "excerpt": "Aprenda o essencial para investir em Renda Variável: Ações, FIIs, BDRs e ETFs. Entenda os riscos, as estratégias e como montar uma carteira diversificada para o longo prazo.",
    "date": "2026-03-20",
    "readingTime": "13 min",
    "category": "investimentos",
    "subcategory": "renda-variavel",
    "pillar": "pillar-1-investimentos",
    "cluster": "renda-variavel-geral",
    "author": "Equipe Bigwall",
    "seoTitle": "Guia Completo de Renda Variável para Iniciantes em 2026",
    "seoDescription": "Guia completo de Renda Variável para iniciantes: Ações, FIIs, BDRs e ETFs. Aprenda a analisar, diversificar e investir com foco no longo prazo.",
    "disclaimer": "defaultDisclaimer",
    "content": [],
    "faq": [],
    "internalLinks": [],
    "cta": {
      "primary": { "text": "Veja como começar a investir do zero", "url": "/como-comecar-a-investir" }
    }
  }
]
