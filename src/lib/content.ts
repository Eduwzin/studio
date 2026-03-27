
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
        content: `<h1>CDB ou poupança: qual rende mais e por que o CDB quase sempre vence</h1><div class='resumo-rapido'><ul><li>Com a Selic acima de 8,5% ao ano, o CDB rende mais que a poupança — sempre</li><li>A poupança rende apenas {{poupancaRate}}% ao ano + TR com a Selic atual de {{selicRate}}%</li><li>CDB de 100% do CDI rende aproximadamente {{cdb100Rate}}% líquido ao ano — quase o dobro</li><li>Os dois têm FGC até R$ 250.000 — o nível de segurança é o mesmo</li><li>A única vantagem real da poupança é a isenção de IR — mas não compensa o rendimento menor</li></ul></div><p>A poupança ainda é o investimento mais popular do Brasil — mas não porque é o melhor. É porque é o mais conhecido. Para quem está avaliando onde deixar o dinheiro, a comparação com o CDB é inevitável.</p><p>A resposta direta: com a Selic acima de 8,5% ao ano, o CDB rende mais que a poupança em praticamente todos os cenários — mesmo após o desconto do Imposto de Renda.</p><h2>Como funciona o rendimento da poupança</h2><p>O rendimento da poupança segue uma regra definida pelo Banco Central:</p><ul><li><strong>Quando a Selic está acima de 8,5% ao ano:</strong> poupança rende 0,5% ao mês + TR (Taxa Referencial), o que equivale a aproximadamente {{poupancaRate}}% ao ano.</li><li><strong>Quando a Selic está igual ou abaixo de 8,5% ao ano:</strong> poupança rende 70% da Selic + TR</li></ul><p>A poupança é isenta de Imposto de Renda para pessoa física — mas como veremos, isso não compensa o rendimento menor.</p><h2>Como funciona o rendimento do CDB</h2><p>O CDB rende um percentual do CDI (Certificado de Depósito Interbancário). Com CDI a {{cdiRate}}% ao ano:</p><ul><li>CDB a 100% do CDI: {{cdb100Rate}}% ao ano bruto</li><li>CDB a 110% do CDI: {{cdb120Rate}}% ao ano bruto</li></ul><p>O CDB tem Imposto de Renda regressivo sobre o rendimento.</p><h2>Simulação: R$ 10.000 em CDB vs poupança</h2>`
      },
      {
        type: 'simulationTable',
        initialInvestment: 10000,
        terms: [6, 12, 24, 36],
        showDifference: true,
        scenarios: [
          { label: 'Poupança ({{poupancaRate}}% a.a.)', rate: (cdi, selic) => selic > 8.5 ? 0.0617 : selic * 0.70, isTaxable: false },
          { label: 'CDB 100% CDI líquido', rate: (cdi, selic) => cdi / 100, isTaxable: true },
          { label: 'CDB 110% CDI líquido', rate: (cdi, selic) => (cdi / 100) * 1.10, isTaxable: true }
        ]
      },
      {
        type: 'html',
        content: `<p><em>Simulação de rendimento líquido. (Referência: {{dataAtualizacao}})</em></p>`
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
    seoTitle: 'Tesouro Selic ou CDB: qual rende mais em 2026?',
    seoDescription: 'Tesouro Selic ou CDB: compare segurança, liquidez e rendimento líquido. Veja quando cada um compensa com simulação prática e checklist de decisão.',
    date: '2026-03-20',
    imageId: 'blog-tesouro-cdb',
    content: [
      {
        type: 'html',
        content: `<h1>Tesouro Selic ou CDB: qual é melhor para você?</h1><div class='resumo-rapido'><ul><li>Tesouro Selic e CDB de liquidez diária têm rendimento muito próximo — a diferença em 12 meses é pequena</li><li>A principal diferença está na garantia: Tesouro é garantido pelo Governo Federal, CDB pelo FGC até R$ 250k</li><li>Para reserva de emergência, os dois funcionam bem — a escolha depende do valor investido</li><li>CDB acima de 100% do CDI pode superar o Tesouro Selic no líquido</li><li>Sempre compare rendimento líquido — não taxa bruta</li></ul></div><p>Tesouro Selic e CDB são os dois investimentos de renda fixa mais populares para reserva de emergência e objetivos de curto prazo. A dúvida entre os dois é comum — e a resposta depende de alguns fatores simples.</p><p>Este comparativo explica as diferenças reais, mostra uma simulação prática e te ajuda a decidir em minutos.</p><h2>Simulação: R$ 10.000 em Tesouro Selic vs CDB</h2>`
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
        content: `<p><em>Simulação de rendimento líquido. (Referência: {{dataAtualizacao}})</em></p><p>A tabela mostra que, para um CDB de liquidez diária superar o rendimento do Tesouro Selic, ele precisa pagar acima de 100% do CDI. A diferença é pequena, mas existe.</p><h2>Quando o Tesouro Selic é melhor?</h2><p><strong>Segurança máxima:</strong> para valores acima de R$ 250.000 — limite do FGC —, o Tesouro Selic é a opção mais segura, pois é garantido pelo Governo Federal sem limite de valor.</p><p><strong>Praticidade:</strong> se o seu banco ou corretora oferece apenas CDBs com taxas abaixo de 100% do CDI, o Tesouro Selic é uma escolha melhor e mais simples.</p><h2>Quando o CDB é melhor?</h2><p><strong>Taxas competitivas:</strong> se você encontrar um CDB de liquidez diária que pague acima de 101% do CDI, ele terá um rendimento líquido ligeiramente superior ao Tesouro Selic.</p><p><strong>Isenção da taxa de custódia:</strong> o Tesouro Selic tem uma taxa de custódia de 0,20% ao ano da B3 (isenta para os primeiros R$ 10.000). O CDB não tem essa taxa, o que pode fazer diferença no longo prazo.</p>`
      }
    ],
    conclusion: `<h2>Conclusão</h2><p>Tesouro Selic e CDB de liquidez diária são produtos quase equivalentes para objetivos de curto prazo e reserva de emergência. A diferença de rendimento é pequena — o que realmente importa é a taxa do CDB disponível e o valor que você vai investir.</p><p>Regra simples: se o CDB paga acima de 101% do CDI com liquidez diária, ele vence. Se paga menos, o Tesouro Selic é melhor. Para valores acima de R$ 250.000, Tesouro Selic sempre.</p><p>Quer entender melhor cada produto? Leia <a href='/o-que-e-tesouro-direto'>o que é Tesouro Direto</a> e <a href='/o-que-e-cdb'>o que é CDB</a>.</p>`,
    faq: [
      {
        question: "Tesouro Selic ou CDB: qual rende mais?",
        answer: "Depende da taxa do CDB. Com CDI a {{cdiRate}}% ao ano, o Tesouro Selic rende aproximadamente {{selicRate}}% bruto ao ano. Um CDB a 100% do CDI rende {{cdb100Rate}}% bruto. A diferença líquida é mínima."
      },
      {
        question: "Qual a diferença entre Tesouro Selic e CDB?",
        answer: "A principal diferença é a garantia: Tesouro Selic é garantido pelo Governo Federal sem limite de valor. CDB tem cobertura do FGC até R$ 250.000 por CPF por instituição. O rendimento dos dois é muito próximo."
      },
      {
        question: "Tesouro Selic ou CDB para reserva de emergência?",
        answer: "Os dois são excelentes para reserva de emergência. Tesouro Selic é mais indicado para valores acima de R$ 250.000. Para valores menores, um CDB que pague acima de 100% do CDI com liquidez diária pode ser mais vantajoso."
      },
      {
        question: "CDB é mais seguro que Tesouro Selic?",
        answer: "Não. O Tesouro Selic é garantido pelo Governo Federal — considerado o investimento de menor risco do Brasil. O CDB tem FGC até R$ 250.000, que é um nível de segurança muito alto, mas inferior ao Governo Federal."
      },
      {
        question: "Tesouro Selic tem taxa de custódia?",
        answer: "Sim. A B3 cobra 0,20% ao ano. Porém, investimentos de até R$ 10.000 no Tesouro Selic são isentos dessa taxa. Acima disso, a taxa se aplica ao valor total."
      },
      {
        question: "Qual o rendimento do Tesouro Selic em 2026?",
        answer: "Com a Selic a {{selicRate}}% ao ano, o Tesouro Selic rende aproximadamente {{selicRate}}% bruto ao ano. O rendimento líquido depende do prazo e da alíquota de IR."
      },
      {
        question: "Posso ter Tesouro Selic e CDB ao mesmo tempo?",
        answer: "Sim. Muitos investidores usam os dois — Tesouro Selic para a reserva de emergência principal e CDB de liquidez diária para complementar, aproveitando taxas acima de 100% do CDI dentro do limite do FGC."
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
    slug: 'onde-investir',
    title: 'Onde Posso Investir? Conheça as Opções Disponíveis no Brasil',
    description: 'Descubra onde investir no Brasil: Tesouro Direto, CDB, LCI, ações, FIIs e mais. Veja como acessar cada produto e qual plataforma usar para começar.',
    seoTitle: 'Onde Posso Investir? Guia Completo das Opções em 2026',
    seoDescription: 'Onde investir no Brasil em 2026? Veja todas as opções disponíveis, como acessar cada produto, diferença entre banco e corretora e por onde começar.',
    date: '2026-03-20',
    imageId: 'blog-onde-investir',
    content: [{
      type: 'html',
      content: `<h1>Onde posso investir? Guia completo das opções disponíveis no Brasil</h1><div class='resumo-rapido'><ul><li>Você pode investir pelo seu banco atual ou abrindo conta em uma corretora independente</li><li>Corretoras costumam oferecer mais produtos, melhores taxas e mais ferramentas educativas</li><li>Os principais produtos disponíveis são: Tesouro Direto, CDB, LCI, LCA, ações, FIIs e ETFs</li><li>Abrir conta em corretora é gratuito e 100% digital na maioria das plataformas</li><li>Antes de escolher onde investir, defina o seu objetivo — isso determina o produto certo</li></ul></div><p>Uma das primeiras dúvidas práticas de quem decide começar a investir é: onde exatamente eu coloco o meu dinheiro? Pelo banco? Por um aplicativo? Existe uma corretora certa?</p><p>A boa notícia é que hoje investir ficou mais acessível do que nunca. Existem diversas plataformas, a maioria gratuita e 100% digital. O desafio é entender as diferenças e escolher a que faz mais sentido para o seu perfil.</p><h2>As duas formas de acessar investimentos no Brasil</h2><h3>Pelo banco onde você já tem conta</h3><p>A forma mais simples de começar é usar o próprio banco. A maioria dos bancos tradicionais e digitais oferece acesso a Tesouro Direto, CDB próprio, fundos de investimento e, em alguns casos, ações.</p><p><strong>Vantagens:</strong> praticidade — tudo em um único app, sem precisar transferir dinheiro.</p><p><strong>Desvantagens:</strong> seleção limitada de produtos, taxas às vezes mais altas e tendência de oferecer principalmente produtos próprios do banco.</p><h3>Por uma corretora de valores independente</h3><p>Corretoras são plataformas especializadas em investimentos, regulamentadas pela CVM e pelo Banco Central. Elas dão acesso a uma gama muito maior de produtos — de diferentes emissores, com taxas mais competitivas.</p><p><strong>Vantagens:</strong> mais opções de CDB, LCI e LCA de diferentes bancos, acesso completo ao Tesouro Direto, ações, FIIs, ETFs e BDRs, ferramentas de análise e conteúdo educativo.</p><p><strong>Desvantagens:</strong> exige abertura de conta separada e transferência de dinheiro via TED ou PIX.</p>`
    }],
    conclusion: "<h2>Conclusão</h2><p>Hoje você pode investir de forma segura e gratuita pelo seu banco ou por uma corretora independente — a diferença está na variedade de produtos e nas taxas disponíveis.</p><p>Para quem está começando: abra conta em uma corretora digital de boa reputação, comece pelo Tesouro Selic ou CDB de liquidez diária para montar a reserva de emergência e explore os demais produtos conforme seu conhecimento cresce.</p><p>Quer saber quais são os melhores produtos para começar? <a href='/melhores-investimentos-para-iniciantes'>Veja os melhores investimentos para iniciantes.</a></p>",
    faq: [
      {
        question: "Onde posso investir dinheiro no Brasil?",
        answer: "Você pode investir pelo seu banco atual ou abrindo conta em uma corretora de valores independente. Corretoras oferecem mais produtos, melhores taxas e acesso completo a Tesouro Direto, CDB, LCI, ações, FIIs e ETFs. A abertura de conta é gratuita e 100% digital."
      },
      {
        question: "É melhor investir pelo banco ou por uma corretora?",
        answer: "Depende do seu objetivo. Para renda fixa simples, o banco pode ser suficiente. Para mais opções de produtos, melhores taxas e acesso a ações e FIIs, uma corretora independente é mais indicada."
      },
      {
        question: "Como abrir conta em uma corretora?",
        answer: "Acesse o site ou app da corretora, preencha o cadastro com CPF e documentos, faça o teste de perfil de investidor e aguarde a aprovação — geralmente em minutos. Depois transfira dinheiro via PIX ou TED e já pode investir."
      },
      {
        question: "Como saber se uma corretora é confiável?",
        answer: "Verifique se está regulamentada pela CVM (cvm.gov.br) e pelo Banco Central (bcb.gov.br). Para Tesouro Direto, confirme se está listada como agente autorizado em tesourodireto.com.br. Pesquise também avaliações e reclamações antes de abrir conta."
      },
      {
        question: "Posso investir em Tesouro Direto pelo meu banco?",
        answer: "Sim, desde que o banco seja habilitado pelo Tesouro Nacional. O produto é o mesmo em qualquer plataforma — a diferença pode estar nas taxas cobradas pela instituição."
      },
      {
        question: "Preciso pagar para abrir conta em corretora?",
        answer: "Não. A maioria das corretoras digitais oferece abertura de conta gratuita. Algumas cobram taxa de corretagem para operações com ações — verifique as condições antes de abrir conta."
      },
      {
        question: "Onde investir para ter renda passiva mensal?",
        answer: "Para renda passiva mensal, os Fundos de Investimento Imobiliário (FIIs) são os mais usados — distribuem rendimentos mensais isentos de IR para pessoa física. São acessados por corretoras habilitadas na B3."
      }
    ],
    category: 'investimentos',
    subcategory: 'para-iniciantes',
    pillar: 'pillar-1-investimentos',
    cluster: 'comecar-a-investir',
    tags: ["onde investir", "onde investir dinheiro", "onde investir no Brasil", "melhores plataformas para investir", "corretora ou banco"],
    disclaimer: "Este conteúdo é educativo e não constitui recomendação de investimento. Sempre verifique a regulamentação da instituição antes de investir. Consulte um profissional certificado para orientação personalizada.",
  },
  {
    slug: 'o-que-e-lca',
    title: 'O que é LCA? Como funciona e quando vale a pena',
    description: 'LCA é um título de renda fixa isento de IR para pessoa física, lastreado no agronegócio. Entenda como funciona, quando compensa e como comparar com CDB e LCI.',
    seoTitle: 'O que é LCA? Como funciona e quando vale a pena',
    seoDescription: 'LCA é um título de renda fixa isento de IR para pessoa física. Veja como funciona, quais os tipos, quando compensa mais que CDB e LCI e como investir.',
    date: '2026-03-20',
    imageId: 'blog-o-que-e-lca',
    content: [
      {
        type: 'html',
        content: `<h1>O que é LCA: como funciona, vantagens e quando vale a pena</h1><div class='resumo-rapido'><ul><li>LCA é um título de renda fixa emitido por bancos, lastreado em crédito do agronegócio</li><li>É isento de Imposto de Renda para pessoa física — igual à LCI</li><li>Tem cobertura do FGC até R$ 250.000 por CPF por instituição</li><li>Tem carência mínima de 90 dias — não permite resgate imediato</li><li>A comparação correta com CDB é sempre pelo rendimento líquido, não pela taxa bruta</li></ul></div><p>LCA e LCI são frequentemente mencionadas juntas — e com razão: funcionam de forma muito parecida. A principal diferença está no lastro: enquanto a LCI financia o setor imobiliário, a LCA financia o agronegócio.</p><p>Para o investidor pessoa física, o que importa é que as duas são isentas de IR e têm cobertura do FGC. Este guia explica tudo que você precisa saber sobre a LCA antes de investir.</p><h2>LCA vs LCI: qual a diferença?</h2><table><thead><tr><th>Critério</th><th>LCA (Letra de Crédito do Agronegócio)</th><th>LCI (Letra de Crédito Imobiliário)</th></tr></thead><tbody><tr><td><strong>Lastro</strong></td><td>Crédito para o agronegócio</td><td>Crédito para o setor imobiliário</td></tr><tr><td><strong>Rendimento</strong></td><td>Pós (CDI), Pré ou Híbrido (IPCA+)</td><td>Pós (CDI), Pré ou Híbrido (IPCA+)</td></tr><tr><td><strong>Imposto de Renda</strong></td><td>Isento para pessoa física</td><td>Isento para pessoa física</td></tr><tr><td><strong>Garantia</strong></td><td>FGC (até R$ 250 mil)</td><td>FGC (até R$ 250 mil)</td></tr><tr><td><strong>Liquidez</strong></td><td>Carência mínima de 90 dias</td><td>Carência mínima de 90 dias</td></tr></tbody></table><p>Na prática, para o investidor, a diferença é mínima. A escolha entre LCA e LCI geralmente se resume a qual está oferecendo a melhor taxa de rendimento no momento da aplicação.</p><h2>Quando a LCA compensa mais que o CDB</h2><p>A comparação correta usa a fórmula de equivalência: <strong>Taxa LCA equivalente = Taxa CDB × (1 — alíquota IR)</strong>. Uma LCA a {{lci90Rate}}% do CDI pode render mais no líquido que um CDB a {{cdb100Rate}}% do CDI. Veja a simulação abaixo para entender na prática.</p><h2>Simulação: Equivalência LCA vs CDB</h2>`
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
        content: `<p><em>(Referência: {{dataAtualizacao}})</em></p><h2>Comparativo rápido: LCA vs outros produtos</h2>`
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
        content: `<p><em>(Referência: {{dataAtualizacao}})</em></p><h2>Tipos de LCA por Rendimento</h2><table><thead><tr><th>Tipo de LCA</th><th>Como funciona</th></tr></thead><tbody><tr><td><strong>Pós-fixada</strong></td><td>A mais comum. Rende um percentual do CDI (ex: 95% do CDI).</td></tr><tr><td><strong>Prefixada</strong></td><td>A taxa é definida no momento da compra (ex: 11% ao ano).</td></tr><tr><td><strong>Híbrida (IPCA+)</strong></td><td>Paga a variação da inflação (IPCA) mais uma taxa fixa (ex: IPCA + 5% a.a.).</td></tr></tbody></table>`
      }
    ],
    conclusion: `<h2>Conclusão</h2><p>LCA é uma excelente opção de renda fixa para quem tem objetivo com prazo definido e pode abrir mão da liquidez imediata. A isenção de IR é uma vantagem real — mas só compensa quando a taxa oferecida é competitiva o suficiente para superar o rendimento líquido de outras opções.</p><p>A regra de ouro: sempre compare pelo rendimento líquido. E lembre-se — LCA e LCI funcionam de forma muito parecida. Vale comparar as duas antes de decidir.</p><p>Quer entender melhor a comparação com o CDB? <a href='/cdb-ou-lci'>Veja o comparativo completo entre CDB e LCI/LCA.</a></p>`,
    faq: [
      {
        question: "O que é LCA e como funciona?",
        answer: "LCA (Letra de Crédito do Agronegócio) é um título de renda fixa emitido por bancos para financiar o setor agropecuário. Você empresta dinheiro ao banco e recebe juros isentos de IR para pessoa física. Tem cobertura do FGC até R$ 250.000 por CPF por instituição."
      },
      {
        question: "LCA é isenta de Imposto de Renda?",
        answer: "Sim, para pessoa física. O rendimento da LCA é totalmente isento de IR, independente do prazo. Para pessoa jurídica, o IR é cobrado normalmente."
      },
      {
        question: "Qual a diferença entre LCA e LCI?",
        answer: "Para o investidor, a diferença é mínima. LCA é lastreada no agronegócio, LCI no setor imobiliário. As duas são isentas de IR para pessoa física, têm FGC e carência mínima de 90 dias. A diferença prática está nas taxas disponíveis no mercado."
      },
      {
        question: "LCA tem garantia do FGC?",
        answer: "Sim. O FGC garante até R$ 250.000 por CPF por instituição financeira em caso de falência do banco emissor. O limite global é de R$ 1.000.000 por CPF, renovável a cada 4 anos."
      },
      {
        question: "LCA tem carência? Quando posso resgatar?",
        answer: "Sim. Por regulamentação do Banco Central, a LCA tem prazo mínimo de 90 dias. A maioria das LCAs só permite resgate no vencimento. Não é indicada para reserva de emergência."
      },
      {
        question: "LCA rende mais que CDB?",
        answer: "Depende das taxas. Compare sempre pelo rendimento líquido. Uma LCA a {{lci90Rate}}% do CDI pode render mais no líquido que um CDB a {{cdb100Rate}}% do CDI pela isenção de IR. Mas um CDB a {{cdb120Rate}}% do CDI pode superar uma LCA a {{lci95Rate}}% do CDI."
      },
      {
        question: "Qual o valor mínimo para investir em LCA?",
        answer: "Varia por instituição. Geralmente a partir de R$ 1.000, mas algumas plataformas digitais oferecem valores menores. Verifique as condições na corretora onde pretende investir."
      }
    ],
    category: 'renda-fixa',
    subcategory: 'lca',
    pillar: 'pillar-2-renda-fixa',
    cluster: 'lci-lca',
    tags: ["o que é LCA", "LCA", "letra de crédito agronegócio", "renda fixa isenta IR", "LCA ou CDB", "LCA ou LCI"],
    disclaimer: defaultDisclaimer,
  },
   {
    slug: 'guia-renda-fixa',
    title: 'Guia de Renda Fixa: O que é e Como Investir em 2026',
    description: 'Guia completo para começar a investir em Renda Fixa. Entenda o que é Tesouro Direto, CDB, LCI, LCA, a segurança do FGC e como escolher o melhor para você.',
    seoTitle: 'Renda Fixa: O Guia Completo para Iniciantes em 2026',
    seoDescription: 'Aprenda o que é renda fixa, como funciona, quais os principais produtos (Tesouro, CDB, LCI/LCA), riscos e como começar a investir com segurança e rentabilidade.',
    date: '2026-03-20',
    imageId: 'blog-guia-renda-fixa',
    content: [
      {
        type: 'html',
        content: `<h1>Guia de Renda Fixa: O que é e Como Investir em 2026</h1>
<div class='resumo-rapido'>
  <ul>
    <li>Renda fixa são investimentos com regras de remuneração definidas no momento da aplicação.</li>
    <li>São considerados os investimentos mais seguros, ideais para iniciantes e reserva de emergência.</li>
    <li>Principais produtos: Tesouro Direto (Selic, IPCA+, Prefixado), CDB, LCI e LCA.</li>
    <li>A maioria tem garantia do FGC ou do Tesouro Nacional.</li>
    <li>Com a Selic em {{selicRate}}% ao ano, a renda fixa oferece excelentes retornos com baixo risco.</li>
  </ul>
</div>
<p>Renda fixa é a porta de entrada para o mundo dos investimentos. É a categoria de ativos mais segura, com rentabilidade previsível e ideal para quem quer sair da poupança e fazer o dinheiro render de verdade, sem correr grandes riscos.</p>
<p>Este guia completo vai te ensinar tudo o que você precisa saber para começar a investir em renda fixa com confiança.</p>
<h2>O que é Renda Fixa?</h2>
<p>Renda fixa é uma classe de investimentos onde você "empresta" seu dinheiro para uma entidade (governo, banco ou empresa) e recebe juros por isso. A "fixa" no nome se refere ao fato de que a regra de cálculo da remuneração é definida no momento da aplicação. Você já sabe como seu dinheiro vai render.</p>
<h2>Principais produtos de Renda Fixa</h2>
<h3>Tesouro Direto</h3>
<p>São títulos públicos emitidos pelo Governo Federal. São considerados os investimentos mais seguros do país.</p>
<ul>
    <li><strong>Tesouro Selic:</strong> Pós-fixado, acompanha a taxa Selic. Ideal para reserva de emergência.</li>
    <li><strong>Tesouro Prefixado:</strong> Você sabe exatamente quanto vai receber no vencimento. Bom para metas de médio prazo com juros em queda.</li>
    <li><strong>Tesouro IPCA+:</strong> Paga a inflação (IPCA) mais uma taxa fixa. Protege seu poder de compra. Ideal para longo prazo.</li>
</ul>
<h3>CDB (Certificado de Depósito Bancário)</h3>
<p>Você empresta dinheiro para bancos. A maioria rende um percentual do CDI (que anda colado na Selic) e tem garantia do FGC até R$ 250 mil.</p>
<h3>LCI e LCA (Letra de Crédito Imobiliário/Agronegócio)</h3>
<p>Similares ao CDB, mas isentas de Imposto de Renda para pessoa física. O dinheiro financia os setores imobiliário e do agronegócio. Também contam com a garantia do FGC.</p>

<h2>Comparativo de Rendimento Líquido (12 meses)</h2>
<p>Veja quanto R$ 10.000 renderiam em 12 meses nos principais produtos, já descontando o imposto quando aplicável:</p>`
      },
      {
        type: 'simulationTable',
        initialInvestment: 10000,
        terms: [12],
        scenarios: [
          { label: 'Poupança', rate: (cdi, selic) => selic > 8.5 ? 0.0617 : selic * 0.70, isTaxable: false },
          { label: 'Tesouro Selic', rate: (cdi, selic) => selic / 100, isTaxable: true },
          { label: 'CDB 100% CDI', rate: (cdi, selic) => cdi / 100, isTaxable: true },
          { label: 'LCI 90% CDI', rate: (cdi, selic) => (cdi / 100) * 0.90, isTaxable: false },
          { label: 'LCI 95% CDI', rate: (cdi, selic) => (cdi / 100) * 0.95, isTaxable: false },
          { label: 'CDB 110% CDI', rate: (cdi, selic) => (cdi / 100) * 1.10, isTaxable: true }
        ]
      },
      {
          type: 'html',
          content: `<p><em>Rendimento líquido em 12 meses. (Referência: {{dataAtualizacao}})</em></p><h2>Tabela de Equivalência: LCI/LCA vs. CDB</h2>
<p>Para saber se uma LCI/LCA isenta de IR vale mais a pena que um CDB com IR, use a tabela de equivalência. Ela mostra a taxa mínima que uma LCI/LCA precisa ter para superar um CDB a 100% do CDI.</p>
<table><thead><tr><th>Prazo da Aplicação</th><th>Alíquota IR (CDB)</th><th>Taxa LCI/LCA equivalente</th></tr></thead><tbody><tr><td>Até 6 meses</td><td>22,5%</td><td><strong>77,5% do CDI</strong></td></tr><tr><td>De 6 meses a 1 ano</td><td>20%</td><td><strong>80% do CDI</strong></td></tr><tr><td>De 1 a 2 anos</td><td>17,5%</td><td><strong>82,5% do CDI</strong></td></tr><tr><td>Acima de 2 anos</td><td>15%</td><td><strong>85% do CDI</strong></td></tr></tbody></table>
<p><em>CDI de referência: {{cdiRate}}% a.a. ({{dataAtualizacao}})</em></p>
`
      }
    ],
    conclusion: `<h2>Conclusão</h2><p>Renda fixa é a base de uma carteira de investimentos sólida. Com a Selic em {{selicRate}}% ao ano, ela se torna ainda mais atrativa. Comece pelo Tesouro Selic ou um CDB de liquidez diária para sua reserva de emergência e, aos poucos, explore outras opções para diversificar e potencializar seus ganhos com segurança.</p>`,
    faq: [
      {
        question: "Qual o melhor investimento em renda fixa para iniciantes?",
        answer: "O Tesouro Selic é a porta de entrada ideal. É o investimento mais seguro do Brasil, tem liquidez diária e rende mais que a poupança. Um CDB de liquidez diária que pague 100% do CDI é uma alternativa equivalente em termos de simplicidade."
      },
      {
        question: "Renda fixa tem algum risco?",
        answer: "Sim, mas os riscos são baixos. O principal é o risco de crédito (calote do emissor), que é mitigado pela garantia do FGC para CDBs/LCIs ou pelo Tesouro Nacional para títulos públicos. Títulos prefixados têm risco de mercado se vendidos antes do vencimento."
      },
      {
        question: "Onde investir em renda fixa?",
        answer: "Você pode investir através do seu banco ou de uma corretora de valores. Corretoras geralmente oferecem uma variedade maior de produtos e taxas mais competitivas, especialmente em CDBs e LCIs/LCAs de diferentes bancos."
      }
    ],
    category: 'renda-fixa',
    subcategory: 'guias',
    pillar: 'pillar-2-renda-fixa',
    cluster: 'renda-fixa-basico',
    tags: ["renda fixa", "guia renda fixa", "investir em renda fixa", "cdb", "tesouro direto", "lci"],
    disclaimer: defaultDisclaimer
  },
  {
    slug: 'o-que-e-lci',
    title: 'O que é LCI? Como funciona e se vale a pena',
    description: 'LCI é um título de renda fixa isento de Imposto de Renda para pessoa física. Entenda como funciona, quando compensa em relação ao CDB e como escolher o melhor opção.',
    seoTitle: 'O que é LCI? Como funciona e se vale a pena',
    seoDescription: 'LCI é um título de renda fixa isento de IR para pessoa física. Veja como funciona, quais os tipos, quando compensa mais que CDB e como investir.',
    date: '2026-03-20',
    imageId: 'blog-o-que-e-lci',
    content: [
      {
        type: 'html',
        content: `<h1>O que é LCI: como funciona, vantagens e quando vale a pena</h1><div class='resumo-rapido'><ul><li>LCI é um título de renda fixa emitido por bancos, lastreado em crédito imobiliário</li><li>É isento de Imposto de Renda para pessoa física — essa é a principal vantagem</li><li>Tem cobertura do FGC até R$ 250.000 por CPF por instituição</li><li>Geralmente tem carência mínima — não permite resgate imediato como o CDB de liquidez diária</li><li>Para saber se compensa, sempre compare o rendimento líquido com outras opções</li></ul></div><p>LCI é um dos investimentos de renda fixa mais procurados por quem quer pagar menos imposto. A isenção de IR para pessoa física é o principal atrativo — mas nem sempre isso significa que a LCI rende mais que um CDB ou o Tesouro Direto.</p><p>Este guia explica o que é, como funciona, quais os tipos disponíveis e como calcular se a isenção realmente compensa no seu caso.</p><h2>Tipos de LCI por rendimento</h2><p>Assim como os CDBs, as LCIs podem ter diferentes formas de remuneração:</p><table><thead><tr><th>Tipo de LCI</th><th>Como funciona</th></tr></thead><tbody><tr><td><strong>Pós-fixada</strong></td><td>A mais comum. Rende um percentual do CDI (ex: 95% do CDI).</td></tr><tr><td><strong>Prefixada</strong></td><td>A taxa é definida no momento da compra (ex: 11% ao ano).</td></tr><tr><td><strong>Híbrida (IPCA+)</strong></td><td>Paga a variação da inflação (IPCA) mais uma taxa fixa (ex: IPCA + 5% a.a.).</td></tr></tbody></table><h2>Simulação prática: CDB vs LCI</h2><p>Esta simulação mostra o rendimento líquido de R$ 10.000 em diferentes cenários, já descontando o IR quando aplicável.</p>`
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
        content: `<p><em>(Referência: {{dataAtualizacao}})</em></p><h2>Comparativo Rápido: LCI vs Outros Produtos</h2>`
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
          content: `<p><em>(Referência: {{dataAtualizacao}})</em></p>`
      }
    ],
    conclusion: `<h2>Conclusão</h2><p>LCI é uma excelente opção de renda fixa para quem tem um objetivo com prazo definido e pode abrir mão da liquidez imediata. A isenção de IR é uma vantagem real — mas só faz sentido quando a taxa oferecida é competitiva o suficiente para superar o rendimento líquido de outras opções.</p><p>A regra de ouro: sempre compare rendimento líquido, não taxa bruta. Uma LCI a {{lci90Rate}}% do CDI pode render menos que um CDB a {{cdb100Rate}}% do CDI no mesmo prazo.</p><p>Quer entender melhor essa comparação? <a href='/cdb-ou-lci'>Veja o comparativo completo entre CDB e LCI.</a></p>`,
    faq: [
      {
        question: "O que é LCI e como funciona?",
        answer: "LCI (Letra de Crédito Imobiliário) é um título de renda fixa emitido por bancos para financiar o setor imobiliário. Você empresta dinheiro ao banco e recebe juros isentos de IR. Tem cobertura do FGC até R$ 250.000 por CPF por instituição."
      },
      {
        question: "LCI é isenta de Imposto de Renda?",
        answer: "Sim, para pessoa física. O rendimento da LCI é totalmente isento de IR, independente do prazo. Para pessoa jurídica, o IR é cobrado normalmente."
      },
      {
        question: "LCI tem garantia do FGC?",
        answer: "Sim. O FGC garante até R$ 250.000 por CPF por instituição financeira em caso de falência do banco emissor. O limite global é de R$ 1.000.000 por CPF, renovável a cada 4 anos."
      },
      {
        question: "Qual a principal diferença entre LCI e CDB?",
        answer: "A principal diferença é o IR: LCI é isenta para pessoa física, CDB tem IR de 15% a 22,5% sobre o rendimento. LCI também tem carência mínima de 90 dias — não permite resgate imediato. Para saber qual rende mais, compare sempre o rendimento líquido."
      },
      {
        question: "LCI tem carência? Posso resgatar quando quiser?",
        answer: "Não. LCI tem carência mínima de 90 dias por regulamentação do Banco Central. A maioria das LCIs disponíveis tem liquidez apenas no vencimento. Verifique as condições antes de aplicar."
      },
      {
        question: "LCI rende mais que CDB?",
        answer: "Depende das taxas. Uma LCI a {{lci90Rate}}% do CDI pode render mais no líquido que um CDB a {{cdb100Rate}}% do CDI, por conta da isenção de IR. Mas um CDB a {{cdb120Rate}}% do CDI pode superar uma LCI a {{lci95Rate}}% do CDI. Compare sempre pelo rendimento líquido."
      },
      {
        question: "Qual o valor mínimo para investir em LCI?",
        answer: "Varia por instituição. Geralmente a partir de R$ 1.000, mas algumas plataformas digitais oferecem valores menores. Verifique as condições na corretora onde pretende investir."
      }
    ],
    category: 'renda-fixa',
    subcategory: 'lci',
    pillar: 'pillar-2-renda-fixa',
    cluster: 'lci-lca',
    tags: ["o que é LCI", "LCI", "renda fixa", "letra de crédito imobiliário", "isento IR", "FGC"],
    disclaimer: defaultDisclaimer,
  },
  {
    slug: 'renda-fixa-ou-renda-variavel',
    title: 'Renda Fixa ou Renda Variável: qual vale mais a pena?',
    description: 'Renda fixa ou renda variável: entenda as diferenças, riscos e quando cada uma faz sentido para o seu perfil e objetivo de investimento.',
    seoTitle: 'Renda Fixa ou Renda Variável: qual vale mais a pena?',
    seoDescription: 'Renda fixa ou renda variável? Entenda as diferenças, riscos, rentabilidade e quando cada uma faz sentido para o seu perfil. Comparativo completo com exemplos.',
    date: '2026-03-20',
    imageId: 'blog-fixa-vs-variavel',
    content: [
      {
        type: 'html',
        content: `<h1>Renda fixa ou renda variável: entenda as diferenças e quando escolher cada uma</h1>
<div class='resumo-rapido'>
    <ul>
        <li>Renda fixa tem retorno previsível — você sabe o quanto vai render antes de investir</li>
        <li>Renda variável não tem retorno garantido — pode render muito mais ou gerar prejuízo</li>
        <li>Para iniciantes, renda fixa é o ponto de partida recomendado</li>
        <li>A maioria dos investidores combina as duas — a proporção depende do perfil e do objetivo</li>
        <li>Antes de qualquer coisa: monte a reserva de emergência em renda fixa</li>
    </ul>
</div>
<p>Uma das primeiras dúvidas de quem começa a investir é: devo ir para renda fixa ou renda variável? A resposta honesta é: depende — e este guia vai te ajudar a entender do quê.</p>
<h2>Renda Fixa vs. Renda Variável: Tabela Comparativa</h2>
<table>
    <thead>
        <tr>
            <th>Critério</th>
            <th>Renda Fixa</th>
            <th>Renda Variável</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><strong>Previsibilidade</strong></td>
            <td>Alta. Você sabe a regra de remuneração no início.</td>
            <td>Baixa. O retorno não é conhecido e pode variar muito.</td>
        </tr>
        <tr>
            <td><strong>Risco</strong></td>
            <td>Baixo a moderado.</td>
            <td>Moderado a alto.</td>
        </tr>
        <tr>
            <td><strong>Potencial de Retorno</strong></td>
            <td>Limitado, mas geralmente estável.</td>
            <td>Ilimitado, mas com risco de perda.</td>
        </tr>
        <tr>
            <td><strong>Liquidez</strong></td>
            <td>Varia do diário (Tesouro Selic) ao vencimento (CDBs de prazo).</td>
            <td>Alta para ações líquidas (vende em dias úteis).</td>
        </tr>
        <tr>
            <td><strong>Garantia</strong></td>
            <td>FGC para CDBs/LCIs; Tesouro Nacional para títulos públicos.</td>
            <td>Nenhuma. O risco é do investidor.</td>
        </tr>
        <tr>
            <td><strong>Ideal para</strong></td>
            <td>Reserva de emergência, objetivos de curto/médio prazo, perfil conservador.</td>
            <td>Crescimento de patrimônio no longo prazo, perfil moderado/arrojado.</td>
        </tr>
    </tbody>
</table>
<h2>Qual tem maior rentabilidade?</h2>
<p>No longo prazo, a renda variável tende a ter uma rentabilidade maior que a renda fixa para compensar o risco mais elevado. No entanto, em períodos de juros altos, a renda fixa pode apresentar retornos muito atrativos com segurança.</p>
<p>Por exemplo, com a Selic em {{selicRate}}% ao ano, um CDB que paga 110% do CDI (aproximadamente {{cdbExampleRate}}% ao ano) oferece um retorno excelente com baixo risco.</p>
<p>(Dados de referência: {{dataAtualizacao}})</p>
<h2>Alocação por Perfil de Investidor</h2>
<table>
    <thead>
        <tr>
            <th>Perfil</th>
            <th>Renda Fixa</th>
            <th>Renda Variável</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><strong>Conservador</strong></td>
            <td>80% a 90%</td>
            <td>10% a 20%</td>
        </tr>
        <tr>
            <td><strong>Moderado</strong></td>
            <td>50% a 70%</td>
            <td>30% a 50%</td>
        </tr>
        <tr>
            <td><strong>Arrojado</strong></td>
            <td>20% a 40%</td>
            <td>60% a 80%</td>
        </tr>
    </tbody>
</table>
<p><em>Valores de referência. A alocação ideal deve ser personalizada.</em></p>
`
      },
    ],
    conclusion: `<h2>Conclusão</h2><p>Renda fixa e renda variável não são opostos — são complementares. A maioria dos investidores bem-sucedidos combina as duas, ajustando a proporção conforme o perfil, o objetivo e o momento de vida.</p><p>Para quem está começando: comece pela renda fixa, monte a reserva de emergência, entenda como os investimentos funcionam — e só então explore renda variável com uma parcela que você pode deixar parada por anos.</p><p>Quer dar o próximo passo? <a href='/como-comecar-a-investir'>Veja o guia completo de como começar a investir do zero.</a></p>`,
    faq: [
      {
        question: "Qual a diferença entre renda fixa e renda variável?",
        answer: "Renda fixa tem retorno previsível — definido ou seguindo uma regra conhecida como CDI ou Selic. Renda variável não tem retorno garantido — pode render muito mais ou gerar prejuízo, dependendo do desempenho do ativo e do mercado."
      },
      {
        question: "Renda fixa ou renda variável: qual é melhor para iniciantes?",
        answer: "Renda fixa é o ponto de partida recomendado para iniciantes. Antes de qualquer investimento em renda variável, o ideal é ter a reserva de emergência formada e entender como os produtos funcionam."
      },
      {
        question: "Renda variável rende mais que renda fixa?",
        answer: "No longo prazo, renda variável tende a superar renda fixa — mas com muito mais oscilação. Em períodos curtos, a renda variável pode render menos ou até gerar prejuízo. A comparação justa exige horizonte de 10 anos ou mais."
      },
      {
        question: "Posso ter renda fixa e renda variável ao mesmo tempo?",
        answer: "Sim — e é o que a maioria dos investidores faz. A proporção depende do perfil de risco, do objetivo e do prazo. Conservadores ficam com mais renda fixa; arrojados com mais renda variável."
      },
      {
        question: "Renda fixa tem risco?",
        answer: "Sim, mas é menor que a renda variável. O principal risco da renda fixa é o risco de crédito (calote do emissor) e, em alguns casos, o risco de mercado (marcação a mercado em títulos prefixados e IPCA+). Produtos com FGC e Tesouro Direto têm risco muito baixo."
      },
      {
        question: "Qual o melhor investimento para longo prazo: renda fixa ou variável?",
        answer: "Para horizontes de 10 anos ou mais, uma combinação das duas tende a ser mais eficiente. Renda variável tem potencial de retorno maior no longo prazo, mas exige tolerância a oscilações. Renda fixa garante a base e a reserva."
      },
      {
        question: "Por onde começar: renda fixa ou renda variável?",
        answer: "Comece pela renda fixa. Monte a reserva de emergência no Tesouro Selic ou CDB de liquidez diária. Depois, invista objetivos de médio prazo em renda fixa. Só então, com a base montada, explore renda variável para objetivos de longo prazo."
      }
    ],
    category: 'investimentos',
    subcategory: 'para-iniciantes',
    pillar: 'pillar-1-investimentos',
    cluster: 'comecar-a-investir',
    tags: ["renda fixa ou renda variável", "diferença renda fixa variável", "investimentos renda fixa", "renda variável iniciantes"],
    disclaimer: defaultDisclaimer,
  },
  {
    slug: 'como-comecar-a-investir',
    title: 'Como Começar a Investir do Zero: Guia para Iniciantes',
    description: 'Guia completo para começar a investir do zero. Entenda seu perfil, monte sua reserva, escolha os primeiros investimentos e abra conta em uma corretora.',
    seoTitle: 'Como Começar a Investir do Zero: Guia Completo 2026',
    seoDescription: 'Aprenda o passo a passo para começar a investir do zero em 2026. Guia completo sobre reserva de emergência, perfil de investidor e primeiros investimentos.',
    date: '2026-03-20',
    imageId: 'blog-comecar-investir',
    content: [
      {
        type: 'html',
        content: `<h1>Como Começar a Investir do Zero: Guia Passo a Passo para Iniciantes</h1>
<div class='resumo-rapido'>
  <ul>
    <li>O primeiro passo não é escolher um investimento, mas sim montar sua <strong>reserva de emergência</strong>.</li>
    <li>Entenda seu <strong>perfil de investidor</strong> (conservador, moderado, arrojado) para escolher produtos adequados.</li>
    <li>Comece pela <strong>renda fixa</strong> (Tesouro Selic, CDB de liquidez diária) — são seguros e rendem mais que a poupança.</li>
    <li>Use uma <strong>corretora de valores</strong> para ter acesso a mais produtos e taxas melhores que os grandes bancos.</li>
    <li>Invista com <strong>consistência</strong>, mesmo que pouco. Aportes mensais são mais importantes que tentar acertar o "timing" do mercado.</li>
  </ul>
</div>
<p>Começar a investir pode parecer intimidador, com tantas siglas e opções. Mas a verdade é que o processo pode ser simples e direto. Este guia passo a passo foi feito para você que está começando do zero e quer construir um futuro financeiro sólido.</p>
<h2>Passo 1: Monte sua Reserva de Emergência (O Alicerce)</h2>
<p>Antes de pensar em ações, FIIs ou criptomoedas, você precisa de um colchão de segurança. A reserva de emergência é um dinheiro guardado para cobrir imprevistos (problemas de saúde, perda de emprego, etc.) sem que você precise vender seus investimentos em um momento ruim.</p>
<ul>
  <li><strong>Quanto guardar?</strong> De 6 a 12 meses do seu custo de vida mensal.</li>
  <li><strong>Onde guardar?</strong> Em um investimento com segurança máxima e liquidez diária (poder resgatar a qualquer momento).</li>
</ul>
<p>As melhores opções são:</p>
<ul>
  <li><strong>Tesouro Selic:</strong> Título público do governo, considerado o investimento mais seguro do Brasil.</li>
  <li><strong>CDB de liquidez diária que pague 100% do CDI ou mais:</strong> Oferecido por bancos e corretoras, com garantia do FGC.</li>
</ul>
<h2>Passo 2: Defina seus Objetivos e Prazos</h2>
<p>Para que você está investindo? A resposta muda tudo.</p>
<ul>
  <li><strong>Curto Prazo (até 2 anos):</strong> Comprar um carro, fazer uma viagem. Exige segurança. Use renda fixa.</li>
  <li><strong>Médio Prazo (2 a 5 anos):</strong> Dar entrada em um imóvel, fazer um intercâmbio. Permite um pouco mais de risco.</li>
  <li><strong>Longo Prazo (acima de 5 anos):</strong> Aposentadoria, independência financeira. Permite assumir mais riscos em busca de maior rentabilidade.</li>
</ul>
<h2>Passo 3: Descubra seu Perfil de Investidor</h2>
<p>Seu perfil determina o quanto de risco você está disposto a correr. Seja honesto com você mesmo.</p>
<table>
  <thead>
    <tr>
      <th>Perfil</th>
      <th>Descrição</th>
      <th>Produtos Indicados</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Conservador</strong></td>
      <td>Prioriza segurança acima de tudo. Não tolera perdas.</td>
      <td>Tesouro Selic, CDBs, LCI/LCA, poupança.</td>
    </tr>
    <tr>
      <td><strong>Moderado</strong></td>
      <td>Busca um equilíbrio entre segurança e rentabilidade. Aceita alguma oscilação.</td>
      <td>Mix de renda fixa, FIIs e ETFs.</td>
    </tr>
    <tr>
      <td><strong>Arrojado</strong></td>
      <td>Foca em alta rentabilidade, mesmo que isso signifique correr mais riscos.</td>
      <td>Ações, FIIs, ETFs, criptomoedas.</td>
    </tr>
  </tbody>
</table>
<h2>Passo 4: Escolha os Primeiros Investimentos</h2>
<p>Com a reserva montada e o perfil definido, é hora de escolher. Para iniciantes, o caminho mais seguro é começar pela renda fixa e, aos poucos, explorar a renda variável.</p>
<h3>Renda Fixa: Segurança e Previsibilidade</h3>
<p>Produtos como Tesouro Direto e CDBs são excelentes para começar. Eles rendem mais que a poupança com segurança similar ou até maior. Veja a comparação de rendimento líquido para R$ 10.000 por 12 meses:</p>`
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
        content: `<p><em>(Referência: {{dataAtualizacao}})</em></p><p>Note como a poupança rende significativamente menos. CDBs e Tesouro Selic têm desconto de IR, que segue a tabela regressiva:</p>
<table>
  <thead>
    <tr>
      <th>Prazo</th>
      <th>Alíquota de IR</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Até 180 dias</td><td>22,5%</td></tr>
    <tr><td>181 a 360 dias</td><td>20%</td></tr>
    <tr><td>361 a 720 dias</td><td>17,5%</td></tr>
    <tr><td>Acima de 720 dias</td><td>15%</td></tr>
  </tbody>
</table>
<h3>Renda Variável: Potencial de Crescimento</h3>
<p>Depois de formar sua base em renda fixa, você pode começar a explorar a renda variável para objetivos de longo prazo. As melhores portas de entrada são:</p>
<ul>
  <li><strong>Fundos Imobiliários (FIIs):</strong> Para receber uma renda mensal com aluguéis de imóveis, isenta de IR.</li>
  <li><strong>ETFs (Fundos de Índice):</strong> Para investir em centenas de ações de uma vez com uma única cota, como o BOVA11 (Bolsa brasileira) ou IVVB11 (Bolsa americana).</li>
</ul>`
      }
    ],
    conclusion: `<h2>Conclusão: O Segredo é Começar</h2>
<p>Começar a investir é um processo de aprendizado contínuo. Não espere saber tudo para dar o primeiro passo. Comece com pouco, em produtos seguros como o Tesouro Selic, e vá aumentando seus aportes e diversificando sua carteira conforme ganha confiança e conhecimento.</p>
<p>Lembre-se: o maior risco é não investir e deixar a inflação corroer seu poder de compra. O tempo é seu maior aliado. Comece hoje.</p>`,
    faq: [
      {
        question: "Qual o valor mínimo para começar a investir?",
        answer: "Hoje é possível começar com muito pouco. No Tesouro Direto, você pode investir a partir de R$ 30. Em muitas corretoras, você encontra CDBs, FIIs e ações a partir de R$ 1 a R$ 100."
      },
      {
        question: "Qual o melhor investimento para quem está começando?",
        answer: "O Tesouro Selic é universalmente recomendado como o primeiro investimento. É o mais seguro do Brasil, tem liquidez diária e rende mais que a poupança. Um CDB de liquidez diária que pague 100% do CDI é uma alternativa equivalente em termos de simplicidade."
      },
      {
        question: "É melhor investir por banco ou corretora?",
        answer: "Corretoras geralmente oferecem mais produtos, taxas menores e melhores plataformas. Para quem está começando, abrir uma conta gratuita em uma corretora digital (como XP, Rico, NuInvest) é o caminho mais recomendado."
      },
      {
        question: "Preciso declarar Imposto de Renda ao começar a investir?",
        answer: "Depende. Operações na bolsa de valores (ações, FIIs) te obrigam a declarar, mesmo que não tenha tido lucro. Para renda fixa, você só precisa declarar se o total de bens (incluindo o valor investido) ultrapassar o limite de isenção da Receita Federal."
      }
    ],
    category: 'investimentos',
    subcategory: 'para-iniciantes',
    pillar: 'pillar-1-investimentos',
    cluster: 'comecar-a-investir',
    tags: ["como começar a investir", "investir do zero", "guia para iniciantes", "primeiros investimentos", "reserva de emergência"],
    disclaimer: defaultDisclaimer,
  },
  {
    slug: 'reserva-de-emergencia',
    title: 'Reserva de Emergência: quanto guardar e onde deixar o dinheiro',
    description: 'Reserva de emergência é o dinheiro guardado para imprevistos. Veja quanto guardar, onde deixar e quais produtos têm liquidez e segurança para esse fim.',
    seoTitle: 'Reserva de Emergência: quanto guardar e onde investir',
    seoDescription: 'Saiba quanto guardar na reserva de emergência, onde deixar o dinheiro com liquidez e segurança, e por que ela deve vir antes de qualquer investimento.',
    date: '2026-03-20',
    imageId: 'blog-reserva-emergencia',
    content: [{type: 'html', content: `<h1>Reserva de emergência: quanto guardar, onde deixar e como montar a sua</h1><div class='resumo-rapido'><ul><li>Reserva de emergência é o dinheiro separado para imprevistos — não para investir, mas para proteger</li><li>O valor ideal é de 3 a 6 meses de despesas mensais (6 a 12 meses para autônomos e MEIs)</li><li>Precisa ter liquidez imediata — você deve conseguir resgatar em até 1 dia útil</li><li>Os melhores produtos: Tesouro Selic, CDB de liquidez diária e conta remunerada</li><li>Monte a reserva antes de qualquer outro investimento — sem exceção</li></ul></div><p>Reserva de emergência é o alicerce de qualquer vida financeira saudável. Sem ela, qualquer imprevisto — demissão, problema de saúde, carro quebrado — pode destruir um planejamento financeiro que levou anos para construir.</p>`}],
    conclusion: "<h2>Conclusão</h2><p>Reserva de emergência não é opcional — é o primeiro passo de qualquer planejamento financeiro sério. Sem ela, você está sempre a um imprevisto de distância do endividamento.</p><p>Monte a sua antes de qualquer outro investimento. Use Tesouro Selic ou CDB de liquidez diária. E não mexa nela a não ser em emergências reais.</p>",
    faq: [
      {
        question: "Quanto devo ter de reserva de emergência?",
        answer: "O recomendado é de 3 a 6 meses de despesas mensais para quem tem renda estável (CLT). Para autônomos, MEIs e quem tem dependentes, o ideal é de 6 a 12 meses. Calcule: despesas mensais × número de meses recomendado."
      },
      {
        question: "Onde deixar a reserva de emergência?",
        answer: "Os melhores produtos são Tesouro Selic e CDB de liquidez diária. Os dois têm liquidez em até 1 dia útil, segurança alta e rendimento muito acima da poupança. Evite deixar a reserva na poupança — ela rende pouco com a Selic atual."
      },
      {
        question: "Posso investir a reserva de emergência em ações ou FIIs?",
        answer: "Não. Renda variável tem oscilação de preço — você pode ser forçado a vender em queda justamente quando precisar do dinheiro. A reserva de emergência deve estar em produtos de renda fixa com liquidez diária e sem risco de perda do principal."
      },
      {
        question: "Tesouro Selic ou CDB para reserva de emergência?",
        answer: "Os dois são ótimas opções. O Tesouro Selic é garantido pelo Governo Federal (sem limite). O CDB de liquidez diária tem cobertura do FGC até R$ 250.000 por instituição. Para reservas abaixo desse valor, os dois são equivalentes em segurança."
      },
      {
        question: "Devo montar a reserva antes de pagar dívidas?",
        answer: "Depende. Dívidas com juros muito altos (cartão de crédito, cheque especial) devem ser quitadas antes. Para dívidas de juros baixos (financiamento imobiliário), é possível montar a reserva e pagar simultaneamente. Uma reserva mínima de 1 a 2 meses já ajuda a evitar novos endividamentos."
      },
      {
        question: "Posso usar a reserva de emergência para aproveitar uma oportunidade de investimento?",
        answer: "Não. Reserva de emergência é para imprevistos — não para oportunidades. Usar esse dinheiro para investir deixa você desprotegido. Se quiser investir em oportunidades, crie um segundo objetivo separado da reserva."
      },
      {
        question: "Quanto tempo leva para montar uma reserva de emergência?",
        answer: "Depende do valor da reserva e do quanto você poupa por mês. Com R$ 500 mensais, uma reserva de R$ 12.000 leva cerca de 24 meses. O importante é começar com o que tiver e manter consistência — uma reserva parcial já oferece proteção."
      }
    ],
    category: 'educacao-financeira',
    subcategory: 'reserva-de-emergencia',
    pillar: 'pillar-4-educacao-financeira',
    cluster: 'reserva-de-emergencia',
    tags: ["reserva de emergência", "quanto guardar reserva emergência", "onde deixar reserva emergência", "Tesouro Selic reserva", "CDB liquidez diária"],
    disclaimer: defaultDisclaimer,
  },
  {
    slug: 'calculadora-juros-compostos',
    title: 'Calculadora de Juros Compostos com Aportes Mensais',
    description: 'Calcule quanto seu dinheiro vai render com juros compostos e aportes mensais. Veja simulações prontas e entenda como o tempo afeta o crescimento do patrimônio.',
    seoTitle: 'Calculadora de Juros Compostos com Aportes Mensais 2026',
    seoDescription: 'Use a calculadora de juros compostos com aportes mensais. Simule quanto rende seu investimento em 1, 5, 10 e 20 anos com exemplos práticos e tabelas prontas.',
    date: '2026-03-20',
    imageId: 'blog-calculadora-juros-compostos',
    content: [{type: 'html', content: `<h1>Calculadora de juros compostos: simule quanto seu dinheiro vai render com aportes mensais</h1><div class='resumo-rapido'><ul><li>Juros compostos são juros que incidem sobre juros — o efeito cresce exponencialmente com o tempo</li><li>Quanto mais cedo você começa, mais poderoso o efeito — o tempo é o principal fator</li><li>Aportes mensais regulares potencializam muito mais o resultado do que um único aporte inicial</li><li>Use a calculadora abaixo para simular seu cenário específico</li><li>As simulações desta página assumem taxa constante — o rendimento real pode variar</li></ul></div><p>Juros compostos são frequentemente chamados de a oitava maravilha do mundo. O conceito é simples: os juros de um período são somados ao capital, e no período seguinte os juros incidem sobre esse novo valor maior. Com o tempo, o efeito se torna exponencial.</p>`}],
    conclusion: "<h2>Conclusão</h2><p>Juros compostos são a ferramenta mais poderosa que um investidor tem — e o tempo é o combustível que os alimenta. Quanto mais cedo você começa e mais consistente você é, maior o efeito.</p><p>A simulação mais importante não é a que mostra o maior número — é a que te faz agir hoje.</p><p>Quer começar a investir agora? <a href='/como-comecar-a-investir'>Veja o guia completo de como começar a investir do zero.</a></p>",
    faq: [
      {
        question: "O que são juros compostos?",
        answer: "Juros compostos são juros que incidem sobre o saldo acumulado — incluindo os juros anteriores. A cada período, os juros são somados ao capital e no período seguinte geram novos juros sobre esse valor maior. O efeito cresce exponencialmente com o tempo."
      },
      {
        question: "Qual a fórmula dos juros compostos?",
        answer: "M = C × (1 + i)^t, onde M é o montante final, C é o capital inicial, i é a taxa de juros por período e t é o número de períodos. Com aportes mensais, a fórmula se expande: M = C × (1+i)^t + A × [(1+i)^t - 1] / i, onde A é o aporte mensal."
      },
      {
        question: "Quanto rende R$ 1.000 por mês com juros compostos em 10 anos?",
        answer: "Com uma taxa de 10% ao ano, R$ 1.000 por mês investidos por 10 anos resultam em um montante bruto de aproximadamente R$ 203.000, sendo R$ 120.000 de aportes e R$ 83.000 de rendimento. O valor líquido depende do IR e do produto escolhido."
      },
      {
        question: "Qual a diferença entre juros simples e compostos?",
        answer: "Em juros simples, os juros sempre incidem sobre o capital inicial. Em juros compostos, os juros de cada período são somados ao saldo e geram novos juros sobre esse valor maior. No longo prazo, a diferença é enorme — juros compostos crescem exponencialmente."
      },
      {
        question: "Os juros compostos se aplicam à renda fixa?",
        answer: "Sim. Produtos de renda fixa como CDB, Tesouro Direto e LCI usam juros compostos com capitalização diária ou mensal. O rendimento de cada dia é incorporado ao saldo e gera novos rendimentos no dia seguinte."
      },
      {
        question: "Quanto tempo leva para dobrar o dinheiro com juros compostos?",
        answer: "Use a Regra dos 72: divida 72 pela taxa anual. Com 10% ao ano, o dinheiro dobra em aproximadamente 7,2 anos. Com 12% ao ano, em 6 anos. Com 6% ao ano, em 12 anos."
      },
      {
        question: "Qual o melhor investimento para aproveitar os juros compostos?",
        answer: "Qualquer produto de renda fixa com reinvestimento automático dos rendimentos aproveita os juros compostos — CDB, Tesouro Direto e LCI. O mais importante é manter o dinheiro investido por mais tempo e fazer aportes regulares."
      }
    ],
    category: 'ferramentas',
    subcategory: 'calculadoras',
    pillar: 'hub-ferramentas',
    cluster: 'ferramentas-calculadoras',
    tags: ["calculadora juros compostos", "juros compostos aportes mensais", "simulador investimento", "quanto rende por mês", "juros compostos"],
    disclaimer: defaultDisclaimer,
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
        content: `<h1>Quanto rende R$ 1.000 no CDB? Simulação com rendimento líquido</h1><div class='resumo-rapido'><ul><li>Com CDI a {{cdiRate}}% ao ano, R$ 1.000 no CDB a 100% do CDI rendem aproximadamente R$ 83 líquidos em 6 meses</li><li>Em 12 meses, o rendimento líquido é de aproximadamente R$ 109</li><li>O CDB rende quase o dobro da poupança no mesmo período</li><li>A simulação abaixo considera IR regressivo — sempre compare rendimento líquido</li><li>Taxas variam por produto e emissor — use como referência, não como promessa</li></ul></div><p>R$ 1.000 pode parecer pouco para investir — mas é um ótimo ponto de partida. E saber exatamente quanto esse valor vai render ajuda a planejar aportes futuros e comparar produtos com clareza.</p><p>Esta simulação mostra o rendimento de R$ 1.000 no CDB em diferentes prazos e taxas, com os impostos reais descontados.</p><h2>Simulação: quanto rende R$ 1.000 em diferentes taxas de CDB</h2>`
      },
      {
        type: 'simulationTable',
        initialInvestment: 1000,
        terms: [6, 12, 24, 36],
        scenarios: [
            { label: 'CDB 90% CDI líquido', rate: (cdi, selic) => (cdi / 100) * 0.9, isTaxable: true },
            { label: 'CDB 100% CDI líquido', rate: (cdi, selic) => cdi / 100, isTaxable: true },
            { label: 'CDB 110% CDI líquido', rate: (cdi, selic) => (cdi / 100) * 1.10, isTaxable: true },
            { label: 'CDB 120% CDI líquido', rate: (cdi, selic) => (cdi / 100) * 1.2, isTaxable: true },
        ],
      },
      {
          type: 'html',
          content: `<p><em>(Referência: {{dataAtualizacao}})</em></p><h2>Quanto rende R$ 1.000 na poupança no mesmo período?</h2>`
      },
      {
          type: 'simulationTable',
          initialInvestment: 1000,
          terms: [6, 12, 24, 36],
          showDifference: true,
          scenarios: [
              { label: 'Poupança ({{poupancaRate}}% a.a.)', rate: (cdi, selic) => selic > 8.5 ? 0.0617 : selic * 0.70, isTaxable: false },
              { label: 'CDB 100% CDI líquido', rate: (cdi, selic) => cdi / 100, isTaxable: true },
          ]
      },
      {
        type: 'html',
        content: `<p><em>(Referência: {{dataAtualizacao}})</em></p><p>Em 36 meses, o CDB a 100% do CDI rende mais que o dobro da poupança para cada R$ 1.000 investidos. Proporcionalmente ao valor aplicado, a diferença é significativa.</p><h2>Como maximizar o rendimento de R$ 1.000 no CDB</h2><p><strong>1. Escolha a maior taxa disponível dentro do seu prazo</strong><br>Compare CDBs de diferentes emissores na plataforma da sua corretora. Bancos menores costumam oferecer taxas mais altas — dentro do limite do FGC, o risco é controlado.</p><p><strong>2. Reinvista o rendimento</strong><br>Se não precisar do dinheiro, deixe o rendimento acumular. É exatamente o reinvestimento automático que cria o efeito dos juros compostos.</p>`
      }
    ],
    conclusion: `<h2>Conclusão</h2><p>R$ 1.000 no CDB a 100% do CDI rende aproximadamente R$ 109 líquidos em 12 meses — contra R$ 62 na poupança no mesmo período. A diferença cresce com o tempo e com o valor investido.</p><p>Para começar, o mais importante é escolher um produto adequado ao seu objetivo, respeitar o prazo e manter a consistência dos aportes.</p><p>Quer entender melhor o CDB? <a href='/o-que-e-cdb'>Leia o guia completo sobre o CDB.</a> Ou <a href='/cdb-ou-poupanca'>veja a comparação completa entre CDB e poupança.</a></p>`,
    faq: [
      {
        question: "Quanto rende R$ 1.000 no CDB em 12 meses?",
        answer: "Com CDI a {{cdiRate}}% ao ano, R$ 1.000 no CDB a 100% do CDI rendem aproximadamente R$ 109 líquidos em 12 meses, após o desconto do IR de 20%. O saldo final seria de cerca de R$ 1.109."
      },
      {
        question: "Quanto rende R$ 1.000 no CDB por mês?",
        answer: "Com CDI a {{cdiRate}}% ao ano, R$ 1.000 rendem aproximadamente R$ 8,34 líquidos por mês (após IR de 22,5% nos primeiros 180 dias). O rendimento mensal melhora conforme a alíquota de IR diminui com o tempo."
      },
      {
        question: "R$ 1.000 no CDB rende mais que na poupança?",
        answer: "Sim. Em 12 meses, o CDB a 100% do CDI rende aproximadamente R$ 109 líquidos contra R$ 62 na poupança no mesmo período — quase o dobro."
      },
      {
        question: "Qual o mínimo para investir em CDB?",
        answer: "Em algumas corretoras digitais é possível investir a partir de R$ 1. Em bancos tradicionais o mínimo pode ser R$ 1.000 ou mais. Verifique as condições na plataforma onde pretende investir."
      },
      {
        question: "CDB de R$ 1.000 tem garantia do FGC?",
        answer: "Sim. O FGC garante até R$ 250.000 por CPF por instituição financeira. R$ 1.000 está muito dentro do limite — o risco de perda é praticamente zero dentro dessa cobertura."
      },
      {
        question: "Quanto rende R$ 1.000 no CDB a 110% do CDI em 12 meses?",
        answer: "Com CDI a {{cdiRate}}% ao ano e IR de 20% (prazo de 12 meses), um CDB a 110% do CDI rende aproximadamente R$ 120 líquidos em 12 meses para cada R$ 1.000 investidos."
      },
      {
        question: "Vale a pena investir apenas R$ 1.000 no CDB?",
        answer: "Sim. Começar com R$ 1.000 e adicionar aportes mensais é uma ótima estratégia. O efeito dos juros compostos cresce com o tempo, e manter a consistência dos aportes é mais importante do que o valor inicial."
      }
    ],
    category: 'renda-fixa',
    subcategory: 'cdb',
    pillar: 'pillar-2-renda-fixa',
    cluster: 'cdb',
    tags: ["quanto rende 1000 no CDB", "simulação CDB", "rendimento CDB", "CDB 1000 reais", "renda fixa simulação"],
    disclaimer: defaultDisclaimer,
  },
  {
    slug: 'o-que-e-tesouro-direto',
    title: 'O que é Tesouro Direto? Guia para Iniciantes 2026',
    description: 'Entenda o que é Tesouro Direto, os tipos de títulos (Selic, Prefixado, IPCA+), segurança, taxas e como começar a investir no investimento mais seguro do Brasil.',
    date: '2026-03-20',
    imageId: 'blog-o-que-e-tesouro-direto',
    content: [{
      type: 'html',
      content: `<h1>O que é Tesouro Direto: Guia Completo para Iniciantes</h1>
      <p>O Tesouro Direto é um programa do Governo Federal para venda de títulos públicos a pessoas físicas. Na prática, é como se você estivesse emprestando dinheiro para o governo em troca de juros. É considerado o investimento mais seguro do país.</p>
    `}],
    conclusion: `<h2>Conclusão</h2><p>Tesouro Direto é a porta de entrada mais segura e acessível para o mundo dos investimentos. É ideal para a reserva de emergência (Tesouro Selic) e para objetivos de médio e longo prazo (Prefixado e IPCA+).</p>`,
    seoTitle: 'O que é Tesouro Direto? Guia Completo 2026',
    seoDescription: 'Aprenda o que é Tesouro Direto, como funciona, quais são os tipos de títulos (Selic, Prefixado, IPCA+), riscos, taxas e como começar a investir com segurança.',
    faq: [],
    category: 'renda-fixa',
    subcategory: 'tesouro-direto',
    pillar: 'pillar-2-renda-fixa',
    cluster: 'tesouro-direto',
    tags: ["o que é tesouro direto", "tesouro direto", "tesouro selic", "tesouro ipca", "tesouro prefixado", "investir no tesouro"],
    disclaimer: defaultDisclaimer
  },
  {
    slug: 'o-que-sao-fiis',
    title: 'O que são FIIs? Como funcionam os Fundos Imobiliários',
    description: 'FIIs são fundos de investimento imobiliário negociados na bolsa. Entenda como funcionam, como geram renda mensal, os tipos disponíveis e como começar a investir.',
    date: '2026-03-20',
    imageId: 'blog-o-que-sao-fiis',
    content: [{
      type: 'html',
      content: `<h1>O que são FIIs? Como funcionam os Fundos Imobiliários</h1><div class='resumo-rapido'><ul><li>FIIs (Fundos Imobiliários) permitem investir em imóveis com pouco dinheiro, comprando cotas na bolsa.</li><li>A maioria paga rendimentos mensais, que são isentos de Imposto de Renda para pessoa física.</li><li>Existem FIIs de tijolo (imóveis físicos), de papel (dívidas imobiliárias) e de fundos (FOFs).</li><li>Como são renda variável, o preço das cotas oscila, e não há garantia de rendimento.</li><li>A análise de indicadores como P/VP e Dividend Yield é crucial antes de investir.</li></ul></div><p>Os Fundos de Investimento Imobiliário (FIIs) se tornaram uma das formas mais populares para o brasileiro investir em imóveis. Em vez de comprar um apartamento ou sala comercial — o que exige muito dinheiro —, você pode comprar uma pequena parte de grandes empreendimentos com poucos reais, diretamente pela bolsa de valores.</p><p>Este guia completo explica o que são FIIs, como funcionam, quais os tipos e como você pode começar a receber uma renda mensal com eles.</p><h2>O que são Fundos Imobiliários (FIIs)</h2><p>Um Fundo de Investimento Imobiliário (FII) é um fundo que reúne o dinheiro de vários investidores para aplicar em ativos do mercado imobiliário. Esses ativos podem ser imóveis físicos (shoppings, galpões logísticos, prédios de escritórios) ou títulos de dívida imobiliária (CRI, LCI).</p><p>Ao investir em um FII, você se torna cotista do fundo, ou seja, dono de uma pequena fração de todos os ativos que ele possui. A gestão do fundo é feita por um gestor profissional, responsável por comprar, vender e administrar os imóveis e títulos.</p><h2>Como os FIIs funcionam e geram renda?</h2><p>O funcionamento é simples: o fundo gera receita com seus ativos e distribui a maior parte para os cotistas. A receita pode vir de:</p><ul><li><strong>Aluguéis:</strong> de shoppings, galpões, escritórios, etc. (FIIs de tijolo).</li><li><strong>Juros e correção monetária:</strong> de títulos como CRIs. (FIIs de papel).</li><li><strong>Venda de imóveis:</strong> o fundo pode vender um imóvel com lucro e distribuir parte desse ganho.</li></ul><p>Por lei, os FIIs são obrigados a distribuir pelo menos 95% do lucro caixa apurado a cada semestre. Na prática, a grande maioria faz essa distribuição mensalmente. É por isso que FIIs são famosos por gerar <strong>renda passiva mensal</strong>.</p><p>Para o investidor pessoa física, esses rendimentos distribuídos são <strong>isentos de Imposto de Renda</strong>.</p><h2>Principais tipos de FIIs</h2><p>Os FIIs são classificados principalmente pelo tipo de ativo em que investem:</p><table><thead><tr><th>Tipo de FII</th><th>O que é</th><th>Risco principal</th></tr></thead><tbody><tr><td><strong>FIIs de Tijolo</strong></td><td>Investem em imóveis físicos (shoppings, galpões, lajes corporativas, hospitais). A renda vem principalmente de aluguéis.</td><td>Vacância (imóveis vazios) e desvalorização do imóvel.</td></tr><tr><td><strong>FIIs de Papel</strong></td><td>Investem em títulos de dívida imobiliária, como CRIs. A renda vem de juros e correção monetária.</td><td>Risco de crédito (calote dos devedores) e sensibilidade aos juros.</td></tr><tr><td><strong>FIIs de Fundos (FOFs)</strong></td><td>Investem em cotas de outros FIIs. É uma forma de diversificar com um único ativo.</td><td>Taxa de administração em cascata e desempenho atrelado à seleção do gestor.</td></tr><tr><td><strong>FIIs Híbridos</strong></td><td>Mesclam diferentes tipos de ativos (tijolo, papel, outros FIIs) na mesma carteira.</td><td>Combinação dos riscos de cada classe de ativo.</td></tr></tbody></table><h2>Vantagens e Riscos de investir em FIIs</h2><h3>Vantagens</h3><ul><li><strong>Renda mensal isenta de IR:</strong> Ideal para quem busca um fluxo de renda passiva.</li><li><strong>Acessibilidade:</strong> Com menos de R$ 100 já é possível comprar cotas de bons fundos.</li><li><strong>Diversificação:</strong> Com uma única cota, você investe em múltiplos imóveis ou títulos.</li><li><strong>Liquidez:</strong> Cotas são negociadas na B3, sendo mais fácil de vender que um imóvel físico.</li><li><strong>Gestão profissional:</strong> Você não precisa se preocupar com inquilinos ou burocracia.</li></ul><h3>Riscos</h3><ul><li><strong>Risco de Mercado:</strong> O preço das cotas oscila na bolsa de valores, como o de ações.</li><li><strong>Risco de Vacância:</strong> Nos FIIs de tijolo, a saída de inquilinos pode reduzir os rendimentos.</li><li><strong>Risco de Crédito:</strong> Nos FIIs de papel, há o risco de os devedores dos CRIs não pagarem.</li><li><strong>Risco de Liquidez:</strong> Fundos menores podem ter baixo volume de negociação, dificultando a venda de cotas.</li></ul><h2>Como analisar um FII antes de investir</h2><p>Analisar um FII não precisa ser complicado. Para iniciantes, alguns indicadores já dão uma boa visão:</p><ul><li><strong>Dividend Yield (DY):</strong> É o rendimento distribuído nos últimos 12 meses dividido pelo preço atual da cota. Mostra o retorno em dividendos.</li><li><strong>P/VP (Preço/Valor Patrimonial):</strong> Compara o preço da cota com o valor patrimonial. P/VP abaixo de 1 pode indicar que o fundo está "barato". Acima de 1, "caro".</li><li><strong>Vacância:</strong> Percentual de imóveis do fundo que estão desocupados. Quanto menor, melhor.</li><li><strong>Qualidade dos ativos e inquilinos:</strong> Verifique quem são os inquilinos e a localização dos imóveis.</li><li><strong>Gestão:</strong> Pesquise sobre o histórico e a reputação do gestor do fundo.</li></ul><h2>Como começar a investir em FIIs</h2><p><strong>Passo 1:</strong> Abra conta em uma corretora de valores regulamentada pela CVM.</p><p><strong>Passo 2:</strong> Transfira o dinheiro que deseja investir para a conta da corretora.</p><p><strong>Passo 3:</strong> Acesse o home broker (a plataforma de negociação da corretora).</p><p><strong>Passo 4:</strong> Busque pelo ticker do FII desejado (ex: MXRF11, HGLG11).</p><p><strong>Passo 5:</strong> Envie a ordem de compra, informando a quantidade de cotas e o preço. Após a execução, as cotas aparecerão na sua carteira.</p>`,
    }],
    conclusion: `<h2>Conclusão</h2><p>FIIs são uma excelente porta de entrada para a renda variável e para o mercado imobiliário. Permitem diversificar a carteira e receber uma renda mensal isenta de IR com um valor inicial baixo.</p><p>Mas é fundamental entender que são renda variável: o preço das cotas oscila. Comece com uma parcela pequena do seu patrimônio, estude os fundos e entenda os riscos antes de aumentar a posição.</p><p>Quer comparar FIIs com outras classes de ativos? Veja a <a href='/fii-ou-acao'>comparação entre FIIs e ações</a> e <a href='/fii-ou-renda-fixa'>FIIs vs renda fixa</a>.</p>`,
    seoTitle: "O que são FIIs? Guia completo sobre Fundos Imobiliários",
    seoDescription: "FIIs são fundos imobiliários que pagam renda mensal isenta de IR. Veja como funcionam, os tipos, riscos, como escolher e como começar a investir.",
    faq: [
      { question: "O que são FIIs e como funcionam?", answer: "FIIs são fundos que investem em imóveis ou títulos imobiliários e distribuem rendimentos mensais para os cotistas. São negociados na B3 e permitem investir no mercado imobiliário a partir do preço de uma cota." },
      { question: "FII paga renda todo mês?", answer: "A maioria dos FIIs distribui rendimentos mensalmente. Por lei, os FIIs devem distribuir pelo menos 95% do lucro caixa semestral. O valor pode variar conforme o desempenho do fundo." },
      { question: "FII tem Imposto de Renda?", answer: "Os rendimentos distribuídos são isentos de IR para pessoa física. O ganho de capital na venda de cotas é tributado em 20%." },
      { question: "Qual o valor mínimo para investir em FIIs?", answer: "O valor mínimo é o preço de uma cota. Muitos FIIs têm cotas abaixo de R$ 100." },
      { question: "FII é mais seguro que ações?", answer: "Em geral, FIIs tendem a ter menor volatilidade que ações individuais. Mas ambos são renda variável — o preço oscila e não há garantia de rendimento." },
      { question: "Qual a diferença entre FII de tijolo e FII de papel?", answer: "FII de tijolo investe em imóveis físicos e a renda vem de aluguéis. FII de papel investe em títulos de crédito imobiliário e a renda vem de juros." },
      { question: "Posso perder dinheiro investindo em FIIs?", answer: "Sim. O preço das cotas oscila diariamente na bolsa e os rendimentos podem variar. FIIs são renda variável e têm riscos que a renda fixa não tem." }
    ],
    category: 'renda-variavel',
    subcategory: 'fiis',
    pillar: 'pillar-3-renda-variavel',
    cluster: 'fiis',
    tags: ["o que são FIIs", "fundos imobiliários", "FII como funciona", "FII renda mensal", "investir em FIIs"],
    disclaimer: defaultDisclaimer,
  },
  {
    slug: 'o-que-sao-etfs',
    title: 'O que são ETFs? Como funcionam os Fundos de Índice',
    description: 'ETFs são fundos de índice negociados na bolsa que replicam carteiras diversificadas. Entenda como funcionam, os tipos disponíveis, custos e como começar a investir.',
    date: '2026-03-20',
    imageId: 'blog-o-que-sao-etfs',
    content: [{
      type: 'html',
      content: `<h1>O que são ETFs: como funcionam, tipos e como investir com diversificação automática</h1><div class='resumo-rapido'><ul><li>ETF é um fundo de índice negociado na bolsa — ele replica uma carteira diversificada de ativos</li><li>Com uma única cota, você investe em dezenas ou centenas de empresas ao mesmo tempo</li><li>Têm taxa de administração baixa — geralmente entre 0,05% e 0,5% ao ano</li><li>São renda variável — o preço oscila conforme o índice que replicam</li><li>Ideais para quem quer diversificação sem precisar escolher ações individualmente</li></ul></div><p>ETF é uma das formas mais eficientes de investir em renda variável com diversificação automática e custo baixo. Em vez de escolher ações individuais, você compra uma cota que já representa dezenas ou centenas de empresas de uma vez.</p><p>Este guia explica o que são, como funcionam, quais os tipos disponíveis no Brasil e como começar.</p><h2>O que é ETF</h2><p>ETF significa Exchange Traded Fund — fundo negociado em bolsa. É um fundo que replica um índice de mercado, como o Ibovespa, o S&P 500 ou um índice de renda fixa.</p><p>Quando você compra uma cota de ETF, está comprando uma fatia de todos os ativos que compõem aquele índice — na mesma proporção. Se o índice sobe, o ETF sobe. Se o índice cai, o ETF cai.</p><p>Os ETFs são negociados na B3 durante o horário de mercado, igual às ações e FIIs. Você compra e vende pelo home broker da sua corretora.</p><h2>Como os ETFs funcionam na prática</h2><h3>Replicação do índice</h3><p>Um ETF que replica o Ibovespa, por exemplo, compra as mesmas ações que compõem o índice, nas mesmas proporções. Se o Ibovespa tem 90 ações, o ETF tem as mesmas 90 ações na mesma distribuição.</p><p>Quando o índice é rebalanceado — empresas entram e saem conforme critérios de liquidez e representatividade — o ETF ajusta automaticamente sua carteira. Você não precisa fazer nada.</p><h3>Gestão passiva vs ativa</h3><p>A maioria dos ETFs usa gestão passiva — o objetivo é replicar o índice, não superá-lo. Isso reduz os custos operacionais e resulta em taxas de administração muito menores que fundos ativos.</p><p>Gestão ativa tenta superar o índice — mas historicamente, a maioria dos gestores ativos não consegue superar o índice consistentemente no longo prazo, especialmente depois das taxas.</p><h2>Principais ETFs disponíveis no Brasil</h2><h3>ETFs de ações brasileiras</h3><p>Replicam índices da bolsa brasileira:</p><ul><li><strong>BOVA11:</strong> replica o Ibovespa — as maiores e mais negociadas ações da B3</li><li><strong>IVVB11:</strong> replica o S&P 500 americano — as 500 maiores empresas dos EUA, em reais</li><li><strong>SMAL11:</strong> replica o índice de small caps — empresas menores da B3</li><li><strong>DIVO11:</strong> replica o índice de dividendos — empresas com histórico de bons dividendos</li></ul><h3>ETFs de renda fixa</h3><p>Replicam índices de títulos de renda fixa:</p><ul><li><strong>FIXA11:</strong> títulos prefixados do Tesouro</li><li><strong>IMAB11:</strong> títulos IPCA+ do Tesouro</li></ul><h3>ETFs internacionais</h3><p>Dão exposição a mercados internacionais sem precisar abrir conta no exterior:</p><ul><li><strong>IVVB11:</strong> S&P 500 (EUA)</li><li><strong>NASDAQ:</strong> empresas de tecnologia dos EUA</li><li><strong>EURP11:</strong> empresas europeias</li></ul><table><thead><tr><th>ETF</th><th>O que replica</th><th>Exposição</th><th>Taxa admin. aprox.</th></tr></thead><tbody><tr><td>BOVA11</td><td>Ibovespa</td><td>Ações brasileiras (top liquidez)</td><td>0,10% a.a.</td></tr><tr><td>IVVB11</td><td>S&P 500</td><td>500 maiores empresas dos EUA</td><td>0,23% a.a.</td></tr><tr><td>SMAL11</td><td>Small Caps</td><td>Empresas menores da B3</td><td>0,40% a.a.</td></tr><tr><td>DIVO11</td><td>Índice Dividendos</td><td>Ações pagadoras de dividendos</td><td>0,40% a.a.</td></tr><tr><td>IMAB11</td><td>IMA-B</td><td>Títulos IPCA+ do Tesouro</td><td>0,20% a.a.</td></tr></tbody></table><p><em>Taxas de administração aproximadas. Verifique as condições atuais na B3 ou na corretora antes de investir.</em></p><h2>ETF vs ação individual: qual é melhor?</h2><table><thead><tr><th>Critério</th><th>ETF</th><th>Ação individual</th></tr></thead><tbody><tr><td>Diversificação</td><td>Automática — dezenas ou centenas de empresas</td><td>Baixa — concentrado em uma empresa</td></tr><tr><td>Risco</td><td>Menor — diluído entre muitos ativos</td><td>Maior — depende de uma empresa</td></tr><tr><td>Custo</td><td>Taxa de administração baixa (0,05% a 0,5%)</td><td>Taxa de corretagem por operação</td></tr><tr><td>Gestão</td><td>Passiva — replica o índice automaticamente</td><td>Ativa — você decide quando comprar e vender</td></tr><tr><td>Conhecimento necessário</td><td>Baixo — não precisa analisar empresas</td><td>Alto — análise de balanços, setor, gestão</td></tr><tr><td>Potencial de retorno</td><td>Retorno do índice</td><td>Pode superar o índice (ou perder mais)</td></tr></tbody></table><h2>Imposto de Renda nos ETFs</h2><p>ETFs de ações têm tributação diferente de ações individuais:</p><ul><li><strong>Ganho de capital na venda:</strong> 15% sobre o lucro, independente do valor vendido — não há isenção de R$ 20.000 como nas ações</li><li><strong>Dividendos e juros sobre capital próprio:</strong> tributados conforme a tabela progressiva quando distribuídos</li><li><strong>Imposto retido na fonte:</strong> 0,005% sobre o valor da venda (come-cotas não se aplica a ETFs de ações)</li></ul><p>Para ETFs de renda fixa, a tributação segue a tabela regressiva de IR — igual aos títulos que compõem o fundo.</p><p>Fonte: Receita Federal do Brasil, março de 2026.</p><h2>Vantagens dos ETFs para iniciantes</h2><p><strong>Diversificação imediata com pouco dinheiro</strong><br>Com o preço de uma cota — que pode ser menos de R$ 100 — você já tem exposição a dezenas de empresas. Para replicar a mesma diversificação comprando ações individuais, precisaria de muito mais capital.</p><p><strong>Custo baixo</strong><br>A taxa de administração dos ETFs é muito menor que a dos fundos ativos. Essa diferença de custo tem impacto enorme no longo prazo — cada 0,5% ao ano a menos em taxas representa muito mais patrimônio em 20 anos.</p><p><strong>Simplicidade</strong><br>Não precisa analisar empresas individuais, acompanhar balanços ou decidir quando rebalancear. O ETF faz isso automaticamente.</p><p><strong>Liquidez diária</strong><br>Assim como ações e FIIs, você compra e vende cotas a qualquer momento durante o horário de mercado.</p><h2>Riscos dos ETFs</h2><p><strong>Risco de mercado:</strong> se o índice cair, o ETF cai na mesma proporção. Não há proteção contra quedas do mercado.</p><p><strong>Risco cambial:</strong> ETFs que replicam índices internacionais (como IVVB11) têm exposição à variação do dólar — que pode aumentar ou reduzir o rendimento em reais.</p><p><strong>Risco de liquidez:</strong> ETFs menos negociados podem ter spread alto entre o preço de compra e venda — o que reduz a eficiência da operação.</p><p><strong>Tracking error:</strong> diferença entre o retorno do ETF e o retorno do índice que ele replica — geralmente pequena, mas existe.</p><h2>Como começar a investir em ETFs</h2><p><strong>Passo 1:</strong> abra conta em corretora habilitada na B3.</p><p><strong>Passo 2:</strong> defina seu objetivo — exposição ao mercado brasileiro, internacional ou renda fixa.</p><p><strong>Passo 3:</strong> escolha o ETF adequado ao objetivo. Para começar, BOVA11 (Ibovespa) e IVVB11 (S&P 500) são os mais usados.</p><p><strong>Passo 4:</strong> compre cotas pelo home broker durante o horário de mercado.</p><p><strong>Passo 5:</strong> invista regularmente — aportes mensais são mais eficientes que tentativas de acertar o melhor momento.</p><h2>ETF ou FII: qual escolher?</h2><p>Dependendo do objetivo, os dois podem complementar uma carteira:</p><ul><li><strong>ETFs de ações:</strong> crescimento de patrimônio no longo prazo, exposição ao mercado acionário</li><li><strong>FIIs:</strong> renda passiva mensal, exposição ao mercado imobiliário com isenção de IR nos rendimentos</li></ul><p>Para iniciantes, uma combinação de renda fixa (base) com ETFs e FIIs (complemento de longo prazo) é uma estrutura eficiente e diversificada.</p>`
    }],
    conclusion: `<h2>Conclusão</h2><p>ETFs são a forma mais simples e eficiente de investir em renda variável com diversificação automática. Com uma única cota, você acessa dezenas de empresas, paga taxas baixas e não precisa analisar ações individuais.</p><p>Para quem está começando, ETFs de índice como BOVA11 e IVVB11 são excelentes pontos de partida para exposição à renda variável — depois de ter a reserva de emergência formada em renda fixa.</p><p>Quer entender a diferença? <a href='/etf-ou-acao'>Veja o comparativo entre ETF e ação individual.</a></p>`,
    faq: [
      { question: "O que são ETFs e como funcionam?", answer: "ETF (Exchange Traded Fund) é um fundo de índice negociado na bolsa. Ele replica uma carteira diversificada de ativos — como as ações do Ibovespa ou do S&P 500. Com uma cota, você investe em dezenas ou centenas de empresas ao mesmo tempo." },
      { question: "ETF é seguro para iniciantes?", answer: "ETFs são mais seguros que ações individuais pela diversificação automática. Mas são renda variável — o preço oscila e você pode perder dinheiro. São mais indicados para objetivos de longo prazo, após montar a reserva de emergência em renda fixa." },
      { question: "Qual o valor mínimo para investir em ETF?", answer: "O valor mínimo é o preço de uma cota. O BOVA11, por exemplo, costuma ser negociado entre R$ 100 e R$ 120. Alguns ETFs têm cotas mais baratas. Verifique o preço atual na sua corretora." },
      { question: "ETF tem Imposto de Renda?", answer: "Sim. O ganho de capital na venda de cotas de ETF de ações é tributado em 15% — sem isenção para vendas abaixo de R$ 20.000 como nas ações. ETFs de renda fixa seguem a tabela regressiva de IR." },
      { question: "Qual a diferença entre ETF e fundo de investimento comum?", answer: "ETFs são negociados na bolsa como ações — você compra e vende a qualquer momento. Fundos comuns têm cotas resgatadas diretamente com o gestor, geralmente com prazo. ETFs também têm taxas menores e maior transparência." },
      { question: "BOVA11 ou IVVB11: qual escolher?", answer: "Depende do objetivo. BOVA11 dá exposição ao mercado brasileiro (Ibovespa). IVVB11 dá exposição ao mercado americano (S&P 500) em reais, com risco cambial. Muitos investidores combinam os dois para diversificação geográfica." },
      { question: "ETF ou ação: qual rende mais?", answer: "Depende do período e das ações escolhidas. Ações individuais podem superar o índice — mas também podem perder muito mais. Historicamente, a maioria dos investidores individuais não supera o índice no longo prazo, tornando os ETFs uma escolha eficiente." }
    ],
    disclaimer: "Este conteúdo é educativo e não constitui recomendação de investimento. ETFs são renda variável — o preço das cotas oscila e rentabilidades passadas não garantem resultados futuros. Consulte um profissional certificado para orientação personalizada.",
  },
  {
    slug: 'quanto-rende-fii-por-mes',
    title: 'Quanto Rende FII por Mês? Simulação com Dividend Yield',
    description: 'Veja quanto rende um FII por mês com simulações práticas. Entenda o Dividend Yield, como calcular a renda mensal e quanto investir para atingir sua meta.',
    date: '2026-03-20',
    imageId: 'blog-fii-rendimento',
    content: [
      {
        type: 'html',
        content: `<h1>Quanto rende FII por mês? Simulação com Dividend Yield e renda passiva</h1><div class='resumo-rapido'><ul><li>O rendimento mensal de FIIs é medido pelo Dividend Yield (DY) — rendimento anual dividido pelo preço da cota</li><li>FIIs brasileiros pagam em média 0,7% a 1,0% ao mês em rendimentos (DY médio de 8% a 12% ao ano)</li><li>Os rendimentos são isentos de IR para pessoa física</li><li>O valor distribuído varia todo mês — não é fixo como renda fixa</li><li>Para R$ 1.000 de renda mensal, você precisa de aproximadamente R$ 100.000 a R$ 140.000 investidos</li></ul></div><p>Uma das maiores atrações dos FIIs é a renda mensal. A ideia de receber dinheiro todo mês sem trabalhar para isso é poderosa — mas é importante entender como esse rendimento funciona antes de calcular metas.</p><p>Este guia mostra como calcular o rendimento mensal de FIIs, simulações com diferentes valores investidos e quanto você precisaria ter para atingir uma meta de renda.</p><h2>O que é Dividend Yield (DY)</h2><p>Dividend Yield é o indicador que mede o rendimento distribuído por um FII em relação ao preço atual da cota. É calculado assim:</p><p><strong>DY anual = (rendimentos distribuídos nos últimos 12 meses ÷ preço atual da cota) × 100</strong></p><p>Exemplo: FII com cota a R$ 100 que distribuiu R$ 10 nos últimos 12 meses tem DY de 10% ao ano — ou aproximadamente 0,83% ao mês.</p><p>O DY mensal é a forma mais prática de estimar o quanto você vai receber por cota a cada mês. Mas atenção: o rendimento varia todo mês conforme os resultados do fundo.</p><h2>Faixa de DY dos FIIs brasileiros</h2><p>Em março de 2026, a maioria dos FIIs brasileiros distribui entre 0,7% e 1,1% ao mês por cota. Em termos anuais, isso representa DY de 8% a 13%.</p><table><thead><tr><th>Tipo de FII</th><th>DY mensal típico</th><th>DY anual típico</th><th>Observação</th></tr></thead><tbody><tr><td><strong>FIIs de Papel (CRI)</strong></td><td>0,9% a 1,2%</td><td>11% a 14%</td><td>Mais atrelado ao CDI/IPCA — tende a ser mais previsível</td></tr><tr><td><strong>FIIs de Tijolo (shoppings/galpões)</strong></td><td>0,6% a 0,9%</td><td>7% a 11%</td><td>Depende de vacância e contratos de aluguel</td></tr><tr><td><strong>FOF (fundo de fundos)</strong></td><td>0,7% a 1,0%</td><td>8% a 12%</td><td>Diversificação automática entre FIIs</td></tr><tr><td><strong>FIIs Híbridos</strong></td><td>0,7% a 1,0%</td><td>8% a 12%</td><td>Mix de imóveis e títulos</td></tr></tbody></table><p><em>Referências de DY médio do mercado em março de 2026. Valores variam por fundo e momento do mercado. DY alto pode indicar cota barata por problemas no fundo — sempre analise antes de investir. (Referência: {{dataAtualizacao}})</em></p><h2>Simulação: quanto rende por mês com diferentes valores investidos</h2><table><thead><tr><th>Valor investido</th><th>DY 0,7%/mês</th><th>DY 0,85%/mês</th><th>DY 1,0%/mês</th><th>DY 1,1%/mês</th></tr></thead><tbody><tr><td>R$ 10.000</td><td>R$ 70</td><td>R$ 85</td><td>R$ 100</td><td>R$ 110</td></tr><tr><td>R$ 25.000</td><td>R$ 175</td><td>R$ 213</td><td>R$ 250</td><td>R$ 275</td></tr><tr><td>R$ 50.000</td><td>R$ 350</td><td>R$ 425</td><td>R$ 500</td><td>R$ 550</td></tr><tr><td>R$ 100.000</td><td>R$ 700</td><td>R$ 850</td><td>R$ 1.000</td><td>R$ 1.100</td></tr><tr><td>R$ 150.000</td><td>R$ 1.050</td><td>R$ 1.275</td><td>R$ 1.500</td><td>R$ 1.650</td></tr><tr><td>R$ 200.000</td><td>R$ 1.400</td><td>R$ 1.700</td><td>R$ 2.000</td><td>R$ 2.200</td></tr></tbody></table><p><em>Simulação com DY constante para fins ilustrativos. O rendimento real varia todo mês conforme os resultados do fundo. Valores isentos de IR para pessoa física. (Referência: {{dataAtualizacao}})</em></p><h2>Quanto investir para receber R$ 500, R$ 1.000 ou R$ 2.000 por mês</h2><p>A fórmula para calcular o patrimônio necessário para uma meta de renda é:</p><p><strong>Patrimônio necessário = meta mensal ÷ DY mensal</strong></p><table><thead><tr><th>Meta de renda mensal</th><th>Com DY de 0,7%/mês</th><th>Com DY de 0,85%/mês</th><th>Com DY de 1,0%/mês</th></tr></thead><tbody><tr><td>R$ 500/mês</td><td>R$ 71.429</td><td>R$ 58.824</td><td>R$ 50.000</td></tr><tr><td>R$ 1.000/mês</td><td>R$ 142.857</td><td>R$ 117.647</td><td>R$ 100.000</td></tr><tr><td>R$ 2.000/mês</td><td>R$ 285.714</td><td>R$ 235.294</td><td>R$ 200.000</td></tr><tr><td>R$ 5.000/mês</td><td>R$ 714.286</td><td>R$ 588.235</td><td>R$ 500.000</td></tr></tbody></table><p><em>Cálculo: patrimônio = meta ÷ DY. DY pode variar — use como referência de planejamento, não como garantia. (Referência: {{dataAtualizacao}})</em></p><h2>FII vs renda fixa: qual paga mais por mês?</h2><p>A tabela abaixo compara o rendimento mensal de R$ 100.000. Note que, enquanto o FII tem potencial de rendimento maior e isento de IR, seu valor não é garantido e oscila. A renda fixa oferece previsibilidade.</p>
<table>
<thead>
  <tr>
    <th>Produto</th>
    <th>Rendimento mensal estimado</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td><strong>FII (DY 1,0% a.m.)</strong></td>
    <td><strong>~R$ 1.000 (isento de IR, variável)</strong></td>
  </tr>
</tbody>
</table>`
      },
      {
        type: 'simulationTable',
        initialInvestment: 100000,
        terms: [12],
        scenarios: [
          { label: 'CDB 100% CDI líquido', rate: (cdi, selic) => cdi / 100, isTaxable: true },
          { label: 'LCI 90% CDI (isento)', rate: (cdi, selic) => (cdi / 100) * 0.90, isTaxable: false },
          { label: 'Tesouro Selic líquido', rate: (cdi, selic) => selic / 100, isTaxable: true }
        ]
      },
      {
        type: 'html',
        content: `<p><em>Rendimento líquido em 12 meses. (Referência: {{dataAtualizacao}})</em></p><h2>Como montar uma carteira de FIIs para renda mensal</h2><p><strong>Diversifique entre tipos:</strong> combine FIIs de papel (mais previsíveis) com FIIs de tijolo de diferentes segmentos (shoppings, galpões, escritórios). Isso reduz o impacto de problemas em um único fundo.</p><p><strong>Diversifique entre gestores:</strong> não concentre tudo em um único gestor ou administradora.</p><p><strong>Verifique o histórico de distribuições:</strong> fundos com pelo menos 2 a 3 anos de distribuições consistentes oferecem mais previsibilidade.</p><p><strong>Atenção ao DY muito alto:</strong> DY acima de 1,3% ao mês pode indicar que a cota está barata por problemas no fundo — analise antes de investir.</p>`
      }
    ],
    conclusion: `<h2>Conclusão</h2><p>FIIs são uma excelente porta de entrada para a renda variável e para o mercado imobiliário. Permitem diversificar a carteira e receber uma renda mensal isenta de IR com um valor inicial baixo.</p><p>Mas é fundamental entender que são renda variável: o preço das cotas oscila. Comece com uma parcela pequena do seu patrimônio, estude os fundos e entenda os riscos antes de aumentar a posição.</p><p>Quer comparar FIIs com outras classes de ativos? Veja a <a href='/fii-ou-acao'>comparação entre FIIs e ações</a> e <a href='/fii-ou-renda-fixa'>FIIs vs renda fixa</a>.</p>`,
    seoTitle: "Quanto Rende FII por Mês? Simulação com Dividend Yield",
    seoDescription: "Veja quanto rende um FII por mês com simulações práticas. Entenda o Dividend Yield, como calcular a renda mensal e quanto investir para atingir sua meta.",
    faq: [
      { question: "O que são FIIs e como funcionam?", answer: "FIIs são fundos que investem em imóveis ou títulos imobiliários e distribuem rendimentos mensais para os cotistas. São negociados na B3 e permitem investir no mercado imobiliário a partir do preço de uma cota." },
      { question: "FII paga renda todo mês?", answer: "A maioria dos FIIs distribui rendimentos mensalmente. Por lei, os FIIs devem distribuir pelo menos 95% do lucro caixa semestral. O valor pode variar conforme o desempenho do fundo." },
      { question: "FII tem Imposto de Renda?", answer: "Os rendimentos distribuídos são isentos de IR para pessoa física. O ganho de capital na venda de cotas é tributado em 20%." },
      { question: "Qual o valor mínimo para investir em FIIs?", answer: "O valor mínimo é o preço de uma cota. Muitos FIIs têm cotas abaixo de R$ 100." },
      { question: "FII é mais seguro que ações?", answer: "Em geral, FIIs tendem a ter menor volatilidade que ações individuais. Mas ambos são renda variável — o preço oscila e não há garantia de rendimento." },
      { question: "Qual a diferença entre FII de tijolo e FII de papel?", answer: "FII de tijolo investe em imóveis físicos e a renda vem de aluguéis. FII de papel investe em títulos de crédito imobiliário e a renda vem de juros." },
      { question: "Posso perder dinheiro investindo em FIIs?", answer: "Sim. O preço das cotas oscila diariamente na bolsa e os rendimentos podem variar. FIIs são renda variável e têm riscos que a renda fixa não tem." }
    ],
    category: 'renda-variavel',
    subcategory: 'fiis',
    pillar: 'pillar-3-renda-variavel',
    cluster: 'fiis',
    tags: ["quanto rende FII", "rendimento FII", "FII renda mensal", "dividend yield FIIs", "investir em FIIs"],
    disclaimer: defaultDisclaimer,
  },
  {
    slug: 'quanto-investir-para-ganhar-1000-por-mes',
    title: 'Quanto Investir para Ganhar R$ 1.000 por Mês?',
    description: 'Descubra quanto você precisa investir para ganhar R$ 1.000 por mês. Simulação com renda fixa, FIIs e carteira mista, com metas por prazo e valor de aporte.',
    date: '2026-03-20',
    imageId: 'blog-renda-1000',
    content: [
      {
        type: 'html',
        content: `<h1>Quanto investir para ganhar R$ 1.000 por mês? Simulação por produto e prazo</h1><div class='resumo-rapido'><ul><li>Para ganhar R$ 1.000 por mês, você precisa de R$ 100.000 a R$ 143.000 investidos dependendo do produto</li><li>Com FIIs (DY 1% ao mês), o patrimônio necessário é de aproximadamente R$ 100.000</li><li>Com renda fixa (Selic {{selicRate}}%), o patrimônio necessário é de aproximadamente R$ 103.000</li><li>Aportes mensais consistentes aceleram o caminho — R$ 1.000 por mês chega lá em 6 a 7 anos</li><li>Os valores são referências — rendimentos variam e não são garantidos</li></ul></div><p>R$ 1.000 por mês de renda passiva é uma meta concreta e alcançável — mas exige planejamento, consistência e tempo. A boa notícia é que existem caminhos diferentes, e você pode começar com muito menos do que imagina.</p><p>Este guia mostra quanto você precisa ter investido, quanto tempo leva com aportes mensais e quais produtos usar para chegar lá.</p><h2>Quanto patrimônio você precisa para R$ 1.000 por mês</h2><p>A resposta depende do produto escolhido e do rendimento que ele oferece. A fórmula é simples:</p><p><strong>Patrimônio necessário = meta mensal ÷ rendimento mensal do produto</strong></p><table><thead><tr><th>Produto</th><th>Rendimento mensal estimado</th><th>Patrimônio para R$ 1.000/mês</th><th>IR</th><th>Garantia</th></tr></thead><tbody><tr><td>FII (DY 1,0%/mês)</td><td>1,0% ao mês</td><td>~R$ 100.000</td><td>Isento (rendimentos)</td><td>Nenhuma — renda variável</td></tr><tr><td>FII (DY 0,85%/mês)</td><td>0,85% ao mês</td><td>~R$ 118.000</td><td>Isento (rendimentos)</td><td>Nenhuma — renda variável</td></tr><tr><td>Tesouro Selic (líquido)</td><td>~0,97% ao mês líquido</td><td>~R$ 103.000</td><td>15% (acima 720 dias)</td><td>Governo Federal</td></tr><tr><td>CDB 100% CDI (líquido)</td><td>~0,97% ao mês líquido</td><td>~R$ 103.000</td><td>15% (acima 720 dias)</td><td>FGC até R$ 250k</td></tr><tr><td>LCI/LCA 90% CDI</td><td>~1,02% ao mês</td><td>~R$ 98.000</td><td>Isento (PF)</td><td>FGC até R$ 250k</td></tr></tbody></table><p><em>Referências com Selic de {{selicRate}}% a.a. e CDI de {{cdiRate}}% a.a. ({{dataAtualizacao}}). FII com DY estimado — variável. Renda fixa com IR de 15% para prazos acima de 720 dias. Valores aproximados.</em></p><h2>O caminho: quanto tempo leva com aportes mensais</h2><p>Poucos têm R$ 100.000 disponíveis hoje. A maioria vai construir esse patrimônio ao longo do tempo com aportes mensais regulares.</p><p>Veja quanto tempo leva para acumular R$ 100.000 com diferentes valores de aporte mensal, considerando rendimento de 1% ao mês (juros compostos):</p><table><thead><tr><th>Aporte mensal</th><th>Tempo para R$ 100.000</th><th>Total aportado</th><th>Rendimento acumulado</th></tr></thead><tbody><tr><td>R$ 500</td><td>~10 anos</td><td>R$ 60.000</td><td>R$ 40.000</td></tr><tr><td>R$ 1.000</td><td>~6,5 anos</td><td>R$ 78.000</td><td>R$ 22.000</td></tr><tr><td>R$ 2.000</td><td>~4 anos</td><td>R$ 96.000</td><td>R$ 4.000</td></tr><tr><td>R$ 3.000</td><td>~3 anos</td><td>R$ 108.000*</td><td>já passa de R$ 100k antes</td></tr></tbody></table><p><em>Simulação com rendimento constante de 1% ao mês, capitalização mensal. Taxa constante para fins ilustrativos. *Com R$ 3.000/mês, o patrimônio de R$ 100.000 é atingido em aproximadamente 30 meses. (Referência: {{dataAtualizacao}})</em></p><h2>Simulação completa: da meta de R$ 1.000 ao caminho para chegar lá</h2><p>Exemplo prático: João tem 30 anos, ganha R$ 5.000 por mês e consegue poupar R$ 1.000 por mês para investir. Ele quer criar uma renda passiva de R$ 1.000 mensais.</p><table><thead><tr><th>Ano</th><th>Patrimônio acumulado (1% a.m.)</th><th>Renda mensal estimada (DY 1%)</th></tr></thead><tbody><tr><td>1</td><td>R$ 12.682</td><td>R$ 127</td></tr><tr><td>2</td><td>R$ 27.243</td><td>R$ 272</td></tr><tr><td>3</td><td>R$ 43.923</td><td>R$ 439</td></tr><tr><td>4</td><td>R$ 62.985</td><td>R$ 630</td></tr><tr><td>5</td><td>R$ 84.729</td><td>R$ 847</td></tr><tr><td>6</td><td>R$ 109.502</td><td>R$ 1.095</td></tr><tr><td>7</td><td>R$ 137.706</td><td>R$ 1.377</td></tr></tbody></table><p><em>Simulação com aporte de R$ 1.000/mês, rendimento constante de 1% ao mês. Taxa constante para fins ilustrativos — o rendimento real varia. (Referência: {{dataAtualizacao}})</em></p><h2>Renda fixa vs FII: qual paga mais por mês?</h2><p>A tabela abaixo compara o rendimento mensal de R$ 100.000. Note que, enquanto o FII tem potencial de rendimento maior e isento de IR, seu valor não é garantido e oscila. A renda fixa oferece previsibilidade.</p>
<table>
<thead>
  <tr>
    <th>Produto</th>
    <th>Rendimento mensal estimado</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td><strong>FII (DY 1,0% a.m.)</strong></td>
    <td><strong>~R$ 1.000 (isento de IR, variável)</strong></td>
  </tr>
</tbody>
</table>`
      },
      {
        type: 'simulationTable',
        initialInvestment: 100000,
        terms: [12],
        scenarios: [
          { label: 'Tesouro Selic líquido', rate: (cdi, selic) => selic / 100, isTaxable: true },
          { label: 'CDB 100% CDI líquido', rate: (cdi, selic) => cdi / 100, isTaxable: true },
          { label: 'LCI/LCA 90% CDI (isento)', rate: (cdi, selic) => (cdi / 100) * 0.90, isTaxable: false }
        ]
      },
      {
        type: 'html',
        content: `<p><em>(Referência: {{dataAtualizacao}})</em></p><h2>Estratégia recomendada: carteira mista para R$ 1.000/mês</h2><p>A estratégia mais eficiente para a maioria dos investidores não é escolher entre renda fixa e FIIs — é combinar os dois:</p><ul><li><strong>Base (60-70%):</strong> renda fixa — Tesouro Selic, CDB, LCI/LCA para segurança e liquidez</li><li><strong>Complemento (30-40%):</strong> FIIs diversificados para renda mensal isenta e potencial de valorização</li></ul><p>Com essa estrutura, você tem previsibilidade da renda fixa + potencial de renda mensal isenta dos FIIs + diversificação entre classes de ativos.</p><h2>Erros comuns ao perseguir a meta de R$ 1.000 por mês</h2><p><strong>Começar pelos FIIs sem ter reserva de emergência</strong><br>Se precisar do dinheiro em emergência, vai vender FIIs no pior momento. Monte a reserva primeiro.</p><p><strong>Concentrar tudo em um único FII</strong><br>Diversifique entre pelo menos 5 a 8 FIIs diferentes para reduzir o impacto de problemas em um único fundo.</p><p><strong>Resgatar os rendimentos em vez de reinvestir</strong><br>No início, reinvestir os rendimentos acelera muito o crescimento do patrimônio. Só retire quando o patrimônio estiver na meta.</p><p><strong>Escolher FIIs apenas pelo DY mais alto</strong><br>DY muito alto pode indicar problemas no fundo. Priorize qualidade dos ativos e histórico consistente.</p><p><strong>Desistir nas primeiras oscilações</strong><br>FIIs oscilam — o preço das cotas sobe e cai. Quem vende na queda realiza prejuízo e atrasa a meta. O foco é a renda mensal, não o preço diário.</p>`
      }
    ],
    conclusion: `<h2>Conclusão</h2><p>Ganhar R$ 1.000 por mês de renda passiva é uma meta realista — não instantânea. Com R$ 1.000 de aporte mensal e rendimento consistente, você chega lá em aproximadamente 6 anos.</p><p>O segredo é começar, ser consistente e reinvestir os rendimentos enquanto o patrimônio não atinge a meta. O tempo e os juros compostos fazem o trabalho pesado.</p><p>Quer entender melhor os FIIs? <a href='/o-que-sao-fiis'>Leia o guia completo sobre FIIs.</a> Ou <a href='/quanto-rende-fii-por-mes'>veja quanto rende FII por mês com diferentes valores investidos.</a></p>`,
    faq: [
      { question: "Quanto preciso investir para ganhar R$ 1.000 por mês?", answer: "Depende do produto. Com FIIs com DY de 1% ao mês, você precisa de aproximadamente R$ 100.000. Com renda fixa (Tesouro Selic ou CDB a 100% do CDI), o patrimônio necessário é de aproximadamente R$ 103.000 considerando o IR de 15%." },
      { question: "Quanto tempo leva para acumular R$ 100.000 investindo R$ 1.000 por mês?", answer: "Com rendimento de 1% ao mês, aportes de R$ 1.000 mensais acumulam R$ 100.000 em aproximadamente 6,5 anos. Com R$ 2.000 por mês, leva cerca de 4 anos." },
      { question: "FII ou renda fixa para ganhar R$ 1.000 por mês?", answer: "Os dois são viáveis com patrimônio semelhante. FIIs oferecem isenção de IR nos rendimentos, mas sem garantia — a renda varia. Renda fixa é mais previsível e segura. Muitos investidores combinam os dois." },
      { question: "Devo reinvestir os rendimentos ou usar para despesas?", answer: "Enquanto o patrimônio não atingiu a meta, reinvestir os rendimentos acelera muito o crescimento do patrimônio. Só retire quando o patrimônio estiver na meta de renda que você precisa." },
      { question: "R$ 1.000 por mês de renda passiva é possível para iniciantes?", answer: "Sim, mas exige tempo e consistência. Com aportes mensais regulares e paciência, é uma meta alcançável em 5 a 10 anos dependendo do valor que você consegue investir por mês." },
      { question: "Quantos FIIs preciso ter para ganhar R$ 1.000 por mês?", answer: "Não é o número de FIIs que determina a renda — é o patrimônio total investido e o DY médio da carteira. Com R$ 100.000 em FIIs com DY médio de 1% ao mês, você recebe aproximadamente R$ 1.000 — independente de ter 3 ou 15 FIIs." },
      { question: "Posso perder o patrimônio investido em FIIs?", answer: "O preço das cotas pode cair — mas você só realiza a perda se vender. Enquanto mantém as cotas, continua recebendo os rendimentos mensais. O risco principal é a redução ou suspensão dos rendimentos por problemas no fundo." }
    ],
    category: 'renda-variavel',
    subcategory: 'fiis',
    pillar: 'pillar-3-renda-variavel',
    cluster: 'fiis',
    tags: ["quanto investir para ganhar 1000 por mês", "renda passiva 1000 reais", "quanto investir renda passiva", "FII renda mensal", "independência financeira"],
    disclaimer: defaultDisclaimer,
  },
  {
    slug: 'quanto-rende-10000-no-tesouro-selic',
    title: 'Quanto Rende R$ 10.000 no Tesouro Selic? Simulação 2026',
    description: 'Veja quanto rende R$ 10.000 no Tesouro Selic hoje com a taxa atual. Simulação de rendimento líquido em 1, 6, 12 e 24 meses, comparado com poupança e CDB.',
    date: '2026-03-20',
    imageId: 'blog-tesouro-10000',
    content: [
      {
        type: 'html',
        content: `<h1>Quanto rende R$ 10.000 no Tesouro Selic hoje? Simulação 2026</h1><div class='resumo-rapido'><ul><li>Com a Selic a {{selicRate}}% ao ano, R$ 10.000 no Tesouro Selic rendem aproximadamente R$ 1.169 líquidos em 12 meses.</li><li>O rendimento é diário e segue a taxa Selic, o que o torna ideal para reserva de emergência.</li><li>Tem Imposto de Renda regressivo (de 22,5% a 15%) sobre o rendimento.</li><li>É considerado o investimento mais seguro do Brasil, garantido pelo Tesouro Nacional.</li><li>A simulação abaixo mostra o rendimento líquido em diferentes prazos.</li></ul></div><p>O Tesouro Selic é o investimento mais recomendado para quem busca segurança e liquidez. Mas quanto ele rende na prática? Para responder, simulamos o rendimento de R$ 10.000 com a taxa Selic atual de {{selicRate}}% ao ano.</p><h2>Simulação: R$ 10.000 no Tesouro Selic por prazo</h2>`
      },
      {
        type: 'simulationTable',
        initialInvestment: 10000,
        terms: [1, 3, 6, 12, 24, 36],
        scenarios: [
          { label: 'Tesouro Selic ({{selicRate}}% a.a.)', rate: (cdi, selic) => selic / 100, isTaxable: true }
        ]
      },
      {
        type: 'html',
        content: `<p><em>Rendimento líquido, já descontado o IR. (Referência: {{dataAtualizacao}})</em></p><h2>Tesouro Selic vs. Poupança</h2><p>A diferença de rendimento para a poupança é significativa. Veja a comparação para os mesmos R$ 10.000:</p>`
      },
      {
        type: 'simulationTable',
        initialInvestment: 10000,
        terms: [6, 12, 24, 36],
        showDifference: true,
        scenarios: [
          { label: 'Poupança ({{poupancaRate}}% a.a.)', rate: (cdi, selic) => selic > 8.5 ? 0.0617 : selic * 0.70, isTaxable: false },
          { label: 'Tesouro Selic líquido', rate: (cdi, selic) => selic / 100, isTaxable: true }
        ]
      },
      {
        type: 'html',
        content: `<p><em>(Referência: {{dataAtualizacao}})</em></p><h2>Tesouro Selic vs. CDB 100% CDI</h2><p>O CDB de liquidez diária é o concorrente mais direto do Tesouro Selic. O rendimento dos dois é muito próximo, pois o CDI acompanha a Selic. A diferença é pequena:</p>`
      },
      {
        type: 'simulationTable',
        initialInvestment: 10000,
        terms: [6, 12, 24],
        scenarios: [
          { label: 'Tesouro Selic líquido', rate: (cdi, selic) => selic / 100, isTaxable: true },
          { label: 'CDB 100% CDI líquido', rate: (cdi, selic) => cdi / 100, isTaxable: true },
          { label: 'CDB 110% CDI líquido', rate: (cdi, selic) => (cdi / 100) * 1.10, isTaxable: true }
        ]
      },
      {
        type: 'html',
        content: `<p><em>(Referência: {{dataAtualizacao}})</em></p><p>Um CDB a 100% do CDI rende praticamente o mesmo que o Tesouro Selic. Um CDB que pague acima disso, como 110% do CDI, passa a ser mais vantajoso, desde que tenha a mesma liquidez e garantia do FGC.</p>`
      }
    ],
    conclusion: `<h2>Conclusão</h2><p>Com a Selic a {{selicRate}}% ao ano, R$ 10.000 no Tesouro Selic rendem mais de R$ 1.100 líquidos no primeiro ano, superando com folga a poupança e competindo diretamente com os melhores CDBs de liquidez diária.</p><p>É a escolha ideal para quem busca segurança máxima e precisa do dinheiro disponível a qualquer momento, sendo o produto perfeito para a sua reserva de emergência.</p><p>Quer entender mais sobre o Tesouro Direto? <a href='/o-que-e-tesouro-direto'>Leia nosso guia completo.</a></p>`,
    faq: [
      {
        question: "Quanto rende R$ 10.000 no Tesouro Selic em 1 ano?",
        answer: "Com a Selic a {{selicRate}}% ao ano, R$ 10.000 rendem aproximadamente R$ 1.169 líquidos em 12 meses, já descontando o Imposto de Renda de 17,5% sobre o rendimento."
      },
      {
        question: "Qual o rendimento mensal do Tesouro Selic?",
        answer: "O rendimento é diário e acompanha a taxa Selic. Com a Selic a {{selicRate}}% ao ano, o rendimento bruto mensal é de aproximadamente 0,89%. O rendimento líquido depende do prazo e da alíquota do IR."
      },
      {
        question: "Tesouro Selic tem Imposto de Renda?",
        answer: "Sim. O IR incide sobre o rendimento e segue a tabela regressiva: de 22,5% (até 180 dias) a 15% (acima de 720 dias). O imposto é retido na fonte no momento do resgate."
      },
      {
        question: "Tesouro Selic ou Poupança: qual o melhor?",
        answer: "Tesouro Selic é melhor. Ele rende mais (com a Selic atual, quase o dobro da poupança), tem liquidez diária e é considerado o investimento mais seguro do Brasil."
      },
      {
        question: "Tesouro Selic tem taxa de custódia?",
        answer: "Sim, a B3 cobra uma taxa de 0,20% ao ano sobre o valor investido. No entanto, investimentos de até R$ 10.000 no Tesouro Selic são isentos dessa taxa."
      },
      {
        question: "Posso resgatar o Tesouro Selic a qualquer momento?",
        answer: "Sim. O Tesouro Selic tem liquidez diária (D+1), o que significa que o dinheiro cai na sua conta no próximo dia útil após a solicitação de resgate."
      }
    ],
    category: 'renda-fixa',
    subcategory: 'tesouro-direto',
    pillar: 'pillar-2-renda-fixa',
    cluster: 'tesouro-direto',
    tags: ["quanto rende tesouro selic", "tesouro selic", "simulação tesouro selic", "rendimento tesouro selic", "reserva de emergência"],
    disclaimer: defaultDisclaimer,
  }
];
