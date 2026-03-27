
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
    // A função é avaliada no servidor antes de ser passada para o componente cliente
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
  description: string;
  date: string;
  imageId: string;
  content: ArticleContent; // Modificado para aceitar múltiplos blocos
  conclusion: string;
  seoTitle?: string;
  seoDescription?: string;
  faq?: { question: string; answer: string }[];
  category?: string;
  subcategory?: string;
  pillar?: string;
  cluster?: string;
  tags?: string[];
  disclaimer?: string;
};

const defaultDisclaimer = "Este conteúdo é educativo e não constitui recomendação de investimento. Rentabilidades são referências e variam conforme o produto e o emissor. Consulte um profissional certificado para orientação personalizada.";

export const blogArticles: Article[] = [
  {
    slug: 'cdb-ou-poupanca',
    title: 'CDB ou Poupança: qual rende mais e qual escolher?',
    description: 'CDB ou poupança: veja qual rende mais, as diferenças em segurança e liquidez, e por que o CDB supera a poupança na maioria dos cenários.',
    date: '2026-03-20',
    imageId: 'blog-cdb-poupanca',
    content: [
      {
        type: 'html',
        content: `<h1>CDB ou poupança: qual rende mais e por que o CDB quase sempre vence</h1><div class='resumo-rapido'><ul><li>Com a Selic acima de 8,5% ao ano, o CDB rende mais que a poupança — sempre</li><li>A poupança rende apenas {{poupancaRate}}% ao ano + TR com a Selic atual de {{selicRate}}%</li><li>CDB de 100% do CDI rende aproximadamente {{cdb100Rate}}% líquido ao ano — quase o dobro</li><li>Os dois têm FGC até R$ 250.000 — o nível de segurança é o mesmo</li><li>A única vantagem real da poupança é a isenção de IR — mas não compensa o rendimento menor</li></ul></div><p>A poupança ainda é o investimento mais popular do Brasil — mas não porque é o melhor. É porque é o mais conhecido. Para quem está avaliando onde deixar o dinheiro, a comparação com o CDB é inevitável.</p><p>A resposta direta: com a Selic acima de 8,5% ao ano, o CDB rende mais que a poupança em praticamente todos os cenários — mesmo após o desconto do Imposto de Renda.</p><h2>Como funciona o rendimento da poupança</h2><p>O rendimento da poupança segue uma regra definida pelo Banco Central:</p><ul><li><strong>Quando a Selic está acima de 8,5% ao ano:</strong> poupança rende 0,5% ao mês + TR (Taxa Referencial), o que equivale a aproximadamente {{poupancaRate}}% ao ano.</li><li><strong>Quando a Selic está igual ou abaixo de 8,5% ao ano:</strong> poupança rende 70% da Selic + TR</li></ul><p>A poupança é isenta de Imposto de Renda para pessoa física — mas como veremos, isso não compensa o rendimento menor.</p><h2>Como funciona o rendimento do CDB</h2><p>O CDB rende um percentual do CDI (Certificado de Depósito Interbancário). Com CDI a {{cdiRate}}% ao ano:</p><ul><li>CDB a 100% do CDI: {{cdb100Rate}}% ao ano bruto</li><li>CDB a 110% do CDI: {{cdb120Rate}}% ao ano bruto</li></ul><p>O CDB tem Imposto de Renda regressivo sobre o rendimento.</p><h2>Simulação: R$ 10.000 em CDB vs poupança</h2>`,
      },
      {
        type: 'simulationTable',
        initialInvestment: 10000,
        terms: [6, 12, 24, 36],
        showDifference: true,
        scenarios: [
          { label: 'Poupança ({{poupancaRate}}% a.a.)', rate: (cdi, selic) => (selic > 8.5 ? 0.0617 : (selic / 100) * 0.70), isTaxable: false },
          { label: 'CDB 100% CDI líquido', rate: (cdi, selic) => cdi / 100, isTaxable: true },
          { label: 'CDB 110% CDI líquido', rate: (cdi, selic) => (cdi / 100) * 1.10, isTaxable: true }
        ]
      },
      {
        type: 'html',
        content: `<p><em>Simulação de rendimento líquido. (Referência: {{dataAtualizacao}})</em></p>`,
      }
    ],
    conclusion: `<h2>Conclusão</h2><p>Com a Selic a {{selicRate}}% ao ano, o CDB supera a poupança em todos os prazos — mesmo após o desconto do IR.</p><p>Se você ainda tem dinheiro na poupança, vale avaliar migrar para um CDB de liquidez diária ou Tesouro Selic — com o mesmo nível de segurança (FGC) e rendimento muito superior.</p><p>Quer entender melhor as opções? <a href='/melhores-investimentos-para-iniciantes'>Veja os melhores investimentos para iniciantes.</a></p>`,
    seoTitle: 'CDB ou Poupança: qual rende mais em 2026?',
    seoDescription: 'CDB ou poupança: compare rendimento líquido, segurança e liquidez. Simulação com valores reais e checklist para escolher o melhor investimento.',
    faq: [
      {
        question: 'CDB ou poupança: qual rende mais?',
        answer: "Com a Selic acima de 8,5% ao ano, o CDB rende mais que a poupança em todos os cenários — mesmo após o desconto do IR. Com a Selic a {{selicRate}}% ao ano, um CDB a 100% do CDI rende aproximadamente {{cdb100Rate}}% líquido ao ano contra {{poupancaRate}}% da poupança."
      },
      {
        question: 'A poupança tem IR?',
        answer: 'Não. A poupança é isenta de Imposto de Renda para pessoa física. Mas essa vantagem não compensa o rendimento muito menor — o CDB supera a poupança mesmo após pagar IR.'
      },
      {
        question: 'CDB e poupança têm a mesma segurança?',
        answer: 'Sim. Os dois têm cobertura do FGC até R$ 250.000 por CPF por instituição financeira. O nível de segurança é equivalente para valores dentro desse limite.'
      },
      {
        question: 'Posso resgatar o CDB a qualquer momento como a poupança?',
        answer: 'Depende do produto. CDB de liquidez diária permite resgate a qualquer momento, igual à poupança. CDB com prazo definido só permite resgate no vencimento. Verifique as condições antes de aplicar.'
      },
      {
        question: 'Quanto rende mais o CDB do que a poupança?',
        answer: `Com a Selic a {{selicRate}}% ao ano, um CDB a 100% do CDI rende aproximadamente R$ 475 a mais do que a poupança em 12 meses para cada R$ 10.000 investidos.`
      },
      {
        question: 'Vale a pena migrar da poupança para o CDB?',
        answer: 'Sim, na maioria dos casos. Um CDB de liquidez diária tem o mesmo nível de segurança (FGC), a mesma praticidade de resgate e rende quase o dobro da poupança com a Selic atual.'
      },
      {
        question: 'Existe algum cenário em que a poupança é melhor que o CDB?',
        answer: 'Na prática, não com a Selic atual. Para a poupança empatar com um CDB a 100% do CDI, ela precisaria render mais do que o dobro do que rende hoje. Mesmo com Selic mais baixa, um CDB bem escolhido acima de 85% do CDI supera a poupança.'
      }
    ],
    category: 'renda-fixa',
    subcategory: 'comparativos',
    pillar: 'pillar-2-renda-fixa',
    cluster: 'comparativos-renda-fixa',
    tags: ['CDB ou poupança', 'CDB vs poupança', 'poupança ou CDB', 'poupança rende menos', 'melhor que poupança'],
    disclaimer: 'Este conteúdo é educativo e não constitui recomendação de investimento. As simulações assumem taxa constante para fins ilustrativos — o rendimento real pode variar. Consulte um profissional certificado para orientação personalizada.',
  },
  {
    slug: 'tesouro-selic-ou-cdb',
    title: 'Tesouro Selic ou CDB: qual é melhor para você?',
    description: 'Tesouro Selic ou CDB: descubra as diferenças em segurança, liquidez e rendimento. Comparativo completo com tabela, simulação e checklist de decisão.',
    date: '2026-03-20',
    imageId: 'blog-tesouro-cdb',
    content: [
      {
        type: 'html',
        content: `<h1>Tesouro Selic ou CDB: qual é melhor para você?</h1><div class='resumo-rapido'><ul><li>Tesouro Selic e CDB de liquidez diária têm rendimento muito próximo — a diferença em 12 meses é pequena</li><li>A principal diferença está na garantia: Tesouro é garantido pelo Governo Federal, CDB pelo FGC até R$ 250k</li><li>Para reserva de emergência, os dois funcionam bem — a escolha depende do valor investido</li><li>CDB acima de 100% do CDI pode superar o Tesouro Selic no líquido</li><li>Sempre compare rendimento líquido — não taxa bruta</li></ul></div><p>Tesouro Selic e CDB são os dois investimentos de renda fixa mais populares para reserva de emergência e objetivos de curto prazo. A dúvida entre os dois é comum — e a resposta depende de alguns fatores simples.</p><p>Este comparativo explica as diferenças reais, mostra uma simulação prática e te ajuda a decidir em minutos.</p><h2>Simulação: R$ 10.000 em Tesouro Selic vs CDB</h2>`,
      },
      {
        type: 'simulationTable',
        initialInvestment: 10000,
        terms: [6, 12, 24],
        scenarios: [
            { label: 'Tesouro Selic líquido', rate: (cdi, selic) => selic / 100, isTaxable: true },
            { label: 'CDB 95% CDI líquido', rate: (cdi, selic) => (cdi / 100) * 0.95, isTaxable: true },
            { label: 'CDB 100% CDI líquido', rate: (cdi, selic) => cdi / 100, isTaxable: true },
            { label: 'CDB 105% CDI líquido', rate: (cdi, selic) => (cdi / 100) * 1.05, isTaxable: true },
            { label: 'CDB 110% CDI líquido', rate: (cdi, selic) => (cdi / 100) * 1.10, isTaxable: true }
        ]
      },
      {
        type: 'html',
        content: `<p><em>Simulação de rendimento líquido. (Referência: {{dataAtualizacao}})</em></p><p>A tabela mostra que, para um CDB de liquidez diária superar o rendimento do Tesouro Selic, ele precisa pagar acima de 100% do CDI. A diferença é pequena, mas existe.</p><h2>Quando o Tesouro Selic é melhor?</h2><p><strong>Segurança máxima:</strong> para valores acima de R$ 250.000 — limite do FGC —, o Tesouro Selic é a opção mais segura, pois é garantido pelo Governo Federal sem limite de valor.</p><p><strong>Praticidade:</strong> se o seu banco ou corretora oferece apenas CDBs com taxas abaixo de 100% do CDI, o Tesouro Selic é uma escolha melhor e mais simples.</p><h2>Quando o CDB é melhor?</h2><p><strong>Taxas competitivas:</strong> se você encontrar um CDB de liquidez diária que pague acima de 101% do CDI, ele terá um rendimento líquido ligeiramente superior ao Tesouro Selic.</p><p><strong>Isenção da taxa de custódia:</strong> o Tesouro Selic tem uma taxa de custódia de 0,20% ao ano da B3 (isenta para os primeiros R$ 10.000). O CDB não tem essa taxa, o que pode fazer diferença no longo prazo.</p>`,
      }
    ],
    conclusion: `<h2>Conclusão</h2><p>Tesouro Selic e CDB de liquidez diária são produtos quase equivalentes para objetivos de curto prazo e reserva de emergência. A diferença de rendimento é pequena — o que realmente importa é a taxa do CDB disponível e o valor que você vai investir.</p><p>Regra simples: se o CDB paga acima de 101% do CDI com liquidez diária, ele vence. Se paga menos, o Tesouro Selic é melhor. Para valores acima de R$ 250.000, Tesouro Selic sempre.</p><p>Quer entender melhor cada produto? Leia <a href='/o-que-e-tesouro-direto'>o que é Tesouro Direto</a> e <a href='/o-que-e-cdb'>o que é CDB</a>.</p>`,
    seoTitle: 'Tesouro Selic ou CDB: qual rende mais em 2026?',
    seoDescription: 'Tesouro Selic ou CDB: compare segurança, liquidez e rendimento líquido. Veja quando cada um compensa com simulação prática e checklist de decisão.',
    faq: [
        {
            "question": "Tesouro Selic ou CDB: qual rende mais?",
            "answer": "Depende da taxa do CDB. Com CDI a {{cdiRate}}% ao ano, o Tesouro Selic rende aproximadamente {{selicRate}}% bruto ao ano. Um CDB a 100% do CDI rende {{cdb100Rate}}% bruto. A diferença líquida é mínima."
        },
        {
            "question": "Qual a diferença entre Tesouro Selic e CDB?",
            "answer": "A principal diferença é a garantia: Tesouro Selic é garantido pelo Governo Federal sem limite de valor. CDB tem cobertura do FGC até R$ 250.000 por CPF por instituição. O rendimento dos dois é muito próximo."
        },
        {
            "question": "Tesouro Selic ou CDB para reserva de emergência?",
            "answer": "Os dois são excelentes para reserva de emergência. Tesouro Selic é mais indicado para valores acima de R$ 250.000. Para valores menores, um CDB que pague acima de 100% do CDI com liquidez diária pode ser mais vantajoso."
        },
        {
            "question": "CDB é mais seguro que Tesouro Selic?",
            "answer": "Não. O Tesouro Selic é garantido pelo Governo Federal — considerado o investimento de menor risco do Brasil. O CDB tem FGC até R$ 250.000, que é um nível de segurança muito alto, mas inferior ao Governo Federal."
        },
        {
            "question": "Tesouro Selic tem taxa de custódia?",
            "answer": "Sim. A B3 cobra 0,20% ao ano. Porém, investimentos de até R$ 10.000 no Tesouro Selic são isentos dessa taxa. Acima disso, a taxa se aplica ao valor total."
        },
        {
            "question": "Qual o rendimento do Tesouro Selic em 2026?",
            "answer": "Com a Selic a {{selicRate}}% ao ano, o Tesouro Selic rende aproximadamente {{selicRate}}% bruto ao ano. O rendimento líquido depende do prazo e da alíquota de IR."
        },
        {
            "question": "Posso ter Tesouro Selic e CDB ao mesmo tempo?",
            "answer": "Sim. Muitos investidores usam os dois — Tesouro Selic para a reserva de emergência principal e CDB de liquidez diária para complementar, aproveitando taxas acima de 100% do CDI dentro do limite do FGC."
        }
    ],
    category: 'renda-fixa',
    subcategory: 'comparativos',
    pillar: 'pillar-2-renda-fixa',
    cluster: 'comparativos-renda-fixa',
    tags: ["Tesouro Selic ou CDB", "Tesouro Selic vs CDB", "CDB ou Tesouro Direto", "comparativo renda fixa", "qual melhor Tesouro Selic CDB"],
    disclaimer: defaultDisclaimer,
  },
  {
    slug: 'o-que-e-lci',
    title: 'O que é LCI: como funciona e qual o rendimento?',
    description: 'Entenda o que é LCI (Letra de Crédito Imobiliário), como funciona a isenção de Imposto de Renda e compare o rendimento com CDB e Poupança.',
    date: '2026-03-20',
    imageId: 'blog-o-que-e-lci',
    content: [
      {
        type: 'html',
        content: `<h1>O que é LCI: como funciona, rendimento e comparação com CDB</h1><div class='resumo-rapido'><ul><li>LCI (Letra de Crédito Imobiliário) é um título de renda fixa isento de IR para pessoa física</li><li>O dinheiro é usado para financiar o setor imobiliário</li><li>Garantido pelo FGC até R$ 250.000</li><li>Costuma ter prazo de carência (mínimo de 90 dias) — não serve para reserva de emergência</li><li>Para valer a pena, uma LCI a 90% do CDI precisa superar um CDB de ~106% do CDI (líquido)</li></ul></div><p>LCI é um dos investimentos de renda fixa mais populares por um motivo simples: não tem Imposto de Renda para pessoa física. Mas será que a isenção fiscal sempre compensa?</p><p>Este guia explica o que é, como funciona, os tipos e como comparar o rendimento com outras opções.</p><h2>O que é LCI?</h2><p>LCI significa Letra de Crédito Imobiliário. É um título de renda fixa emitido por bancos para financiar o setor imobiliário. Na prática, você "empresta" dinheiro ao banco, que usa esses recursos para conceder crédito imobiliário. Em troca, o banco te paga juros.</p><h2>Tipos de LCI</h2><p>Assim como outros títulos, a LCI pode ter rentabilidade Pós-fixada, Prefixada ou Híbrida.</p><table><thead><tr><th>Tipo</th><th>Como rende</th><th>Ideal para</th></tr></thead><tbody><tr><td>Pós-fixada</td><td>Percentual do CDI (ex: 95% do CDI)</td><td>Acompanhar a Selic, cenários de alta ou estabilidade nos juros</td></tr><tr><td>Prefixada</td><td>Taxa fixa (ex: 10% ao ano)</td><td>Garantir rentabilidade específica, cenários de queda nos juros</td></tr><tr><td>Híbrida (IPCA+)</td><td>Taxa fixa + inflação (ex: IPCA + 5% a.a.)</td><td>Proteger o poder de compra no longo prazo</td></tr></tbody></table><h2>Vantagens e desvantagens da LCI</h2><h3>Vantagens</h3><ul><li><strong>Isenção de Imposto de Renda:</strong> o rendimento é totalmente isento de IR para pessoa física.</li><li><strong>Garantia do FGC:</strong> tem a mesma proteção da poupança e do CDB, até R$ 250.000 por CPF por instituição.</li><li><strong>Previsibilidade:</strong> por ser renda fixa, você tem uma boa ideia do quanto vai render.</li></ul><h3>Desvantagens</h3><ul><li><strong>Carência e liquidez:</strong> a maioria das LCIs tem prazo de carência (mínimo de 90 dias) e só permite resgate no vencimento. Não serve para reserva de emergência.</li><li><strong>Disponibilidade:</strong> a oferta de LCIs pode ser menor que a de CDBs, especialmente em grandes bancos.</li><li><strong>Rendimento bruto menor:</strong> para compensar a isenção de IR, os bancos oferecem taxas brutas menores que as de CDBs.</li></ul><h2>LCI vs CDB: qual rende mais?</h2><p>Como o CDB tem IR, ele precisa oferecer uma taxa bruta maior para "empatar" com uma LCI. Veja a simulação de R$ 10.000 em 1 ano com CDI a {{cdiRate}}%:</p>`,
      },
      {
        type: 'simulationTable',
        initialInvestment: 10000,
        terms: [12],
        scenarios: [
          { label: 'CDB 100% CDI líquido', rate: (cdi, selic) => cdi / 100, isTaxable: true },
          { label: 'CDB 110% CDI líquido', rate: (cdi, selic) => (cdi / 100) * 1.10, isTaxable: true },
          { label: 'LCI 90% CDI (isento)', rate: (cdi, selic) => (cdi / 100) * 0.90, isTaxable: false },
          { label: 'LCI 95% CDI (isento)', rate: (cdi, selic) => (cdi / 100) * 0.95, isTaxable: false }
        ]
      },
      {
        type: 'html',
        content: `<p><em>(Referência: {{dataAtualizacao}})</em></p><h2>LCI vs Outros Produtos: comparativo rápido</h2><p>Rendimento líquido de R$ 10.000 em 1 ano:</p>`,
      },
      {
        type: 'simulationTable',
        initialInvestment: 10000,
        terms: [12],
        scenarios: [
          { label: 'Poupança', rate: (cdi, selic) => selic > 8.5 ? 0.0617 : selic * 0.70, isTaxable: false },
          { label: 'CDB 100% CDI', rate: (cdi, selic) => cdi / 100, isTaxable: true },
          { label: 'LCI 90% CDI', rate: (cdi, selic) => (cdi / 100) * 0.90, isTaxable: false },
          { label: 'LCI 95% CDI', rate: (cdi, selic) => (cdi / 100) * 0.95, isTaxable: false },
          { label: 'Tesouro Selic', rate: (cdi, selic) => selic / 100, isTaxable: true }
        ]
      },
      {
        type: 'html',
        content: `<p><em>(Referência: {{dataAtualizacao}})</em></p>`,
      },
    ],
    conclusion: `<h2>Conclusão</h2><p>A LCI é um excelente investimento de renda fixa para objetivos de médio e longo prazo, graças à isenção de IR e à segurança do FGC. No entanto, ela não serve para reserva de emergência por causa da carência.</p><p>Para decidir se uma LCI vale a pena, compare sempre o rendimento dela com o de um CDB líquido de IR. Use a regra: uma LCI a {{lci90Rate}}% do CDI é melhor que um CDB de 100% do CDI, mas pior que um de {{cdb110Rate}}% do CDI. Compare as taxas disponíveis na sua corretora.</p><p>Quer entender melhor a diferença? <a href='/cdb-ou-lci'>Veja o comparativo completo entre CDB e LCI.</a></p>`,
    seoTitle: 'O que é LCI: rendimento, segurança e como funciona',
    seoDescription: 'Descubra o que é LCI, como funciona a isenção de IR, os tipos (pré e pós-fixada), riscos e compare o rendimento com CDB, poupança e Tesouro Selic.',
    faq: [
      {
        question: 'O que é LCI?',
        answer: 'LCI (Letra de Crédito Imobiliário) é um investimento de renda fixa emitido por bancos para financiar o setor imobiliário. Seu principal atrativo é a isenção de Imposto de Renda para pessoas físicas.'
      },
      {
        question: 'LCI é seguro?',
        answer: 'Sim, é um dos investimentos mais seguros do mercado. Tem a mesma garantia da poupança, o FGC (Fundo Garantidor de Créditos), que protege até R$ 250.000 por CPF por instituição financeira.'
      },
      {
        question: 'LCI rende mais que CDB?',
        answer: 'Depende da taxa. Uma LCI de 95% do CDI, por ser isenta de IR, renderá mais que um CDB de 100% do CDI no mesmo prazo. No entanto, um CDB de 115% do CDI já renderá mais que a LCI.'
      },
      {
        question: 'LCI tem liquidez diária?',
        answer: 'Não. Por lei, as LCIs têm um prazo de carência mínimo de 90 dias. A maioria só permite o resgate no vencimento. Por isso, não são indicadas para reserva de emergência.'
      },
      {
        question: 'O que é melhor: LCI ou LCA?',
        answer: 'Em termos de rendimento, risco e tributação, LCI e LCA são idênticas. A única diferença é o destino do dinheiro: LCI financia o setor imobiliário e LCA o agronegócio. Escolha a que tiver a melhor taxa.'
      }
    ],
    category: 'renda-fixa',
    subcategory: 'produtos',
    pillar: 'pillar-2-renda-fixa',
    cluster: 'produtos-renda-fixa',
    tags: ["o que é lci", "lci", "letra de crédito imobiliário", "lci rendimento", "lci como funciona", "lci ou cdb"],
    disclaimer: defaultDisclaimer,
  },
  {
    slug: 'o-que-e-lca',
    title: 'O que é LCA: como funciona e qual o rendimento?',
    description: 'Entenda o que é LCA (Letra de Crédito do Agronegócio), como funciona a isenção de Imposto de Renda e compare o rendimento com CDB e Poupança.',
    date: '2026-03-20',
    imageId: 'blog-o-que-e-lca',
    content: [
      {
        type: 'html',
        content: `<h1>O que é LCA: como funciona, rendimento e comparação com LCI</h1><div class='resumo-rapido'><ul><li>LCA (Letra de Crédito do Agronegócio) é um título de renda fixa isento de IR para pessoa física</li><li>O dinheiro é usado para financiar o setor do agronegócio</li><li>Garantido pelo FGC até R$ 250.000, assim como LCI, CDB e poupança</li><li>Costuma ter prazo de carência (mínimo de 90 dias) — não serve para reserva de emergência</li><li>Para o investidor, LCA e LCI são praticamente idênticas — a escolha se resume a qual oferece a melhor taxa</li></ul></div><p>LCA, assim como sua "irmã" LCI, é um dos investimentos de renda fixa preferidos dos brasileiros por causa da isenção de Imposto de Renda. Mas o que exatamente ela financia e qual a diferença para outros produtos?</p><p>Este guia explica o que é, como funciona, os tipos e como comparar o rendimento com outras opções.</p><h2>O que é LCA?</h2><p>LCA significa Letra de Crédito do Agronegócio. É um título de renda fixa emitido por bancos para financiar o setor do agronegócio. Ao investir em LCA, você "empresta" dinheiro ao banco, que usa esses recursos para conceder crédito a produtores rurais e cooperativas. Em troca, o banco te paga juros.</p><h2>Tipos de LCA</h2><p>Assim como as LCIs, as LCAs podem ter rentabilidade Pós-fixada, Prefixada ou Híbrida.</p><table><thead><tr><th>Tipo</th><th>Como rende</th><th>Ideal para</th></tr></thead><tbody><tr><td>Pós-fixada</td><td>Percentual do CDI (ex: 95% do CDI)</td><td>Acompanhar a Selic, cenários de alta ou estabilidade nos juros</td></tr><tr><td>Prefixada</td><td>Taxa fixa (ex: 10% ao ano)</td><td>Garantir rentabilidade específica, cenários de queda nos juros</td></tr><tr><td>Híbrida (IPCA+)</td><td>Taxa fixa + inflação (ex: IPCA + 5% a.a.)</td><td>Proteger o poder de compra no longo prazo</td></tr></tbody></table><h2>LCA vs LCI: Qual a diferença?</h2><p>Para o investidor, a diferença é praticamente nula. Os dois produtos têm a mesma estrutura, mesma tributação (isenção de IR) e mesma garantia (FGC). A única diferença real é o destino do dinheiro:</p><table><thead><tr><th></th><th>LCI</th><th>LCA</th></tr></thead><tbody><tr><td>Significado</td><td>Letra de Crédito Imobiliário</td><td>Letra de Crédito do Agronegócio</td></tr><tr><td>Lastro (Destino do dinheiro)</td><td>Setor Imobiliário</td><td>Setor do Agronegócio</td></tr><tr><td>Tributação</td><td>Isento de IR (PF)</td><td>Isento de IR (PF)</td></tr><tr><td>Garantia</td><td>FGC até R$ 250k</td><td>FGC até R$ 250k</td></tr><tr><td>Liquidez</td><td>Geralmente no vencimento (mín. 90 dias)</td><td>Geralmente no vencimento (mín. 90 dias)</td></tr></tbody></table><p><strong>A regra é simples:</strong> entre uma LCI e uma LCA com o mesmo tipo de rentabilidade, prazo e emitente, escolha a que oferecer a maior taxa.</p><h2>LCA vs CDB: qual rende mais?</h2><p>A isenção de IR da LCA faz com que ela seja mais vantajosa que um CDB de mesma taxa bruta. Veja a simulação de R$ 10.000 em 1 ano com CDI a {{cdiRate}}%:</p>`,
      },
      {
        type: 'simulationTable',
        initialInvestment: 10000,
        terms: [12],
        scenarios: [
          { label: 'CDB 100% CDI líquido', rate: (cdi, selic) => cdi / 100, isTaxable: true },
          { label: 'CDB 110% CDI líquido', rate: (cdi, selic) => (cdi / 100) * 1.10, isTaxable: true },
          { label: 'LCA 90% CDI (isento)', rate: (cdi, selic) => (cdi / 100) * 0.90, isTaxable: false },
          { label: 'LCA 95% CDI (isento)', rate: (cdi, selic) => (cdi / 100) * 0.95, isTaxable: false }
        ]
      },
      {
        type: 'html',
        content: `<p><em>(Referência: {{dataAtualizacao}})</em></p><h2>LCA vs Outros Produtos: comparativo rápido</h2><p>Rendimento líquido de R$ 10.000 em 1 ano:</p>`,
      },
      {
        type: 'simulationTable',
        initialInvestment: 10000,
        terms: [12],
        scenarios: [
          { label: 'Poupança', rate: (cdi, selic) => selic > 8.5 ? 0.0617 : selic * 0.70, isTaxable: false },
          { label: 'CDB 100% CDI', rate: (cdi, selic) => cdi / 100, isTaxable: true },
          { label: 'LCA 90% CDI', rate: (cdi, selic) => (cdi / 100) * 0.90, isTaxable: false },
          { label: 'LCA 95% CDI', rate: (cdi, selic) => (cdi / 100) * 0.95, isTaxable: false },
          { label: 'Tesouro Selic', rate: (cdi, selic) => selic / 100, isTaxable: true }
        ]
      },
      {
        type: 'html',
        content: `<p><em>(Referência: {{dataAtualizacao}})</em></p>`,
      },
    ],
    conclusion: `<h2>Conclusão</h2><p>A LCA é uma ótima opção para diversificar a carteira de renda fixa, com a vantagem da isenção de IR e segurança do FGC. Por ter prazo de carência, ela é indicada para objetivos de médio e longo prazo, e não para reserva de emergência.</p><p>Ao escolher, compare a taxa oferecida com a de um CDB. Uma LCA de {{lci90Rate}}% do CDI é melhor que um CDB de 100% do CDI. A partir de taxas como {{cdb120Rate}}% do CDI, o CDB pode se tornar mais vantajoso mesmo com o IR.</p><p>Quer entender melhor a diferença? <a href='/cdb-ou-lci'>Veja o comparativo completo entre CDB, LCI e LCA.</a></p>`,
    seoTitle: 'O que é LCA: rendimento, segurança e como funciona',
    seoDescription: 'Descubra o que é LCA, como funciona a isenção de IR, os tipos (pré e pós-fixada), riscos e compare o rendimento com LCI, CDB e Tesouro Selic.',
    faq: [
      {
        question: 'O que é LCA?',
        answer: 'LCA (Letra de Crédito do Agronegócio) é um investimento de renda fixa emitido por bancos para financiar o setor do agronegócio. Seu principal atrativo é a isenção de Imposto de Renda para pessoas físicas.'
      },
      {
        question: 'LCA é seguro?',
        answer: 'Sim, é um dos investimentos mais seguros do mercado. Tem a mesma garantia da poupança, o FGC (Fundo Garantidor de Créditos), que protege até R$ 250.000 por CPF por instituição financeira.'
      },
      {
        question: 'LCA rende mais que LCI?',
        answer: 'Não necessariamente. Para o investidor, LCI e LCA são produtos idênticos em estrutura, risco e tributação. Você deve escolher o que oferecer a melhor taxa de rendimento, independente de ser LCI ou LCA.'
      },
      {
        question: 'LCA tem liquidez diária?',
        answer: 'Não. Por lei, as LCAs têm um prazo de carência mínimo de 90 dias, e muitas só permitem o resgate no vencimento. Por isso, não são indicadas para reserva de emergência.'
      },
      {
        question: 'Quanto rende uma LCA de 95% do CDI?',
        answer: 'Com a taxa CDI em {{cdiRate}}% ao ano, uma LCA que rende 95% do CDI terá um rendimento bruto de {{lci95Rate}}% ao ano. Como é isenta de IR, esse é também o rendimento líquido.'
      }
    ],
    category: 'renda-fixa',
    subcategory: 'produtos',
    pillar: 'pillar-2-renda-fixa',
    cluster: 'produtos-renda-fixa',
    tags: ["o que é lca", "lca", "letra de crédito do agronegócio", "lca rendimento", "lca como funciona", "lci ou lca"],
    disclaimer: defaultDisclaimer,
  }
]

    