
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

const defaultDisclaimer = "Este conteúdo é educativo e não constitui recomendação de investimento. Rentabilidades são referências e variam conforme o produto e o emissor. Consulte um profissional certificado para orientação personalizada.";

export const blogArticles: Article[] = [
  {
    "title": "CDB ou Poupança: qual rende mais e é mais seguro?",
    "slug": "cdb-ou-poupanca",
    "excerpt": "CDB rende mais que a poupança em praticamente todos os cenários. Entenda a diferença, o rendimento líquido, a segurança do FGC e quando cada um vale a pena.",
    "seoTitle": "CDB ou Poupança: Qual Rende Mais e é Mais Seguro em 2026?",
    "seoDescription": "CDB rende mais que a poupança. Entenda o rendimento líquido, a segurança do FGC e quando cada um vale a pena com a Selic atual.",
    "category": "renda-fixa",
    "subcategory": "comparativo",
    "pillar": "pillar-2-renda-fixa",
    "cluster": "cdb",
    "readingTime": "9 min",
    "lastUpdated": "2026-03-20",
    "author": "Equipe Bigwall",
    "content": [
      {
        "type": "html",
        "content": "<h1>CDB ou Poupança: qual o melhor investimento?</h1><div class='resumo-rapido'><ul><li>Com a Selic a {{selicRate}}% ao ano, um CDB a 100% do CDI rende quase o dobro da poupança ({{poupancaRate}}% a.a.)</li><li>Ambos têm a mesma segurança, garantidos pelo FGC em até R$ 250 mil</li><li>O CDB tem IR regressivo, mas mesmo assim supera a poupança</li><li>A poupança só rende no 'aniversário', o CDB em todo dia útil</li></ul></div><p>A poupança é o investimento mais popular do Brasil, mas está longe de ser o melhor. Com as taxas de juros atuais, deixar o dinheiro na poupança significa perder poder de compra para a inflação. O CDB, por outro lado, oferece segurança similar com rentabilidade muito superior.</p><h2>CDB x Poupança: Comparativo de Rendimento Líquido</h2><p>Esta simulação mostra o rendimento líquido (já descontado o Imposto de Renda) de R$ 10.000 investidos em 12 meses. Referência: CDI de {{cdiRate}}% ao ano (Bacen/SGS, {{dataAtualizacao}}).</p>"
      },
      {
        "type": "simulationTable",
        "initialInvestment": 10000,
        "terms": [12],
        "showDifference": true,
        "scenarios": [
          { "label": "Poupança ({{poupancaRate}}% a.a.)", "rate": (cdi, selic) => selic > 8.5 ? 0.0617 : selic * 0.70, "isTaxable": false },
          { "label": "CDB 100% CDI líquido", "rate": (cdi, selic) => cdi / 100, "isTaxable": true }
        ]
      },
      {
        "type": "html",
        "content": "<h2>Por que o CDB rende mais?</h2><p>O rendimento da poupança é fixado por lei: 0,5% ao mês + TR quando a Selic está acima de 8,5% ao ano, e 70% da Selic quando a taxa está igual ou abaixo de 8,5%. Já o CDB acompanha o CDI, que por sua vez, anda colado na Selic. Com a Selic a {{selicRate}}%, o CDI fica em torno de {{cdiRate}}% ao ano.</p><h2>Segurança: Empate técnico</h2><p>Tanto o CDB quanto a poupança são garantidos pelo Fundo Garantidor de Créditos (FGC) para valores de até R$ 250.000 por CPF por instituição financeira. Na prática, o risco para o investidor é o mesmo.</p><h2>Liquidez: Vantagem do CDB</h2><p>A poupança só paga rendimento no 'aniversário', ou seja, a cada 30 dias. Se você resgatar no 29º dia, perde todo o rendimento do período. Um CDB de liquidez diária, por outro lado, rende todos os dias úteis.</p><h2>Imposto de Renda: Vantagem da Poupança</h2><p>A poupança é isenta de Imposto de Renda, enquanto o CDB tem alíquota regressiva (de 22,5% a 15%). No entanto, mesmo com o IR, o rendimento líquido do CDB ainda é muito superior, como mostra a simulação acima.</p><h2>Conclusão</h2><p>Com a Selic a {{selicRate}}% ao ano, não há motivo para deixar o dinheiro na poupança. Um CDB a 100% do CDI é a melhor opção, oferecendo a mesma segurança com um rendimento líquido quase duas vezes maior.</p><p><a href='/o-que-e-cdb'>Leia o guia completo sobre o que é CDB.</a></p><p><em>Referência: Selic {{selicRate}}% a.a., CDI {{cdiRate}}% a.a. (Bacen/SGS, {{dataAtualizacao}}).</em></p>",
        "disclaimer": "Este conteúdo é educativo e não constitui recomendação de investimento."
      }
    ],
    "faq": [
      { "question": "CDB é mais seguro que a poupança?", "answer": "Ambos têm a mesma segurança para valores até R$ 250 mil, pois são garantidos pelo FGC." },
      { "question": "Qual rende mais, CDB ou poupança?", "answer": "Com a Selic a {{selicRate}}%, o CDB rende quase o dobro da poupança, mesmo após o Imposto de Renda." },
      { "question": "Qual a desvantagem do CDB?", "answer": "A principal desvantagem é o Imposto de Renda, que já é descontado no rendimento líquido. A vantagem da poupança é a isenção, mas seu rendimento é muito menor." },
      { "question": "Posso resgatar o CDB a qualquer momento?", "answer": "Depende. CDBs de liquidez diária podem ser resgatados a qualquer momento. Outros CDBs têm prazo de vencimento." },
      { "question": "O que acontece se o banco do meu CDB quebrar?", "answer": "O FGC garante o seu dinheiro de volta, limitado a R$ 250.000 por CPF e por instituição." }
    ],
    "internalLinks": [
      { "anchor": "o que é CDB", "slug": "o-que-e-cdb" },
      { "anchor": "guia completo de renda fixa", "slug": "guia-renda-fixa" }
    ],
    "cta": {
      "primary": { "text": "Entenda o que é CDB", "url": "/o-que-e-cdb" },
      "secondary": { "text": "Veja os melhores investimentos para iniciantes", "url": "/melhores-investimentos-para-iniciantes" }
    }
  },
  {
    "title": "Tesouro Selic ou CDB: qual o melhor para sua reserva?",
    "slug": "tesouro-selic-ou-cdb",
    "excerpt": "Tesouro Selic e CDB são os melhores investimentos para a reserva de emergência. Entenda a diferença de rendimento, liquidez, segurança e qual escolher.",
    "seoTitle": "Tesouro Selic ou CDB: Qual o Melhor para Reserva de Emergência?",
    "seoDescription": "Tesouro Selic vs CDB: qual o melhor para sua reserva de emergência? Entenda a diferença de rendimento líquido, liquidez, segurança e como escolher.",
    "category": "renda-fixa",
    "subcategory": "comparativo",
    "pillar": "pillar-2-renda-fixa",
    "cluster": "tesouro-direto",
    "readingTime": "8 min",
    "lastUpdated": "2026-03-20",
    "author": "Equipe Bigwall",
    "content": [
      {
        "type": "html",
        "content": "<h1>Tesouro Selic ou CDB: qual o melhor para sua reserva de emergência?</h1><div class='resumo-rapido'><ul><li>Ambos são excelentes para a reserva de emergência</li><li>O Tesouro Selic é o investimento mais seguro do país</li><li>Um bom CDB de liquidez diária rende um pouco mais que o Tesouro Selic</li><li>A diferença de rendimento é pequena, então a escolha depende do seu perfil</li></ul></div><p>Tanto o Tesouro Selic quanto um bom CDB de liquidez diária são as melhores opções para sua reserva de emergência. Ambos são seguros e permitem o resgate a qualquer momento. A diferença está nos detalhes de segurança e rentabilidade.</p><h2>Tesouro Selic vs CDB: Comparativo de Rendimento Líquido</h2><p>Esta simulação mostra o rendimento líquido (já descontado o Imposto de Renda) de R$ 10.000 investidos em 12 meses. Referência: Selic de {{selicRate}}% ao ano (Bacen/SGS, {{dataAtualizacao}}).</p>"
      },
      {
        "type": "simulationTable",
        "initialInvestment": 10000,
        "terms": [12],
        "showDifference": true,
        "scenarios": [
          { "label": "Tesouro Selic líquido", "rate": (cdi, selic) => selic / 100, "isTaxable": true },
          { "label": "CDB 102% CDI líquido", "rate": (cdi, selic) => (cdi / 100) * 1.02, "isTaxable": true }
        ]
      },
      {
        "type": "html",
        "content": "<h2>Segurança: Ponto para o Tesouro Selic</h2><p>O Tesouro Selic é um título público federal. Isso significa que ele é garantido pelo Governo Federal, sendo considerado o investimento mais seguro do Brasil. O CDB é garantido pelo FGC em até R$ 250 mil, o que também é extremamente seguro. Mas, em teoria, o Tesouro Selic tem um grau de segurança ligeiramente superior.</p><h2>Rentabilidade: Ponto para um bom CDB</h2><p>O Tesouro Selic rende a taxa Selic (hoje em {{selicRate}}% a.a.) mais um pequeno prêmio. Um CDB de liquidez diária de um banco digital pode render 102% do CDI (hoje em {{cdiRate}}% a.a.) ou mais. Com isso, o CDB tende a render um pouco mais, como mostra a simulação acima.</p><h2>Liquidez: Empate técnico</h2><p>Ambos oferecem liquidez diária. No Tesouro Selic, o resgate cai na sua conta em D+1 (um dia útil). Em um CDB de liquidez diária, o resgate costuma ser imediato (D+0).</p><h2>Imposto de Renda</h2><p>Ambos seguem a mesma tabela regressiva de Imposto de Renda, de 22,5% a 15% sobre o rendimento.</p><h2>Conclusão: Qual escolher?</h2><p>Se você busca a máxima segurança possível, vá de Tesouro Selic. Se quer otimizar o rendimento, um bom CDB de liquidez diária (acima de 100% do CDI) é a melhor escolha. A diferença de rendimento é pequena, então ambas as opções são excelentes para a sua reserva de emergência.</p><p><a href='/o-que-e-tesouro-direto'>Leia o guia completo sobre o Tesouro Direto.</a></p><p><a href='/o-que-e-cdb'>Leia o guia completo sobre o CDB.</a></p><p><em>Referência: Selic {{selicRate}}% a.a., CDI {{cdiRate}}% a.a. (Bacen/SGS, {{dataAtualizacao}}).</em></p>",
        "disclaimer": "Este conteúdo é educativo e não constitui recomendação de investimento."
      }
    ],
    "faq": [
      { "question": "Qual é mais seguro, Tesouro Selic ou CDB?", "answer": "O Tesouro Selic é considerado o investimento mais seguro do Brasil, pois é garantido pelo Governo Federal. O CDB é garantido pelo FGC, que também é extremamente seguro." },
      { "question": "Qual rende mais, Tesouro Selic ou CDB?", "answer": "Um bom CDB de liquidez diária (acima de 100% do CDI) tende a render um pouco mais que o Tesouro Selic." },
      { "question": "Qual tem mais liquidez?", "answer": "Ambos têm alta liquidez. O CDB de liquidez diária geralmente permite resgate imediato (D+0), enquanto o Tesouro Selic leva um dia útil (D+1)." },
      { "question": "Onde investir a reserva de emergência?", "answer": "Tanto o Tesouro Selic quanto um CDB de liquidez diária com rendimento acima de 100% do CDI são as melhores opções para a reserva de emergência." }
    ],
    "internalLinks": [
      { "anchor": "reserva de emergência", "slug": "reserva-de-emergencia" },
      { "anchor": "o que é CDB", "slug": "o-que-e-cdb" },
      { "anchor": "o que é Tesouro Direto", "slug": "o-que-e-tesouro-direto" }
    ],
    "cta": {
      "primary": { "text": "Aprenda a montar sua reserva de emergência", "url": "/reserva-de-emergencia" },
      "secondary": { "text": "Veja o guia de como começar a investir", "url": "/como-comecar-a-investir" }
    }
  },
  {
    "title": "O que é LCI e como funciona? É melhor que CDB?",
    "slug": "o-que-e-lci",
    "excerpt": "LCI (Letra de Crédito Imobiliário) é um investimento de renda fixa isento de IR. Entenda como funciona, a segurança do FGC e quando vale a pena.",
    "seoTitle": "O que é LCI: como funciona e comparativo com o CDB",
    "seoDescription": "LCI é um investimento de renda fixa isento de Imposto de Renda. Entenda como funciona a Letra de Crédito Imobiliário, a segurança do FGC e quando vale a pena.",
    "category": "renda-fixa",
    "subcategory": "lci-lca",
    "pillar": "pillar-2-renda-fixa",
    "cluster": "lci-lca",
    "readingTime": "7 min",
    "lastUpdated": "2026-03-20",
    "author": "Equipe Bigwall",
    "content": [
      {
        "type": "html",
        "content": "<h1>O que é LCI e como funciona?</h1><div class='resumo-rapido'><ul><li>LCI é um título de renda fixa emitido por bancos para financiar o setor imobiliário</li><li>É isento de Imposto de Renda para pessoas físicas</li><li>Tem a mesma segurança do CDB e da poupança (garantia do FGC)</li><li>Exige carência mínima (geralmente 90 dias), então não é ideal para reserva de emergência</li><li>Uma LCI a 90% do CDI equivale a um CDB de 116% do CDI em 12 meses</li></ul></div><p>LCI (Letra de Crédito Imobiliário) é um dos melhores investimentos de renda fixa disponíveis no Brasil, principalmente pela sua isenção de Imposto de Renda para pessoas físicas.</p><h2>LCI vs CDB: qual rende mais?</h2><p>Como a LCI é isenta de IR, sua taxa de rendimento pode parecer menor que a de um CDB. Mas o que importa é o rendimento líquido. Esta simulação mostra o rendimento líquido de R$ 10.000 investidos por 12 meses.</p>"
      },
      {
        "type": "simulationTable",
        "initialInvestment": 10000,
        "terms": [12],
        "showDifference": true,
        "scenarios": [
          { "label": "CDB 100% CDI líquido", "rate": (cdi, selic) => cdi / 100, "isTaxable": true },
          { "label": "LCI 90% CDI", "rate": (cdi, selic) => (cdi / 100) * 0.90, "isTaxable": false }
        ]
      },
      {
        "type": "html",
        "content": "<h2>Como funciona a LCI</h2><ul><li><strong>Emissor:</strong> Bancos (Itaú, Bradesco, etc.) e corretoras.</li><li><strong>Segurança:</strong> Garantido pelo FGC em até R$ 250 mil.</li><li><strong>Imposto de Renda:</strong> Isento para pessoa física.</li><li><strong>Liquidez:</strong> Geralmente no vencimento, com carência mínima de 90 dias.</li></ul><h2>Quando vale a pena investir em LCI?</h2><p>A LCI é ideal para objetivos de curto a médio prazo (de 3 meses a 3 anos). Não é indicada para a reserva de emergência por causa da carência. Para saber se uma LCI é melhor que um CDB, você precisa comparar as taxas equivalentes. Uma LCI a 90% do CDI, por exemplo, é mais rentável que um CDB a 110% do CDI para um prazo de 1 ano.</p><h2>Conclusão</h2><p>A LCI é uma excelente opção de investimento para quem não precisa de liquidez imediata. Sua isenção de IR a torna, na maioria das vezes, mais rentável que o CDB para o mesmo nível de risco.</p><p><a href='/cdb-ou-lci'>Veja a calculadora e o guia completo de CDB vs LCI.</a></p><p><em>Referência: CDI de {{cdiRate}}% a.a. (Bacen/SGS, {{dataAtualizacao}}).</em></p>",
        "disclaimer": "Este conteúdo é educativo e não constitui recomendação de investimento."
      }
    ],
    "faq": [
      { "question": "LCI é seguro?", "answer": "Sim. A LCI tem a mesma segurança do CDB e da poupança, com garantia do FGC de até R$ 250 mil por CPF por instituição." },
      { "question": "LCI tem Imposto de Renda?", "answer": "Não, a LCI é isenta de Imposto de Renda para pessoas físicas." },
      { "question": "Qual a desvantagem da LCI?", "answer": "A principal desvantagem é a carência mínima, que geralmente é de 90 dias. Por isso, não é indicada para reserva de emergência." },
      { "question": "LCI ou CDB, qual o melhor?", "answer": "Depende da taxa e do prazo. Uma LCI a 90% do CDI é geralmente melhor que um CDB a 110% do CDI para prazos de até 2 anos. Use uma calculadora de equivalência para comparar." }
    ],
    "internalLinks": [
      { "anchor": "CDB ou LCI: qual o melhor", "slug": "cdb-ou-lci" },
      { "anchor": "o que é CDB", "slug": "o-que-e-cdb" },
      { "anchor": "guia completo de renda fixa", "slug": "guia-renda-fixa" }
    ],
    "cta": {
      "primary": { "text": "Compare CDB e LCI", "url": "/cdb-ou-lci" },
      "secondary": { "text": "Veja o guia completo de renda fixa", "url": "/guia-renda-fixa" }
    }
  },
  {
    "title": "O que é LCA e como funciona? É melhor que LCI ou CDB?",
    "slug": "o-que-e-lca",
    "excerpt": "LCA (Letra de Crédito do Agronegócio) é um investimento de renda fixa isento de IR, similar à LCI. Entenda como funciona, a segurança e quando vale a pena.",
    "seoTitle": "O que é LCA: como funciona e comparativo com LCI e CDB",
    "seoDescription": "LCA é um investimento de renda fixa isento de IR, similar à LCI. Entenda como funciona a Letra de Crédito do Agronegócio, a segurança e quando vale a pena.",
    "category": "renda-fixa",
    "subcategory": "lci-lca",
    "pillar": "pillar-2-renda-fixa",
    "cluster": "lci-lca",
    "readingTime": "5 min",
    "lastUpdated": "2026-03-20",
    "author": "Equipe Bigwall",
    "content": [
      {
        "type": "html",
        "content": "<h1>O que é LCA e como funciona?</h1><div class='resumo-rapido'><ul><li>LCA é um título de renda fixa emitido por bancos para financiar o agronegócio</li><li>É isento de Imposto de Renda para pessoas físicas</li><li>Tem a mesma segurança de LCI, CDB e poupança (garantia do FGC)</li><li>Exige carência mínima (geralmente 90 dias)</li><li>Para o investidor, LCA e LCI são praticamente idênticas</li></ul></div><p>LCA (Letra de Crédito do Agronegócio) é um investimento de renda fixa muito similar à LCI. A principal diferença é o seu lastro: enquanto a LCI financia o setor imobiliário, a LCA financia o agronegócio. Para o investidor pessoa física, as regras são as mesmas.</p><h2>LCA vs LCI vs CDB: qual rende mais?</h2><p>Como a LCA e a LCI são isentas de IR, a comparação com o CDB deve sempre ser feita pelo rendimento líquido. Esta simulação mostra o rendimento de R$ 10.000 investidos por 12 meses.</p>"
      },
      {
        "type": "simulationTable",
        "initialInvestment": 10000,
        "terms": [12],
        "showDifference": false,
        "scenarios": [
          { "label": "CDB 100% CDI líquido", "rate": (cdi, selic) => cdi / 100, "isTaxable": true },
          { "label": "LCA/LCI 90% CDI", "rate": (cdi, selic) => (cdi / 100) * 0.90, "isTaxable": false }
        ]
      },
      {
        "type": "html",
        "content": "<h2>Como funciona a LCA</h2><ul><li><strong>Emissor:</strong> Bancos e corretoras.</li><li><strong>Segurança:</strong> Garantido pelo FGC em até R$ 250 mil.</li><li><strong>Imposto de Renda:</strong> Isento para pessoa física.</li><li><strong>Liquidez:</strong> Geralmente no vencimento, com carência mínima de 90 dias.</li></ul><h2>Quando vale a pena investir em LCA?</h2><p>A LCA é ideal para objetivos de curto a médio prazo (de 3 meses a 3 anos). Não é indicada para a reserva de emergência por causa da carência. A escolha entre LCA e LCI se resume a qual oferece a melhor taxa no momento da aplicação, já que são produtos quase idênticos para o investidor.</p><h2>Conclusão</h2><p>A LCA é, junto com a LCI, uma das melhores opções de renda fixa para quem não precisa de liquidez imediata, graças à isenção de IR e à segurança do FGC.</p><p><a href='/cdb-ou-lci'>Veja a calculadora e o guia completo de CDB vs LCI/LCA.</a></p><p><em>Referência: CDI de {{cdiRate}}% a.a. (Bacen/SGS, {{dataAtualizacao}}).</em></p>",
        "disclaimer": "Este conteúdo é educativo e não constitui recomendação de investimento."
      }
    ],
    "faq": [
      { "question": "LCA é seguro?", "answer": "Sim. A LCA tem garantia do FGC de até R$ 250 mil, a mesma do CDB, LCI e poupança." },
      { "question": "Qual a diferença entre LCI e LCA?", "answer": "A LCI financia o setor imobiliário e a LCA o agronegócio. Para o investidor pessoa física, as regras de isenção de IR, FGC e carência são as mesmas." },
      { "question": "LCA tem Imposto de Renda?", "answer": "Não, a LCA é isenta de Imposto de Renda para pessoas físicas." },
      { "question": "Qual o prazo mínimo de uma LCA?", "answer": "A carência mínima mais comum para LCA é de 90 dias, mas pode variar." }
    ],
    "internalLinks": [
      { "anchor": "CDB ou LCI/LCA: qual o melhor", "slug": "cdb-ou-lci" },
      { "anchor": "o que é LCI", "slug": "o-que-e-lci" },
      { "anchor": "guia completo de renda fixa", "slug": "guia-renda-fixa" }
    ],
    "cta": {
      "primary": { "text": "Compare CDB e LCI/LCA", "url": "/cdb-ou-lci" }
    }
  },
  {
    "title": "Renda Fixa ou Renda Variável: onde investir em 2026?",
    "slug": "renda-fixa-ou-renda-variavel",
    "excerpt": "A eterna dúvida do investidor: renda fixa ou variável? Entenda a diferença, os riscos, os retornos e como combinar os dois para uma carteira equilibrada.",
    "seoTitle": "Renda Fixa ou Renda Variável: Onde Investir em 2026?",
    "seoDescription": "Renda fixa vs renda variável: qual o melhor para você? Entenda a diferença, os riscos, os retornos e como combinar os dois para uma carteira equilibrada.",
    "category": "investimentos",
    "subcategory": "conceitos",
    "pillar": "pillar-1-investimentos",
    "cluster": "conceitos-basicos",
    "readingTime": "10 min",
    "lastUpdated": "2026-03-20",
    "author": "Equipe Bigwall",
    "content": [
      {
        "type": "html",
        "content": "<h1>Renda Fixa ou Renda Variável: onde investir?</h1><div class='resumo-rapido'><ul><li><strong>Renda Fixa:</strong> Mais segura, retorno previsível. Ideal para iniciantes e reserva de emergência. Ex: Tesouro Direto, CDB.</li><li><strong>Renda Variável:</strong> Maior potencial de retorno, maior risco. Ideal para longo prazo. Ex: Ações, FIIs.</li><li>O ideal não é escolher um ou outro, mas combinar os dois na sua carteira.</li><li>Para iniciantes: comece pela renda fixa, depois aloque uma pequena parte em renda variável.</li></ul></div><p>A escolha entre renda fixa e variável é a decisão mais fundamental de um investidor. Entender a função de cada uma é o primeiro passo para construir uma carteira de investimentos sólida e alinhada aos seus objetivos.</p><h2>O que é Renda Fixa?</h2><p>Na renda fixa, você 'empresta' dinheiro para uma instituição (banco ou governo) e recebe juros por isso. A forma de cálculo desses juros é definida no momento da aplicação. É previsível e mais seguro.</p><h2>O que é Renda Variável?</h2><p>Na renda variável, você se torna sócio de um negócio (ações) ou de um empreendimento (FIIs). O retorno não é garantido e depende do desempenho do ativo. O potencial de ganho é maior, mas o risco também.</p><h2>Comparativo: Renda Fixa vs Renda Variável</h2><table><thead><tr><th>Critério</th><th>Renda Fixa</th><th>Renda Variável</th></tr></thead><tbody><tr><td>Segurança</td><td>Alta (FGC ou Tesouro Nacional)</td><td>Baixa (sem garantia)</td></tr><tr><td>Retorno</td><td>Previsível e menor</td><td>Imprevisível e maior potencial</td></tr><tr><td>Liquidez</td><td>Variável (de diária a anos)</td><td>Alta (D+2 para ações)</td></tr><tr><td>Ideal para</td><td>Reserva de emergência, metas de curto/médio prazo</td><td>Metas de longo prazo, crescimento de patrimônio</td></tr></tbody></table><h2>Como combinar os dois?</h2><p>A melhor estratégia é a diversificação. A alocação ideal depende do seu perfil de risco, mas uma regra geral para iniciantes é:</p><ul><li><strong>Comece pela Renda Fixa:</strong> Monte sua reserva de emergência (6 meses de custos) em Tesouro Selic ou CDB de liquidez diária.</li><li><strong>Adicione Renda Variável aos Poucos:</strong> Após a reserva, comece a alocar uma pequena parte (5% a 10%) da sua carteira em renda variável, preferencialmente via ETFs (fundos de índice), que já são diversificados.</li></ul><h2>Conclusão</h2><p>Não existe 'melhor' ou 'pior'. Renda fixa é a base segura da sua carteira, enquanto a renda variável é o motor do crescimento a longo prazo. Comece pela segurança da renda fixa e, conforme ganha conhecimento e confiança, adicione a renda variável de forma gradual e estratégica.</p><p><a href='/guia-renda-fixa'>Veja o guia completo de Renda Fixa.</a></p><p><a href='/como-comecar-a-investir'>Aprenda como começar a investir do zero.</a></p>",
        "disclaimer": defaultDisclaimer
      }
    ],
    "faq": [
      { "question": "O que é mais seguro, renda fixa ou variável?", "answer": "Renda fixa é muito mais segura. A maioria dos produtos tem garantia do FGC ou do Tesouro Nacional." },
      { "question": "Qual rende mais, renda fixa ou variável?", "answer": "A renda variável tem um potencial de rendimento muito maior a longo prazo, mas também um risco muito maior." },
      { "question": "Sou iniciante, onde devo investir?", "answer": "Comece pela renda fixa. Monte sua reserva de emergência em Tesouro Selic ou CDB de liquidez diária antes de pensar em renda variável." },
      { "question": "Como sei se meu perfil é para renda variável?", "answer": "Se você tem um horizonte de longo prazo (mais de 5 anos), já tem sua reserva de emergência e tolera ver seu patrimônio oscilar, pode começar a estudar a renda variável." }
    ],
    "internalLinks": [
      { "anchor": "como começar a investir do zero", "slug": "como-comecar-a-investir" },
      { "anchor": "reserva de emergência", "slug": "reserva-de-emergencia" },
      { "anchor": "guia completo de renda fixa", "slug": "guia-renda-fixa" }
    ],
    "cta": {
      "primary": { "text": "Veja como começar a investir", "url": "/como-comecar-a-investir" }
    }
  },
  {
    "title": "Como Começar a Investir do Zero em 2026: Guia Completo",
    "slug": "como-comecar-a-investir",
    "excerpt": "Aprenda a começar a investir em 5 passos simples: defina objetivos, monte sua reserva de emergência, abra conta em uma corretora, escolha os produtos e invista.",
    "seoTitle": "Como Começar a Investir do Zero em 2026: Guia Completo",
    "seoDescription": "Guia completo de como começar a investir do zero: defina objetivos, monte sua reserva de emergência, abra conta em uma corretora, escolha os produtos e invista.",
    "category": "investimentos",
    "subcategory": "para-iniciantes",
    "pillar": "pillar-1-investimentos",
    "cluster": "comecar-a-investir",
    "readingTime": "12 min",
    "lastUpdated": "2026-03-20",
    "author": "Equipe Bigwall",
    "content": [
      {
        "type": "html",
        "content": "<h1>Como começar a investir do zero: guia completo em 5 passos</h1><div class='resumo-rapido'><ul><li><strong>Passo 1:</strong> Defina seus objetivos (curto, médio, longo prazo)</li><li><strong>Passo 2:</strong> Monte sua reserva de emergência (6 meses de custos)</li><li><strong>Passo 3:</strong> Abra conta em uma corretora (gratuito e digital)</li><li><strong>Passo 4:</strong> Escolha os investimentos certos para cada objetivo</li><li><strong>Passo 5:</strong> Invista e acompanhe</li></ul></div><p>Começar a investir pode parecer complicado, mas seguindo um passo a passo, o processo se torna simples e seguro.</p><h2>Passo 1: Defina seus objetivos</h2><p>Por que você está investindo? A resposta para essa pergunta define todo o resto. Divida seus objetivos por prazo:</p><ul><li><strong>Curto prazo (até 1 ano):</strong> Viagem, compra de eletrônico. Exige segurança e liquidez.</li><li><strong>Médio prazo (1 a 5 anos):</strong> Compra de carro, entrada de imóvel. Exige segurança, mas pode abrir mão de um pouco de liquidez.</li><li><strong>Longo prazo (mais de 5 anos):</strong> Aposentadoria, independência financeira. Permite mais risco para buscar mais retorno.</li></ul><h2>Passo 2: Monte sua reserva de emergência</h2><p>Antes de qualquer investimento, você precisa de uma reserva de emergência. É um dinheiro para imprevistos (saúde, desemprego) que deve ficar em um lugar seguro e com resgate imediato.</p><ul><li><strong>Quanto guardar?</strong> De 3 a 6 meses do seu custo de vida mensal.</li><li><strong>Onde investir?</strong> Tesouro Selic ou CDB de liquidez diária com rendimento acima de 100% do CDI.</li></ul><h2>Passo 3: Abra conta em uma corretora</h2><p>Corretoras de valores são as plataformas que te dão acesso à maioria dos investimentos. A abertura é gratuita e 100% digital.</p><p><a href='/onde-investir'>Veja o guia de onde investir: banco ou corretora.</a></p><h2>Passo 4: Escolha os investimentos</h2><p>Com a reserva montada e a conta aberta, é hora de investir para os seus objetivos, começando pela renda fixa.</p><p><a href='/melhores-investimentos-para-iniciantes'>Veja os melhores investimentos para iniciantes.</a></p><h2>Passo 5: Invista e acompanhe</h2><p>Transfira o dinheiro para a corretora (via PIX ou TED) e faça a aplicação no produto escolhido. Acompanhe a evolução, mas evite tomar decisões precipitadas com base em notícias do dia a dia. Foco no longo prazo.</p><h2>Conclusão</h2><p>Começar a investir é um processo de organização. Defina seus objetivos, crie sua reserva, abra sua conta, escolha os produtos certos e comece. O mais importante é dar o primeiro passo.</p>",
        "disclaimer": defaultDisclaimer
      }
    ],
    "faq": [
      { "question": "Qual o primeiro passo para começar a investir?", "answer": "O primeiro passo é montar sua reserva de emergência, um valor de 3 a 6 meses do seu custo de vida em um investimento seguro e de liquidez diária, como o Tesouro Selic." },
      { "question": "Preciso de muito dinheiro para começar?", "answer": "Não. É possível começar a investir no Tesouro Direto com cerca de R$ 30, e em alguns CDBs a partir de R$ 1." },
      { "question": "É seguro investir em corretora?", "answer": "Sim, desde que a corretora seja regulamentada pela CVM e pelo Banco Central. Seus investimentos são registrados no seu CPF, não no CNPJ da corretora." },
      { "question": "Por onde eu começo a investir, renda fixa ou variável?", "answer": "Sempre comece pela renda fixa. É mais segura, mais simples de entender e ideal para seus primeiros investimentos e para a reserva de emergência." }
    ],
    "internalLinks": [
      { "anchor": "reserva de emergência", "slug": "reserva-de-emergencia" },
      { "anchor": "melhores investimentos para iniciantes", "slug": "melhores-investimentos-para-iniciantes" },
      { "anchor": "onde investir: banco ou corretora", "slug": "onde-investir" },
      { "anchor": "guia completo de renda fixa", "slug": "guia-renda-fixa" }
    ],
    "cta": {
      "primary": { "text": "Veja os melhores investimentos para iniciantes", "url": "/melhores-investimentos-para-iniciantes" }
    }
  },
  {
    "title": "Quanto Rende um FII por Mês? Entenda o Dividend Yield",
    "slug": "quanto-rende-fii-por-mes",
    "excerpt": "Veja quanto rende um FII por mês, como funciona o dividend yield (DY), como calcular e qual um bom valor de DY para Fundos Imobiliários.",
    "seoTitle": "Quanto Rende um FII por Mês? Entenda o Dividend Yield",
    "seoDescription": "Entenda quanto rende um FII por mês, como funciona o dividend yield (DY), como calcular e qual um bom valor de DY para Fundos Imobiliários (FIIs).",
    "category": "renda-variavel",
    "subcategory": "fiis",
    "pillar": "pillar-3-renda-variavel",
    "cluster": "fiis",
    "readingTime": "8 min",
    "lastUpdated": "2026-03-20",
    "author": "Equipe Bigwall",
    "content": [
      {
        "type": "html",
        "content": "<h1>Quanto rende um FII por mês? Entenda o Dividend Yield (DY)</h1><div class='resumo-rapido'><ul><li>O rendimento de um FII é medido pelo Dividend Yield (DY)</li><li>Um DY de 0,8% ao mês significa que um FII de R$ 100 paga R$ 0,80 de dividendo por cota</li><li>O rendimento varia todo mês e não é garantido</li><li>Dividendos de FIIs são isentos de Imposto de Renda para pessoa física</li><li>Um bom DY é aquele que é consistente e superior ao de alternativas mais seguras</li></ul></div><p>Uma das principais atrações dos Fundos Imobiliários (FIIs) é a possibilidade de receber uma renda mensal, isenta de Imposto de Renda. Mas como saber quanto um FII paga? A resposta está no Dividend Yield.</p><h2>O que é Dividend Yield (DY)?</h2><p>O Dividend Yield é um indicador que mede o rendimento de um ativo (ação ou FII) em relação ao seu preço. Ele é expresso em porcentagem e calculado da seguinte forma:</p><p><code>DY = (Total de dividendos pagos por cota nos últimos 12 meses / Preço atual da cota) * 100</code></p><h2>Exemplo prático de rendimento de FII</h2><p>Imagine o FII <strong>HGLG11</strong>:</p><ul><li><strong>Preço da cota:</strong> R$ 160,00</li><li><strong>Último dividendo mensal:</strong> R$ 1,10</li></ul><p>O rendimento mensal (DY do mês) seria:</p><p><code>DY mensal = (R$ 1,10 / R$ 160,00) * 100 = 0,6875%</code></p><p>Isso significa que, nesse mês, o HGLG11 rendeu aproximadamente 0,69% sobre o valor da cota.</p><h2>Como saber se um Dividend Yield é bom?</h2><p>Não existe um número mágico. Um bom DY deve ser:</p><ul><li><strong>Consistente:</strong> O fundo tem um histórico de pagar dividendos de forma regular?</li><li><strong>Sustentável:</strong> O dividendo vem do lucro da operação ou de vendas não recorrentes?</li><li><strong>Competitivo:</strong> É maior que o rendimento de investimentos mais seguros, como o Tesouro Selic?</li></ul><h2>Conclusão</h2><p>O rendimento de um FII varia todo mês. O Dividend Yield é a melhor forma de medir e comparar esse rendimento. Lembre-se que, por ser renda variável, o retorno passado não é garantia de retorno futuro.</p><p><a href='/o-que-sao-fiis'>Aprenda tudo sobre Fundos Imobiliários (FIIs).</a></p>",
        "disclaimer": defaultDisclaimer
      }
    ],
    "faq": [
      { "question": "Quanto rende um FII de R$ 100?", "answer": "Depende do Dividend Yield. Se o DY mensal for de 0,8%, ele renderá R$ 0,80 por cota naquele mês." },
      { "question": "Dividendo de FII é mensal?", "answer": "A grande maioria dos FIIs paga dividendos mensalmente, mas isso não é uma regra. A decisão é do gestor do fundo." },
      { "question": "Dividendo de FII paga Imposto de Renda?", "answer": "Não. Os rendimentos distribuídos por FIIs são isentos de Imposto de Renda para pessoas físicas." },
      { "question": "O que é um bom Dividend Yield para FIIs?", "answer": "Não há um número exato. Um bom DY deve ser consistente ao longo do tempo e superior ao rendimento de alternativas mais seguras, como o Tesouro Selic." }
    ],
    "internalLinks": [
      { "anchor": "o que são FIIs", "slug": "o-que-sao-fiis" },
      { "anchor": "guia de renda variável", "slug": "guia-renda-variavel" }
    ],
    "cta": {
      "primary": { "text": "Veja o guia completo de FIIs", "url": "/o-que-sao-fiis" }
    }
  },
  {
    "title": "O que é Tesouro Direto e como funciona? É seguro?",
    "slug": "o-que-e-tesouro-direto",
    "excerpt": "Tesouro Direto é o investimento mais seguro do Brasil. Entenda como funciona, os tipos de títulos (Selic, Prefixado, IPCA+), a liquidez e como investir.",
    "seoTitle": "O que é Tesouro Direto e Como Funciona? Guia Completo 2026",
    "seoDescription": "Tesouro Direto é o investimento mais seguro do Brasil. Entenda como funciona, os tipos de títulos (Selic, Prefixado, IPCA+), a liquidez e como investir.",
    "category": "renda-fixa",
    "subcategory": "tesouro-direto",
    "pillar": "pillar-2-renda-fixa",
    "cluster": "tesouro-direto",
    "readingTime": "10 min",
    "lastUpdated": "2026-03-20",
    "author": "Equipe Bigwall",
    "content": [
      {
        "type": "html",
        "content": "<h1>O que é Tesouro Direto e como funciona?</h1><div class='resumo-rapido'><ul><li>Tesouro Direto é um programa do Governo Federal para venda de títulos públicos a pessoas físicas</li><li>É o investimento mais seguro do país, garantido pelo Tesouro Nacional</li><li>Você pode começar a investir com cerca de R$ 30</li><li>Existem 3 tipos principais: Tesouro Selic, Tesouro Prefixado e Tesouro IPCA+</li><li>Ideal para reserva de emergência, metas de médio e longo prazo</li></ul></div><p>Tesouro Direto é a forma mais simples e segura de começar a investir. Ao comprar um título, você está emprestando dinheiro para o Governo Federal em troca de juros.</p><h2>Tipos de Títulos do Tesouro Direto</h2><h3>1. Tesouro Selic</h3><p>O mais simples e seguro. Rende a taxa Selic (hoje em {{selicRate}}% a.a.) e tem liquidez diária. É a melhor opção para a reserva de emergência.</p><h3>2. Tesouro Prefixado</h3><p>Você sabe exatamente quanto vai receber no vencimento. Ideal para metas de médio prazo, como a compra de um carro. Exemplo: taxa de 12% ao ano.</p><h3>3. Tesouro IPCA+</h3><p>Rende a inflação (IPCA) mais uma taxa prefixada. Protege seu poder de compra. Ideal para metas de longo prazo, como aposentadoria.</p><h2>Comparativo: Tesouro Selic vs Poupança</h2><p>Esta simulação mostra o rendimento líquido de R$ 10.000 investidos por 12 meses.</p>"
      },
      {
        "type": "simulationTable",
        "initialInvestment": 10000,
        "terms": [12],
        "showDifference": true,
        "scenarios": [
          { "label": "Poupança", "rate": (cdi, selic) => selic > 8.5 ? 0.0617 : selic * 0.70, "isTaxable": false },
          { "label": "Tesouro Selic líquido", "rate": (cdi, selic) => selic / 100, "isTaxable": true }
        ]
      },
      {
        "type": "html",
        "content": "<h2>Como investir no Tesouro Direto?</h2><ol><li>Abra conta em uma corretora habilitada (a maioria não cobra taxa).</li><li>Transfira o dinheiro para a corretora via PIX ou TED.</li><li>Na plataforma da corretora, acesse a área de 'Tesouro Direto'.</li><li>Escolha o título, o valor e confirme a aplicação.</li></ol><h2>Conclusão</h2><p>O Tesouro Direto é a porta de entrada para o mundo dos investimentos. É seguro, acessível e mais rentável que a poupança. Comece pelo Tesouro Selic para montar sua reserva de emergência.</p><p><a href='/tesouro-selic-ou-cdb'>Compare Tesouro Selic e CDB.</a></p><p><em>Referência: Selic {{selicRate}}% a.a. (Bacen/SGS, {{dataAtualizacao}}).</em></p>",
        "disclaimer": defaultDisclaimer
      }
    ],
    "faq": [
      { "question": "Tesouro Direto é seguro?", "answer": "Sim, é o investimento mais seguro do Brasil, 100% garantido pelo Tesouro Nacional." },
      { "question": "Qual o melhor título do Tesouro Direto para iniciantes?", "answer": "O Tesouro Selic. Ele tem a menor volatilidade, rende a taxa Selic e tem liquidez diária, sendo ideal para a reserva de emergência." },
      { "question": "Tesouro Direto paga Imposto de Renda?", "answer": "Sim, segue a mesma tabela regressiva do CDB, de 22,5% a 15% sobre os rendimentos." },
      { "question": "Posso resgatar o Tesouro Direto antes do vencimento?", "answer": "Sim. O Tesouro Selic tem liquidez diária (D+1). Já o Prefixado e o IPCA+ podem ter perdas se resgatados antes, pois sofrem marcação a mercado." }
    ],
    "internalLinks": [
      { "anchor": "reserva de emergência", "slug": "reserva-de-emergencia" },
      { "anchor": "Tesouro Selic ou CDB", "slug": "tesouro-selic-ou-cdb" },
      { "anchor": "guia de renda fixa", "slug": "guia-renda-fixa" }
    ],
    "cta": {
      "primary": { "text": "Veja como montar sua reserva de emergência", "url": "/reserva-de-emergencia" }
    }
  },
  {
    "title": "Quanto Rende R$ 10.000 no Tesouro Selic? Simulação 2026",
    "slug": "quanto-rende-10000-no-tesouro-selic",
    "excerpt": "Simulação de quanto rende R$ 10.000 no Tesouro Selic em 1, 6, 12 e 24 meses. Veja o rendimento líquido após IR e compare com a poupança e CDB.",
    "seoTitle": "Quanto Rende R$ 10.000 no Tesouro Selic? Simulação 2026",
    "seoDescription": "Simule quanto rende R$ 10.000 no Tesouro Selic em 1, 6, 12 e 24 meses. Veja o rendimento líquido após IR, comparação com poupança e CDB.",
    "category": "renda-fixa",
    "subcategory": "tesouro-direto",
    "pillar": "pillar-2-renda-fixa",
    "cluster": "tesouro-direto",
    "readingTime": "7 min",
    "lastUpdated": "2026-03-20",
    "author": "Equipe Bigwall",
    "content": [
      {
        "type": "html",
        "content": "<h1>Quanto rende R$ 10.000 no Tesouro Selic?</h1><div class='resumo-rapido'><ul><li>Com Selic a {{selicRate}}% ao ano, R$ 10.000 no Tesouro Selic rendem aproximadamente R$ 86 líquidos por mês</li><li>Em 12 meses, o rendimento líquido é de aproximadamente R$ 1.090</li><li>O Tesouro Selic rende quase o dobro da poupança ({{poupancaRate}}% a.a.)</li><li>É o investimento mais seguro do Brasil</li></ul></div><p>Esta simulação mostra o rendimento de R$ 10.000 no Tesouro Selic em diferentes prazos. Referência: Selic de {{selicRate}}% ao ano (Bacen/SGS, {{dataAtualizacao}}).</p>"
      },
      {
        "type": "simulationTable",
        "initialInvestment": 10000,
        "terms": [1, 3, 6, 12, 24, 36],
        "scenarios": [
          { "label": "Tesouro Selic líquido", "rate": (cdi, selic) => selic / 100, "isTaxable": true }
        ]
      },
      {
        "type": "html",
        "content": "<h2>Tesouro Selic vs Poupança: R$ 10.000 investidos</h2>"
      },
      {
        "type": "simulationTable",
        "initialInvestment": 10000,
        "terms": [6, 12, 24, 36],
        "showDifference": true,
        "scenarios": [
          { "label": "Poupança ({{poupancaRate}}% a.a.)", "rate": (cdi, selic) => selic > 8.5 ? 0.0617 : selic * 0.70, "isTaxable": false },
          { "label": "Tesouro Selic líquido", "rate": (cdi, selic) => selic / 100, "isTaxable": true }
        ]
      },
      {
        "type": "html",
        "content": "<h2>Tesouro Selic vs CDB: R$ 10.000 investidos</h2>"
      },
      {
        "type": "simulationTable",
        "initialInvestment": 10000,
        "terms": [12],
        "showDifference": true,
        "scenarios": [
          { "label": "Tesouro Selic líquido", "rate": (cdi, selic) => selic / 100, "isTaxable": true },
          { "label": "CDB 102% CDI líquido", "rate": (cdi, selic) => (cdi / 100) * 1.02, "isTaxable": true }
        ]
      },
      {
        "type": "html",
        "content": "<h2>Conclusão</h2><p>O Tesouro Selic é a opção mais segura para sua reserva de emergência e rende muito mais que a poupança. Um bom CDB de liquidez diária pode render um pouco mais, mas a diferença é pequena.</p><p><a href='/o-que-e-tesouro-direto'>Leia o guia completo sobre o Tesouro Direto.</a></p><p><em>Referência: Selic {{selicRate}}% a.a. (Bacen/SGS, {{dataAtualizacao}}).</em></p>",
        "disclaimer": defaultDisclaimer
      }
    ],
    "faq": [
      { "question": "Quanto rende R$ 10.000 no Tesouro Selic em 1 ano?", "answer": "Com a Selic a {{selicRate}}% ao ano, R$ 10.000 rendem aproximadamente R$ 1.090 líquidos em 12 meses, já descontado o IR." },
      { "question": "Tesouro Selic é seguro?", "answer": "Sim, é o investimento mais seguro do Brasil, 100% garantido pelo Tesouro Nacional." },
      { "question": "Tesouro Selic tem liquidez diária?", "answer": "Sim, você pode resgatar a qualquer momento e o dinheiro cai na sua conta em 1 dia útil (D+1)." },
      { "question": "Tesouro Selic ou CDB, qual o melhor?", "answer": "Ambos são excelentes. O Tesouro Selic é marginalmente mais seguro. Um CDB de liquidez diária a mais de 100% do CDI rende um pouco mais." }
    ],
    "internalLinks": [
      { "anchor": "guia do Tesouro Direto", "slug": "o-que-e-tesouro-direto" },
      { "anchor": "Tesouro Selic ou CDB", "slug": "tesouro-selic-ou-cdb" },
      { "anchor": "reserva de emergência", "slug": "reserva-de-emergencia" }
    ],
    "cta": {
      "primary": { "text": "Aprenda sobre o Tesouro Direto", "url": "/o-que-e-tesouro-direto" }
    }
  },
  {
    "title": "O que é CDB e como funciona? Guia para iniciantes",
    "slug": "o-que-e-cdb",
    "excerpt": "CDB (Certificado de Depósito Bancário) é um investimento de renda fixa seguro e mais rentável que a poupança. Entenda como funciona, os tipos e como investir.",
    "seoTitle": "O que é CDB e Como Funciona? Guia para Iniciantes 2026",
    "seoDescription": "Aprenda o que é CDB, como funciona, os tipos (prefixado, pós-fixado, híbrido), a segurança do FGC e como investir no melhor CDB para seus objetivos.",
    "category": "renda-fixa",
    "subcategory": "cdb",
    "pillar": "pillar-2-renda-fixa",
    "cluster": "cdb",
    "readingTime": "9 min",
    "lastUpdated": "2026-03-20",
    "author": "Equipe Bigwall",
    "content": [
      {
        "type": "html",
        "content": "<h1>O que é CDB e como funciona? Guia para iniciantes</h1><div class='resumo-rapido'><ul><li>CDB é um 'empréstimo' que você faz para um banco em troca de juros</li><li>É tão seguro quanto a poupança, com garantia do FGC até R$ 250 mil</li><li>Rende muito mais que a poupança, acompanhando a taxa CDI (próxima à Selic)</li><li>Ideal para reserva de emergência (liquidez diária) e metas de curto/médio prazo</li><li>Tem Imposto de Renda regressivo (22,5% a 15%) sobre o rendimento</li></ul></div><p>CDB significa Certificado de Depósito Bancário. Na prática, é um dos investimentos mais simples e populares do Brasil, sendo a porta de entrada para quem quer sair da poupança.</p><h2>Tipos de CDB</h2><ul><li><strong>Pós-fixado:</strong> O mais comum. Rende uma porcentagem do CDI (ex: 100% do CDI). Ideal para reserva de emergência.</li><li><strong>Prefixado:</strong> Você sabe exatamente a taxa que vai receber no vencimento (ex: 12% ao ano). Bom para metas com prazo definido.</li><li><strong>Híbrido (IPCA+):</strong> Rende a inflação (IPCA) mais uma taxa fixa. Protege seu poder de compra. Ótimo para longo prazo.</li></ul><h2>CDB vs Poupança: qual rende mais?</h2><p>Com a Selic em {{selicRate}}% ao ano, um CDB a 100% do CDI rende quase o dobro da poupança, mesmo após o Imposto de Renda. Veja a simulação com R$ 10.000 por 12 meses:</p>"
      },
      {
        "type": "simulationTable",
        "initialInvestment": 10000,
        "terms": [12],
        "showDifference": true,
        "scenarios": [
          { "label": "Poupança", "rate": (cdi, selic) => selic > 8.5 ? 0.0617 : selic * 0.70, "isTaxable": false },
          { "label": "CDB 100% CDI líquido", "rate": (cdi, selic) => cdi / 100, "isTaxable": true }
        ]
      },
      {
        "type": "html",
        "content": "<h2>Como investir em CDB?</h2><p>Você pode investir em CDBs pelo seu próprio banco ou, de preferência, por uma corretora de valores, que oferece opções de diversos bancos com taxas mais competitivas.</p><h2>Conclusão</h2><p>O CDB é um investimento seguro, simples e rentável, ideal para iniciantes. Um CDB com liquidez diária que pague pelo menos 100% do CDI é a melhor opção para sua reserva de emergência e para sair da poupança.</p><p><a href='/cdb-ou-poupanca'>Veja o comparativo completo: CDB ou Poupança.</a></p><p><em>Referência: Selic {{selicRate}}% a.a., CDI {{cdiRate}}% a.a. (Bacen/SGS, {{dataAtualizacao}}).</em></p>",
        "disclaimer": defaultDisclaimer
      }
    ],
    "faq": [
      { "question": "O que significa 100% do CDI?", "answer": "Significa que o CDB renderá exatamente a variação da taxa CDI no período. Com o CDI a {{cdiRate}}% ao ano, o rendimento bruto será de {{cdiRate}}% ao ano." },
      { "question": "CDB é seguro? Tem FGC?", "answer": "Sim, é muito seguro. O FGC (Fundo Garantidor de Créditos) garante até R$ 250.000 por CPF por instituição." },
      { "question": "Qual o melhor CDB para iniciantes?", "answer": "Um CDB pós-fixado com liquidez diária e que pague no mínimo 100% do CDI. É ideal para a reserva de emergência." },
      { "question": "CDB paga imposto?", "answer": "Sim, o Imposto de Renda é cobrado sobre o rendimento e a alíquota diminui com o tempo, de 22,5% (até 6 meses) para 15% (após 2 anos)." }
    ],
    "internalLinks": [
      { "anchor": "CDB ou Poupança", "slug": "cdb-ou-poupanca" },
      { "anchor": "Tesouro Selic ou CDB", "slug": "tesouro-selic-ou-cdb" },
      { "anchor": "guia completo de renda fixa", "slug": "guia-renda-fixa" }
    ],
    "cta": {
      "primary": { "text": "Compare CDB com a Poupança", "url": "/cdb-ou-poupanca" }
    }
  },
  {
    "title": "CDB ou LCI: qual o melhor? Guia com calculadora",
    "slug": "cdb-ou-lci",
    "excerpt": "CDB ou LCI/LCA? Entenda a diferença, o impacto do Imposto de Renda e use nossa calculadora de equivalência para saber qual investimento rende mais.",
    "seoTitle": "CDB ou LCI/LCA: Qual Rende Mais? Guia com Calculadora 2026",
    "seoDescription": "CDB ou LCI/LCA: qual o melhor? Entenda a diferença, o impacto do IR e use nossa calculadora de equivalência para saber qual rende mais em 2026.",
    "category": "renda-fixa",
    "subcategory": "comparativo",
    "pillar": "pillar-2-renda-fixa",
    "cluster": "lci-lca",
    "readingTime": "9 min",
    "lastUpdated": "2026-03-20",
    "author": "Equipe Bigwall",
    "content": [
      {
        "type": "html",
        "content": "<h1>CDB ou LCI: qual o melhor investimento?</h1><div class='resumo-rapido'><ul><li>A grande diferença: LCI/LCA são isentas de IR para pessoa física, CDB não.</li><li>Por isso, um CDB precisa render mais (taxa bruta maior) para superar uma LCI.</li><li>Exemplo: uma LCI de 90% do CDI equivale a um CDB de 116% do CDI em 1 ano.</li><li>Ambos têm a mesma segurança (garantia do FGC).</li><li>LCI/LCA geralmente têm carência, CDB pode ter liquidez diária.</li></ul></div><p>CDB e LCI/LCA são alguns dos melhores e mais seguros investimentos de renda fixa. A escolha entre eles depende da taxa oferecida e do prazo do seu investimento.</p><h2>Calculadora de Equivalência: CDB vs LCI/LCA</h2><p>Para um CDB ser mais vantajoso que uma LCI isenta, ele precisa ter uma taxa bruta maior para compensar o Imposto de Renda. A tabela abaixo mostra a taxa que um CDB precisa ter para igualar o rendimento de uma LCI.</p><table><thead><tr><th>Prazo</th><th>LCI 90% CDI equivale a CDB de...</th><th>LCI 95% CDI equivale a CDB de...</th></tr></thead><tbody><tr><td>Até 6 meses</td><td>116,1% do CDI</td><td>122,6% do CDI</td></tr><tr><td>De 6 a 12 meses</td><td>112,5% do CDI</td><td>118,8% do CDI</td></tr><tr><td>De 1 a 2 anos</td><td>109,1% do CDI</td><td>115,2% do CDI</td></tr><tr><td>Acima de 2 anos</td><td>105,9% do CDI</td><td>111,8% do CDI</td></tr></tbody></table><h2>Simulação: R$ 10.000 em 24 meses</h2>"
      },
      {
        "type": "simulationTable",
        "initialInvestment": 10000,
        "terms": [24],
        "showDifference": true,
        "scenarios": [
          { "label": "CDB 110% CDI líquido", "rate": (cdi, selic) => (cdi / 100) * 1.10, "isTaxable": true },
          { "label": "LCI 95% CDI", "rate": (cdi, selic) => (cdi / 100) * 0.95, "isTaxable": false }
        ]
      },
      {
        "type": "html",
        "content": "<h2>Segurança e Liquidez</h2><p><strong>Segurança:</strong> Ambos são igualmente seguros, com garantia do FGC de até R$ 250 mil.</p><p><strong>Liquidez:</strong> O CDB leva vantagem, pois existem muitas opções com liquidez diária. LCI e LCA geralmente têm uma carência mínima de 90 dias.</p><h2>Conclusão: qual escolher?</h2><ul><li><strong>Para reserva de emergência:</strong> CDB de liquidez diária (ou Tesouro Selic).</li><li><strong>Para metas de curto/médio prazo (acima de 90 dias):</strong> Compare a taxa oferecida. Use a tabela de equivalência. Se uma LCI de 90% do CDI estiver disponível, ela provavelmente será melhor que um CDB de 110% para o mesmo prazo.</li></ul><p><a href='/guia-renda-fixa'>Acesse o guia completo de Renda Fixa.</a></p>",
        "disclaimer": defaultDisclaimer
      }
    ],
    "faq": [
      { "question": "O que rende mais, CDB ou LCI?", "answer": "Depende da taxa e do prazo. Como LCI é isenta de IR, uma taxa de LCI aparentemente menor pode render mais no final. Use a tabela de equivalência para comparar." },
      { "question": "Qual é mais seguro, CDB ou LCI?", "answer": "Ambos têm a mesma segurança, garantidos pelo FGC em até R$ 250 mil por CPF por instituição." },
      { "question": "LCI tem carência?", "answer": "Sim, a maioria das LCIs tem uma carência mínima, geralmente de 90 dias. Por isso, não são ideais para reserva de emergência." },
      { "question": "Qual a alíquota de IR do CDB?", "answer": "O IR do CDB é regressivo: começa em 22,5% sobre o rendimento (até 6 meses) e cai para 15% (após 2 anos)." }
    ],
    "internalLinks": [
      { "anchor": "o que é LCI", "slug": "o-que-e-lci" },
      { "anchor": "o que é CDB", "slug": "o-que-e-cdb" },
      { "anchor": "guia completo de renda fixa", "slug": "guia-renda-fixa" }
    ],
    "cta": {
      "primary": { "text": "Veja nosso Guia de Renda Fixa", "url": "/guia-renda-fixa" }
    }
  },
  {
    "title": "Reserva de Emergência: quanto guardar e onde investir",
    "slug": "reserva-de-emergencia",
    "excerpt": "Aprenda a calcular, montar e onde investir sua reserva de emergência. Veja as melhores opções de investimento com segurança e liquidez diária.",
    "seoTitle": "Reserva de Emergência: Quanto Guardar e Onde Investir em 2026",
    "seoDescription": "Guia completo da reserva de emergência: aprenda a calcular, montar e onde investir seu dinheiro com segurança e liquidez diária (Tesouro Selic e CDB).",
    "category": "educacao-financeira",
    "subcategory": "planejamento",
    "pillar": "pillar-4-educacao-financeira",
    "cluster": "reserva-de-emergencia",
    "readingTime": "9 min",
    "lastUpdated": "2026-03-20",
    "author": "Equipe Bigwall",
    "content": [
      {
        "type": "html",
        "content": "<h1>Reserva de Emergência: o guia definitivo</h1><div class='resumo-rapido'><ul><li>É o primeiro passo de todo investidor</li><li>Serve para cobrir imprevistos sem precisar vender outros investimentos</li><li><strong>Quanto guardar:</strong> De 3 a 6 meses do seu custo de vida mensal</li><li><strong>Onde investir:</strong> Em produtos com alta segurança e liquidez diária</li><li>As melhores opções são Tesouro Selic e CDBs de liquidez diária</li></ul></div><p>A reserva de emergência é o seu colchão de segurança financeira. É um dinheiro guardado especificamente para cobrir gastos inesperados, como um problema de saúde, a perda do emprego ou um conserto urgente no carro.</p><h2>Passo 1: Quanto guardar na reserva de emergência?</h2><p>A regra geral é ter o suficiente para cobrir de 3 a 6 meses do seu custo de vida mensal.</p><ul><li><strong>Funcionários CLT ou servidores públicos (mais estabilidade):</strong> 3 meses.</li><li><strong>Autônomos e freelancers (renda variável):</strong> 6 meses.</li></ul><p>Exemplo: se seu custo de vida é R$ 4.000 por mês, sua reserva deve ser entre R$ 12.000 e R$ 24.000.</p><h2>Passo 2: Onde investir a reserva de emergência?</h2><p>A reserva deve ficar em um investimento com duas características principais: <strong>segurança máxima</strong> e <strong>liquidez diária</strong> (poder resgatar a qualquer momento). Rentabilidade é secundário.</p><h3>As melhores opções</h3><table><thead><tr><th>Opção</th><th>Segurança</th><th>Liquidez</th><th>Rendimento</th></tr></thead><tbody><tr><td>Tesouro Selic</td><td>Máxima (Governo Federal)</td><td>D+1 (1 dia útil)</td><td>Taxa Selic</td></tr><tr><td>CDB 100% CDI</td><td>Alta (FGC)</td><td>D+0 (imediata)</td><td>~ Taxa Selic</td></tr><tr><td>Conta remunerada</td><td>Alta (FGC)</td><td>D+0 (imediata)</td><td>~ Taxa Selic</td></tr></tbody></table><h3>O que evitar</h3><p><strong>Poupança:</strong> Rende muito menos e só no aniversário. <a href='/cdb-ou-poupanca'>Veja por que o CDB é melhor.</a></p><p><strong>Ações, FIIs, Cripto:</strong> São voláteis. Você pode precisar resgatar em um momento de queda e perder dinheiro.</p><p><strong>CDB/LCI com carência:</strong> Você não pode resgatar antes do prazo.</p><h2>Conclusão</h2><p>Montar a reserva de emergência é o passo zero para a tranquilidade financeira e para começar a investir com segurança. Escolha entre Tesouro Selic ou um CDB/Conta com rendimento de 100% do CDI e liquidez diária. A disciplina de poupar todo mês é mais importante do que a pequena diferença de rendimento entre eles.</p><p><a href='/tesouro-selic-ou-cdb'>Compare Tesouro Selic e CDB.</a></p>",
        "disclaimer": defaultDisclaimer
      }
    ],
    "faq": [
      { "question": "Quanto devo ter na reserva de emergência?", "answer": "Entre 3 e 6 meses do seu custo de vida mensal. Se você tem mais estabilidade (CLT, servidor), 3 meses. Se for autônomo, 6 meses." },
      { "question": "Onde deixar o dinheiro da reserva de emergência?", "answer": "Em investimentos com máxima segurança e liquidez diária. As melhores opções são Tesouro Selic e CDBs de liquidez diária que rendam pelo menos 100% do CDI." },
      { "question": "Posso deixar a reserva de emergência na poupança?", "answer": "Não é recomendado. A poupança rende muito menos que o Tesouro Selic ou um CDB, e você perde o rendimento do mês se resgatar antes do 'aniversário'." },
      { "question": "A reserva de emergência é meu primeiro investimento?", "answer": "Sim. Antes de pensar em investir para outros objetivos, é fundamental ter sua reserva de emergência completa." }
    ],
    "internalLinks": [
      { "anchor": "Tesouro Selic ou CDB", "slug": "tesouro-selic-ou-cdb" },
      { "anchor": "CDB ou Poupança", "slug": "cdb-ou-poupanca" },
      { "anchor": "como começar a investir", "slug": "como-comecar-a-investir" }
    ],
    "cta": {
      "primary": { "text": "Compare Tesouro Selic e CDB", "url": "/tesouro-selic-ou-cdb" }
    }
  },
  {
    "title": "O que é ETF e como funciona? Vale a pena investir?",
    "slug": "o-que-e-etf",
    "excerpt": "ETFs (Exchange Traded Funds) são fundos de índice negociados na bolsa. Entenda como funcionam, as vantagens (diversificação, baixo custo) e os principais exemplos.",
    "seoTitle": "O que é ETF e Como Funciona? Vale a Pena Investir em 2026?",
    "seoDescription": "Aprenda o que é ETF (Exchange Traded Fund), como funciona, as vantagens (diversificação, baixo custo) e veja os principais exemplos como o BOVA11 e IVVB11.",
    "category": "renda-variavel",
    "subcategory": "etfs",
    "pillar": "pillar-3-renda-variavel",
    "cluster": "etfs",
    "readingTime": "9 min",
    "lastUpdated": "2026-03-20",
    "author": "Equipe Bigwall",
    "content": [
      {
        "type": "html",
        "content": "<h1>O que é ETF e como funciona?</h1><div class='resumo-rapido'><ul><li>ETF (Exchange Traded Fund) é um fundo que replica um índice de referência, como o Ibovespa</li><li>É negociado na bolsa de valores como uma ação</li><li>Permite investir em dezenas de empresas com uma única cota</li><li>É uma forma simples, barata e diversificada de investir em renda variável</li><li>Exemplos: BOVA11 (segue o Ibovespa), IVVB11 (segue o S&P 500)</li></ul></div><p>ETF, ou Fundo de Índice, é uma das formas mais inteligentes de começar a investir em renda variável. Em vez de escolher ações individuais, você compra uma cota de um ETF e se expõe a uma carteira completa de ativos.</p><h2>Como funciona um ETF?</h2><p>Imagine que você quer investir nas maiores empresas da bolsa brasileira. Em vez de comprar ações de Petrobras, Vale, Itaú, Bradesco, etc., uma a uma, você pode simplesmente comprar uma cota do ETF <strong>BOVA11</strong>. O BOVA11 replica o índice Ibovespa, então seu rendimento será praticamente o mesmo do principal índice da nossa bolsa.</p><h2>Vantagens dos ETFs</h2><ul><li><strong>Diversificação instantânea:</strong> Com uma única cota, você investe em todas as empresas do índice.</li><li><strong>Baixo custo:</strong> As taxas de administração são muito menores que as de fundos de ações tradicionais.</li><li><strong>Simplicidade:</strong> Você não precisa analisar empresas individualmente.</li><li><strong>Transparência:</strong> A composição do fundo é pública e segue as regras do índice.</li></ul><h2>Principais ETFs da bolsa brasileira</h2><table><thead><tr><th>Ticker</th><th>Índice que replica</th><th>Onde investe</th></tr></thead><tbody><tr><td>BOVA11</td><td>Ibovespa</td><td>~90 maiores empresas do Brasil</td></tr><tr><td>SMAL11</td><td>SMLL (Small Caps)</td><td>Empresas de menor porte com potencial de crescimento</td></tr><tr><td>IVVB11</td><td>S&P 500</td><td>500 maiores empresas dos EUA</td></tr><tr><td>XINA11</td><td>MSCI China</td><td>Maiores empresas da China</td></tr><tr><td>GOLD11</td><td>Ouro</td><td>Investe em ouro físico</td></tr></tbody></table><h2>ETFs pagam dividendos?</h2><p>No Brasil, os ETFs não distribuem os dividendos pagos pelas empresas. Em vez disso, eles são reinvestidos automaticamente no próprio fundo, valorizando o preço da cota. Isso simplifica a vida do investidor, que não precisa se preocupar em reinvestir os proventos.</p><h2>Conclusão</h2><p>ETFs são a melhor porta de entrada para a renda variável. Para iniciantes, começar com BOVA11 (para Brasil) e IVVB11 (para exterior) é uma forma simples, barata e diversificada de construir patrimônio a longo prazo.</p>",
        "disclaimer": defaultDisclaimer
      }
    ],
    "faq": [
      { "question": "O que é ETF?", "answer": "ETF (Exchange Traded Fund) é um fundo negociado na bolsa que replica um índice de referência. Comprando uma cota de BOVA11, por exemplo, você investe nas maiores empresas da bolsa brasileira de uma só vez." },
      { "question": "ETF paga dividendo?", "answer": "No Brasil, não. Os dividendos são reinvestidos automaticamente no próprio fundo, o que valoriza a cota. Isso simplifica o processo para o investidor." },
      { "question": "Qual a vantagem de investir em ETF?", "answer": "As principais vantagens são a diversificação instantânea (uma cota, dezenas de ativos), o baixo custo (taxas menores que fundos tradicionais) e a simplicidade." },
      { "question": "ETF é um bom investimento para iniciantes?", "answer": "Sim, é uma das melhores formas de começar na renda variável. ETFs como o BOVA11 (Brasil) e IVVB11 (EUA) são excelentes pontos de partida." }
    ],
    "internalLinks": [
      { "anchor": "renda fixa ou variável", "slug": "renda-fixa-ou-renda-variavel" },
      { "anchor": "o que são ações", "slug": "o-que-e-acao" }
    ],
    "cta": {
      "primary": { "text": "Entenda a diferença entre Renda Fixa e Variável", "url": "/renda-fixa-ou-renda-variavel" }
    }
  },
  {
    "title": "Quanto Investir para Ganhar R$ 1.000 por Mês?",
    "slug": "quanto-investir-para-ganhar-1000-por-mes",
    "excerpt": "Veja quanto você precisa investir em Tesouro Selic, CDBs, FIIs e ações para gerar uma renda passiva de R$ 1.000 por mês. Simulações e estratégias.",
    "seoTitle": "Quanto Investir para Ganhar R$ 1.000 por Mês? (Guia 2026)",
    "seoDescription": "Descubra quanto precisa investir em Tesouro Selic, CDB, FIIs e ações para ter uma renda passiva mensal de R$ 1.000. Simulações e estratégias para iniciantes.",
    "category": "educacao-financeira",
    "subcategory": "planejamento",
    "pillar": "pillar-4-educacao-financeira",
    "cluster": "renda-passiva",
    "readingTime": "10 min",
    "lastUpdated": "2026-03-20",
    "author": "Equipe Bigwall",
    "content": [
      {
        "type": "html",
        "content": "<h1>Quanto preciso investir para ter uma renda de R$ 1.000 por mês?</h1><div class='resumo-rapido'><ul><li><strong>Cálculo rápido:</strong> Divida a renda mensal desejada pelo rendimento mensal do seu investimento.</li><li><strong>Tesouro Selic ({{selicRate}}% a.a.):</strong> Aproximadamente R$ 140.000.</li><li><strong>CDB 100% CDI ({{cdiRate}}% a.a.):</strong> Aproximadamente R$ 138.000.</li><li><strong>FIIs (DY de 0,8% a.m.):</strong> Aproximadamente R$ 125.000.</li><li>A chave é a paciência e a consistência dos aportes.</li></ul></div><p>Gerar renda passiva é o grande objetivo de muitos investidores. Atingir os primeiros R$ 1.000 por mês é um marco importante nessa jornada. O valor necessário para isso depende do rendimento dos seus investimentos.</p><h2>A Fórmula Mágica da Renda Passiva</h2><p>A conta é simples: <code>Valor Necessário = Renda Mensal Desejada / Rendimento Mensal do Investimento</code>. O desafio é que o rendimento varia. Vamos simular com as taxas atuais ({{dataAtualizacao}}).</p><h2>Quanto investir em cada produto para ganhar R$ 1.000/mês</h2><table><thead><tr><th>Produto</th><th>Rendimento Bruto (a.a.)</th><th>Rendimento Líquido (a.m.)</th><th>Valor Necessário</th></tr></thead><tbody><tr><td>Tesouro Selic</td><td>{{selicRate}}%</td><td>~0,71%</td><td>~ R$ 140.000</td></tr><tr><td>CDB 100% CDI</td><td>{{cdiRate}}%</td><td>~0,72%</td><td>~ R$ 138.000</td></tr><tr><td>FIIs (foco em renda)</td><td>~10% (DY)</td><td>~0,83% (isento de IR)</td><td>~ R$ 120.000</td></tr><tr><td>Ações (foco em dividendos)</td><td>~6% (DY)</td><td>~0,50% (isento de IR)</td><td>~ R$ 200.000</td></tr></tbody></table><p><em>*Rendimento líquido mensal considera IR de 15% para RF e isenção para FIIs/Ações. O rendimento de FIIs e ações é uma estimativa e não é garantido.</em></p><h2>Como chegar lá com aportes mensais</h2><p>O segredo não é ter todo o dinheiro agora, mas sim a disciplina de investir um pouco todo mês. Esta simulação mostra quanto tempo levaria para atingir um patrimônio de R$ 140.000 (para render R$ 1.000/mês no Tesouro Selic) com diferentes aportes mensais, a uma taxa de {{selicRate}}% ao ano.</p><table><thead><tr><th>Aporte Mensal</th><th>Tempo para atingir R$ 140.000</th></tr></thead><tbody><tr><td>R$ 500</td><td>~ 12 anos</td></tr><tr><td>R$ 1.000</td><td>~ 8 anos</td></tr><tr><td>R$ 1.500</td><td>~ 6 anos</td></tr><tr><td>R$ 2.000</td><td>~ 5 anos</td></tr></tbody></table><h2>Conclusão</h2><p>Atingir uma renda passiva de R$ 1.000 por mês é totalmente possível com disciplina. Comece com o que você tem, invista em produtos seguros e adequados ao seu perfil e, o mais importante, seja consistente com seus aportes.</p>",
        "disclaimer": defaultDisclaimer
      }
    ],
    "faq": [
      { "question": "Quanto preciso investir para ganhar R$ 1.000 por mês?", "answer": "Depende do rendimento. Em um investimento seguro como o Tesouro Selic (rendendo ~0,7% a.m. líquido), você precisaria de aproximadamente R$ 140.000. Em FIIs com DY de 0,8% a.m., precisaria de R$ 125.000." },
      { "question": "Qual o melhor investimento para renda mensal?", "answer": "Fundos Imobiliários (FIIs) são os mais populares para gerar renda mensal, pois distribuem a maior parte de seus lucros aos cotistas e são isentos de IR." },
      { "question": "É possível viver de renda?", "answer": "Sim, mas exige disciplina, paciência e um planejamento de longo prazo para acumular o patrimônio necessário para cobrir seus custos de vida." },
      { "question": "Como começar a buscar renda passiva?", "answer": "Comece investindo em ativos que geram renda, como Tesouro IPCA+ com juros semestrais, FIIs e ações de empresas boas pagadoras de dividendos." }
    ],
    "internalLinks": [
      { "anchor": "o que são FIIs", "slug": "o-que-sao-fiis" },
      { "anchor": "guia de renda fixa", "slug": "guia-renda-fixa" }
    ],
    "cta": {
      "primary": { "text": "Aprenda sobre Fundos Imobiliários (FIIs)", "url": "/o-que-sao-fiis" }
    }
  },
   {
    "title": "Quanto Rende R$ 1.000 no CDB? Simulação 2026",
    "slug": "quanto-rende-1000-no-cdb",
    "excerpt": "Veja quanto rende R$ 1.000 no CDB em 1, 6, 12 e 24 meses. Simulação com rendimento líquido após IR, comparação com poupança e Tesouro Selic.",
    "seoTitle": "Quanto Rende R$ 1.000 no CDB? Simulação 2026",
    "seoDescription": "Simule quanto rende R$ 1.000 no CDB em 1, 6, 12 e 24 meses. Veja o rendimento líquido após IR, comparação com poupança e Tesouro Selic atualizado.",
    "category": "renda-fixa",
    "subcategory": "cdb",
    "pillar": "pillar-2-renda-fixa",
    "cluster": "cdb",
    "readingTime": "7 min",
    "lastUpdated": "2026-03-20",
    "author": "Equipe Bigwall",
    "content": [
      {
        "type": "html",
        "content": "<h1>Quanto rende R$ 1.000 no CDB? Simulação com rendimento líquido</h1><div class='resumo-rapido'><ul><li>Com CDI a {{cdiRate}}% ao ano, R$ 1.000 no CDB a 100% do CDI rendem aproximadamente R$ 8 líquidos por mês</li><li>Em 12 meses, o rendimento líquido é de aproximadamente R$ 109</li><li>O CDB rende quase o dobro da poupança ({{poupancaRate}}% a.a.)</li><li>Sempre compare rendimento líquido — não taxa bruta</li></ul></div><p>Esta simulação mostra o rendimento de R$ 1.000 no CDB em diferentes prazos e taxas. Referência: CDI de {{cdiRate}}% ao ano (Bacen/SGS, {{dataAtualizacao}}).</p>"
      },
      {
        "type": "simulationTable",
        "initialInvestment": 1000,
        "terms": [1, 3, 6, 12, 24, 36],
        "scenarios": [
          { "label": "CDB 100% CDI líquido", "rate": "(cdi, selic) => cdi / 100", "isTaxable": true }
        ]
      },
      {
        "type": "html",
        "content": "<h2>Quanto rende em diferentes taxas de CDB</h2>"
      },
      {
        "type": "simulationTable",
        "initialInvestment": 1000,
        "terms": [6, 12, 24, 36],
        "scenarios": [
          { "label": "CDB 90% CDI líquido", "rate": "(cdi, selic) => (cdi / 100) * 0.90", "isTaxable": true },
          { "label": "CDB 100% CDI líquido", "rate": "(cdi, selic) => cdi / 100", "isTaxable": true },
          { "label": "CDB 110% CDI líquido", "rate": "(cdi, selic) => (cdi / 100) * 1.10", "isTaxable": true },
          { "label": "CDB 120% CDI líquido", "rate": "(cdi, selic) => (cdi / 100) * 1.20", "isTaxable": true }
        ]
      },
      {
        "type": "html",
        "content": "<h2>CDB vs Poupança: R$ 1.000 investidos</h2>"
      },
      {
        "type": "simulationTable",
        "initialInvestment": 1000,
        "terms": [6, 12, 24, 36],
        "showDifference": true,
        "scenarios": [
          { "label": "Poupança ({{poupancaRate}}% a.a.)", "rate": "(cdi, selic) => selic > 8.5 ? 0.0617 : selic * 0.70", "isTaxable": false },
          { "label": "CDB 100% CDI líquido", "rate": "(cdi, selic) => cdi / 100", "isTaxable": true }
        ]
      },
      {
        "type": "html",
        "content": "<h2>Conclusão</h2><p>R$ 1.000 no CDB rende quase o dobro da poupança em qualquer prazo com a Selic a {{selicRate}}% ao ano — mesmo após o IR.</p><p>Quer entender melhor? <a href='/o-que-e-cdb'>Leia o guia completo sobre o CDB.</a></p><p><em>Referência: CDI de {{cdiRate}}% a.a. (Bacen/SGS, {{dataAtualizacao}}).</em></p>",
        "disclaimer": "Este conteúdo é educativo e não constitui recomendação de investimento."
      }
    ],
    "faq": [
      { "question": "Quanto rende R$ 1.000 no CDB em 12 meses?", "answer": "Com CDI a {{cdiRate}}% ao ano, R$ 1.000 no CDB a 100% do CDI rendem aproximadamente R$ 109 líquidos em 12 meses após IR de 20%." },
      { "question": "R$ 1.000 no CDB rende mais que na poupança?", "answer": "Sim. Em 12 meses, o CDB rende quase o dobro da poupança ({{poupancaRate}}% a.a.) — mesmo após o IR." },
      { "question": "Qual o mínimo para investir em CDB?", "answer": "A partir de R$ 1 em corretoras digitais. Em bancos tradicionais pode ser R$ 1.000 ou mais." },
      { "question": "CDB tem FGC?", "answer": "Sim. O FGC garante até R$ 250.000 por CPF por instituição financeira." },
      { "question": "Quanto rende CDB a 110% do CDI em 12 meses?", "answer": "Com CDI a {{cdiRate}}% ao ano e IR de 20%, um CDB a 110% do CDI rende aproximadamente R$ 120 líquidos em 12 meses para R$ 1.000 investidos." }
    ],
    "internalLinks": [
      { "anchor": "leia o guia completo sobre o CDB", "slug": "o-que-e-cdb" },
      { "anchor": "compare CDB com a poupança", "slug": "cdb-ou-poupanca" },
      { "anchor": "compare CDB e Tesouro Selic", "slug": "tesouro-selic-ou-cdb" },
      { "anchor": "guia completo de renda fixa", "slug": "guia-renda-fixa" }
    ],
    "cta": {
      "primary": { "text": "Entenda o que é CDB", "url": "/o-que-e-cdb" },
      "secondary": { "text": "Compare CDB com a poupança", "url": "/cdb-ou-poupanca" }
    }
  },
  {
    "title": "Guia Completo de Renda Fixa 2026: tudo que você precisa saber",
    "slug": "guia-renda-fixa",
    "excerpt": "Tudo sobre renda fixa em um só lugar: CDB, LCI, LCA, Tesouro Direto, IR, FGC, liquidez e como escolher o melhor investimento para o seu objetivo.",
    "seoTitle": "Guia Completo de Renda Fixa 2026: tudo que você precisa saber",
    "seoDescription": "Tudo sobre renda fixa: CDB, LCI, LCA, Tesouro Direto, IR, FGC, liquidez e como escolher o melhor investimento para o seu objetivo.",
    "category": "renda-fixa",
    "subcategory": "guia",
    "pillar": "pillar-2-renda-fixa",
    "cluster": "guia-renda-fixa",
    "readingTime": "15 min",
    "lastUpdated": "2026-03-20",
    "author": "Equipe Bigwall",
    "content": [
      {
        "type": "html",
        "content": "<h1>Guia completo de renda fixa: tudo que você precisa saber para investir com segurança</h1><div class='resumo-rapido'><ul><li>Renda fixa é qualquer investimento com retorno previsível ou regra de remuneração definida</li><li>Os principais produtos são: Tesouro Direto, CDB, LCI e LCA</li><li>Todos têm IR regressivo (22,5% a 15%) — exceto LCI e LCA, isentos para PF</li><li>A maioria tem FGC ou garantia do Governo Federal</li><li>Compare sempre pelo rendimento líquido — não pela taxa bruta</li></ul></div><p>Renda fixa é a base de qualquer carteira bem estruturada. Com a Selic a {{selicRate}}% ao ano (Bacen/SGS, {{dataAtualizacao}}), os produtos de renda fixa brasileiros oferecem um dos melhores retornos reais do mundo com risco controlado.</p><h2>O que é renda fixa</h2><p>Renda fixa é qualquer investimento em que as condições de remuneração são definidas no momento da aplicação — ou seguem uma regra conhecida, como a variação da Selic ({{selicRate}}% a.a.), do CDI ({{cdiRate}}% a.a.) ou do IPCA ({{ipcaRate}}% a.a.).</p><h2>Principais produtos de renda fixa</h2><h3>Tesouro Direto</h3><p>Programa do Governo Federal para venda de títulos públicos. Menor risco do Brasil — garantido pelo Governo Federal. Valor mínimo: ~R$ 30. <a href='/o-que-e-tesouro-direto'>Veja o guia completo do Tesouro Direto.</a></p><h3>CDB</h3><p>Título emitido por bancos. FGC até R$ 250k. IR regressivo. Pode ter liquidez diária. <a href='/o-que-e-cdb'>Veja o guia completo do CDB.</a></p><h3>LCI</h3><p>Isenta de IR para PF. FGC até R$ 250k. Carência mínima 90 dias. <a href='/o-que-e-lci'>Veja o guia completo da LCI.</a></p><h3>LCA</h3><p>Igual à LCI, lastreada no agronegócio. Isenta de IR para PF. FGC até R$ 250k.</p><h2>IR na renda fixa</h2><table><thead><tr><th>Prazo</th><th>Alíquota IR</th></tr></thead><tbody><tr><td>Até 180 dias</td><td>22,5%</td></tr><tr><td>181 a 360 dias</td><td>20%</td></tr><tr><td>361 a 720 dias</td><td>17,5%</td></tr><tr><td>Acima de 720 dias</td><td>15%</td></tr></tbody></table><p>Exceções isentas para PF: LCI e LCA. Fonte: Receita Federal do Brasil.</p><h2>Comparativo geral de produtos</h2>"
      },
      {
        "type": "simulationTable",
        "initialInvestment": 10000,
        "terms": [12],
        "scenarios": [
          { "label": "Poupança", "rate": "(cdi, selic) => selic > 8.5 ? 0.0617 : selic * 0.70", "isTaxable": false },
          { "label": "Tesouro Selic", "rate": "(cdi, selic) => selic / 100", "isTaxable": true },
          { "label": "CDB 100% CDI", "rate": (cdi, selic) => cdi / 100, "isTaxable": true },
          { "label": "LCI 90% CDI", "rate": (cdi, selic) => (cdi / 100) * 0.90, "isTaxable": false },
          { "label": "LCI 95% CDI", "rate": (cdi, selic) => (cdi / 100) * 0.95, "isTaxable": false },
          { "label": "CDB 110% CDI", "rate": (cdi, selic) => (cdi / 100) * 1.10, "isTaxable": true }
        ]
      },
      {
        "type": "html",
        "content": "<p><em>Referência: Selic de {{selicRate}}% a.a. e CDI de {{cdiRate}}% a.a. (Bacen/SGS, {{dataAtualizacao}}). Sempre compare rendimento líquido.</em></p><h2>Por qual produto começar</h2><table><thead><tr><th>Objetivo</th><th>Produto recomendado</th></tr></thead><tbody><tr><td>Reserva de emergência</td><td>Tesouro Selic ou CDB liquidez diária</td></tr><tr><td>Curto prazo (até 1 ano)</td><td>CDB pós-fixado ou LCI</td></tr><tr><td>Médio prazo (1 a 3 anos)</td><td>LCI, LCA ou CDB com prazo</td></tr><tr><td>Proteção contra inflação</td><td>Tesouro IPCA+ ou CDB IPCA+</td></tr></tbody></table><h2>Conclusão</h2><p>Escolha o produto certo para o objetivo certo e compare sempre pelo rendimento líquido. Explore os guias: <a href='/o-que-e-cdb'>CDB</a>, <a href='/o-que-e-lci'>LCI</a>, <a href='/o-que-e-tesouro-direto'>Tesouro Direto</a> e <a href='/cdb-ou-lci'>CDB vs LCI.</a></p><p><em>Referência: Selic {{selicRate}}% a.a., CDI {{cdiRate}}% a.a., IPCA {{ipcaRate}}% a.a. (Bacen/SGS, {{dataAtualizacao}}).</em></p>",
        "disclaimer": "Este conteúdo é educativo e não constitui recomendação de investimento."
      }
    ],
    "faq": [
      { "question": "O que é renda fixa?", "answer": "Renda fixa é qualquer investimento com retorno previsível ou regra definida. Os principais produtos são Tesouro Direto, CDB, LCI e LCA." },
      { "question": "Renda fixa é segura?", "answer": "Sim. A maioria tem FGC até R$ 250.000 ou é garantida pelo Governo Federal." },
      { "question": "Qual o melhor investimento de renda fixa?", "answer": "Depende do objetivo. Reserva de emergência: Tesouro Selic ou CDB diário. Médio prazo: LCI/LCA. Longo prazo: Tesouro IPCA+." },
      { "question": "Renda fixa tem IR?", "answer": "A maioria sim, com alíquota regressiva de 22,5% a 15%. LCI e LCA são isentas para PF." },
      { "question": "O que é CDI?", "answer": "CDI é a taxa de referência da renda fixa brasileira. Atualmente em {{cdiRate}}% ao ano, próxima à Selic." }
    ],
    "internalLinks": [
      { "anchor": "guia completo do Tesouro Direto", "slug": "o-que-e-tesouro-direto" },
      { "anchor": "o que é CDB", "slug": "o-que-e-cdb" },
      { "anchor": "o que é LCI", "slug": "o-que-e-lci" },
      { "anchor": "CDB ou LCI: quando compensa", "slug": "cdb-ou-lci" },
      { "anchor": "reserva de emergência", "slug": "reserva-de-emergencia" },
      { "anchor": "como começar a investir", "slug": "como-comecar-a-investir" }
    ],
    "cta": {
      "primary": { "text": "Veja o que é CDB", "url": "/o-que-e-cdb" },
      "secondary": { "text": "Compare CDB e LCI", "url": "/cdb-ou-lci" }
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
    "content": [
      {
        "type": "html",
        "content": "<h1>Melhores investimentos para iniciantes: opções seguras, rentáveis e acessíveis</h1><div class='resumo-rapido'><ul><li>Para iniciantes, segurança e liquidez vêm antes de rentabilidade máxima</li><li>Os melhores pontos de partida são Tesouro Selic e CDB de liquidez diária</li><li>Poupança ({{poupancaRate}}% a.a.) não é recomendada — existem opções mais seguras com rendimento maior</li><li>Monte a reserva de emergência antes de qualquer investimento</li><li>Compare sempre pelo rendimento líquido — não taxa bruta</li></ul></div><p>Não existe o melhor investimento universal — existe o produto certo para o seu objetivo. Para iniciantes, o caminho é começar com produtos simples, seguros e com boa liquidez.</p><h2>O que um bom investimento para iniciantes precisa ter</h2><table><thead><tr><th>Critério</th><th>Por que importa</th></tr></thead><tbody><tr><td>Segurança</td><td>Risco de perda deve ser baixo</td></tr><tr><td>Liquidez</td><td>Poder resgatar sem penalidade</td></tr><tr><td>Simplicidade</td><td>Fácil de entender e acompanhar</td></tr><tr><td>Rendimento acima da poupança</td><td>Não faz sentido ter risco para render igual à poupança</td></tr><tr><td>Acessibilidade</td><td>Valor mínimo baixo para começar com o que tem</td></tr></tbody></table><h2>Comparativo dos melhores produtos para iniciantes</h2>"
      },
      {
        "type": "simulationTable",
        "initialInvestment": 10000,
        "terms": [12],
        "scenarios": [
          { "label": "Poupança", "rate": "(cdi, selic) => selic > 8.5 ? 0.0617 : selic * 0.70", "isTaxable": false },
          { "label": "Tesouro Selic", "rate": "(cdi, selic) => selic / 100", "isTaxable": true },
          { "label": "CDB liquidez diária (100% CDI)", "rate": (cdi, selic) => cdi / 100, "isTaxable": true },
          { "label": "LCI 90% CDI", "rate": (cdi, selic) => (cdi / 100) * 0.90, "isTaxable": false },
          { "label": "LCI 95% CDI", "rate": (cdi, selic) => (cdi / 100) * 0.95, "isTaxable": false },
          { "label": "CDB 110% CDI", "rate": (cdi, selic) => (cdi / 100) * 1.10, "isTaxable": true }
        ]
      },
      {
        "type": "html",
        "content": "<p><em>Referência: Selic de {{selicRate}}% a.a. e CDI de {{cdiRate}}% a.a. (Bacen/SGS, {{dataAtualizacao}}). Sempre compare rendimento líquido.</em></p><h2>Por que a poupança não é recomendada</h2><p>A poupança rende apenas {{poupancaRate}}% ao ano com a Selic atual de {{selicRate}}% — menos da metade do Tesouro Selic ou CDB de liquidez diária. Existem alternativas com a mesma segurança (FGC) e rendimento muito superior.</p><h2>Como escolher o melhor para o seu caso</h2><p><strong>Tem reserva de emergência?</strong> Não → comece pelo Tesouro Selic ou CDB de liquidez diária.<br><strong>Prazo menor que 1 ano?</strong> → Tesouro Selic ou CDB diário.<br><strong>Prazo de 1 a 3 anos?</strong> → LCI/LCA ou CDB com prazo.<br><strong>Longo prazo?</strong> → Tesouro IPCA+ ou mix renda fixa e variável.</p><h2>Conclusão</h2><p>Para a maioria dos iniciantes: Tesouro Selic ou CDB para reserva de emergência, LCI/LCA para médio prazo e Tesouro IPCA+ para longo prazo.</p><p><a href='/como-comecar-a-investir'>Veja o guia completo de como começar a investir.</a></p><p><em>Referência: Selic {{selicRate}}% a.a., CDI {{cdiRate}}% a.a. (Bacen/SGS, {{dataAtualizacao}}).</em></p>",
        "disclaimer": "Este conteúdo é educativo e não constitui recomendação de investimento."
      }
    ],
    "faq": [
      { "question": "Qual o melhor investimento para quem está começando?", "answer": "Tesouro Selic e CDB de liquidez diária são os melhores pontos de partida — seguros, acessíveis e com rendimento muito acima da poupança." },
      { "question": "Quanto preciso para começar a investir?", "answer": "O Tesouro Direto aceita a partir de R$ 30. Alguns CDBs aceitam R$ 1 em corretoras digitais." },
      { "question": "Poupança é boa para iniciantes?", "answer": "Não. Com a Selic a {{selicRate}}% ao ano, a poupança rende {{poupancaRate}}% ao ano — menos da metade do Tesouro Selic ou CDB." },
      { "question": "LCI é boa para iniciantes?", "answer": "Sim, para objetivos com prazo acima de 90 dias. Não é indicada para reserva de emergência pela carência mínima." },
      { "question": "Devo começar pela renda fixa ou variável?", "answer": "Renda fixa. Monte sua reserva de emergência, entenda os produtos e só então explore renda variável com uma parcela pequena." }
    ],
    "internalLinks": [
      { "anchor": "como começar a investir do zero", "slug": "como-comecar-a-investir" },
      { "anchor": "reserva de emergência", "slug": "reserva-de-emergencia" },
      { "anchor": "o que é Tesouro Direto", "slug": "o-que-e-tesouro-direto" },
      { "anchor": "o que é CDB", "slug": "o-que-e-cdb" },
      { "anchor": "o que é LCI", "slug": "o-que-e-lci" },
      { "anchor": "guia completo de renda fixa", "slug": "guia-renda-fixa" }
    ],
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
    "content": [
      {
        "type": "html",
        "content": "<h1>Onde posso investir? Guia completo das opções disponíveis no Brasil</h1><div class='resumo-rapido'><ul><li>Você pode investir pelo seu banco atual ou por uma corretora independente</li><li>Corretoras oferecem mais produtos, melhores taxas e mais ferramentas</li><li>Os principais produtos são: Tesouro Direto, CDB, LCI, LCA, ações, FIIs e ETFs</li><li>Abrir conta em corretora é gratuito e 100% digital</li><li>Sempre verifique se a corretora é regulamentada pela CVM antes de investir</li></ul></div><p>Hoje investir ficou mais acessível do que nunca. Existem diversas plataformas, a maioria gratuita e 100% digital. O desafio é entender as diferenças e escolher a que faz mais sentido para o seu perfil.</p><h2>Banco ou corretora: qual escolher?</h2><table><thead><tr><th>Critério</th><th>Banco</th><th>Corretora independente</th></tr></thead><tbody><tr><td>Variedade de produtos</td><td>Limitada — foco em produtos próprios</td><td>Alta — produtos de vários emissores</td></tr><tr><td>Taxas de CDB/LCI</td><td>Geralmente menores</td><td>Geralmente mais competitivas</td></tr><tr><td>Acesso a ações e FIIs</td><td>Limitado ou inexistente</td><td>Completo</td></tr><tr><td>Praticidade</td><td>Alta — já tem conta</td><td>Exige abertura de conta e PIX/TED</td></tr><tr><td>Custo de abertura</td><td>Gratuito</td><td>Gratuito na maioria</td></tr></tbody></table><h2>Onde investir por produto</h2><table><thead><tr><th>Produto</th><th>Onde acessar</th><th>Observação</th></tr></thead><tbody><tr><td>Tesouro Direto</td><td>Corretoras ou banco habilitado</td><td>Mesmo produto em qualquer plataforma</td></tr><tr><td>CDB</td><td>Banco emissor ou corretoras</td><td>Corretoras têm mais opções e taxas melhores</td></tr><tr><td>LCI e LCA</td><td>Banco emissor ou corretoras</td><td>Mesma lógica do CDB</td></tr><tr><td>Ações</td><td>Corretoras habilitadas na B3</td><td>Não disponível em bancos tradicionais</td></tr><tr><td>FIIs</td><td>Corretoras habilitadas na B3</td><td>Negociados na bolsa como ações</td></tr><tr><td>ETFs</td><td>Corretoras habilitadas na B3</td><td>Negociados na bolsa como ações</td></tr></tbody></table><h2>Como verificar se uma corretora é confiável</h2><ul><li>Está regulamentada pela CVM? Consulte em cvm.gov.br</li><li>Está regulamentada pelo Banco Central? Consulte em bcb.gov.br</li><li>Para Tesouro Direto: está listada em tesourodireto.com.br?</li><li>Tem boa reputação? Pesquise no Reclame Aqui</li></ul><h2>Onde investir por objetivo</h2><table><thead><tr><th>Objetivo</th><th>Produto</th><th>Onde acessar</th></tr></thead><tbody><tr><td>Reserva de emergência</td><td>Tesouro Selic ou CDB diário</td><td>Qualquer corretora ou banco digital</td></tr><tr><td>Objetivo de 1 a 3 anos</td><td>LCI, LCA ou CDB com prazo</td><td>Corretora com boa seleção</td></tr><tr><td>Proteção contra inflação</td><td>Tesouro IPCA+</td><td>Qualquer corretora habilitada</td></tr><tr><td>Renda passiva mensal</td><td>FIIs</td><td>Corretora habilitada na B3</td></tr><tr><td>Exposição à bolsa</td><td>ETFs de índice</td><td>Corretora habilitada na B3</td></tr></tbody></table><h2>Conclusão</h2><p>Para quem está começando: abra conta em uma corretora digital de boa reputação, comece pelo Tesouro Selic ou CDB de liquidez diária e explore os demais produtos conforme seu conhecimento cresce.</p><p><a href='/melhores-investimentos-para-iniciantes'>Veja os melhores investimentos para iniciantes.</a></p>",
        "disclaimer": "Este conteúdo é educativo e não constitui recomendação de investimento. Sempre verifique a regulamentação antes de investir."
      }
    ],
    "faq": [
      { "question": "Onde posso investir dinheiro no Brasil?", "answer": "Pelo seu banco atual ou em uma corretora independente. Corretoras oferecem mais produtos, melhores taxas e acesso a ações, FIIs e ETFs. A abertura é gratuita e 100% digital." },
      { "question": "É melhor investir pelo banco ou por corretora?", "answer": "Para renda fixa simples, o banco pode ser suficiente. Para mais opções e acesso a ações e FIIs, uma corretora independente é mais indicada." },
      { "question": "Como abrir conta em corretora?", "answer": "Acesse o site ou app, preencha o cadastro com CPF e documentos, faça o teste de perfil e aguarde aprovação — geralmente em minutos." },
      { "question": "Como saber se uma corretora é confiável?", "answer": "Verifique se está regulamentada pela CVM (cvm.gov.br) e pelo Banco Central (bcb.gov.br). Pesquise avaliações antes de abrir conta." },
      { "question": "Posso investir no Tesouro Direto pelo banco?", "answer": "Sim, desde que o banco seja habilitado pelo Tesouro Nacional. O produto é o mesmo em qualquer plataforma." }
    ],
    "internalLinks": [
      { "anchor": "melhores investimentos para iniciantes", "slug": "melhores-investimentos-para-iniciantes" },
      { "anchor": "como começar a investir do zero", "slug": "como-comecar-a-investir" },
      { "anchor": "o que é CDB", "slug": "o-que-e-cdb" },
      { "anchor": "o que é Tesouro Direto", "slug": "o-que-e-tesouro-direto" },
      { "anchor": "reserva de emergência", "slug": "reserva-de-emergencia" }
    ],
    "cta": {
      "primary": { "text": "Veja os melhores investimentos para iniciantes", "url": "/melhores-investimentos-para-iniciantes" },
      "secondary": { "text": "Como começar a investir do zero", "url": "/como-comecar-a-investir" }
    }
  }
];
