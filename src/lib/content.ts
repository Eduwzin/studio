
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
  },
  {
    slug: 'renda-fixa-ou-renda-variavel',
    title: 'Renda Fixa ou Variável: qual a melhor para você?',
    description: 'Renda Fixa vs. Variável: entenda as diferenças de risco, retorno e liquidez. Saiba como e quando usar cada uma e como alocar na sua carteira.',
    date: '2026-03-20',
    imageId: 'blog-fixa-vs-variavel',
    content: [
      {
        type: 'html',
        content: `<h1>Renda Fixa vs. Renda Variável: guia completo para decidir</h1><div class='resumo-rapido'><ul><li><strong>Renda Fixa:</strong> mais segura, previsível. Ideal para reserva de emergência e metas de curto prazo. Exemplos: Tesouro Selic, CDBs.</li><li><strong>Renda Variável:</strong> maior potencial de retorno, mais arriscada. Ideal para crescimento de patrimônio no longo prazo. Exemplos: Ações, FIIs.</li><li>A melhor carteira não tem um ou outro — tem os dois, na proporção certa para o seu perfil e objetivos.</li><li>Com a Selic a {{selicRate}}% ao ano, a renda fixa brasileira está muito atrativa.</li><li>Regra de ouro: só invista em renda variável depois de ter sua reserva de emergência formada em renda fixa.</li></ul></div><p>Renda fixa ou renda variável? Essa é a primeira grande decisão de todo investidor. Entender a diferença entre as duas é o passo mais importante para construir uma carteira de investimentos que funcione para você.</p><p>Este guia explica as diferenças, as vantagens e desvantagens de cada uma, e como combiná-las de forma inteligente.</p><h2>O que é Renda Fixa?</h2><p>Renda Fixa são investimentos com regras de remuneração definidas no momento da aplicação. Você sabe exatamente como seu dinheiro vai render — se será uma taxa fixa (prefixado), atrelada a um índice como a Selic ou o CDI (pós-fixado), ou uma combinação dos dois (híbrido).</p><ul><li><strong>Segurança:</strong> É o seu principal atrativo. Muitos produtos têm a garantia do FGC (Fundo Garantidor de Créditos) ou são emitidos pelo governo (Tesouro Direto), considerados os mais seguros do país.</li><li><strong>Previsibilidade:</strong> O retorno é previsível, ideal para quem não quer surpresas.</li><li><strong>Ideal para:</strong> Reserva de emergência, metas de curto e médio prazo, ou para a parte mais conservadora da sua carteira.</li></ul><h2>O que é Renda Variável?</h2><p>Renda Variável são investimentos cujo retorno não é conhecido no momento da aplicação. O valor dos ativos oscila conforme o mercado, os resultados das empresas e a economia. Você pode ter retornos altos, mas também pode perder parte do dinheiro investido.</p><ul><li><strong>Potencial de retorno:</strong> Ilimitado no longo prazo. Boas empresas e fundos podem multiplicar seu patrimônio.</li><li><strong>Risco:</strong> O preço dos ativos pode cair. Não há garantia de retorno.</li><li><strong>Ideal para:</strong> Crescimento de patrimônio no longo prazo (5+ anos), para investidores com maior tolerância ao risco.</li></ul><h2>Renda Fixa vs. Renda Variável: Tabela Comparativa</h2><table><thead><tr><th>Característica</th><th>Renda Fixa</th><th>Renda Variável</th></tr></thead><tbody><tr><td><strong>Previsibilidade</strong></td><td>Alta. Regras de rendimento conhecidas.</td><td>Baixa. Retorno incerto e volátil.</td></tr><tr><td><strong>Risco</strong></td><td>Baixo. Garantia do FGC ou do Tesouro.</td><td>Alto. Sem garantias, risco de perda do capital.</td></tr><tr><td><strong>Potencial de Retorno</strong></td><td>Limitado, geralmente próximo à Selic/CDI.</td><td>Ilimitado, mas com maior risco.</td></tr><tr><td><strong>Liquidez</strong></td><td>Varia. Alguns diária (Tesouro Selic, CDBs), outros só no vencimento.</td><td>Alta (ações, FIIs, ETFs podem ser vendidos na bolsa a qualquer momento).</td></tr><tr><td><strong>Indicado para</strong></td><td>Reserva de emergência, metas de curto prazo, perfil conservador.</td><td>Crescimento no longo prazo, perfil moderado/arrojado.</td></tr><tr><td><strong>Exemplos</strong></td><td>Tesouro Direto, CDB, LCI/LCA, Poupança.</td><td>Ações, FIIs, ETFs, BDRs, Criptomoedas.</td></tr></tbody></table><h2>Qual tem maior rentabilidade?</h2><p>No longo prazo, a renda variável tende a ter uma rentabilidade maior para compensar o risco mais elevado. No entanto, no curto e médio prazo, o cenário pode mudar drasticamente.</p><p>No Brasil, com a taxa Selic em <strong>{{selicRate}}% ao ano</strong>, a renda fixa se torna extremamente competitiva. Um CDB que paga <strong>{{cdbExampleRate}}% ao ano</strong> (110% do CDI de {{cdiRate}}%) oferece um retorno excelente com risco muito baixo.</p><p>Em cenários de juros altos como o atual, a renda fixa pode superar a bolsa de valores por longos períodos. <strong>(Dados de referência: {{dataAtualizacao}})</strong></p><h2>Alocação por Perfil de Investidor</h2><p>A resposta para "renda fixa ou variável?" não é uma escolha, mas uma questão de <strong>proporção</strong>. A alocação ideal depende do seu perfil de risco:</p><table><thead><tr><th>Perfil</th><th>Renda Fixa (%)</th><th>Renda Variável (%)</th><th>Foco Principal</th></tr></thead><tbody><tr><td><strong>Conservador</strong></td><td>80% - 100%</td><td>0% - 20%</td><td>Preservação de capital e segurança.</td></tr><tr><td><strong>Moderado</strong></td><td>50% - 70%</td><td>30% - 50%</td><td>Equilíbrio entre segurança e crescimento.</td></tr><tr><td><strong>Arrojado/Agressivo</strong></td><td>20% - 40%</td><td>60% - 80%</td><td>Maximizar o crescimento no longo prazo, aceitando alta volatilidade.</td></tr></tbody></table>`,
      },
    ],
    conclusion: `<h2>Conclusão</h2><p>A melhor carteira de investimentos não escolhe entre renda fixa ou variável, mas combina as duas de forma inteligente. A renda fixa oferece a segurança para seus objetivos de curto prazo e sua reserva de emergência. A renda variável oferece o potencial de crescimento para seus objetivos de longo prazo.</p><p>A proporção ideal entre as duas é a decisão mais importante que você tomará como investidor. Comece pelo <a href='/onboarding'>nosso onboarding</a> para descobrir seu perfil e receber uma alocação recomendada.</p>`,
    seoTitle: 'Renda Fixa ou Variável: Qual a Melhor? Guia 2026',
    seoDescription: 'Renda Fixa vs. Variável: entenda as diferenças de risco, retorno, liquidez e saiba como alocar sua carteira de acordo com seu perfil de investidor.',
    faq: [
      {
        question: 'O que é melhor, renda fixa ou variável?',
        answer: 'Nenhum é inerentemente "melhor". Renda fixa é para segurança e previsibilidade. Renda variável é para potencial de crescimento no longo prazo. Uma boa carteira combina os dois, na proporção adequada ao seu perfil.'
      },
      {
        question: 'Qual o investimento mais seguro?',
        answer: 'Os investimentos considerados mais seguros no Brasil são os títulos do Tesouro Direto, especialmente o Tesouro Selic, por serem 100% garantidos pelo Governo Federal.'
      },
      {
        question: 'Posso perder dinheiro em renda fixa?',
        answer: 'Sim, mas é raro. A "marcação a mercado" em títulos prefixados e de inflação pode causar perdas se você vender antes do vencimento. No entanto, se segurar até o vencimento, a rentabilidade contratada é garantida. Produtos com FGC (CDB, LCI/LCA) são seguros até R$ 250 mil.'
      },
      {
        question: 'Quanto da minha carteira deve ser em renda variável?',
        answer: 'Depende do seu perfil. Conservadores podem ter de 0% a 20%. Moderados, de 30% a 50%. Arrojados, de 60% a 80%. O importante é que seja um dinheiro que você não precisará no curto prazo.'
      },
      {
        question: 'Com a Selic alta, vale a pena investir em renda variável?',
        answer: 'Com a Selic em {{selicRate}}% ao ano, o custo de oportunidade é alto. A renda variável precisa performar muito bem para justificar o risco. Muitos investidores aproveitam para aumentar a posição em renda fixa, mas mantêm uma parte em variável pensando no longo prazo.'
      }
    ],
    category: 'educacao-financeira',
    subcategory: 'conceitos',
    pillar: 'pillar-1-comecando',
    cluster: 'conceitos-basicos',
    tags: ['renda fixa', 'renda variável', 'renda fixa ou variável', 'perfil de investidor', 'alocação de ativos'],
    disclaimer: defaultDisclaimer,
  },
  {
    slug: 'como-comecar-a-investir',
    title: 'Como começar a investir do zero: um guia simples',
    description: 'Guia completo para quem quer começar a investir: passo a passo desde a organização financeira até a escolha dos primeiros investimentos em renda fixa e variável.',
    date: '2026-03-20',
    imageId: 'blog-comecar-investir',
    content: [
      {
        type: 'html',
        content: `<h1>Como começar a investir do zero: guia passo a passo</h1><div class='resumo-rapido'><ul><li>Passo 0: quite dívidas caras e monte sua reserva de emergência.</li><li>Comece simples: Tesouro Selic e CDBs de 100% do CDI são ideais para iniciantes.</li><li>Não tente adivinhar o mercado. Faça aportes mensais consistentes.</li><li>Entenda seu perfil de investidor (conservador, moderado, arrojado) para definir a alocação.</li><li>O maior risco para quem está começando não é o mercado, é não começar.</li></ul></div><p>Começar a investir parece complicado, mas é mais simples do que parece. O segredo é seguir uma ordem lógica, começar com pouco e manter a consistência. Este guia é o passo a passo definitivo para sair da poupança e colocar seu dinheiro para trabalhar por você.</p><h2>Passo 0: A Preparação (O Mais Importante)</h2><p>Antes de pensar em qual ação ou fundo escolher, você precisa arrumar a casa. Sem uma base sólida, qualquer imprevisto pode te forçar a vender seus investimentos no pior momento possível.</p><ol><li><strong>Quite suas dívidas caras:</strong> Se você tem dívidas no cartão de crédito ou cheque especial, pague-as antes de qualquer coisa. Os juros que você paga nessas dívidas (mais de 300% ao ano) são muito maiores do que qualquer rendimento que você terá.</li><li><strong>Monte sua Reserva de Emergência:</strong> Tenha de 3 a 6 meses do seu custo de vida em um investimento seguro e com liquidez diária (que permite resgate a qualquer momento).</li></ol><p><strong>Onde montar a reserva?</strong></p><ul><li><strong>Tesouro Selic:</strong> O mais seguro do país, rende a taxa Selic (hoje em {{selicRate}}% ao ano).</li><li><strong>CDBs de liquidez diária que paguem pelo menos 100% do CDI:</strong> Oferecidos por bancos digitais, têm a mesma segurança da poupança (FGC) e rendem bem mais.</li></ul><h2>Passo 1: Definir Seus Objetivos e Perfil</h2><p>Por que você está investindo? A resposta muda tudo.</p><ul><li><strong>Curto Prazo (até 2 anos):</strong> Comprar um carro, fazer uma viagem. Exige segurança. Foco em Renda Fixa.</li><li><strong>Médio Prazo (2 a 5 anos):</strong> Dar entrada em um imóvel. Permite um pouco mais de risco.</li><li><strong>Longo Prazo (mais de 5 anos):</strong> Aposentadoria, independência financeira. Permite mais risco em busca de maior retorno.</li></ul><p>Com base nisso, descubra seu <strong>perfil de investidor</strong>. Você é conservador, moderado ou arrojado? Se não sabe, <a href='/onboarding'>nosso onboarding te ajuda a descobrir em 2 minutos.</a></p><h2>Passo 2: Abrir Conta em uma Corretora</h2><p>Para investir, você precisa de uma conta em uma corretora de valores. Elas são as "pontes" para o mercado financeiro. Boas corretoras para iniciantes são:</p><ul><li>Nubank (NuInvest)</li><li>Banco Inter</li><li>XP Investimentos</li><li>Rico</li></ul><p>Todas oferecem taxa zero de corretagem para a maioria dos produtos, como Tesouro Direto, FIIs e ETFs.</p><h2>Passo 3: Escolher os Primeiros Investimentos</h2><p>A regra de ouro: <strong>comece simples</strong>. Sua primeira carteira não precisa ser complicada.</p><h3>Para a parte segura (Renda Fixa):</h3><p>Além da reserva de emergência, você pode usar:</p><ul><li><strong>Tesouro IPCA+:</strong> Protege seu dinheiro da inflação, rendendo a inflação + uma taxa fixa. Ideal para o longo prazo.</li><li><strong>LCI/LCA:</strong> Isentas de Imposto de Renda. Uma LCI que paga 90% do CDI equivale a um CDB de ~109% do CDI. Ótimo para médio prazo.</li></ul><h3>Para a parte de crescimento (Renda Variável):</h3><p>Não comece comprando ações individuais. É a receita para o desastre. Comece com produtos diversificados:</p><ul><li><strong>ETFs (Fundos de Índice):</strong> Com uma única cota, você investe em dezenas ou centenas de empresas. <strong>BOVA11</strong> replica as maiores e mais negociadas ações da bolsa brasileira. <strong>IVVB11</strong> replica as 500 maiores empresas dos EUA.</li><li><strong>FIIs (Fundos Imobiliários):</strong> Investem em imóveis e pagam aluguéis mensais isentos de IR. Ótimo para gerar uma renda passiva.</li></ul><h3>Exemplo de Carteira para Iniciante (Perfil Moderado):</h3><ul><li>50% em Renda Fixa (Tesouro Selic, CDB 100% CDI)</li><li>25% em FIIs (um fundo diversificado como o KNSC11)</li><li>25% em Ações (via ETFs como BOVA11 e IVVB11)</li></ul><h2>Tabela Comparativa de Produtos para Iniciantes</h2><p>Veja o rendimento líquido de R$ 10.000 em 1 ano, considerando o IR. (Referência: {{dataAtualizacao}})</p>`,
      },
      {
        type: 'simulationTable',
        initialInvestment: 10000,
        terms: [12],
        scenarios: [
          { label: 'Poupança', rate: (cdi, selic) => selic > 8.5 ? 0.0617 : selic * 0.70, isTaxable: false },
          { label: 'Tesouro Selic', rate: (cdi, selic) => selic / 100, isTaxable: true },
          { label: 'CDB 100% CDI', rate: (cdi, selic) => cdi / 100, isTaxable: true },
          { label: 'LCI 90% CDI', rate: (cdi, selic) => (cdi / 100) * 0.90, isTaxable: false }
        ]
      },
      {
        type: 'html',
        content: `<h2>Passo 4: Aporte Mensal e Paciência</h2><p>O segredo do sucesso no longo prazo é a <strong>consistência</strong>. Faça aportes mensais, mesmo que pequenos. R$ 200 por mês em um ETF que rende 10% ao ano se tornam mais de R$ 63 mil em 15 anos.</p><p>Não tente "acertar a hora" de comprar ou vender. Apenas invista com regularidade e deixe o tempo e os juros compostos fazerem seu trabalho.</p><h2>Tabela de Imposto de Renda Regressivo (Renda Fixa)</h2><p>Quanto mais tempo você deixa o dinheiro investido, menos imposto paga sobre o rendimento.</p><table><thead><tr><th>Prazo</th><th>Alíquota de IR</th></tr></thead><tbody><tr><td>Até 180 dias (6 meses)</td><td>22,5%</td></tr><tr><td>De 181 a 360 dias (1 ano)</td><td>20%</td></tr><tr><td>De 361 a 720 dias (2 anos)</td><td>17,5%</td></tr><tr><td>Acima de 720 dias</td><td>15%</td></tr></tbody></table>`,
      },
    ],
    conclusion: `<h2>Conclusão</h2><p>Começar a investir é um processo de etapas: arrumar a casa, definir objetivos, abrir conta e, finalmente, escolher produtos simples e diversificados. O mais importante é dar o primeiro passo e manter a consistência dos aportes mensais.</p><p>Seu 'eu' do futuro vai agradecer. Pronto para começar? <a href='/onboarding'>Descubra seu perfil de investidor agora.</a></p>`,
    seoTitle: 'Como Começar a Investir do Zero em 2026 [Guia Simples]',
    seoDescription: 'Guia passo a passo para começar a investir do zero: organize as finanças, defina objetivos, abra conta em corretora e escolha seus primeiros investimentos.',
    faq: [
      {
        question: 'Qual o melhor investimento para iniciantes?',
        answer: 'Para a reserva de emergência, Tesouro Selic ou um CDB com liquidez diária que pague 100% do CDI. Para começar na renda variável, ETFs de índice como BOVA11 e FIIs são mais seguros que ações individuais.'
      },
      {
        question: 'Quanto dinheiro preciso para começar a investir?',
        answer: 'Você pode começar com muito pouco. É possível comprar uma cota de Tesouro Selic por cerca de R$ 140, ou uma cota de FII por menos de R$ 100. O importante é começar e criar o hábito.'
      },
      {
        question: 'É melhor investir ou quitar dívidas?',
        answer: 'Dívidas com juros altos (cartão de crédito, cheque especial) devem ser quitadas antes de qualquer investimento. Os juros que você paga são muito maiores do que qualquer retorno de investimento seguro.'
      },
      {
        question: 'Qual a melhor corretora para iniciantes?',
        answer: 'Corretoras como Nubank (NuInvest), Banco Inter e Rico são boas opções para iniciantes por terem taxa zero na maioria dos produtos e plataformas fáceis de usar.'
      },
      {
        question: 'O que é o FGC (Fundo Garantidor de Créditos)?',
        answer: 'O FGC é uma entidade que garante investimentos como Poupança, CDBs, LCIs e LCAs em até R$ 250.000 por CPF por instituição financeira. É a principal proteção do investidor de renda fixa privada.'
      }
    ],
    category: 'educacao-financeira',
    subcategory: 'primeiros-passos',
    pillar: 'pillar-1-comecando',
    cluster: 'comecando-a-investir',
    tags: ['como começar a investir', 'investir do zero', 'primeiros investimentos', 'guia do investidor iniciante', 'investir com pouco dinheiro'],
    disclaimer: defaultDisclaimer,
  },
  {
    slug: 'quanto-rende-fii-por-mes',
    title: 'Quanto rende um FII por mês? Entenda o Dividend Yield',
    description: 'Descubra quanto rende um FII por mês, como calcular o Dividend Yield (DY) e compare a renda passiva dos FIIs com a renda fixa. Simulação e exemplos práticos.',
    date: '2026-03-20',
    imageId: 'blog-market-trends',
    content: [
      {
          type: 'html',
          content: `<h1>Quanto rende um Fundo Imobiliário (FII) por mês? Guia do Dividend Yield</h1><div class='resumo-rapido'><ul><li>O rendimento de um FII é medido pelo <strong>Dividend Yield (DY)</strong>, que é o total de rendimentos pagos por cota dividido pelo preço da cota.</li><li>Um DY de 0,8% ao mês significa que, para cada R$ 100 investidos, você receberia R$ 0,80 de rendimento mensal isento de IR.</li><li>FIIs de Papel (CRIs) tendem a ter um DY maior, mas com mais risco de crédito. FIIs de Tijolo (imóveis físicos) têm um DY um pouco menor, mas com potencial de valorização do imóvel.</li><li>A Selic alta ({{selicRate}}% a.a.) pressiona o DY dos FIIs para cima, pois eles precisam render mais para competir com a renda fixa.</li><li>Não analise apenas o DY. Um DY muito alto pode indicar problemas no fundo.</li></ul></div><p>Uma das perguntas mais comuns de quem começa a investir em Fundos Imobiliários (FIIs) é: "mas, na prática, quanto eu ganho por mês?". A resposta está em um indicador chamado <strong>Dividend Yield (DY)</strong>.</p><p>Este guia vai te ensinar a calcular, interpretar e comparar o rendimento dos FIIs para tomar decisões mais inteligentes.</p><h2>O que é Dividend Yield (DY)?</h2><p>O Dividend Yield é a forma mais comum de medir o rendimento de um FII. Ele representa a relação entre os dividendos (aluguéis) pagos por uma cota em um determinado período e o preço daquela cota.</p><p>A fórmula é simples:</p><p><code>DY (%) = (Total de Rendimentos Pagos por Cota / Preço da Cota) * 100</code></p><p><strong>Exemplo prático:</strong></p><ul><li>Um FII X custa R$ 100 por cota.</li><li>Nos últimos 12 meses, ele pagou R$ 12,00 em rendimentos por cota.</li><li>Cálculo do DY anual: (R$ 12,00 / R$ 100) * 100 = <strong>12% ao ano</strong>.</li><li>Para saber o rendimento médio mensal, basta dividir por 12: <strong>1% ao mês</strong>.</li></ul><p>Isso significa que, em média, para cada R$ 100 investidos, você teria recebido R$ 1,00 por mês de aluguel, isento de Imposto de Renda.</p><h2>Quanto rende um FII, na prática?</h2><p>O rendimento varia muito dependendo do tipo de FII (papel, tijolo, etc.) e do momento do mercado. Com a taxa Selic em <strong>{{selicRate}}% ao ano</strong>, os investidores esperam um prêmio para investir em FIIs, que são mais arriscados que a renda fixa. (Referência: {{dataAtualizacao}})</p><h3>Tabela de Rendimento Mensal (Exemplos)</h3><p>Veja uma simulação de quanto renderia um investimento de R$ 100.000 em FIIs com diferentes Dividend Yields:</p><table><thead><tr><th>Dividend Yield (Mensal)</th><th>Renda Mensal (R$ 100.000 investidos)</th><th>Equivalente a um CDB de (aprox.)</th></tr></thead><tbody><tr><td>0,7% a.m.</td><td>R$ 700,00</td><td>~105% do CDI</td></tr><tr><td>0,8% a.m.</td><td>R$ 800,00</td><td>~115% do CDI</td></tr><tr><td>0,9% a.m.</td><td>R$ 900,00</td><td>~130% do CDI</td></tr><tr><td>1,0% a.m.</td><td>R$ 1.000,00</td><td>~145% do CDI</td></tr></tbody></table><p><em>Valores aproximados para fins didáticos, considerando IR de 15% sobre o CDB e um CDI de {{cdiRate}}% ao ano. (Referência: {{dataAtualizacao}})</em></p><h2>FIIs de Papel vs. FIIs de Tijolo: Qual Rende Mais?</h2><ul><li><strong>FIIs de Papel (CRIs):</strong> Investem em dívidas do setor imobiliário (títulos). Tendem a ter um <strong>Dividend Yield maior</strong>, pois seus rendimentos são atrelados a indicadores como o IPCA ou o CDI. O risco é maior, pois depende da saúde financeira dos devedores.</li><li><strong>FIIs de Tijolo:</strong> São donos de imóveis físicos (shoppings, galpões, escritórios). Tendem a ter um <strong>Dividend Yield um pouco menor</strong>, mas oferecem potencial de valorização do patrimônio (os imóveis) no longo prazo.</li></ul><h2>Comparativo: Renda Mensal de FII vs. Renda Fixa</h2><p>Para gerar renda, você poderia simplesmente sacar os juros de um investimento em renda fixa. A tabela abaixo compara a renda mensal gerada por um FII com DY de 0,8% a.m. com a renda gerada por R$ 100.000 em produtos de renda fixa.</p><p><em>(Referência: {{dataAtualizacao}})</em></p>`,
      },
      {
          type: 'simulationTable',
          initialInvestment: 100000,
          terms: [12],
          scenarios: [
              { label: 'CDB 100% CDI líquido', rate: (cdi, selic) => cdi / 100, isTaxable: true },
              { label: 'LCI 90% CDI (isento)', rate: (cdi, selic) => (cdi / 100) * 0.90, isTaxable: false },
              { label: 'Tesouro Selic líquido', rate: (cdi, selic) => selic / 100, isTaxable: true },
          ],
      },
      {
          type: 'html',
          content: `<h2>O DY é o único indicador que importa?</h2><p><strong>Não.</strong> Analisar apenas o Dividend Yield é um erro perigoso. Um DY muito alto pode ser um sinal de alerta:</p><ul><li><strong>Preço da cota em queda:</strong> Se o preço da cota cai muito, o DY sobe artificialmente, mesmo que o rendimento pago seja o mesmo. Isso pode indicar problemas no fundo.</li><li><strong>Risco elevado:</strong> FIIs de papel com CRIs de alto risco podem pagar um DY maior para compensar, mas o risco de inadimplência (calote) também é maior.</li><li><strong>Rendimentos não recorrentes:</strong> Às vezes, um FII vende um imóvel e distribui o lucro, gerando um DY pontual altíssimo que não se repetirá.</li></ul><h3>Outros indicadores para analisar junto com o DY:</h3><ul><li><strong>P/VP (Preço / Valor Patrimonial):</strong> Mostra se o FII está sendo negociado com ágio (acima do valor patrimonial) ou deságio (abaixo). Um P/VP abaixo de 1 pode indicar uma oportunidade.</li><li><strong>Vacância:</strong> A porcentagem de imóveis do fundo que estão desocupados. Vacância alta significa menos aluguel e, consequentemente, menor rendimento.</li><li><strong>Qualidade dos ativos e inquilinos:</strong> Imóveis bem localizados e alugados para empresas sólidas oferecem mais segurança.</li></ul>`,
      }
    ],
    conclusion: `<h2>Conclusão</h2><p>O rendimento mensal de um FII é uma combinação do seu Dividend Yield e do valor que você investe. Com a Selic atual, um bom FII precisa oferecer um DY mensal acima de 0,7% para ser competitivo com a renda fixa.</p><p>Lembre-se que o DY é apenas uma foto do momento. O mais importante é escolher FIIs com bons fundamentos (imóveis de qualidade, inquilinos sólidos, gestão competente) para garantir uma renda passiva mais segura e sustentável no longo prazo.</p><p>Quer saber mais? Veja nosso <a href='/o-que-sao-fiis'>guia completo sobre FIIs</a> ou o comparativo <a href='/fii-ou-renda-fixa'>FII vs. Renda Fixa</a>.</p>`,
    seoTitle: 'Quanto Rende um FII por Mês? (Calculadora e Exemplos)',
    seoDescription: 'Descubra quanto rende um FII por mês, como calcular o Dividend Yield (DY), e compare a renda passiva de FIIs com CDB e Tesouro Selic.',
    faq: [
      {
        question: 'Quanto rende R$ 100.000 em FIIs por mês?',
        answer: 'Depende do Dividend Yield (DY) do FII. Um FII com DY de 0,8% ao mês renderia R$ 800 por mês. Um FII com DY de 1,0% ao mês renderia R$ 1.000 por mês. O valor é isento de IR.'
      },
      {
        question: 'Qual o rendimento médio de FIIs?',
        answer: 'O rendimento médio varia muito, mas FIIs de papel costumam render entre 0,9% e 1,2% ao mês em cenários de juros altos. FIIs de tijolo rendem um pouco menos, entre 0,6% e 0,8% ao mês, mas com potencial de valorização da cota.'
      },
      {
        question: 'Como calcular o rendimento de um FII?',
        answer: 'Divida o valor do último rendimento pago por cota pelo preço atual da cota. Exemplo: se o FII pagou R$ 1,00 e a cota custa R$ 100, o DY mensal foi de 1%.'
      },
      {
        question: 'O rendimento do FII é garantido?',
        answer: 'Não. FIIs são renda variável. O valor dos rendimentos pode variar (por inadimplência, vacância, etc.) e o preço da cota oscila na bolsa. Não há garantia do FGC.'
      },
      {
        question: 'É melhor FII ou Tesouro Selic para renda mensal?',
        answer: 'Para renda mensal, FIIs geralmente levam vantagem por terem rendimentos isentos de IR. Para sacar os juros do Tesouro Selic, você pagaria IR sobre o ganho de capital. FIIs, no entanto, têm mais risco e volatilidade.'
      }
    ],
    category: 'renda-variavel',
    subcategory: 'fiis',
    pillar: 'pillar-3-renda-variavel',
    cluster: 'fiis',
    tags: ["quanto rende fii", "dividend yield fii", "renda mensal fii", "fii vs renda fixa", "calcular dy fii"],
    disclaimer: defaultDisclaimer,
  },
   {
    slug: 'o-que-e-tesouro-direto',
    title: 'O que é Tesouro Direto? Como funciona e como investir',
    description: 'Tesouro Direto é o programa do governo federal para venda de títulos públicos a pessoas físicas. Entenda como funciona, quais os tipos e como começar.',
    date: '2026-03-20',
    imageId: 'blog-o-que-e-tesouro-direto',
    content: [
      {
        type: 'html',
        content: `<h1>O que é Tesouro Direto: como funciona, tipos de título e como investir</h1><div class='resumo-rapido'><ul><li>Tesouro Direto é um programa do governo federal para venda de títulos públicos a pessoas físicas</li><li>É o investimento de menor risco do Brasil — garantido pelo Governo Federal</li><li>Tem três tipos principais: Tesouro Selic, Tesouro Prefixado e Tesouro IPCA+</li><li>Tem IR regressivo (22,5% a 15%) e taxa de custódia da B3 de 0,20% ao ano</li><li>Aplicações a partir de R$ 30 — uma das opções mais acessíveis do mercado</li></ul></div><p>Tesouro Direto é um dos investimentos mais seguros e acessíveis do Brasil. Este guia explica o que é, como funciona, os tipos disponíveis e como começar.</p><h2>O que é Tesouro Direto</h2><p>Tesouro Direto é um programa criado em 2002 pelo Tesouro Nacional em parceria com a B3. Você empresta dinheiro ao Governo Federal e recebe juros em troca. A Selic atual está em {{selicRate}}% ao ano (Bacen/SGS, {{dataAtualizacao}}).</p><h2>Tipos de título</h2><h3>Tesouro Selic</h3><p>Rende de acordo com a taxa Selic ({{selicRate}}% ao ano). Ideal para reserva de emergência — liquidez diária sem risco de perda.</p><h3>Tesouro Prefixado</h3><p>Taxa fixa definida na compra. Você sabe exatamente quanto vai receber no vencimento.</p><h3>Tesouro IPCA+</h3><p>Rende IPCA ({{ipcaRate}}% ao ano) mais taxa fixa. Protege o poder de compra no longo prazo.</p><table><thead><tr><th>Título</th><th>Como rende</th><th>Liquidez</th><th>Melhor para</th></tr></thead><tbody><tr><td>Tesouro Selic</td><td>Taxa Selic ({{selicRate}}% a.a.)</td><td>Diária sem perda</td><td>Reserva de emergência</td></tr><tr><td>Tesouro Prefixado</td><td>Taxa fixa na compra</td><td>Diária com marcação</td><td>Médio prazo</td></tr><tr><td>Tesouro IPCA+</td><td>IPCA + taxa fixa</td><td>Diária com marcação</td><td>Longo prazo</td></tr></tbody></table><h2>Custos do Tesouro Direto</h2><p>Taxa de custódia B3: 0,20% ao ano (isenta para até R$ 10.000 no Tesouro Selic). A maioria das corretoras cobra taxa zero. IR regressivo igual ao CDB: de 22,5% a 15%.</p><h2>Tesouro Direto tem FGC?</h2><p>Não — e não precisa. É garantido pelo Governo Federal, com risco de crédito menor que qualquer banco privado.</p><h2>Tesouro Direto vale a pena? Comparação rápida</h2>`
      },
      {
        type: 'simulationTable',
        initialInvestment: 10000,
        terms: [12],
        scenarios: [
          { label: 'Poupança', rate: (cdi, selic) => selic > 8.5 ? 0.0617 : selic * 0.70, isTaxable: false },
          { label: 'Tesouro Selic', rate: (cdi, selic) => selic / 100, isTaxable: true },
          { label: 'CDB 100% CDI', rate: (cdi, selic) => cdi / 100, isTaxable: true },
          { label: 'LCI 90% CDI', rate: (cdi, selic) => (cdi / 100) * 0.90, isTaxable: false }
        ]
      },
      {
        type: 'html',
        content: `<p><em>Referência: Selic de {{selicRate}}% a.a. e CDI de {{cdiRate}}% a.a. (Bacen/SGS, {{dataAtualizacao}}). Sempre compare rendimento líquido.</em></p><h2>Como começar a investir no Tesouro Direto</h2><ol><li>Abra conta em corretora habilitada pelo Tesouro Nacional</li><li>Acesse a área de Tesouro Direto</li><li>Escolha o título adequado ao seu objetivo</li><li>Informe o valor (mínimo ~R$ 30) e confirme</li><li>Acompanhe pelo extrato da corretora ou em tesourodireto.com.br</li></ol>`
      },
    ],
    conclusion: `<h2>Conclusão</h2><p>Tesouro Direto é o ponto de partida mais seguro para qualquer investidor brasileiro. O Tesouro Selic é ideal para reserva de emergência. Para longo prazo, o Tesouro IPCA+ garante crescimento acima da inflação.</p><p><a href='/tesouro-selic-ou-cdb'>Compare Tesouro Selic e CDB</a> ou <a href='/quanto-rende-10000-no-tesouro-selic'>simule quanto rende R$ 10.000 no Tesouro Selic.</a></p><p><em>Referência: Selic de {{selicRate}}% a.a. (Bacen/SGS, {{dataAtualizacao}}).</em></p>`,
    seoTitle: 'O que é Tesouro Direto? Como funciona e como investir',
    seoDescription: 'Tesouro Direto é o investimento garantido pelo governo federal. Veja como funciona, os tipos de título, custos, IR e se vale mais que CDB e poupança.',
    faq: [
      { question: 'O que é Tesouro Direto e como funciona?', answer: 'Tesouro Direto é um programa do Governo Federal que permite a pessoas físicas comprar títulos públicos. Você empresta dinheiro ao governo e recebe juros em troca. É o investimento de menor risco do Brasil.' },
      { question: 'Tesouro Direto tem FGC?', answer: 'Não. É garantido pelo Governo Federal, que tem risco de crédito menor que qualquer banco privado.' },
      { question: 'Qual a diferença entre Tesouro Selic, Prefixado e IPCA+?', answer: 'Tesouro Selic acompanha a taxa básica de juros — ideal para reserva de emergência. Prefixado tem taxa fixa — médio prazo. IPCA+ rende inflação mais taxa fixa — longo prazo.' },
      { question: 'Qual o valor mínimo para investir no Tesouro Direto?', answer: 'A partir de aproximadamente R$ 30, equivalente a 1% do título mais barato disponível.' },
      { question: 'Posso perder dinheiro no Tesouro Direto?', answer: 'Se carregar até o vencimento, não. Se vender antes, pode receber mais ou menos por causa da marcação a mercado. Para o Tesouro Selic esse risco é mínimo.' }
    ],
    category: 'renda-fixa',
    subcategory: 'tesouro-direto',
    pillar: 'pillar-2-renda-fixa',
    cluster: 'tesouro-direto',
    tags: ['Tesouro Direto', 'o que é tesouro direto', 'como investir no tesouro direto', 'tesouro selic', 'tesouro ipca'],
    disclaimer: defaultDisclaimer,
  },
  {
    slug: 'quanto-rende-10000-no-tesouro-selic',
    title: 'Quanto Rende R$ 10.000 no Tesouro Selic? Simulação 2026',
    description: 'Veja quanto rende R$ 10.000 no Tesouro Selic em 1, 6, 12 e 24 meses. Simulação com rendimento líquido após IR, comparação com poupança e CDB.',
    date: '2026-03-20',
    imageId: 'blog-tesouro-10000',
    content: [
        {
            type: 'html',
            content: `<h1>Quanto rende R$ 10.000 no Tesouro Selic? Simulação com rendimento líquido</h1><div class='resumo-rapido'><ul><li>Com Selic a {{selicRate}}% ao ano, R$ 10.000 no Tesouro Selic rendem bem acima da poupança em todos os prazos</li><li>O Tesouro Selic é isento de taxa de custódia para valores até R$ 10.000</li><li>Tem IR regressivo — quanto mais tempo investido, menor a alíquota</li><li>Simulações assumem taxa constante para fins ilustrativos</li></ul></div><p>Esta simulação mostra o rendimento de R$ 10.000 no Tesouro Selic em diferentes prazos com os descontos reais aplicados. Referência: Selic de {{selicRate}}% ao ano (Bacen/SGS, {{dataAtualizacao}}).</p><h2>Premissas da simulação</h2><ul><li><strong>Selic:</strong> {{selicRate}}% ao ano (Bacen/SGS, {{dataAtualizacao}})</li><li><strong>CDI:</strong> {{cdiRate}}% ao ano</li><li><strong>Taxa de custódia B3:</strong> isenta para até R$ 10.000 no Tesouro Selic</li><li><strong>IR:</strong> tabela regressiva da Receita Federal</li></ul><h2>Simulação: quanto rende R$ 10.000 no Tesouro Selic</h2>`
        },
        {
            type: 'simulationTable',
            initialInvestment: 10000,
            terms: [1, 3, 6, 12, 24, 36],
            scenarios: [
                { "label": "Tesouro Selic ({{selicRate}}% a.a.)", rate: (cdi, selic) => selic / 100, "isTaxable": true }
            ]
        },
        {
            type: 'html',
            content: `<h2>Tesouro Selic vs Poupança</h2>`
        },
        {
            type: 'simulationTable',
            initialInvestment: 10000,
            terms: [6, 12, 24, 36],
            showDifference: true,
            scenarios: [
                { "label": "Poupança ({{poupancaRate}}% a.a.)", rate: (cdi, selic) => selic > 8.5 ? 0.0617 : selic * 0.70, "isTaxable": false },
                { "label": "Tesouro Selic líquido", rate: (cdi, selic) => selic / 100, "isTaxable": true }
            ]
        },
        {
            type: 'html',
            content: `<h2>Tesouro Selic vs CDB</h2>`
        },
        {
            type: 'simulationTable',
            initialInvestment: 10000,
            terms: [6, 12, 24],
            scenarios: [
                { "label": "Tesouro Selic líquido", rate: (cdi, selic) => selic / 100, "isTaxable": true },
                { "label": "CDB 100% CDI líquido", rate: (cdi, selic) => cdi / 100, "isTaxable": true },
                { "label": "CDB 110% CDI líquido", rate: (cdi, selic) => (cdi / 100) * 1.10, "isTaxable": true }
            ]
        },
        {
            type: 'html',
            content: `<h2>Vale a pena investir R$ 10.000 no Tesouro Selic?</h2><p>Para reserva de emergência: sim. O Tesouro Selic é o produto mais indicado para dinheiro que você pode precisar a qualquer momento — liquidez diária, risco mínimo e rendimento muito acima da poupança.</p><p>Para objetivos de médio e longo prazo: o Tesouro Selic é uma boa base, mas CDBs com taxas mais altas, LCI/LCA ou Tesouro IPCA+ podem oferecer rendimento maior dependendo do prazo.</p>`,
        }
    ],
    conclusion: `<h2>Conclusão</h2><p>R$ 10.000 no Tesouro Selic com a Selic a {{selicRate}}% ao ano rendem aproximadamente o dobro da poupança em qualquer prazo — mesmo após o IR.</p><p>Quer entender melhor? <a href='/o-que-e-tesouro-direto'>Leia o guia completo sobre o Tesouro Direto.</a> Ou <a href='/tesouro-selic-ou-cdb'>compare Tesouro Selic com CDB.</a></p><p><em>Referência: Selic de {{selicRate}}% a.a. (Bacen/SGS, {{dataAtualizacao}}). Simulações com taxa constante para fins ilustrativos.</em></p>`,
    seoTitle: 'Quanto Rende R$ 10.000 no Tesouro Selic? Simulação 2026',
    seoDescription: 'Simule quanto rende R$ 10.000 no Tesouro Selic em 1, 6, 12 e 24 meses. Veja o rendimento líquido após IR, comparação com poupança e CDB atualizado.',
    faq: [
        { "question": "Quanto rende R$ 10.000 no Tesouro Selic em 12 meses?", "answer": "Com a Selic a {{selicRate}}% ao ano, R$ 10.000 no Tesouro Selic rendem significativamente mais que a poupança ({{poupancaRate}}% a.a.) em 12 meses, após IR de 20%." },
        { "question": "Tesouro Selic rende mais que a poupança?", "answer": "Sim, em todos os cenários com Selic acima de 8,5% ao ano. Com a Selic atual de {{selicRate}}%, o Tesouro Selic rende aproximadamente o dobro da poupança no líquido." },
        { "question": "Tesouro Selic tem taxa de custódia?", "answer": "Sim. A B3 cobra 0,20% ao ano. Porém investimentos de até R$ 10.000 no Tesouro Selic são isentos dessa taxa." },
        { "question": "Posso perder dinheiro no Tesouro Selic?", "answer": "Praticamente não. O Tesouro Selic sobe todos os dias acompanhando a Selic. Mesmo em resgates antecipados, a chance de perda é extremamente baixa." },
        { "question": "Tesouro Selic ou CDB: qual é melhor?", "answer": "Os dois têm rendimento muito próximo. A diferença principal é a garantia: Tesouro é garantido pelo Governo Federal sem limite. CDB tem FGC até R$ 250.000 por instituição." }
    ],
    category: 'renda-fixa',
    subcategory: 'tesouro-direto',
    pillar: 'pillar-2-renda-fixa',
    cluster: 'tesouro-direto',
    tags: ['quanto rende tesouro selic', 'rendimento tesouro selic', 'simulação tesouro selic', 'tesouro selic 10000'],
    disclaimer: defaultDisclaimer,
  },
  {
    slug: 'fii-ou-acao',
    title: 'FII ou Ação: qual é melhor para investir?',
    description: 'FII ou ação: descubra as diferenças em renda, liquidez, risco e tributação. Comparativo completo para ajudar você a decidir qual faz mais sentido na sua carteira.',
    date: '2026-03-20',
    imageId: 'blog-fii-ou-acao',
    content: [
      {
        type: 'html',
        content: `<h1>FII ou ação: qual é melhor para a sua carteira?</h1><div class='resumo-rapido'><ul><li>FIIs pagam renda mensal isenta de IR — ações pagam dividendos esporádicos e tributados</li><li>Ações têm maior potencial de valorização no longo prazo — mas com mais volatilidade</li><li>FIIs são mais indicados para quem busca renda passiva mensal</li><li>Ações são mais indicadas para quem busca crescimento de patrimônio no longo prazo</li><li>A maioria dos investidores combina os dois — a proporção depende do objetivo</li></ul></div><p>FII ou ação é uma das perguntas mais comuns de quem está começando a montar uma carteira de renda variável. A resposta direta é que os dois têm papéis diferentes — e na maioria dos casos, a melhor escolha é ter os dois.</p><p>Este comparativo explica as diferenças reais, quando cada um faz sentido e como pensar na combinação ideal.</p><h2>O que são FIIs e ações</h2><p>FIIs (Fundos de Investimento Imobiliário) são fundos que investem em imóveis ou títulos imobiliários e distribuem os rendimentos mensalmente para os cotistas. São negociados na B3 como ações.</p><p>Ações representam uma fração do capital de uma empresa. Ao comprar uma ação, você se torna sócio da empresa — e participa dos seus lucros (dividendos e JCP) e da valorização do negócio ao longo do tempo.</p><h2>Diferenças principais entre FII e ação</h2><table><thead><tr><th>Característica</th><th>FII</th><th>Ação</th></tr></thead><tbody><tr><td>O que representa</td><td>Fração de um fundo imobiliário</td><td>Fração do capital de uma empresa</td></tr><tr><td>Renda mensal</td><td>Sim — distribuição mensal obrigatória (95% do lucro caixa)</td><td>Não garantida — dividendos esporádicos</td></tr><tr><td>IR sobre rendimentos</td><td>Isento para PF (condições aplicáveis)</td><td>Dividendos isentos; JCP tributado em 15%</td></tr><tr><td>IR sobre ganho de capital</td><td>20% sobre o lucro na venda</td><td>15% sobre o lucro na venda (isenção até R$ 20k/mês)</td></tr><tr><td>Volatilidade</td><td>Média — oscila conforme juros e mercado</td><td>Alta — oscila conforme resultados e mercado</td></tr><tr><td>Potencial de valorização</td><td>Médio — limitado pelo mercado imobiliário</td><td>Alto — sem limite teórico de valorização</td></tr><tr><td>Gestão</td><td>Profissional — gestor cuida do fundo</td><td>Você decide quando comprar e vender</td></tr><tr><td>Valor mínimo</td><td>Preço de 1 cota (pode ser menos de R$ 100)</td><td>Preço de 1 ação (varia muito por empresa)</td></tr></tbody></table><h2>FII: quando faz mais sentido</h2><p>FIIs são mais indicados quando o objetivo principal é <strong>renda passiva mensal</strong>.</p><p>Com FIIs, você recebe rendimentos todo mês — isentos de IR para pessoa física. Isso cria um fluxo de caixa previsível que ações raramente oferecem com a mesma consistência.</p><p>Outros cenários em que FIIs fazem sentido:</p><ul><li>Você quer exposição ao mercado imobiliário sem comprar um imóvel físico</li><li>Prefere gestão profissional dos ativos</li><li>Quer diversificação imediata com pouco capital</li><li>Tem horizonte de médio a longo prazo e tolerância a oscilações moderadas</li></ul><h2>Ação: quando faz mais sentido</h2><p>Ações são mais indicadas quando o objetivo principal é <strong>crescimento de patrimônio no longo prazo</strong>.</p><p>Empresas bem geridas crescem ao longo do tempo — e o preço das suas ações tende a acompanhar esse crescimento. No longo prazo, ações de boas empresas historicamente superam FIIs em valorização total.</p><p>Outros cenários em que ações fazem sentido:</p><ul><li>Você tem horizonte de 10 anos ou mais</li><li>Tolera oscilações maiores no curto prazo</li><li>Quer participar do crescimento de empresas específicas</li><li>Já tem a base de renda fixa e FIIs formada e quer potencializar o crescimento</li></ul><h2>Tributação: FII vs ação</h2><table><thead><tr><th>Evento</th><th>FII</th><th>Ação</th></tr></thead><tbody><tr><td>Rendimento mensal/dividendo</td><td>Isento de IR (PF)</td><td>Dividendos isentos; JCP tributado em 15%</td></tr><tr><td>Ganho de capital na venda</td><td>20% sobre o lucro</td><td>15% sobre o lucro</td></tr><tr><td>Isenção na venda</td><td>Não há isenção</td><td>Isento se vendas no mês somarem até R$ 20.000</td></tr><tr><td>Come-cotas</td><td>Não se aplica</td><td>Não se aplica</td></tr></tbody></table><p>Fonte: Receita Federal do Brasil, março de 2026.</p><p><strong>Ponto de atenção:</strong> na venda de FIIs, o ganho de capital é sempre tributado em 20% — sem isenção para valores menores. Em ações, vendas abaixo de R$ 20.000 no mês são isentas de IR. Para quem opera com valores pequenos, as ações levam vantagem na tributação do ganho de capital.</p><h2>Volatilidade: qual oscila mais?</h2><p>Ações individuais tendem a oscilar mais que FIIs. Uma ação pode subir ou cair 10%, 20% ou mais em um único dia por conta de resultados trimestrais, mudanças de gestão ou fatores macroeconômicos.</p><p>FIIs oscilam menos — mas não são imunes. Em cenários de alta de juros (Selic subindo), FIIs tendem a cair porque o mercado compara o DY com a renda fixa. Com a Selic a {{selicRate}}% ao ano, FIIs com DY abaixo de 10% ficam menos atrativos em comparação.</p><h2>Como combinar FII e ação na carteira</h2><p>Para a maioria dos investidores, a melhor abordagem é combinar os dois — cada um com um papel diferente na carteira:</p><table><thead><tr><th>Perfil</th><th>FIIs</th><th>Ações</th><th>Objetivo</th></tr></thead><tbody><tr><td>Foco em renda</td><td>60% a 70%</td><td>30% a 40%</td><td>Renda mensal + algum crescimento</td></tr><tr><td>Equilibrado</td><td>40% a 50%</td><td>50% a 60%</td><td>Renda + crescimento balanceados</td></tr><tr><td>Foco em crescimento</td><td>20% a 30%</td><td>70% a 80%</td><td>Máximo crescimento de longo prazo</td></tr></tbody></table><p><em>Estas são referências gerais. A alocação ideal depende do seu objetivo, prazo e situação financeira. Não constitui recomendação de investimento.</em></p><h2>Checklist de decisão: FII ou ação?</h2><ul><li>Você quer renda mensal previsível? → <strong>FII</strong></li><li>Seu objetivo principal é crescimento de patrimônio em 10+ anos? → <strong>Ação</strong></li><li>Você tem baixa tolerância a oscilações? → <strong>FII</strong></li><li>Você quer isenção de IR sobre os rendimentos recebidos? → <strong>FII</strong></li><li>Você opera com valores pequenos e quer isenção no ganho de capital? → <strong>Ação</strong> (isenção até R$ 20k/mês)</li><li>Você quer exposição ao mercado imobiliário? → <strong>FII</strong></li><li>Você quer participar do crescimento de empresas específicas? → <strong>Ação</strong></li></ul>`
      }
  ],
  conclusion: `<h2>Conclusão</h2><p>FII e ação não são concorrentes — são complementares. FIIs entregam renda mensal isenta e previsibilidade. Ações entregam potencial de crescimento no longo prazo.</p><p>Para quem está começando, FIIs são geralmente o ponto de entrada mais natural na renda variável — pela renda mensal, pela gestão profissional e pela menor volatilidade em relação a ações individuais.</p><p>Quer entender melhor os FIIs? <a href='/o-que-sao-fiis'>Leia o guia completo sobre FIIs.</a> Ou <a href='/fii-ou-renda-fixa'>veja a comparação entre FII e renda fixa.</a></p>`,
  seoTitle: "FII ou Ação: qual é melhor para investir em 2026?",
  seoDescription: "FII ou ação: compare renda mensal, liquidez, risco, IR e volatilidade. Veja quando cada um compensa e como combinar os dois na carteira.",
  faq: [
    { "question": "FII ou ação: qual é melhor?", "answer": "Depende do objetivo. FIIs são melhores para renda passiva mensal isenta de IR. Ações são melhores para crescimento de patrimônio no longo prazo. A maioria dos investidores combina os dois." },
    { "question": "FII paga mais dividendos que ação?", "answer": "FIIs pagam rendimentos mensais obrigatórios (95% do lucro caixa), geralmente entre 0,7% e 1,1% ao mês por cota. Ações pagam dividendos de forma esporádica e variável — dependem da política de distribuição de cada empresa." },
    { "question": "FII ou ação: qual tem menos IR?", "answer": "FIIs têm rendimentos mensais isentos de IR para PF, mas ganho de capital de 20% sem isenção. Ações têm dividendos isentos e ganho de capital de 15% — com isenção para vendas até R$ 20.000 por mês." },
    { "question": "FII oscila menos que ação?", "answer": "Em geral, sim. FIIs tendem a ter menor volatilidade que ações individuais. Mas ambos são renda variável e oscilam — especialmente FIIs em cenários de alta de juros." },
    { "question": "Posso ter FII e ação ao mesmo tempo?", "answer": "Sim — e é o que a maioria dos investidores faz. FIIs para renda mensal e ações para crescimento de longo prazo é uma combinação eficiente e complementar." },
    { "question": "Qual o valor mínimo para investir em FII ou ação?", "answer": "Os dois têm valor mínimo equivalente ao preço de uma cota ou ação. Muitos FIIs têm cotas abaixo de R$ 100. Ações variam bastante — algumas custam menos de R$ 10, outras centenas de reais." },
    { "question": "FII é mais seguro que ação?", "answer": "Em geral, FIIs tendem a ter menor volatilidade que ações individuais. Mas ambos são renda variável — o preço oscila e não há garantia de rendimento. Nenhum dos dois tem a segurança da renda fixa com FGC ou Tesouro Direto." }
  ],
  category: 'renda-variavel',
  subcategory: 'comparativos',
  pillar: 'pillar-3-renda-variavel',
  cluster: 'fiis',
  tags: ["FII ou ação", "FII vs ação", "fundos imobiliários ou ações", "comparativo renda variável"],
  disclaimer: "Este conteúdo é educativo e não constitui recomendação de investimento. FIIs e ações são renda variável — o preço oscila e rentabilidades passadas não garantem resultados futuros. Consulte um profissional certificado para orientação personalizada."
  },
  {
      slug: 'guia-renda-variavel',
      title: 'Guia Completo de Renda Variável: o que é, como funciona e como investir',
      description: 'Guia completo sobre renda variável: o que é, como funciona, quais os produtos disponíveis no Brasil, riscos e como começar a investir com segurança.',
      date: '2026-03-20',
      imageId: 'blog-guia-renda-variavel',
      content: [
      {
          type: 'html',
          content: `<h1>Guia completo de renda variável: tudo que você precisa saber para investir com consciência</h1><div class='resumo-rapido'><ul><li>Renda variável é qualquer investimento cujo retorno não é conhecido antecipadamente</li><li>Os principais produtos são: ações, FIIs, ETFs, BDRs e fundos multimercado</li><li>Tem potencial de retorno maior que renda fixa no longo prazo — mas com mais risco</li><li>Não tem cobertura do FGC — o risco de perda é real</li><li>Recomendada apenas após ter reserva de emergência formada em renda fixa</li></ul></div><p>Renda variável é o caminho para quem quer potencializar o crescimento do patrimônio no longo prazo. Mas também é o caminho onde mais pessoas perdem dinheiro por falta de entendimento.</p><p>Este guia explica o que é, como funciona, quais os produtos disponíveis e como começar com consciência.</p><h2>O que é renda variável</h2><p>Renda variável é qualquer investimento cujo retorno não é conhecido antecipadamente e pode variar — para cima ou para baixo — dependendo do desempenho do ativo e do mercado.</p><p>Diferente da renda fixa, onde você sabe de antemão como o dinheiro vai render, na renda variável o retorno é incerto. Você pode ganhar muito, pouco ou até perder parte do capital investido.</p><p>Essa incerteza é compensada pelo potencial de retorno maior no longo prazo. Historicamente, investimentos em renda variável superam a renda fixa em períodos de 10 anos ou mais — mas com muito mais oscilação no caminho.</p><h2>Como funciona a renda variável no Brasil</h2><p>No Brasil, a renda variável é negociada principalmente na B3 (Brasil, Bolsa, Balcão) — a bolsa de valores brasileira. É por meio da B3 que você compra e vende ações, FIIs, ETFs e BDRs.</p><p>Para investir, você precisa de conta em uma corretora habilitada na B3. As ordens de compra e venda são executadas pelo home broker da corretora durante o horário de mercado — das 10h às 17h em dias úteis para o mercado à vista.</p><h2>Principais produtos de renda variável</h2><h3>Ações</h3><p>Representam uma fração do capital de uma empresa. Ao comprar uma ação, você se torna sócio da empresa e participa dos seus lucros (dividendos e JCP) e da valorização do negócio.</p><p>Potencial de retorno: ilimitado no longo prazo — empresas bem geridas crescem e suas ações acompanham. Risco: alto — o preço pode cair muito por resultados ruins, crises ou fatores externos.</p><h3>FIIs — Fundos de Investimento Imobiliário</h3><p>Fundos que investem em imóveis ou títulos imobiliários e distribuem rendimentos mensais isentos de IR para pessoa física. Têm menor volatilidade que ações individuais e são ideais para renda passiva mensal.</p><p>Veja o <a href='/o-que-sao-fiis'>guia completo sobre FIIs.</a></p><h3>ETFs — Exchange Traded Funds</h3><p>Fundos de índice negociados na bolsa. Replicam uma carteira diversificada automaticamente — como o Ibovespa (BOVA11) ou o S&P 500 americano (IVVB11). Têm taxa de administração baixa e são ideais para quem quer diversificação com simplicidade.</p><p>Veja o <a href='/o-que-sao-etfs'>guia completo sobre ETFs.</a></p><h3>BDRs — Brazilian Depositary Receipts</h3><p>Certificados que representam ações de empresas estrangeiras negociadas na B3. Permitem investir em Apple, Amazon, Google e outras empresas internacionais sem precisar abrir conta no exterior.</p><h3>Fundos multimercado</h3><p>Fundos que combinam diferentes classes de ativos — renda fixa, ações, câmbio e derivativos. Têm gestão ativa e buscam retorno acima do CDI. Cobrança de come-cotas semestralmente.</p><h2>Comparativo dos principais produtos de renda variável</h2><table><thead><tr><th>Produto</th><th>Renda mensal</th><th>Volatilidade</th><th>IR sobre ganho</th><th>Diversificação</th><th>Indicado para</th></tr></thead><tbody><tr><td>Ações</td><td>Dividendos (esporádicos)</td><td>Alta</td><td>15% (isenção até R$ 20k/mês)</td><td>Baixa por ativo</td><td>Crescimento LP</td></tr><tr><td>FIIs</td><td>Sim — mensal isento</td><td>Média</td><td>20% (sem isenção)</td><td>Alta por fundo</td><td>Renda passiva</td></tr><tr><td>ETFs</td><td>Não (reinveste)</td><td>Média</td><td>15% (sem isenção)</td><td>Alta automática</td><td>Crescimento simples</td></tr><tr><td>BDRs</td><td>Dividendos (esporádicos)</td><td>Alta + câmbio</td><td>15% (isenção até R$ 20k/mês)</td><td>Baixa por ativo</td><td>Diversificação internacional</td></tr><tr><td>Fundos multimercado</td><td>Não</td><td>Variável</td><td>15% a 22,5% (come-cotas)</td><td>Alta automática</td><td>Gestão ativa</td></tr></tbody></table><h2>Riscos da renda variável</h2><p><strong>Risco de mercado:</strong> o preço dos ativos oscila diariamente. Crises econômicas, mudanças de política monetária e eventos globais podem causar quedas expressivas.</p><p><strong>Risco de empresa (ações):</strong> resultados ruins, mudança de gestão, escândalos ou falência podem fazer o preço de uma ação despencar — ou ir a zero.</p><p><strong>Risco de liquidez:</strong> ativos pouco negociados podem ser difíceis de vender sem impactar o preço.</p><p><strong>Risco cambial (BDRs):</strong> além do risco do ativo, há exposição à variação do dólar — que pode aumentar ou reduzir o retorno em reais.</p><p><strong>Risco emocional:</strong> o maior risco de todos. Vender na queda por medo ou comprar na alta por euforia são os erros mais comuns e mais prejudiciais ao patrimônio.</p><h2>Tributação na renda variável</h2><table><thead><tr><th>Produto</th><th>Rendimento/Dividendo</th><th>Ganho de capital</th><th>Isenção</th></tr></thead><tbody><tr><td>Ações</td><td>Dividendos isentos; JCP 15%</td><td>15%</td><td>Vendas até R$ 20k/mês</td></tr><tr><td>FIIs</td><td>Isento para PF</td><td>20%</td><td>Não há</td></tr><tr><td>ETFs de ações</td><td>Não distribui</td><td>15%</td><td>Não há</td></tr><tr><td>BDRs</td><td>Dividendos: 30% retido na fonte EUA</td><td>15%</td><td>Vendas até R$ 20k/mês</td></tr><tr><td>Fundos multimercado</td><td>Não distribui</td><td>15% a 22,5%</td><td>Come-cotas semestral</td></tr></tbody></table><p>Fonte: Receita Federal do Brasil, março de 2026.</p><h2>Renda variável vs renda fixa: quando escolher cada uma</h2><p>Com a Selic a {{selicRate}}% ao ano, a renda fixa brasileira oferece retorno real elevado com risco baixo. Isso torna a comparação com renda variável mais exigente — para justificar o risco adicional, a renda variável precisa entregar retorno superior no longo prazo.</p><p>A lógica de alocação recomendada:</p><ul><li><strong>Base (reserva de emergência):</strong> sempre em renda fixa com liquidez</li><li><strong>Objetivos de curto e médio prazo:</strong> renda fixa</li><li><strong>Objetivos de longo prazo (5+ anos):</strong> pode incluir renda variável</li><li><strong>Quanto de renda variável:</strong> depende do perfil — conservador 0% a 20%, moderado 30% a 50%, arrojado 60% a 80%</li></ul><h2>Como começar a investir em renda variável</h2><p><strong>Passo 1 — Forme a reserva de emergência primeiro</strong><br>Sem reserva de emergência, qualquer imprevisto pode te forçar a vender na queda. Monte de 3 a 6 meses de despesas em renda fixa com liquidez diária antes de qualquer passo em renda variável.</p><p><strong>Passo 2 — Abra conta em corretora habilitada na B3</strong><br>Escolha uma corretora regulamentada pela CVM com acesso completo ao mercado de renda variável.</p><p><strong>Passo 3 — Comece pelos produtos mais simples</strong><br>ETFs de índice (como BOVA11 e IVVB11) e FIIs são pontos de entrada mais adequados para iniciantes do que ações individuais — pela diversificação automática e menor necessidade de análise.</p><p><strong>Passo 4 — Invista com regularidade — não tente acertar o momento</strong><br>Aportes mensais regulares (independente do preço) são mais eficientes que tentar comprar na baixa e vender na alta. Essa estratégia se chama custo médio e reduz o impacto da volatilidade.</p><p><strong>Passo 5 — Mantenha o horizonte de longo prazo</strong><br>Renda variável funciona no longo prazo. Quedas de 20%, 30% ou mais são normais e fazem parte do processo. Quem mantém a estratégia e não vende na queda historicamente recupera e supera.</p><h2>Erros mais comuns em renda variável</h2><p><strong>Começar sem reserva de emergência</strong><br>O erro mais crítico. Uma emergência pode te forçar a vender no pior momento.</p><p><strong>Concentrar em um único ativo</strong><br>Colocar tudo em uma ação é o oposto de diversificação. Se a empresa tiver problemas, você perde muito. ETFs e FIIs resolvem isso automaticamente.</p><p><strong>Vender na queda por medo</strong><br>Quedas são temporárias na maioria dos casos. Vender realiza o prejuízo e impede a recuperação.</p><p><strong>Comprar na euforia</strong><br>Entrar no mercado quando todo mundo está falando de ganhos fáceis é o momento de mais risco — não de oportunidade.</p><p><strong>Ignorar os custos</strong><br>Taxa de corretagem, emolumentos da B3 e IR impactam o retorno real. Considere sempre o custo total antes de operar.</p>`
      }
  ],
  conclusion: `<h2>Conclusão</h2><p>Renda variável é uma ferramenta poderosa para construção de patrimônio no longo prazo — mas exige paciência, disciplina e entendimento dos riscos.</p><p>Comece pela renda fixa, forme a reserva de emergência, entenda os produtos e só então explore renda variável com uma parcela que você pode deixar parada por anos.</p><p>Explore os guias específicos para cada etapa: <a href='/o-que-sao-fiis'>FIIs</a>, <a href='/o-que-sao-etfs'>ETFs</a>, <a href='/fii-ou-acao'>FII ou ação</a> e <a href='/renda-fixa-ou-renda-variavel'>renda fixa ou renda variável.</a></p>`,
  seoTitle: "Guia Completo de Renda Variável 2026: tudo que você precisa saber",
  seoDescription: "Tudo sobre renda variável: ações, FIIs, ETFs, BDRs, riscos, tributação e como começar a investir. Guia completo para iniciantes e intermediários.",
  faq: [
      { "question": "O que é renda variável?", "answer": "Renda variável é qualquer investimento cujo retorno não é conhecido antecipadamente e pode variar para cima ou para baixo. Os principais produtos são ações, FIIs, ETFs e BDRs." },
      { "question": "Renda variável é arriscada?", "answer": "Sim, mais que renda fixa. O preço dos ativos oscila e você pode perder parte do capital. Não tem cobertura do FGC. Por isso é recomendada apenas após ter reserva de emergência formada." },
      { "question": "Qual o melhor produto de renda variável para iniciantes?", "answer": "ETFs de índice (como BOVA11) e FIIs são os mais indicados para iniciantes pela diversificação automática e menor necessidade de análise individual de empresas." },
      { "question": "Preciso de muito dinheiro para investir em renda variável?", "answer": "Não. ETFs e FIIs têm cotas que podem custar menos de R$ 100. Algumas ações também têm preços baixos. O valor mínimo é o preço de uma cota ou ação." },
      { "question": "Renda variável tem Imposto de Renda?", "answer": "Sim. Ganho de capital em ações é tributado em 15% (isenção para vendas até R$ 20k/mês). FIIs têm 20% sobre ganho de capital — sem isenção. Rendimentos de FIIs são isentos para PF. Dividendos de ações são isentos." },
      { "question": "Quando devo começar a investir em renda variável?", "answer": "Após ter as dívidas caras quitadas e a reserva de emergência formada. Renda variável é para o dinheiro que você não vai precisar por pelo menos 5 anos." },
      { "question": "O que é B3?", "answer": "B3 é a bolsa de valores brasileira — Brasil, Bolsa, Balcão. É onde são negociados ações, FIIs, ETFs, BDRs e outros ativos de renda variável. Para investir, você precisa de conta em corretora habilitada na B3." }
  ],
  category: 'renda-variavel',
  subcategory: 'guia',
  pillar: 'pillar-3-renda-variavel',
  cluster: 'guia-renda-variavel',
  tags: ["renda variável", "guia renda variável", "ações FIIs ETFs", "como investir renda variável", "bolsa de valores"],
  disclaimer: "Este conteúdo é educativo e não constitui recomendação de investimento. Renda variável envolve risco de perda de capital. Rentabilidades passadas não garantem resultados futuros. Consulte um profissional certificado para orientação personalizada."
  },
  {
      slug: 'como-organizar-financas-pessoais',
      title: 'Como Organizar Finanças Pessoais do Zero: guia prático',
      description: 'Aprenda como organizar suas finanças pessoais do zero com um método simples e prático. Controle de gastos, orçamento, dívidas e como começar a investir.',
      date: '2026-03-20',
      imageId: 'blog-organizar-financas-pessoais',
      content: [
      {
          type: 'html',
          content: `<h1>Como organizar finanças pessoais do zero: método simples e prático</h1><div class='resumo-rapido'><ul><li>Organizar finanças começa por entender quanto entra e quanto sai todo mês</li><li>O método 50-30-20 é um ponto de partida simples: 50% necessidades, 30% desejos, 20% poupança</li><li>Antes de investir, quite dívidas com juros altos e monte a reserva de emergência</li><li>Consistência importa mais do que perfeição — um orçamento simples que você usa é melhor que um complexo que abandona</li><li>Automatizar transferências para poupança e investimentos reduz a dependência de força de vontade</li></ul></div><p>Organizar finanças pessoais não exige planilhas complexas nem conhecimento avançado. Exige honestidade sobre quanto você ganha, quanto gasta e para onde o dinheiro vai.</p><p>Este guia mostra um método simples para começar do zero — independente da sua renda atual.</p><h2>Por onde começar: o diagnóstico financeiro</h2><p>Antes de qualquer planejamento, você precisa entender sua situação atual. Isso exige responder três perguntas com honestidade:</p><p><strong>1. Quanto entra por mês?</strong><br>Some todas as fontes de renda: salário, freelances, aluguéis, pensão, benefícios. Use o valor líquido — o que cai na conta, não o bruto.</p><p><strong>2. Quanto sai por mês?</strong><br>Some todos os gastos: aluguel, alimentação, transporte, contas fixas, assinaturas, lazer, compras. Inclua gastos variáveis e ocasionais divididos por 12.</p><p><strong>3. Qual é o saldo?</strong><br>Renda - Gastos = Saldo. Se o saldo é negativo, você gasta mais do que ganha. Se é positivo, esse é o dinheiro disponível para investir.</p><h2>O método 50-30-20: um ponto de partida simples</h2><p>O método 50-30-20 divide a renda em três categorias:</p><table><thead><tr><th>Categoria</th><th>Percentual</th><th>O que inclui</th><th>Exemplos</th></tr></thead><tbody><tr><td>Necessidades</td><td>50%</td><td>Gastos essenciais e fixos</td><td>Aluguel, alimentação, transporte, contas, plano de saúde</td></tr><tr><td>Desejos</td><td>30%</td><td>Gastos não essenciais mas planejados</td><td>Lazer, restaurantes, streaming, roupas, viagens</td></tr><tr><td>Poupança e investimentos</td><td>20%</td><td>Reserva de emergência e investimentos</td><td>Tesouro Selic, CDB, LCI, previdência</td></tr></tbody></table><p>Exemplo prático: renda líquida de R$ 5.000 por mês.</p><ul><li>Necessidades: até R$ 2.500</li><li>Desejos: até R$ 1.500</li><li>Poupança e investimentos: R$ 1.000</li></ul><p>Esse método não precisa ser seguido à risca — é um ponto de referência. Se suas necessidades consomem 60% da renda, o objetivo é reduzir progressivamente essa proporção ao longo do tempo.</p><h2>Como fazer um orçamento mensal</h2><p><strong>Passo 1 — Liste todas as receitas</strong><br>Anote todas as fontes de renda e os valores líquidos mensais.</p><p><strong>Passo 2 — Liste todos os gastos por categoria</strong><br>Divida os gastos em categorias: moradia, alimentação, transporte, saúde, educação, lazer, assinaturas, vestuário, outros.</p><p><strong>Passo 3 — Identifique gastos desnecessários</strong><br>Revise cada categoria e identifique o que pode ser reduzido ou eliminado sem impacto real na qualidade de vida. Assinaturas esquecidas, gastos por impulso e conveniências substituíveis são os alvos mais comuns.</p><p><strong>Passo 4 — Defina metas para cada categoria</strong><br>Estabeleça limites por categoria para o mês seguinte. Comece com ajustes pequenos — cortar R$ 200 de lazer e R$ 150 de alimentação fora já representa R$ 350 a mais para investir.</p><p><strong>Passo 5 — Acompanhe semanalmente</strong><br>Uma revisão semanal de 10 minutos evita surpresas no final do mês. Use um app, planilha ou caderno — o que funcionar melhor para o seu hábito.</p><h2>A ordem correta para organizar as finanças</h2><p>Existe uma sequência lógica que faz as coisas funcionarem melhor:</p><table><thead><tr><th>Etapa</th><th>O que fazer</th><th>Por quê vem primeiro</th></tr></thead><tbody><tr><td>1</td><td>Parar de acumular novas dívidas caras</td><td>Dívida com juros altos cancela qualquer progresso</td></tr><tr><td>2</td><td>Quitar dívidas com juros acima de 1% ao mês</td><td>Cartão e cheque especial cobram mais que qualquer investimento rende</td></tr><tr><td>3</td><td>Montar reserva de emergência mínima (1 mês de despesas)</td><td>Protege contra imprevistos que jogam tudo fora</td></tr><tr><td>4</td><td>Quitar demais dívidas</td><td>Libera renda para investir</td></tr><tr><td>5</td><td>Completar reserva de emergência (3 a 6 meses)</td><td>Base de segurança antes de investir</td></tr><tr><td>6</td><td>Começar a investir</td><td>Com a base segura, o dinheiro trabalha por você</td></tr></tbody></table><h2>Como controlar os gastos no dia a dia</h2><p>O controle de gastos não precisa ser obsessivo — precisa ser consistente. Algumas estratégias que funcionam:</p><p><strong>Regra das 24 horas para compras não planejadas</strong><br>Antes de comprar qualquer item não essencial acima de R$ 100, espere 24 horas. A maioria dos impulsos passa nesse tempo.</p><p><strong>Envelope mental por categoria</strong><br>Defina um limite para cada categoria e acompanhe o saldo disponível. Quando o envelope de lazer esgotar, pare até o mês seguinte.</p><p><strong>Automatize o que é prioritário</strong><br>Configure uma transferência automática para a conta de investimentos no dia do pagamento do salário. Dinheiro que sai antes de você ver raramente faz falta.</p><p><strong>Revise assinaturas a cada 3 meses</strong><br>Liste todos os débitos automáticos e assinaturas. Cancele o que não usa. É comum encontrar R$ 100 a R$ 300 mensais em serviços esquecidos.</p><h2>Metas financeiras: como definir e acompanhar</h2><p>Metas financeiras concretas são mais eficazes do que objetivos vagos como "economizar mais".</p><p>Exemplo de metas concretas:</p><ul><li>"Montar reserva de emergência de R$ 12.000 em 18 meses" → poupar R$ 667 por mês</li><li>"Quitar R$ 8.000 de dívida em 8 meses" → pagar R$ 1.000 por mês além do mínimo</li><li>"Viajar com R$ 5.000 daqui a 10 meses" → guardar R$ 500 por mês em conta separada</li></ul><p>Separe uma conta ou investimento para cada meta. Misturar tudo em uma única conta dificulta o acompanhamento e aumenta o risco de usar o dinheiro para outro fim.</p><h2>Ferramentas para organizar finanças pessoais</h2><p>Não existe ferramenta certa — existe a que você vai usar com consistência:</p><ul><li><strong>Planilha simples:</strong> Google Sheets ou Excel com receitas, gastos e saldo. Baixo custo, alta flexibilidade.</li><li><strong>Aplicativos de finanças:</strong> Mobills, Organizze, GuiaBolso — conectam ao banco e categorizam gastos automaticamente.</li><li><strong>Caderno/papel:</strong> funciona para quem prefere algo tangível e sem distrações digitais.</li><li><strong>Extrato bancário:</strong> mesmo sem ferramentas extras, revisar o extrato mensalmente já é um grande avanço.</li></ul>`
      }
  ],
  conclusion: `<h2>Conclusão</h2><p>Organizar finanças pessoais não é sobre restrição — é sobre intencionalidade. Saber onde o dinheiro vai e decidir conscientemente para onde ele deve ir.</p><p>Comece simples: diagnóstico, orçamento básico, quite as dívidas caras, monte a reserva de emergência. O resto vem naturalmente.</p><p>Com as finanças organizadas, o próximo passo é começar a investir. <a href='/como-comecar-a-investir'>Veja o guia completo de como começar a investir do zero.</a></p>`,
  seoTitle: "Como Organizar Finanças Pessoais do Zero: guia completo 2026",
  seoDescription: "Aprenda a organizar suas finanças pessoais com método simples: controle de gastos, orçamento mensal, como sair das dívidas e começar a investir.",
  faq: [
      { "question": "Como começar a organizar as finanças pessoais do zero?", "answer": "Comece pelo diagnóstico: some tudo que entra e tudo que sai por mês. Se o saldo for negativo, identifique onde cortar. Se for positivo, direcione para quitar dívidas ou formar reserva de emergência. Use o método 50-30-20 como referência inicial." },
      { "question": "O que é o método 50-30-20?", "answer": "É um método simples de orçamento que divide a renda em três categorias: 50% para necessidades (aluguel, alimentação, contas), 30% para desejos (lazer, restaurantes) e 20% para poupança e investimentos." },
      { "question": "Devo investir ou quitar dívidas primeiro?", "answer": "Dívidas com juros acima de 1% ao mês (cartão de crédito, cheque especial) devem ser quitadas primeiro — os juros são maiores que qualquer rendimento de investimento conservador. Para dívidas de juros baixos (financiamento imobiliário), você pode investir e pagar simultaneamente." },
      { "question": "Como controlar gastos sem planilha complexa?", "answer": "O método mais simples é revisar o extrato bancário uma vez por semana e categorizar os gastos. Aplicativos como Mobills e Organizze fazem isso automaticamente. O importante é ter algum acompanhamento consistente." },
      { "question": "Quanto devo guardar por mês?", "answer": "O ideal é 20% da renda líquida. Se não for possível agora, comece com o que for possível — R$ 100, R$ 200. O hábito de guardar é mais importante do que o valor inicial." },
      { "question": "Como organizar finanças com renda variável ou irregular?", "answer": "Use o mês de menor renda como base para o orçamento fixo. Nos meses de renda maior, destine o excedente primeiro para reserva de emergência e depois para investimentos. Nunca comprometa gastos fixos com renda variável." },
      { "question": "Qual app é melhor para controlar finanças pessoais?", "answer": "Depende do hábito. Mobills e Organizze conectam ao banco e categorizam automaticamente. GuiaBolso tem boa integração bancária. Para quem prefere controle manual, uma planilha simples no Google Sheets funciona muito bem." }
  ],
  category: 'educacao-financeira',
  subcategory: 'organizacao-financeira',
  pillar: 'pillar-4-educacao-financeira',
  cluster: 'educacao-financeira',
  tags: ["como organizar finanças pessoais", "organizar finanças", "controle financeiro", "orçamento pessoal", "educação financeira"],
  disclaimer: "Este conteúdo é educativo e não constitui recomendação de investimento ou assessoria financeira personalizada. Consulte um profissional certificado para orientação adequada à sua situação."
  },
  {
      slug: 'guia-educacao-financeira',
      title: 'Guia Completo de Educação Financeira: organize, poupe e invista',
      description: 'Guia completo de educação financeira: como organizar as finanças, sair das dívidas, montar reserva de emergência e começar a investir com segurança.',
      date: '2026-03-20',
      imageId: 'blog-guia-educacao-financeira',
      content: [
      {
          type: 'html',
          content: `<h1>Guia completo de educação financeira: organize, poupe e invista com consciência</h1><div class='resumo-rapido'><ul><li>Educação financeira é o conjunto de conhecimentos e hábitos que permitem tomar boas decisões com dinheiro</li><li>O ponto de partida é entender quanto entra, quanto sai e para onde vai o dinheiro</li><li>A sequência correta: organize → quite dívidas → monte reserva → invista</li><li>Investir antes de ter a base financeira organizada raramente funciona no longo prazo</li><li>Consistência e paciência importam mais do que encontrar o investimento perfeito</li></ul></div><p>Educação financeira não é sobre ser rico — é sobre ter controle. Sobre não ser surpreendido por imprevistos, não depender de crédito para emergências e ter dinheiro trabalhando por você ao longo do tempo.</p><p>Este guia reúne tudo que você precisa para construir uma base financeira sólida do zero.</p><h2>O que é educação financeira</h2><p>Educação financeira é o conjunto de conhecimentos, hábitos e habilidades que permite tomar decisões conscientes e eficientes com dinheiro — seja para gastar, poupar, investir ou se proteger de riscos.</p><p>Não é um dom natural. É uma habilidade que se aprende e se pratica. E quanto mais cedo você começa, mais tempo os efeitos positivos têm para se acumular.</p><h2>Por que educação financeira importa</h2><p>Sem educação financeira, a tendência é seguir o padrão mais comum: gastar tudo que ganha, usar crédito rotativo quando falta, acumular dívidas e chegar à aposentadoria sem reservas.</p><p>Com educação financeira, você consegue:</p><ul><li>Viver dentro das suas possibilidades sem abrir mão de qualidade de vida</li><li>Ter uma reserva para imprevistos sem recorrer a empréstimos</li><li>Construir patrimônio ao longo do tempo com aportes regulares</li><li>Tomar decisões de consumo e investimento com base em dados — não em impulso</li><li>Reduzir o estresse financeiro que afeta saúde e relacionamentos</li></ul><h2>Os pilares da saúde financeira</h2><table><thead><tr><th>Pilar</th><th>O que significa</th><th>Como desenvolver</th></tr></thead><tbody><tr><td>Controle</td><td>Saber quanto entra e quanto sai</td><td>Orçamento mensal, acompanhamento de gastos</td></tr><tr><td>Proteção</td><td>Ter reserva para imprevistos</td><td>Reserva de emergência de 3 a 6 meses</td></tr><tr><td>Liberdade de dívidas</td><td>Não dever com juros altos</td><td>Quitar cartão, cheque especial e empréstimos caros</td></tr><tr><td>Crescimento</td><td>Fazer o dinheiro trabalhar por você</td><td>Investimentos regulares em renda fixa e variável</td></tr><tr><td>Proteção futura</td><td>Garantir renda na aposentadoria</td><td>Previdência, investimentos de longo prazo</td></tr></tbody></table><h2>A sequência correta da organização financeira</h2><p>Existe uma ordem lógica que faz o sistema funcionar. Pular etapas raramente funciona:</p><h3>Etapa 1 — Diagnóstico e orçamento</h3><p>Antes de qualquer decisão, você precisa saber onde está. Some toda a renda líquida mensal. Liste todos os gastos por categoria. Calcule o saldo (renda menos gastos).</p><p>Se o saldo for negativo: você precisa cortar gastos ou aumentar renda antes de qualquer outro passo. Se for positivo: esse é o dinheiro disponível para as próximas etapas.</p><h3>Etapa 2 — Controle e redução de gastos</h3><p>Identifique gastos desnecessários — assinaturas esquecidas, gastos por impulso, conveniências substituíveis. Uma redução de R$ 300 a R$ 500 mensais já muda significativamente o cenário.</p><p>Use o método 50-30-20 como referência: 50% necessidades, 30% desejos, 20% poupança. Adapte à sua realidade — o objetivo é aumentar progressivamente a fatia de poupança.</p><h3>Etapa 3 — Quite as dívidas caras</h3><p>Dívidas com juros acima de 1% ao mês (cartão de crédito, cheque especial, empréstimos pessoais) devem ser quitadas antes de qualquer investimento. Os juros dessas dívidas são maiores que qualquer rendimento que um investimento conservador entregaria.</p><p>Estratégia recomendada: quite primeiro a dívida com maior taxa de juros (método avalanche). Ou quite primeiro a menor dívida para ganhar motivação (método bola de neve). Ambos funcionam — o que importa é começar.</p><h3>Etapa 4 — Monte a reserva de emergência</h3><p>Com as dívidas caras quitadas, o próximo passo é montar uma reserva de emergência de 3 a 6 meses de despesas mensais em produto com liquidez diária.</p><p>Onde guardar: Tesouro Selic ou CDB de liquidez diária. Os dois têm segurança alta, liquidez imediata e rendem muito mais que a poupança com a Selic a {{selicRate}}% ao ano.</p><h3>Etapa 5 — Comece a investir</h3><p>Com a base organizada, você pode investir com tranquilidade — sem o risco de resgatar no pior momento por uma emergência. Comece pela renda fixa e evolua conforme seu conhecimento e tolerância a risco crescem.</p><h2>Conceitos fundamentais de educação financeira</h2><h3>Juros compostos: o tempo é seu maior aliado</h3><p>Juros compostos são juros que incidem sobre juros — a cada período, o rendimento anterior é somado ao capital e gera novos rendimentos. Com o tempo, o efeito é exponencial.</p><p>Quem começa a investir R$ 500 por mês aos 25 anos acumula aproximadamente 3 vezes mais do que quem começa com o mesmo valor aos 35 anos — com a mesma taxa e o mesmo esforço mensal. O tempo é o fator mais poderoso.</p><h3>Inflação: o inimigo silencioso do dinheiro parado</h3><p>Inflação é a perda de poder de compra do dinheiro ao longo do tempo. Com IPCA a {{ipcaRate}}% ao ano, R$ 1.000 parados na conta corrente valem aproximadamente R$ {{ipcaRate}} a menos em poder de compra após 12 meses.</p><p>Por isso investir é necessário — não opcional. Dinheiro parado perde valor. O objetivo mínimo de qualquer investimento é superar a inflação.</p><h3>Risco e retorno: a relação inevitável</h3><p>Quanto maior o potencial de retorno, maior o risco. Não existe investimento com retorno alto e risco zero — quem promete isso está mentindo.</p><p>A chave é encontrar o equilíbrio adequado para o seu perfil: renda fixa para a base de segurança, renda variável para objetivos de longo prazo onde você pode aceitar oscilações.</p><h3>Diversificação: não colocar todos os ovos na mesma cesta</h3><p>Diversificar significa distribuir o dinheiro entre diferentes produtos, emissores e classes de ativos. Isso reduz o impacto de problemas em um único investimento sem necessariamente reduzir o retorno esperado.</p><h2>Erros mais comuns em finanças pessoais</h2><p><strong>Gastar antes de poupar</strong><br>O erro mais comum. Quem tenta poupar o que sobra quase nunca consegue. A solução é poupar primeiro — transferir para investimentos antes de gastar o restante.</p><p><strong>Usar crédito rotativo</strong><br>O cartão de crédito no rotativo cobra taxas de 15% a 20% ao mês — a dívida dobra em menos de 6 meses. É uma armadilha que pode levar anos para sair.</p><p><strong>Comparar com os outros</strong><br>Gastos motivados pelo que os outros têm ou fazem geram dívidas sem construir patrimônio. Cada situação financeira é única.</p><p><strong>Não ter reserva de emergência</strong><br>Sem reserva, qualquer imprevisto vira dívida. Com reserva, imprevistos são apenas inconveniências.</p><p><strong>Buscar enriquecimento rápido</strong><br>Pirâmides financeiras, promessas de retorno garantido acima do mercado e esquemas de renda passiva rápida são armadilhas. Patrimônio sólido se constrói com tempo e consistência.</p><h2>Como criar hábitos financeiros saudáveis</h2><p><strong>Pague a si mesmo primeiro</strong><br>Configure uma transferência automática para a conta de investimentos no dia do pagamento. Trate a poupança como uma conta fixa — não como o que sobra.</p><p><strong>Revise o orçamento mensalmente</strong><br>Uma revisão de 20 minutos no final de cada mês identifica desvios e mantém o plano no trilho.</p><p><strong>Celebre progresso, não perfeição</strong><br>Um mês ruim não apaga meses de progresso. O importante é manter a direção geral — não ser perfeito todo mês.</p><p><strong>Aprenda continuamente</strong><br>Educação financeira é uma jornada, não um destino. Cada novo conceito aprendido melhora as próximas decisões.</p>`
      }
  ],
  conclusion: `<h2>Conclusão</h2><p>Organizar finanças pessoais não é sobre restrição — é sobre intencionalidade. Saber onde o dinheiro vai e decidir conscientemente para onde ele deve ir.</p><p>Comece simples: diagnóstico, orçamento básico, quite as dívidas caras, monte a reserva de emergência. O resto vem naturalmente.</p><p>Com as finanças organizadas, o próximo passo é começar a investir. <a href='/como-comecar-a-investir'>Veja o guia completo de como começar a investir do zero.</a></p>`,
  seoTitle: "Guia Completo de Educação Financeira 2026",
  seoDescription: "Guia completo de educação financeira: organize suas finanças, saia das dívidas, monte reserva de emergência e comece a investir. Tudo em um só lugar.",
  faq: [
      { "question": "O que é educação financeira?", "answer": "Educação financeira é o conjunto de conhecimentos e hábitos que permite tomar decisões conscientes com dinheiro — gastar, poupar, investir e se proteger de riscos. É uma habilidade que se aprende e se pratica ao longo do tempo." },
      { "question": "Por onde começar a educação financeira?", "answer": "Comece pelo diagnóstico: some toda a renda e todos os gastos mensais. Se o saldo for negativo, corte gastos. Se for positivo, siga a sequência: quite dívidas caras → monte reserva de emergência → comece a investir." },
      { "question": "Quanto devo poupar por mês?", "answer": "O ideal é 20% da renda líquida (método 50-30-20). Se não for possível agora, comece com o que for possível. O hábito de poupar regularmente é mais importante que o valor inicial." },
      { "question": "É melhor quitar dívidas ou investir?", "answer": "Dívidas com juros acima de 1% ao mês (cartão de crédito, cheque especial) devem ser quitadas primeiro — os juros superam qualquer rendimento de investimento conservador. Para dívidas de juros baixos (financiamento imobiliário), você pode fazer os dois simultaneamente." },
      { "question": "O que é reserva de emergência e por que é importante?", "answer": "Reserva de emergência é um valor guardado para cobrir imprevistos sem recorrer a dívidas. Deve cobrir de 3 a 6 meses de despesas em produto com liquidez diária. Sem ela, qualquer imprevisto pode destruir o planejamento financeiro." },
      { "question": "Como sair das dívidas?", "answer": "Identifique todas as dívidas com seus saldos e taxas. Quite primeiro a de maior juros (método avalanche) ou a menor (método bola de neve). Negocie renegociação com os credores quando possível. Evite acumular novas dívidas enquanto quita as existentes." },
      { "question": "Quando posso começar a investir?", "answer": "Após ter as dívidas caras quitadas e a reserva de emergência formada. Investir sem essas duas bases significa que qualquer imprevisto vai forçar um resgate no pior momento." }
  ],
  category: 'educacao-financeira',
  subcategory: 'guia',
  pillar: 'pillar-4-educacao-financeira',
  cluster: 'educacao-financeira',
  tags: ["educação financeira", "guia educação financeira", "finanças pessoais", "como organizar dinheiro", "independência financeira"],
  disclaimer: "Este conteúdo é educativo e não constitui recomendação de investimento ou assessoria financeira personalizada. Consulte um profissional certificado para orientação adequada à sua situação."
  },
  {
    slug: 'quanto-rende-1000-no-cdb',
    title: 'Quanto Rende R$ 1.000 no CDB? Simulação Atualizada 2026',
    description: 'Veja quanto rende R$ 1.000 no CDB em 1, 6, 12 e 24 meses. Simulação com rendimento bruto e líquido, comparação com poupança e Tesouro Selic.',
    date: '2026-03-20',
    imageId: 'blog-cdb-1000',
    content: [
      {
        type: 'html',
        content: `<h1>Quanto rende R$ 1.000 no CDB? Simulação com rendimento líquido</h1><div class='resumo-rapido'><ul><li>Com CDI a {{cdiRate}}% ao ano, R$ 1.000 no CDB a 100% do CDI rendem aproximadamente R$ 8 líquidos por mês</li><li>Em 12 meses, o rendimento líquido é de aproximadamente R$ 109</li><li>O CDB rende quase o dobro da poupança ({{poupancaRate}}% a.a.) no mesmo período</li><li>Sempre compare rendimento líquido — não taxa bruta</li><li>Taxas variam por produto e emissor — use como referência, não como promessa</li></ul></div><p>R$ 1.000 pode parecer pouco para investir — mas é um ótimo ponto de partida. Saber exatamente quanto esse valor vai render ajuda a planejar aportes futuros e comparar produtos com clareza.</p><p>Esta simulação mostra o rendimento de R$ 1.000 no CDB em diferentes prazos e taxas, com os impostos reais descontados. Os cálculos usam CDI de {{cdiRate}}% ao ano (Bacen/SGS, {{dataAtualizacao}}).</p><h2>Premissas da simulação</h2><ul><li><strong>CDI:</strong> {{cdiRate}}% ao ano (Bacen/SGS, {{dataAtualizacao}})</li><li><strong>IR:</strong> tabela regressiva da Receita Federal</li><li><strong>IOF:</strong> zero para aplicações mantidas por mais de 30 dias</li></ul><p><strong>Importante:</strong> simulações assumem CDI constante para fins ilustrativos. O rendimento real pode variar conforme o CDI muda a cada reunião do Copom.</p>`
      },
      {
        type: 'simulationTable',
        initialInvestment: 1000,
        terms: [1, 3, 6, 12, 24, 36],
        scenarios: [
          { label: 'CDB 100% CDI líquido', rate: (cdi, selic) => cdi / 100, isTaxable: true }
        ]
      },
      {
        type: 'html',
        content: `<h2>Simulação: quanto rende R$ 1.000 em diferentes taxas de CDB</h2>`
      },
      {
        type: 'simulationTable',
        initialInvestment: 1000,
        terms: [6, 12, 24, 36],
        scenarios: [
          { label: 'CDB 90% CDI líquido', rate: (cdi, selic) => (cdi / 100) * 0.90, isTaxable: true },
          { label: 'CDB 100% CDI líquido', rate: (cdi, selic) => cdi / 100, isTaxable: true },
          { label: 'CDB 110% CDI líquido', rate: (cdi, selic) => (cdi / 100) * 1.10, isTaxable: true },
          { label: 'CDB 120% CDI líquido', rate: (cdi, selic) => (cdi / 100) * 1.20, isTaxable: true }
        ]
      },
      {
        type: 'html',
        content: `<h2>Quanto rende R$ 1.000 na poupança no mesmo período?</h2>`
      },
      {
        type: 'simulationTable',
        initialInvestment: 1000,
        terms: [6, 12, 24, 36],
        showDifference: true,
        scenarios: [
          { label: 'Poupança ({{poupancaRate}}% a.a.)', rate: (cdi, selic) => selic > 8.5 ? 0.0617 : selic * 0.70, isTaxable: false },
          { label: 'CDB 100% CDI líquido', rate: (cdi, selic) => cdi / 100, isTaxable: true }
        ]
      }
    ],
    conclusion: `<h2>Conclusão</h2><p>R$ 1.000 no CDB a 100% do CDI rende mais que o dobro da poupança em qualquer prazo com a Selic atual de {{selicRate}}% ao ano.</p><p>Para começar, escolha um CDB com a maior taxa disponível dentro do seu prazo, respeite a carência e mantenha o rendimento acumulando.</p><p>Quer entender melhor o CDB? <a href='/o-que-e-cdb'>Leia o guia completo sobre o CDB.</a> Ou <a href='/cdb-ou-poupanca'>veja a comparação completa entre CDB e poupança.</a></p><p><em>Referência: CDI de {{cdiRate}}% a.a. (Bacen/SGS, {{dataAtualizacao}}). Simulações com taxa constante para fins ilustrativos.</em></p>`,
    seoTitle: "Quanto Rende R$ 1.000 no CDB? Simulação 2026",
    seoDescription: "Simule quanto rende R$ 1.000 no CDB em 1, 6, 12 e 24 meses. Veja o rendimento líquido após IR, comparação com poupança e Tesouro Selic atualizado.",
    faq: [
      { "question": "Quanto rende R$ 1.000 no CDB em 12 meses?", "answer": "Com CDI a {{cdiRate}}% ao ano, R$ 1.000 no CDB a 100% do CDI rendem aproximadamente R$ 109 líquidos em 12 meses, após IR de 20%." },
      { "question": "R$ 1.000 no CDB rende mais que na poupança?", "answer": "Sim. Em 12 meses, o CDB a 100% do CDI rende quase o dobro da poupança ({{poupancaRate}}% a.a.) — mesmo após descontar o IR." },
      { "question": "Qual o mínimo para investir em CDB?", "answer": "Em algumas corretoras digitais é possível investir a partir de R$ 1. Em bancos tradicionais o mínimo pode ser R$ 1.000 ou mais." },
      { "question": "CDB de R$ 1.000 tem garantia do FGC?", "answer": "Sim. O FGC garante até R$ 250.000 por CPF por instituição financeira." },
      { "question": "Quanto rende R$ 1.000 no CDB a 110% do CDI em 12 meses?", "answer": "Com CDI a {{cdiRate}}% ao ano e IR de 20%, um CDB a 110% do CDI rende aproximadamente R$ 120 líquidos em 12 meses." }
    ],
    category: 'renda-fixa',
    subcategory: 'cdb',
    pillar: 'pillar-2-renda-fixa',
    cluster: 'cdb',
    tags: ['quanto rende cdb', 'cdb 1000 reais', 'rendimento cdb', 'simulador cdb'],
    disclaimer: defaultDisclaimer
  },
  {
    slug: 'o-que-e-cdb',
    title: 'O que é CDB? Como funciona e se vale a pena',
    description: 'CDB é um título de renda fixa emitido por bancos que paga juros ao investidor. Entenda como funciona, quais os tipos, como é o IR e se vale mais que a poupança.',
    date: '2026-03-20',
    imageId: 'blog-o-que-e-cdb',
    content: [
      {
        type: 'html',
        content: `<h1>O que é CDB: como funciona, tipos e o que avaliar antes de investir</h1><div class='resumo-rapido'><ul><li>CDB é um título emitido por bancos — você empresta dinheiro e recebe juros no resgate</li><li>Tem cobertura do FGC até R$ 250.000 por CPF por instituição</li><li>Rende mais que a poupança ({{poupancaRate}}% a.a.) na maioria dos cenários</li><li>Tem IR com alíquota regressiva (22,5% a 15%)</li><li>Liquidez varia: alguns permitem resgate diário, outros só no vencimento</li></ul></div><p>CDB é um dos investimentos de renda fixa mais populares do Brasil. Este guia explica o que é, como funciona, quais os tipos e o que avaliar antes de investir.</p><h2>O que é CDB</h2><p>CDB significa Certificado de Depósito Bancário. É um título de renda fixa emitido por bancos para captar dinheiro dos investidores. Você empresta dinheiro ao banco e recebe de volta com juros no vencimento.</p><p>O CDI atual está em {{cdiRate}}% ao ano (Bacen/SGS, {{dataAtualizacao}}). Um CDB a 100% do CDI rende exatamente esse percentual ao ano — antes de impostos.</p><h2>Tipos de CDB</h2><h3>CDB pré-fixado</h3><p>A taxa é definida na aplicação e não muda. Você sabe exatamente quanto vai receber no vencimento.</p><h3>CDB pós-fixado (% do CDI)</h3><p>Acompanha o CDI durante todo o período. Com CDI a {{cdiRate}}% ao ano, um CDB a 110% do CDI rende {{cdbExampleRate}}% ao ano bruto.</p><h3>CDB IPCA+</h3><p>Rende inflação (IPCA a {{ipcaRate}}% ao ano) mais taxa fixa. Garante crescimento real do patrimônio.</p><h2>CDB tem garantia do FGC?</h2><p>Sim. O FGC garante até R$ 250.000 por CPF por instituição e limite global de R$ 1.000.000 por CPF, renovável a cada 4 anos. (Fonte: FGC, {{dataAtualizacao}}.)</p><h2>IR no CDB</h2><table><thead><tr><th>Prazo</th><th>Alíquota IR</th></tr></thead><tbody><tr><td>Até 180 dias</td><td>22,5%</td></tr><tr><td>181 a 360 dias</td><td>20%</td></tr><tr><td>361 a 720 dias</td><td>17,5%</td></tr><tr><td>Acima de 720 dias</td><td>15%</td></tr></tbody></table><p>Fonte: Receita Federal do Brasil.</p><h2>CDB vale a pena? Comparação rápida</h2>`
      },
      {
        type: 'simulationTable',
        initialInvestment: 10000,
        terms: [12],
        scenarios: [
          { label: 'Poupança', rate: (cdi, selic) => selic > 8.5 ? 0.0617 : selic * 0.70, isTaxable: false },
          { label: 'CDB 100% CDI', rate: (cdi, selic) => cdi / 100, isTaxable: true },
          { label: 'CDB 110% CDI', rate: (cdi, selic) => (cdi / 100) * 1.10, isTaxable: true },
          { label: 'Tesouro Selic', rate: (cdi, selic) => selic / 100, isTaxable: true },
          { label: 'LCI 90% CDI', rate: (cdi, selic) => (cdi / 100) * 0.90, isTaxable: false }
        ]
      },
      {
        type: 'html',
        content: `<p><em>Referência: CDI de {{cdiRate}}% a.a. e Selic de {{selicRate}}% a.a. (Bacen/SGS, {{dataAtualizacao}}). Sempre compare rendimento líquido.</em></p><h2>Como escolher um bom CDB: 5 pontos</h2><ol><li><strong>Taxa:</strong> compare sempre o rendimento líquido</li><li><strong>Liquidez:</strong> defina se pode ou não esperar o vencimento</li><li><strong>Prazo:</strong> combine com seu objetivo</li><li><strong>Emissor:</strong> verifique regulamentação no Bacen</li><li><strong>Rendimento líquido:</strong> o único número que importa na comparação</li></ol>`
      }
    ],
    conclusion: `<h2>Conclusão</h2><p>CDB combina segurança (FGC), variedade de prazos e rentabilidade acima da poupança na maioria dos cenários. A chave é sempre comparar rendimento líquido.</p><p>Quer simular? <a href='/quanto-rende-1000-no-cdb'>Veja quanto rende R$ 1.000 no CDB.</a></p><p><em>Referência: CDI de {{cdiRate}}% a.a. (Bacen/SGS, {{dataAtualizacao}}).</em></p>`,
    seoTitle: "O que é CDB? Como funciona e se vale a pena",
    seoDescription: "CDB é um título de renda fixa emitido por bancos que paga juros ao investidor. Entenda como funciona, quais os tipos, como é o IR e se vale mais que a poupança.",
    faq: [
      { "question": "O que é CDB e como funciona?", "answer": "CDB é um título de renda fixa emitido por bancos. Você empresta dinheiro ao banco e recebe de volta com juros no resgate. Tem cobertura do FGC até R$ 250.000 por CPF por instituição." },
      { "question": "CDB tem garantia do FGC?", "answer": "Sim. O FGC garante até R$ 250.000 por CPF por instituição em caso de falência do banco emissor." },
      { "question": "CDB tem Imposto de Renda?", "answer": "Sim. IR regressivo de 22,5% para resgates em até 180 dias até 15% acima de 720 dias. Retido automaticamente na fonte." },
      { "question": "Posso perder dinheiro no CDB?", "answer": "Em condições normais, não. O único risco é falência do banco emissor — coberto pelo FGC até R$ 250.000." },
      { "question": "Qual o valor mínimo para investir em CDB?", "answer": "A partir de R$ 1 em corretoras digitais. Em bancos tradicionais pode ser R$ 1.000 ou mais." }
    ],
    category: 'renda-fixa',
    subcategory: 'cdb',
    pillar: 'pillar-2-renda-fixa',
    cluster: 'cdb',
    tags: ["o que é cdb", "cdb", "certificado depósito bancário", "rendimento cdb", "cdb liquidez diária"],
    disclaimer: defaultDisclaimer
  },
  {
    slug: 'cdb-ou-lci',
    title: 'CDB ou LCI: qual rende mais? Quando a isenção de IR compensa',
    description: 'CDB tem IR, LCI é isenta — mas isso não significa que LCI rende mais. Veja como comparar corretamente pelo rendimento líquido e quando cada um compensa.',
    date: '2026-03-20',
    imageId: 'blog-cdb-lci',
    content: [
      {
        type: 'html',
        content: "<h1>CDB ou LCI: quando a isenção de IR realmente compensa?</h1><div class='resumo-rapido'><ul><li>LCI é isenta de IR para pessoa física — CDB tem IR de 15% a 22,5%</li><li>Isenção não garante que LCI rende mais — depende da taxa e do prazo</li><li>A comparação correta é sempre pelo rendimento líquido</li><li>LCI tem carência mínima de 90 dias — CDB pode ter liquidez diária</li><li>CDI atual: {{cdiRate}}% ao ano (Bacen/SGS, {{dataAtualizacao}})</li></ul></div><p>A dúvida entre CDB e LCI é uma das mais comuns em renda fixa. A isenção de IR da LCI é uma vantagem real — mas só compensa quando a taxa oferecida é competitiva o suficiente.</p><h2>Diferenças principais</h2><table><thead><tr><th>Característica</th><th>CDB</th><th>LCI</th></tr></thead><tbody><tr><td>IR para PF</td><td>15% a 22,5%</td><td>Isento</td></tr><tr><td>FGC</td><td>Até R$ 250k</td><td>Até R$ 250k</td></tr><tr><td>Liquidez</td><td>Pode ter liquidez diária</td><td>Carência mínima 90 dias</td></tr><tr><td>Valor mínimo típico</td><td>A partir de R$ 1</td><td>Geralmente R$ 1.000+</td></tr></tbody></table><h2>Como comparar corretamente</h2><p>Fórmula: <strong>Taxa LCI equivalente = Taxa CDB × (1 — alíquota IR)</strong></p><p>Exemplo com CDI a {{cdiRate}}% ao ano e IR de 15% (acima de 720 dias):<br>CDB 100% CDI líquido = {{cdb100Rate}}% × 0,85 = rendimento equivalente a LCI de 85% do CDI.<br>Se a LCI pagar acima de 85% do CDI, ela vence.</p><h2>Simulação prática: R$ 10.000 em CDB vs LCI</h2>"
      },
      {
        type: 'simulationTable',
        initialInvestment: 10000,
        terms: [12],
        scenarios: [
          { label: 'CDB 100% CDI líquido', rate: (cdi, selic) => cdi / 100, isTaxable: true },
          { label: 'LCI 90% CDI (isento)', rate: (cdi, selic) => (cdi / 100) * 0.90, isTaxable: false },
          { label: 'CDB 110% CDI líquido', rate: (cdi, selic) => (cdi / 100) * 1.10, isTaxable: true },
          { label: 'LCI 95% CDI (isento)', rate: (cdi, selic) => (cdi / 100) * 0.95, isTaxable: false }
        ]
      },
      {
        type: 'html',
        content: "<h2>Quando a LCI compensa mais que o CDB</h2><ul><li>A taxa da LCI está acima do ponto de equivalência</li><li>O prazo é curto (até 360 dias) — IR do CDB é mais alto</li><li>Você não precisa de liquidez imediata</li></ul><h2>Quando o CDB compensa mais</h2><ul><li>A taxa do CDB está significativamente acima do ponto de equivalência</li><li>Você precisa de liquidez imediata — CDB de liquidez diária resolve</li><li>O valor mínimo da LCI está acima do que você quer investir</li><li>Você é pessoa jurídica (LCI não é isenta para PJ)</li></ul><h2>Checklist de decisão</h2><ul><li>Pode deixar o dinheiro por pelo menos 90 dias? Se não → <strong>CDB liquidez diária</strong></li><li>A LCI paga acima do ponto de equivalência? Se sim → <strong>LCI</strong></li><li>O CDB disponível paga acima de 110% do CDI? → <strong>compare com a tabela antes de decidir</strong></li><li>Você é PJ? → <strong>CDB</strong></li></ul>"
      }
    ],
    conclusion: "<h2>Conclusão</h2><p>A regra de ouro: <strong>sempre compare rendimento líquido, nunca taxa bruta.</strong></p><p>Quer entender melhor cada produto? <a href='/o-que-e-cdb'>O que é CDB</a> e <a href='/o-que-e-lci'>o que é LCI.</a></p><p><em>Referência: CDI de {{cdiRate}}% a.a. (Bacen/SGS, {{dataAtualizacao}}).</em></p>",
    seoTitle: 'CDB ou LCI: qual rende mais em 2026?',
    seoDescription: 'CDB ou LCI: descubra quando a isenção de IR da LCI realmente compensa. Comparativo com tabela de rendimento líquido, exemplos práticos e checklist.',
    faq: [
      { "question": "CDB ou LCI: qual rende mais?", "answer": "Depende da taxa oferecida. Compare sempre pelo rendimento líquido. LCI é isenta de IR, mas um CDB com taxa suficientemente alta pode superar a LCI." },
      { "question": "Qual a principal diferença entre CDB e LCI?", "answer": "IR e liquidez. CDB tem IR de 15% a 22,5%, LCI é isenta para PF. CDB pode ter liquidez diária, LCI tem carência mínima de 90 dias." },
      { "question": "Como calcular o ponto de equivalência entre CDB e LCI?", "answer": "Taxa LCI equivalente = taxa CDB × (1 - alíquota IR). Exemplo: CDB a 100% do CDI com IR de 20% equivale a LCI de 80% do CDI." },
      { "question": "LCI é isenta de IR para pessoa jurídica?", "answer": "Não. A isenção se aplica apenas para pessoa física. Empresas pagam IR normalmente sobre rendimentos de LCI." },
      { "question": "LCI tem FGC?", "answer": "Sim. Até R$ 250.000 por CPF por instituição, com limite global de R$ 1.000.000 renovável a cada 4 anos." }
    ],
    category: 'renda-fixa',
    subcategory: 'comparativos',
    pillar: 'pillar-2-renda-fixa',
    cluster: 'comparativos-renda-fixa',
    tags: ["cdb ou lci", "cdb vs lci", "lci ou cdb", "comparativo renda fixa", "isenção imposto de renda"],
    disclaimer: "Este conteúdo é educativo e não constitui recomendação de investimento."
  }
]
