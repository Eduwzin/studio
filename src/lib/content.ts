

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
    rateLogic: string; 
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

// O array blogArticles é mantido here temporariamente para permitir a re-importação.
// Após a importação bem-sucedida, ele será removido.
export const blogArticles: Article[] = [
 {
  "slug": "cdb-ou-poupanca",
  "title": "CDB ou Poupança",
  "excerpt": "CDB ou poupança: veja qual rende mais, as diferenças em segurança e liquidez, e por que o CDB supera a poupança na maioria dos cenários.",
  "seoTitle": "CDB ou Poupança: qual rende mais em 2026?",
  "seoDescription": "CDB ou poupança: compare rendimento líquido, segurança e liquidez. Simulação com valores reais e checklist para escolher o melhor investimento.",
  "category": "renda-fixa",
  "subcategory": "comparativos",
  "pillar": "pillar-2-renda-fixa",
  "cluster": "comparativos-renda-fixa",
  "readingTime": "8 min",
  "lastUpdated": "2026-03-20",
  "author": "Equipe Bigwall",
  "disclaimer": "Este conteúdo é educativo e não constitui recomendação de investimento. Rentabilidades são referências e variam conforme o produto e o emissor.",
  "content": [
    {
      "type": "html",
      "content": "<h1>CDB ou Poupança: qual rende mais e por que o CDB quase sempre vence</h1><div class='resumo-rapido'><ul><li>Com a Selic acima de 8,5% ao ano, o CDB rende mais que a poupança — sempre</li><li>A poupança rende apenas {{poupancaRate}}% ao ano com a Selic atual de {{selicRate}}%</li><li>CDB de 100% do CDI rende muito mais mesmo após o IR</li><li>Os dois têm FGC até R$ 250.000 — o nível de segurança é o mesmo</li><li>A única vantagem real da poupança é a isenção de IR — mas não compensa</li></ul></div><p>A poupança ainda é o investimento mais popular do Brasil — mas não porque é o melhor. A resposta direta: com a Selic acima de 8,5% ao ano, o CDB rende mais que a poupança em praticamente todos os cenários — mesmo após o IR.</p><h2>Como funciona o rendimento da poupança</h2><p>Com a Selic a {{selicRate}}% ao ano, a poupança rende 0,5% ao mês mais TR — equivalente a aproximadamente {{poupancaRate}}% ao ano. A poupança é isenta de IR, mas isso não compensa o rendimento muito menor.</p><h2>Comparativo: R$ 10.000 investidos</h2>"
    },
    {
      "type": "simulationTable",
      "initialInvestment": 10000,
      "terms": [6, 12, 24, 36],
      "showDifference": true,
      "scenarios": [
        { "label": "Poupança ({{poupancaRate}}% a.a.)", "rateLogic": "selic>8.5?0.0617:selic*0.70", "isTaxable": false },
        { "label": "CDB 100% CDI líquido", "rateLogic": "cdi/100", "isTaxable": true },
        { "label": "CDB 110% CDI líquido", "rateLogic": "cdi*1.10", "isTaxable": true }
      ]
    },
    {
      "type": "html",
      "content": "<p><em>Referência: Selic de {{selicRate}}% a.a. e CDI de {{cdiRate}}% a.a. (Bacen/SGS, {{dataAtualizacao}}). Simulações com taxa constante para fins ilustrativos.</em></p><h2>Por que a poupança não é recomendada</h2><p><strong>1. Rende muito menos.</strong> Com a Selic a {{selicRate}}% ao ano, a poupança rende {{poupancaRate}}% ao ano — menos da metade do CDB de liquidez diária.</p><p><strong>2. Perde para a inflação em muitos cenários.</strong> Com IPCA a {{ipcaRate}}% ao ano, o rendimento real da poupança pode ser próximo de zero.</p><p><strong>3. Existem alternativas com a mesma segurança.</strong> CDB de liquidez diária e Tesouro Selic têm o mesmo FGC e rendem muito mais.</p><h2>O que usar no lugar da poupança</h2><table><thead><tr><th>Uso da poupança</th><th>Alternativa mais eficiente</th></tr></thead><tbody><tr><td>Reserva de emergência</td><td>Tesouro Selic ou CDB de liquidez diária</td></tr><tr><td>Guardar dinheiro de curto prazo</td><td>CDB de liquidez diária ou Tesouro Selic</td></tr><tr><td>Objetivo de médio prazo</td><td>LCI, LCA ou CDB com prazo</td></tr><tr><td>Proteção da inflação</td><td>Tesouro IPCA+ ou CDB IPCA+</td></tr></tbody></table><h2>Conclusão</h2><p>Com a Selic a {{selicRate}}% ao ano, o CDB supera a poupança em todos os prazos — mesmo após o IR. Se você ainda tem dinheiro na poupança, vale migrar para um CDB de liquidez diária ou Tesouro Selic com o mesmo nível de segurança e rendimento muito superior.</p><p><em>Referência: Selic {{selicRate}}% a.a., CDI {{cdiRate}}% a.a. (Bacen/SGS, {{dataAtualizacao}}).</em></p>"
    }
  ],
  "faq": [
    { "question": "CDB ou poupança: qual rende mais?", "answer": "Com a Selic acima de 8,5% ao ano, o CDB rende mais que a poupança em todos os cenários — mesmo após o IR. Um CDB a 100% do CDI rende aproximadamente o dobro da poupança." },
    { "question": "A poupança tem IR?", "answer": "Não. A poupança é isenta de IR para pessoa física. Mas essa vantagem não compensa o rendimento muito menor — o CDB supera a poupança mesmo após pagar IR." },
    { "question": "CDB e poupança têm a mesma segurança?", "answer": "Sim. Os dois têm cobertura do FGC até R$ 250.000 por CPF por instituição. O nível de segurança é equivalente." },
    { "question": "Posso resgatar o CDB a qualquer momento como a poupança?", "answer": "Depende do produto. CDB de liquidez diária permite resgate a qualquer momento. CDB com prazo fixo só no vencimento. Verifique as condições antes de aplicar." },
    { "question": "Vale a pena migrar da poupança para o CDB?", "answer": "Sim, na maioria dos casos. Um CDB de liquidez diária tem o mesmo nível de segurança (FGC), a mesma praticidade e rende muito mais que a poupança com a Selic atual." }
  ],
  "internalLinks": [
    { "anchor": "melhores investimentos para iniciantes", "slug": "melhores-investimentos-para-iniciantes" },
    { "anchor": "o que é CDB e como funciona", "slug": "o-que-e-cdb" },
    { "anchor": "compare Tesouro Selic e CDB", "slug": "tesouro-selic-ou-cdb" },
    { "anchor": "reserva de emergência: quanto guardar", "slug": "reserva-de-emergencia" },
    { "anchor": "guia completo de renda fixa", "slug": "guia-renda-fixa" }
  ],
  "cta": {
    "primary": { "text": "Veja os melhores investimentos para iniciantes", "url": "/melhores-investimentos-para-iniciantes" },
    "secondary": { "text": "Entenda o que é CDB", "url": "/o-que-e-cdb" }
  }
},
{
  "slug": "tesouro-selic-ou-cdb",
  "title": "Tesouro Selic ou CDB",
  "excerpt": "Tesouro Selic ou CDB: descubra as diferenças em segurança, liquidez e rendimento. Comparativo completo com tabela, simulação e checklist de decisão.",
  "seoTitle": "Tesouro Selic ou CDB: qual é melhor em 2026?",
  "seoDescription": "Tesouro Selic ou CDB: compare segurança, liquidez e rendimento líquido. Veja quando cada um compensa com simulação prática e checklist de decisão.",
  "category": "renda-fixa",
  "subcategory": "comparativos",
  "pillar": "pillar-2-renda-fixa",
  "cluster": "comparativos-renda-fixa",
  "readingTime": "9 min",
  "lastUpdated": "2026-03-20",
  "author": "Equipe Bigwall",
  "disclaimer": "Este conteúdo é educativo e não constitui recomendação de investimento. Rentabilidades são referências e variam conforme o produto e o emissor.",
  "content": [
    {
      "type": "html",
      "content": "<h1>Tesouro Selic ou CDB: qual é melhor para você?</h1><div class='resumo-rapido'><ul><li>Tesouro Selic e CDB de liquidez diária têm rendimento muito próximo</li><li>A principal diferença está na garantia: Tesouro é garantido pelo Governo Federal, CDB pelo FGC até R$ 250k</li><li>Para reserva de emergência, os dois funcionam bem</li><li>CDB acima de 100% do CDI pode superar o Tesouro Selic no líquido</li><li>Sempre compare rendimento líquido — não taxa bruta</li></ul></div><p>Tesouro Selic e CDB são os dois investimentos de renda fixa mais populares para reserva de emergência e objetivos de curto prazo. A diferença de rendimento é pequena — o que realmente muda é a garantia e a taxa disponível no mercado.</p><h2>Diferenças principais</h2><table><thead><tr><th>Característica</th><th>Tesouro Selic</th><th>CDB liquidez diária</th></tr></thead><tbody><tr><td>Garantia</td><td>Governo Federal (sem limite)</td><td>FGC até R$ 250k por instituição</td></tr><tr><td>Rendimento</td><td>~100% da Selic ({{selicRate}}% a.a.)</td><td>~95% a 110% do CDI ({{cdiRate}}% a.a.)</td></tr><tr><td>IR</td><td>Regressivo: 22,5% a 15%</td><td>Regressivo: 22,5% a 15%</td></tr><tr><td>Liquidez</td><td>D+1 (1 dia útil)</td><td>D+0 ou D+1</td></tr><tr><td>Valor mínimo</td><td>~R$ 30</td><td>A partir de R$ 1</td></tr><tr><td>Taxa de custódia</td><td>0,20% a.a. (isenta até R$ 10k)</td><td>Não se aplica</td></tr></tbody></table><h2>Simulação: R$ 10.000 investidos</h2>"
    },
    {
      "type": "simulationTable",
      "initialInvestment": 10000,
      "terms": [6, 12, 24],
      "scenarios": [
        { "label": "Tesouro Selic líquido", "rateLogic": "selic/100", "isTaxable": true },
        { "label": "CDB 95% CDI líquido", "rateLogic": "cdi*0.95", "isTaxable": true },
        { "label": "CDB 100% CDI líquido", "rateLogic": "cdi/100", "isTaxable": true },
        { "label": "CDB 105% CDI líquido", "rateLogic": "cdi*1.05", "isTaxable": true },
        { "label": "CDB 110% CDI líquido", "rateLogic": "cdi*1.10", "isTaxable": true }
      ]
    },
    {
      "type": "html",
      "content": "<p><em>Referência: Selic de {{selicRate}}% a.a. e CDI de {{cdiRate}}% a.a. (Bacen/SGS, {{dataAtualizacao}}). Simulações com taxa constante para fins ilustrativos.</em></p><h2>Quando o Tesouro Selic é melhor</h2><ul><li>Para valores acima de R$ 250.000 — FGC não cobre, Governo Federal sim</li><li>Quando o CDB disponível paga abaixo de 100% do CDI</li><li>Para quem quer máxima simplicidade sem escolher emissor</li></ul><h2>Quando o CDB é melhor</h2><ul><li>Quando paga acima de 100% do CDI com liquidez diária</li><li>Para resgates no mesmo dia (D+0)</li><li>Para valores dentro do limite do FGC com taxas mais altas</li></ul><h2>Checklist de decisão</h2><ul><li>Vai investir acima de R$ 250.000? → <strong>Tesouro Selic</strong></li><li>O CDB disponível paga abaixo de 100% do CDI? → <strong>Tesouro Selic</strong></li><li>O CDB disponível paga acima de 101% do CDI com liquidez diária? → <strong>CDB</strong></li><li>Precisa do dinheiro no mesmo dia (D+0)? → <strong>CDB com liquidez D+0</strong></li><li>Quer máxima simplicidade? → <strong>Tesouro Selic</strong></li></ul><h2>Conclusão</h2><p>Tesouro Selic e CDB de liquidez diária são produtos quase equivalentes para reserva de emergência. O que define a escolha é a taxa do CDB disponível e o valor investido.</p><p>Regra simples: se o CDB paga acima de 101% do CDI com liquidez diária, ele vence. Se paga menos, o Tesouro Selic é melhor. Para valores acima de R$ 250.000, Tesouro Selic sempre.</p><p><em>Referência: Selic {{selicRate}}% a.a., CDI {{cdiRate}}% a.a. (Bacen/SGS, {{dataAtualizacao}}).</em></p>"
    }
  ],
  "faq": [
    { "question": "Tesouro Selic ou CDB: qual rende mais?", "answer": "Depende da taxa do CDB. Um CDB acima de 101% do CDI supera o Tesouro Selic. Abaixo disso, o Tesouro Selic vence." },
    { "question": "Qual a diferença entre Tesouro Selic e CDB?", "answer": "A principal diferença é a garantia: Tesouro Selic é garantido pelo Governo Federal sem limite. CDB tem FGC até R$ 250.000 por instituição. O rendimento dos dois é muito próximo." },
    { "question": "Tesouro Selic ou CDB para reserva de emergência?", "answer": "Os dois são excelentes. Para valores acima de R$ 250.000, Tesouro Selic é mais seguro. Para valores menores, um CDB acima de 100% do CDI com liquidez diária pode ser mais vantajoso." },
    { "question": "CDB é mais seguro que Tesouro Selic?", "answer": "Não. O Tesouro Selic é garantido pelo Governo Federal — o de menor risco do Brasil. O CDB tem FGC até R$ 250.000 por instituição." },
    { "question": "Tesouro Selic tem taxa de custódia?", "answer": "Sim, 0,20% ao ano. Mas investimentos de até R$ 10.000 no Tesouro Selic são isentos dessa taxa." }
  ],
  "internalLinks": [
    { "anchor": "o que é Tesouro Direto", "slug": "o-que-e-tesouro-direto" },
    { "anchor": "o que é CDB", "slug": "o-que-e-cdb" },
    { "anchor": "reserva de emergência: quanto guardar", "slug": "reserva-de-emergencia" },
    { "anchor": "quanto rende R$ 10.000 no Tesouro Selic", "slug": "quanto-rende-10000-no-tesouro-selic" },
    { "anchor": "guia completo de renda fixa", "slug": "guia-renda-fixa" }
  ],
  "cta": {
    "primary": { "text": "Veja quanto rende no Tesouro Selic", "url": "/quanto-rende-10000-no-tesouro-selic" },
    "secondary": { "text": "Entenda o que é CDB", "url": "/o-que-e-cdb" }
  }
},
{
  "slug": "o-que-e-cdb",
  "title": "O que é CDB e como funciona",
  "excerpt": "CDB é um título de renda fixa emitido por bancos que paga juros ao investidor. Entenda como funciona, quais os tipos, como é o IR e se vale mais que a poupança.",
  "seoTitle": "O que é CDB e como funciona? Guia completo 2026",
  "seoDescription": "CDB é um título emitido por bancos que paga juros ao investidor. Entenda como funciona, quais os tipos, como é o IR e se vale mais que a poupança.",
  "category": "renda-fixa",
  "subcategory": "cdb",
  "pillar": "pillar-2-renda-fixa",
  "cluster": "cdb",
  "readingTime": "10 min",
  "lastUpdated": "2026-03-20",
  "author": "Equipe Bigwall",
  "disclaimer": "Este conteúdo é educativo e não constitui recomendação de investimento. Rentabilidades são referências e variam conforme o produto e o emissor.",
  "content": [
    {
      "type": "html",
      "content": "<h1>O que é CDB e como funciona: tipos, IR e quando vale a pena</h1><div class='resumo-rapido'><ul><li>CDB é um título emitido por bancos — você empresta dinheiro e recebe juros no resgate</li><li>Tem cobertura do FGC até R$ 250.000 por CPF por instituição</li><li>Rende mais que a poupança ({{poupancaRate}}% a.a.) na maioria dos cenários</li><li>Tem IR regressivo de 22,5% a 15% sobre o rendimento</li><li>Liquidez varia: alguns permitem resgate diário, outros só no vencimento</li></ul></div><p>CDB é um dos investimentos de renda fixa mais populares do Brasil. Este guia explica o que é, como funciona, os tipos disponíveis e o que avaliar antes de investir.</p><h2>O que é CDB</h2><p>CDB significa Certificado de Depósito Bancário. É um título de renda fixa emitido por bancos para captar recursos. Você empresta dinheiro ao banco e recebe de volta com juros no vencimento.</p><p>O CDI atual está em {{cdiRate}}% ao ano (Bacen/SGS, {{dataAtualizacao}}). Um CDB a 100% do CDI rende exatamente esse percentual ao ano — antes de impostos.</p><h2>Tipos de CDB</h2><h3>CDB pré-fixado</h3><p>A taxa é definida na aplicação e não muda. Você sabe exatamente quanto vai receber no vencimento — independente do que acontecer com a Selic.</p><h3>CDB pós-fixado (% do CDI)</h3><p>Acompanha o CDI durante todo o período. Com CDI a {{cdiRate}}% ao ano, um CDB a 110% do CDI rende {{cdbExampleRate}}% ao ano bruto.</p><h3>CDB IPCA+</h3><p>Rende inflação (IPCA a {{ipcaRate}}% ao ano) mais taxa fixa. Garante crescimento real do patrimônio no longo prazo.</p><h2>CDB tem garantia do FGC?</h2><p>Sim. O FGC garante até R$ 250.000 por CPF por instituição e limite global de R$ 1.000.000 por CPF, renovável a cada 4 anos. (Fonte: FGC, {{dataAtualizacao}}.)</p><h2>IR no CDB</h2><table><thead><tr><th>Prazo</th><th>Alíquota IR</th></tr></thead><tbody><tr><td>Até 180 dias</td><td>22,5%</td></tr><tr><td>181 a 360 dias</td><td>20%</td></tr><tr><td>361 a 720 dias</td><td>17,5%</td></tr><tr><td>Acima de 720 dias</td><td>15%</td></tr></tbody></table><p>Fonte: Receita Federal do Brasil. O IR é retido automaticamente na fonte no momento do resgate.</p><h2>CDB vale a pena? Comparação rápida</h2>"
    },
    {
      "type": "simulationTable",
      "initialInvestment": 10000,
      "terms": [12],
      "scenarios": [
        { "label": "Poupança", "rateLogic": "selic>8.5?0.0617:selic*0.70", "isTaxable": false },
        { "label": "CDB 100% CDI", "rateLogic": "cdi/100", "isTaxable": true },
        { "label": "CDB 110% CDI", "rateLogic": "cdi*1.10", "isTaxable": true },
        { "label": "Tesouro Selic", "rateLogic": "selic/100", "isTaxable": true },
        { "label": "LCI 90% CDI", "rateLogic": "cdi*0.90", "isTaxable": false }
      ]
    },
    {
      "type": "html",
      "content": "<p><em>Referência: Selic de {{selicRate}}% a.a. e CDI de {{cdiRate}}% a.a. (Bacen/SGS, {{dataAtualizacao}}). Sempre compare rendimento líquido.</em></p><h2>Como escolher um bom CDB: 5 pontos</h2><ol><li><strong>Taxa:</strong> compare sempre o rendimento líquido — não a taxa bruta</li><li><strong>Liquidez:</strong> defina se pode ou não esperar o vencimento</li><li><strong>Prazo:</strong> combine com seu objetivo</li><li><strong>Emissor:</strong> verifique regulamentação no Bacen (bcb.gov.br)</li><li><strong>Rendimento líquido:</strong> o único número que importa na comparação</li></ol><h2>Conclusão</h2><p>CDB combina segurança (FGC), variedade de prazos e rentabilidade acima da poupança na maioria dos cenários. A chave é sempre comparar rendimento líquido.</p><p>Quer simular? <a href='/quanto-rende-1000-no-cdb'>Veja quanto rende R$ 1.000 no CDB.</a> Ou <a href='/cdb-ou-poupanca'>compare CDB com a poupança.</a></p><p><em>Referência: CDI de {{cdiRate}}% a.a. (Bacen/SGS, {{dataAtualizacao}}).</em></p>"
    }
  ],
  "faq": [
    { "question": "O que é CDB e como funciona?", "answer": "CDB é um título de renda fixa emitido por bancos. Você empresta dinheiro ao banco e recebe de volta com juros no resgate. Tem cobertura do FGC até R$ 250.000 por CPF por instituição." },
    { "question": "CDB tem garantia do FGC?", "answer": "Sim. O FGC garante até R$ 250.000 por CPF por instituição em caso de falência do banco emissor. O limite global é de R$ 1.000.000 por CPF renovável a cada 4 anos." },
    { "question": "CDB tem Imposto de Renda?", "answer": "Sim. IR regressivo de 22,5% para resgates em até 180 dias até 15% acima de 720 dias. Retido automaticamente na fonte." },
    { "question": "Posso perder dinheiro no CDB?", "answer": "Em condições normais, não. O único risco é falência do banco emissor — coberto pelo FGC até R$ 250.000." },
    { "question": "Qual o valor mínimo para investir em CDB?", "answer": "A partir de R$ 1 em corretoras digitais. Em bancos tradicionais pode ser R$ 1.000 ou mais." }
  ],
  "internalLinks": [
    { "anchor": "simule quanto rende R$ 1.000 no CDB", "slug": "quanto-rende-1000-no-cdb" },
    { "anchor": "compare CDB com a poupança", "slug": "cdb-ou-poupanca" },
    { "anchor": "compare CDB e Tesouro Selic", "slug": "tesouro-selic-ou-cdb" },
    { "anchor": "compare CDB e LCI", "slug": "cdb-ou-lci" },
    { "anchor": "guia completo de renda fixa", "slug": "guia-renda-fixa" }
  ],
  "cta": {
    "primary": { "text": "Simule quanto rende o seu CDB", "url": "/quanto-rende-1000-no-cdb" },
    "secondary": { "text": "Compare CDB com a poupança", "url": "/cdb-ou-poupanca" }
  }
},
{
  "slug": "como-comecar-a-investir",
  "title": "Como Começar a Investir do Zero: Guia Passo a Passo",
  "excerpt": "Aprenda a investir do zero com 7 passos práticos: da reserva de emergência à escolha dos primeiros produtos. Guia completo para iniciantes.",
  "seoTitle": "Como Começar a Investir do Zero: Guia Passo a Passo",
  "seoDescription": "Aprenda como começar a investir do zero em 7 passos práticos. Reserva de emergência, perfil de risco, renda fixa e como escolher seus primeiros investimentos.",
  "category": "investimentos",
  "subcategory": "para-iniciantes",
  "pillar": "pillar-1-investimentos",
  "cluster": "comecar-a-investir",
  "readingTime": "12 min",
  "lastUpdated": "2026-03-20",
  "author": "Equipe Bigwall",
  "disclaimer": "Este conteúdo é educativo e não constitui recomendação de investimento. Rentabilidades passadas não garantem resultados futuros.",
  "content": [
    {
      "type": "html",
      "content": "<h1>Como começar a investir do zero (mesmo sem experiência)</h1><div class='resumo-rapido'><ul><li>Você não precisa de muito dinheiro — há opções a partir de R$ 30</li><li>Monte a reserva de emergência antes de qualquer investimento</li><li>Renda fixa é o ponto de partida mais recomendado para iniciantes</li><li>Defina um objetivo antes de escolher qualquer produto</li><li>Consistência importa mais do que o valor inicial</li></ul></div><p>Começar a investir é mais simples do que parece. Você não precisa entender de economia, não precisa ter muito dinheiro e não precisa fazer um curso antes. O que precisa é seguir uma ordem lógica.</p><h2>Por que a maioria das pessoas trava antes de começar</h2><p>A principal razão não é falta de dinheiro — é excesso de dúvida. A pergunta certa não é qual é o melhor investimento, mas o que você precisa fazer antes de investir.</p><h2>Antes de investir: o que organizar</h2><h3>Monte sua reserva de emergência primeiro</h3><p>3 a 6 meses de despesas em produto com liquidez imediata. Com a Selic a {{selicRate}}% ao ano, o Tesouro Selic e o CDB de liquidez diária rendem muito mais que a poupança ({{poupancaRate}}% a.a.) com a mesma segurança.</p><h3>Entenda seu perfil de investidor</h3><table><thead><tr><th>Perfil</th><th>Característica</th><th>Produtos indicados</th></tr></thead><tbody><tr><td>Conservador</td><td>Prioriza segurança</td><td>Tesouro Selic, CDB, LCI, LCA</td></tr><tr><td>Moderado</td><td>Aceita alguma variação</td><td>Mix renda fixa + FIIs ou ETFs</td></tr><tr><td>Arrojado</td><td>Aceita maior oscilação</td><td>Ações, ETFs, FIIs</td></tr></tbody></table><h3>Defina um objetivo claro</h3><p>Reserva de emergência → liquidez imediata. Objetivo de 2 anos → renda fixa de médio prazo. Aposentadoria → pode incluir renda variável.</p><h2>Os 7 passos para começar</h2><h3>Passo 1 — Organize suas finanças</h3><p>Quite dívidas com juros acima de 1% ao mês antes de investir.</p><h3>Passo 2 — Monte a reserva de emergência</h3><p>3 a 6 meses de despesas no Tesouro Selic ou CDB de liquidez diária.</p><h3>Passo 3 — Descubra seu perfil de investidor</h3><p>O teste de perfil é obrigatório por regulamentação da CVM e leva menos de 5 minutos na corretora.</p><h3>Passo 4 — Escolha uma corretora</h3><p>Verifique regulamentação em cvm.gov.br. A maioria das corretoras digitais cobra taxa zero.</p><h3>Passo 5 — Comece pela renda fixa</h3>"
    },
    {
      "type": "simulationTable",
      "initialInvestment": 10000,
      "terms": [12],
      "scenarios": [
        { "label": "Poupança", "rateLogic": "selic>8.5?0.0617:selic*0.70", "isTaxable": false },
        { "label": "Tesouro Selic", "rateLogic": "selic/100", "isTaxable": true },
        { "label": "CDB 100% CDI", "rateLogic": "cdi/100", "isTaxable": true },
        { "label": "LCI 90% CDI", "rateLogic": "cdi*0.90", "isTaxable": false }
      ]
    },
    {
      "type": "html",
      "content": "<h3>Passo 6 — Aumente o aporte com o tempo</h3><p>Aportes mensais regulares produzem resultados significativos graças aos juros compostos.</p><h3>Passo 7 — Aprenda enquanto investe</h3><p>Comece com produtos simples e vá aprendendo no processo.</p><h2>Quanto preciso para começar?</h2><ul><li><strong>Tesouro Direto:</strong> a partir de R$ 30</li><li><strong>CDB:</strong> a partir de R$ 1 em corretoras digitais</li><li><strong>LCI/LCA:</strong> geralmente a partir de R$ 1.000</li><li><strong>ETFs:</strong> a partir de 1 cota (pode ser menos de R$ 100)</li></ul><h2>Erros mais comuns</h2><ol><li>Investir sem ter reserva de emergência</li><li>Deixar tudo na poupança por medo</li><li>Buscar o investimento perfeito em vez de construir a base</li><li>Comparar rendimento bruto sem considerar impostos</li><li>Resgatar antes do prazo por ansiedade</li></ol><h2>Conclusão</h2><p>Organize as finanças, monte a reserva, descubra seu perfil, abra conta em corretora e comece pela renda fixa. O passo mais importante é o primeiro.</p><p>Quer saber onde investir? <a href='/melhores-investimentos-para-iniciantes'>Veja os melhores investimentos para iniciantes.</a></p><p><em>Referência: Selic {{selicRate}}% a.a., CDI {{cdiRate}}% a.a. (Bacen/SGS, {{dataAtualizacao}}).</em></p>"
    }
  ],
  "faq": [
    { "question": "Quanto preciso para começar a investir?", "answer": "Você pode começar com menos de R$ 100. O Tesouro Selic aceita a partir de R$ 30 e alguns CDBs aceitam R$ 1 em corretoras digitais." },
    { "question": "Qual o investimento mais seguro para iniciantes?", "answer": "O Tesouro Selic — garantido pelo Governo Federal. CDBs com FGC até R$ 250.000 também têm alto nível de segurança." },
    { "question": "Preciso de corretora ou posso investir pelo banco?", "answer": "Você pode usar o banco, mas corretoras independentes oferecem mais variedade e melhores condições. Abrir conta é gratuito e 100% digital." },
    { "question": "Renda fixa ou poupança: o que rende mais?", "answer": "Com a Selic acima de 8,5% ao ano, a renda fixa rende muito mais que a poupança — mesmo após o IR." },
    { "question": "Preciso declarar investimentos no IR?", "answer": "Sim. CDB e Tesouro Direto precisam ser declarados mesmo sem imposto a pagar. LCI e LCA são isentas mas também precisam ser declaradas." }
  ],
  "internalLinks": [
    { "anchor": "reserva de emergência: quanto guardar", "slug": "reserva-de-emergencia" },
    { "anchor": "melhores investimentos para iniciantes", "slug": "melhores-investimentos-para-iniciantes" },
    { "anchor": "o que é CDB", "slug": "o-que-e-cdb" },
    { "anchor": "o que é Tesouro Direto", "slug": "o-que-e-tesouro-direto" },
    { "anchor": "guia completo de renda fixa", "slug": "guia-renda-fixa" }
  ],
  "cta": {
    "primary": { "text": "Veja os melhores investimentos para iniciantes", "url": "/melhores-investimentos-para-iniciantes" },
    "secondary": { "text": "Monte sua reserva de emergência", "url": "/reserva-de-emergencia" }
  }
},
{
  "slug": "o-que-e-tesouro-direto",
  "title": "O que é Tesouro Direto",
  "excerpt": "Tesouro Direto é o programa do governo federal para venda de títulos públicos a pessoas físicas. Entenda como funciona, os tipos e como começar a investir.",
  "seoTitle": "O que é Tesouro Direto? Guia completo 2026",
  "seoDescription": "Tesouro Direto é o investimento garantido pelo governo federal. Veja como funciona, os tipos de título, custos, IR e se vale mais que CDB e poupança.",
  "category": "renda-fixa",
  "subcategory": "tesouro-direto",
  "pillar": "pillar-2-renda-fixa",
  "cluster": "tesouro-direto",
  "readingTime": "11 min",
  "lastUpdated": "2026-03-20",
  "author": "Equipe Bigwall",
  "disclaimer": "Este conteúdo é educativo e não constitui recomendação de investimento. Rentabilidades são referências e variam conforme o produto e o emissor.",
  "content": [
    {
      "type": "html",
      "content": "<h1>O que é Tesouro Direto: como funciona, tipos de título e como investir</h1><div class='resumo-rapido'><ul><li>Tesouro Direto é um programa do governo federal para venda de títulos públicos a pessoas físicas</li><li>É o investimento de menor risco do Brasil — garantido pelo Governo Federal</li><li>Três tipos principais: Tesouro Selic, Tesouro Prefixado e Tesouro IPCA+</li><li>Tem IR regressivo (22,5% a 15%) e taxa de custódia da B3 de 0,20% ao ano</li><li>Aplicações a partir de R$ 30 — uma das opções mais acessíveis do mercado</li></ul></div><p>Tesouro Direto é um dos investimentos mais seguros e acessíveis do Brasil. Você empresta dinheiro ao Governo Federal e recebe juros em troca. A Selic atual está em {{selicRate}}% ao ano (Bacen/SGS, {{dataAtualizacao}}).</p><h2>O que é Tesouro Direto</h2><p>Programa criado em 2002 pelo Tesouro Nacional em parceria com a B3. Por ser garantido pelo Governo Federal — que tem o menor risco de crédito do país — é considerado o investimento de menor risco disponível para o investidor brasileiro.</p><h2>Tipos de título</h2><h3>Tesouro Selic</h3><p>Rende de acordo com a taxa Selic ({{selicRate}}% ao ano). Ideal para reserva de emergência — liquidez diária sem risco de perda. É o título mais indicado para quem está começando.</p><h3>Tesouro Prefixado</h3><p>Taxa fixa definida na compra. Você sabe exatamente quanto vai receber no vencimento — independente do que acontecer com a Selic.</p><h3>Tesouro IPCA+</h3><p>Rende IPCA ({{ipcaRate}}% ao ano) mais taxa fixa. Protege o poder de compra no longo prazo. Ideal para objetivos de 5 anos ou mais.</p><table><thead><tr><th>Título</th><th>Como rende</th><th>Liquidez</th><th>Melhor para</th><th>Risco de mercado</th></tr></thead><tbody><tr><td>Tesouro Selic</td><td>Taxa Selic ({{selicRate}}% a.a.)</td><td>Diária sem perda</td><td>Reserva de emergência</td><td>Mínimo</td></tr><tr><td>Tesouro Prefixado</td><td>Taxa fixa na compra</td><td>Diária com marcação</td><td>Médio prazo</td><td>Médio</td></tr><tr><td>Tesouro IPCA+</td><td>IPCA + taxa fixa</td><td>Diária com marcação</td><td>Longo prazo</td><td>Médio</td></tr></tbody></table><h2>Custos do Tesouro Direto</h2><p>Taxa de custódia B3: 0,20% ao ano — isenta para até R$ 10.000 no Tesouro Selic. A maioria das corretoras cobra taxa zero para operar no Tesouro Direto.</p><h2>Tesouro Direto tem FGC?</h2><p>Não — e não precisa. É garantido pelo Governo Federal, com risco de crédito menor que qualquer banco privado.</p><h2>IR no Tesouro Direto</h2><table><thead><tr><th>Prazo</th><th>Alíquota IR</th></tr></thead><tbody><tr><td>Até 180 dias</td><td>22,5%</td></tr><tr><td>181 a 360 dias</td><td>20%</td></tr><tr><td>361 a 720 dias</td><td>17,5%</td></tr><tr><td>Acima de 720 dias</td><td>15%</td></tr></tbody></table><p>Fonte: Receita Federal do Brasil. O IR é retido automaticamente na fonte no resgate.</p><h2>Tesouro Direto vale a pena? Comparação rápida</h2>"
    },
    {
      "type": "simulationTable",
      "initialInvestment": 10000,
      "terms": [12],
      "scenarios": [
        { "label": "Poupança", "rateLogic": "selic>8.5?0.0617:selic*0.70", "isTaxable": false },
        { "label": "Tesouro Selic", "rateLogic": "selic/100", "isTaxable": true },
        { "label": "CDB 100% CDI", "rateLogic": "cdi/100", "isTaxable": true },
        { "label": "LCI 90% CDI", "rateLogic": "cdi*0.90", "isTaxable": false }
      ]
    },
    {
      "type": "html",
      "content": "<p><em>Referência: Selic de {{selicRate}}% a.a. e CDI de {{cdiRate}}% a.a. (Bacen/SGS, {{dataAtualizacao}}). Sempre compare rendimento líquido.</em></p><h2>Como começar a investir no Tesouro Direto</h2><ol><li>Abra conta em corretora habilitada pelo Tesouro Nacional</li><li>Acesse a área de Tesouro Direto na plataforma</li><li>Escolha o título adequado ao seu objetivo</li><li>Informe o valor (mínimo ~R$ 30) e confirme a compra</li><li>Acompanhe pelo extrato da corretora ou em tesourodireto.com.br</li></ol><h2>Conclusão</h2><p>Tesouro Direto é o ponto de partida mais seguro para qualquer investidor brasileiro. O Tesouro Selic é ideal para reserva de emergência e curto prazo. Para longo prazo, o Tesouro IPCA+ garante crescimento acima da inflação.</p><p><a href='/tesouro-selic-ou-cdb'>Compare Tesouro Selic e CDB</a> ou <a href='/quanto-rende-10000-no-tesouro-selic'>simule quanto rende R$ 10.000 no Tesouro Selic.</a></p><p><em>Referência: Selic de {{selicRate}}% a.a. (Bacen/SGS, {{dataAtualizacao}}).</em></p>"
    }
  ],
  "faq": [
    { "question": "O que é Tesouro Direto e como funciona?", "answer": "Tesouro Direto é um programa do Governo Federal que permite pessoas físicas comprarem títulos públicos. Você empresta dinheiro ao governo e recebe juros em troca. É o investimento de menor risco do Brasil." },
    { "question": "Tesouro Direto tem FGC?", "answer": "Não. É garantido pelo Governo Federal, que tem risco de crédito menor que qualquer banco privado. É mais seguro que investimentos cobertos pelo FGC." },
    { "question": "Qual a diferença entre Tesouro Selic, Prefixado e IPCA+?", "answer": "Tesouro Selic acompanha a taxa básica de juros — ideal para reserva de emergência. Prefixado tem taxa fixa — médio prazo. IPCA+ rende inflação mais taxa fixa — longo prazo." },
    { "question": "Qual o valor mínimo para investir no Tesouro Direto?", "answer": "A partir de aproximadamente R$ 30, equivalente a 1% do título mais barato disponível." },
    { "question": "Posso perder dinheiro no Tesouro Direto?", "answer": "Se carregar até o vencimento, não. Se vender antes, pode receber mais ou menos por causa da marcação a mercado. Para o Tesouro Selic esse risco é mínimo." }
  ],
  "internalLinks": [
    { "anchor": "compare Tesouro Selic e CDB", "slug": "tesouro-selic-ou-cdb" },
    { "anchor": "simule quanto rende R$ 10.000 no Tesouro Selic", "slug": "quanto-rende-10000-no-tesouro-selic" },
    { "anchor": "reserva de emergência: quanto guardar", "slug": "reserva-de-emergencia" },
    { "anchor": "guia completo de renda fixa", "slug": "guia-renda-fixa" },
    { "anchor": "como começar a investir do zero", "slug": "como-comecar-a-investir" }
  ],
  "cta": {
    "primary": { "text": "Simule quanto rende no Tesouro Selic", "url": "/quanto-rende-10000-no-tesouro-selic" },
    "secondary": { "text": "Compare Tesouro Direto com CDB", "url": "/tesouro-selic-ou-cdb" }
  }
},
{
  "slug": "o-que-e-lci",
  "title": "O que é LCI e como funciona",
  "excerpt": "LCI é um título de renda fixa isento de IR para pessoa física. Entenda como funciona, quando compensa em relação ao CDB e como escolher a melhor opção.",
  "seoTitle": "O que é LCI e como funciona? Guia completo 2026",
  "seoDescription": "LCI é um título de renda fixa isento de IR para pessoa física. Veja como funciona, os tipos, quando compensa mais que CDB e como investir.",
  "category": "renda-fixa",
  "subcategory": "lci",
  "pillar": "pillar-2-renda-fixa",
  "cluster": "lci-lca",
  "readingTime": "10 min",
  "lastUpdated": "2026-03-20",
  "author": "Equipe Bigwall",
  "disclaimer": "Este conteúdo é educativo e não constitui recomendação de investimento. Rentabilidades são referências e variam conforme o produto e o emissor.",
  "content": [
    {
      "type": "html",
      "content": "<h1>O que é LCI e como funciona: vantagens e quando vale a pena</h1><div class='resumo-rapido'><ul><li>LCI é um título de renda fixa emitido por bancos, lastreado em crédito imobiliário</li><li>É isento de Imposto de Renda para pessoa física — essa é a principal vantagem</li><li>Tem cobertura do FGC até R$ 250.000 por CPF por instituição</li><li>Tem carência mínima de 90 dias — não permite resgate imediato</li><li>A comparação correta com CDB é sempre pelo rendimento líquido</li></ul></div><p>LCI é um dos investimentos de renda fixa mais procurados por quem quer pagar menos imposto. A isenção de IR é o principal atrativo — mas nem sempre significa que rende mais que um CDB.</p><h2>O que é LCI</h2><p>LCI significa Letra de Crédito Imobiliário. É um título emitido por bancos para captar recursos destinados ao financiamento do setor imobiliário. O governo isenta o rendimento de IR para pessoa física como incentivo ao setor.</p><p>O CDI atual está em {{cdiRate}}% ao ano (Bacen/SGS, {{dataAtualizacao}}). Uma LCI a 90% do CDI rende {{lci90Rate}}% ao ano — isento de IR.</p><h2>Carência mínima obrigatória</h2><p>Por regulamentação do Banco Central, a LCI tem prazo mínimo de 90 dias. Você não pode resgatar antes desse período. Regra prática: LCI não é indicada para reserva de emergência.</p><h2>Tipos de LCI</h2><table><thead><tr><th>Tipo</th><th>Como rende</th><th>IR</th><th>Melhor para</th></tr></thead><tbody><tr><td>Pós-fixada (% CDI)</td><td>Acompanha o CDI ({{cdiRate}}% a.a.)</td><td>Isento (PF)</td><td>Médio prazo com juros altos</td></tr><tr><td>Pré-fixada</td><td>Taxa fixa definida na compra</td><td>Isento (PF)</td><td>Quem acredita na queda dos juros</td></tr><tr><td>IPCA+</td><td>IPCA ({{ipcaRate}}% a.a.) + taxa fixa</td><td>Isento (PF)</td><td>Longo prazo com proteção inflacionária</td></tr></tbody></table><h2>LCI tem FGC?</h2><p>Sim. O FGC garante até R$ 250.000 por CPF por instituição e limite global de R$ 1.000.000 por CPF, renovável a cada 4 anos. (Fonte: FGC, {{dataAtualizacao}}.)</p><h2>Como calcular se a LCI compensa mais que o CDB</h2><p>Fórmula: <strong>Taxa LCI equivalente = Taxa CDB × (1 — alíquota IR)</strong></p><p>Exemplo com CDI a {{cdiRate}}% ao ano e IR de 15% (acima de 720 dias): CDB 100% CDI líquido = {{cdiRate}}% × 0,85. Se a LCI pagar acima desse valor, ela vence no líquido.</p><h2>Simulação prática: LCI vs CDB</h2>"
    },
    {
      "type": "simulationTable",
      "initialInvestment": 10000,
      "terms": [12],
      "scenarios": [
        { "label": "CDB 100% CDI líquido", "rateLogic": "cdi/100", "isTaxable": true },
        { "label": "CDB 110% CDI líquido", "rateLogic": "cdi*1.10", "isTaxable": true },
        { "label": "LCI 90% CDI (isento)", "rateLogic": "cdi*0.90", "isTaxable": false },
        { "label": "LCI 95% CDI (isento)", "rateLogic": "cdi*0.95", "isTaxable": false }
      ]
    },
    {
      "type": "html",
      "content": "<p><em>Referência: CDI de {{cdiRate}}% a.a. (Bacen/SGS, {{dataAtualizacao}}). Sempre compare rendimento líquido.</em></p><h2>Conclusão</h2><p>LCI é uma excelente opção para quem tem objetivo com prazo definido e pode abrir mão da liquidez imediata. A isenção de IR é uma vantagem real — mas só compensa quando a taxa é competitiva.</p><p>Regra de ouro: sempre compare pelo rendimento líquido. <a href='/cdb-ou-lci'>Veja o comparativo completo entre CDB e LCI.</a></p><p><em>Referência: CDI de {{cdiRate}}% a.a. (Bacen/SGS, {{dataAtualizacao}}).</em></p>"
    }
  ],
  "faq": [
    { "question": "O que é LCI e como funciona?", "answer": "LCI é um título de renda fixa emitido por bancos para financiar o setor imobiliário. Você empresta dinheiro ao banco e recebe juros isentos de IR. Tem cobertura do FGC até R$ 250.000 por CPF por instituição." },
    { "question": "LCI é isenta de Imposto de Renda?", "answer": "Sim, para pessoa física. O rendimento da LCI é totalmente isento de IR, independente do prazo. Para pessoa jurídica, o IR é cobrado normalmente." },
    { "question": "LCI tem FGC?", "answer": "Sim. O FGC garante até R$ 250.000 por CPF por instituição em caso de falência do banco emissor." },
    { "question": "LCI tem carência? Quando posso resgatar?", "answer": "Sim. Por regulamentação do Banco Central, a LCI tem prazo mínimo de 90 dias. A maioria só permite resgate no vencimento. Não é indicada para reserva de emergência." },
    { "question": "LCI rende mais que CDB?", "answer": "Depende das taxas. Compare sempre pelo rendimento líquido. Uma LCI a 90% do CDI pode render mais no líquido que um CDB a 100% do CDI pela isenção de IR." }
  ],
  "internalLinks": [
    { "anchor": "compare CDB e LCI lado a lado", "slug": "cdb-ou-lci" },
    { "anchor": "o que é CDB e como funciona", "slug": "o-que-e-cdb" },
    { "anchor": "o que é LCA e como funciona", "slug": "o-que-e-lca" },
    { "anchor": "guia completo de renda fixa", "slug": "guia-renda-fixa" },
    { "anchor": "como começar a investir do zero", "slug": "como-comecar-a-investir" }
  ],
  "cta": {
    "primary": { "text": "Compare LCI e CDB", "url": "/cdb-ou-lci" },
    "secondary": { "text": "Veja o guia completo de renda fixa", "url": "/guia-renda-fixa" }
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
    "slug": "cdb-ou-lci",
    "title": "CDB ou LCI: quando a isenção compensa?",
    "excerpt": "CDB tem IR, LCI é isenta — mas isso não significa que LCI rende mais. Veja como comparar corretamente pelo rendimento líquido e quando cada um compensa.",
    "seoTitle": "CDB ou LCI: quando a isenção de IR compensa? 2026",
    "seoDescription": "CDB ou LCI: descubra quando a isenção de IR da LCI realmente compensa. Comparativo com tabela de rendimento líquido, exemplos práticos e checklist.",
    "category": "renda-fixa",
    "subcategory": "comparativos",
    "pillar": "pillar-2-renda-fixa",
    "cluster": "comparativos-renda-fixa",
    "readingTime": "9 min",
    "lastUpdated": "2026-03-20",
    "author": "Equipe Bigwall",
    "disclaimer": "Este conteúdo é educativo e não constitui recomendação de investimento. Rentabilidades são referências e variam conforme o produto e o emissor.",
    "content": [
      {
        "type": "html",
        "content": "<h1>CDB ou LCI: quando a isenção de IR realmente compensa?</h1><div class='resumo-rapido'><ul><li>LCI é isenta de IR para pessoa física — CDB tem IR de 15% a 22,5%</li><li>Isenção não garante que LCI rende mais — depende da taxa e do prazo</li><li>A comparação correta é sempre pelo rendimento líquido</li><li>LCI tem carência mínima de 90 dias — CDB pode ter liquidez diária</li><li>CDI atual: {{cdiRate}}% ao ano (Bacen/SGS, {{dataAtualizacao}})</li></ul></div><p>A dúvida entre CDB e LCI é uma das mais comuns em renda fixa. A isenção de IR da LCI é uma vantagem real — mas só compensa quando a taxa oferecida é competitiva o suficiente.</p><h2>Diferenças principais entre CDB e LCI</h2><table><thead><tr><th>Característica</th><th>CDB</th><th>LCI</th></tr></thead><tbody><tr><td>IR para PF</td><td>15% a 22,5% sobre rendimento</td><td>Isento</td></tr><tr><td>FGC</td><td>Até R$ 250k por CPF/instituição</td><td>Até R$ 250k por CPF/instituição</td></tr><tr><td>Liquidez</td><td>Pode ter liquidez diária</td><td>Carência mínima 90 dias</td></tr><tr><td>Valor mínimo típico</td><td>A partir de R$ 1</td><td>Geralmente R$ 1.000+</td></tr><tr><td>IR para PJ</td><td>Sim</td><td>Sim (isenção só para PF)</td></tr></tbody></table><h2>Como comparar corretamente</h2><p>Fórmula: <strong>Taxa LCI equivalente = Taxa CDB × (1 — alíquota IR)</strong></p><p>Exemplo com CDI a {{cdiRate}}% ao ano e IR de 15% (acima de 720 dias): um CDB a 100% do CDI equivale a uma LCI de 85% do CDI. Se a LCI pagar acima de 85% do CDI, ela vence no líquido.</p><h2>Simulação prática: R$ 10.000 em CDB vs LCI</h2>"
      },
      {
        "type": "simulationTable",
        "initialInvestment": 10000,
        "terms": [12],
        "scenarios": [
          { "label": "CDB 100% CDI líquido", "rateLogic": "cdi/100", "isTaxable": true },
          { "label": "LCI 90% CDI (isento)", "rateLogic": "cdi*0.90", "isTaxable": false },
          { "label": "CDB 110% CDI líquido", "rateLogic": "cdi*1.10", "isTaxable": true },
          { "label": "LCI 95% CDI (isento)", "rateLogic": "cdi*0.95", "isTaxable": false }
        ]
      },
      {
        "type": "html",
        "content": "<p><em>Referência: CDI de {{cdiRate}}% a.a. (Bacen/SGS, {{dataAtualizacao}}). Sempre compare rendimento líquido.</em></p><h2>Quando a LCI compensa mais que o CDB</h2><ul><li>A taxa da LCI está acima do ponto de equivalência</li><li>O prazo é curto (até 360 dias) — IR do CDB é mais alto nesses prazos</li><li>Você não precisa de liquidez imediata</li></ul><h2>Quando o CDB compensa mais</h2><ul><li>A taxa do CDB está significativamente acima do ponto de equivalência</li><li>Você precisa de liquidez imediata — CDB de liquidez diária resolve, LCI não</li><li>O valor mínimo da LCI está acima do que você quer investir</li><li>Você é pessoa jurídica (LCI não é isenta para PJ)</li></ul><h2>Checklist de decisão em 60 segundos</h2><ul><li>Pode deixar o dinheiro por pelo menos 90 dias? Se não → <strong>CDB liquidez diária</strong></li><li>A LCI paga acima do ponto de equivalência? Se sim → <strong>LCI</strong></li><li>Você é PJ? → <strong>CDB</strong></li><li>O CDB disponível paga acima de 110% do CDI? → <strong>compare com a tabela antes de decidir</strong></li></ul><h2>Conclusão</h2><p>A regra de ouro: <strong>sempre compare rendimento líquido, nunca taxa bruta.</strong></p><p>Quer entender melhor cada produto? <a href='/o-que-e-cdb'>O que é CDB</a> e <a href='/o-que-e-lci'>o que é LCI.</a></p><p><em>Referência: CDI de {{cdiRate}}% a.a. (Bacen/SGS, {{dataAtualizacao}}).</em></p>"
      }
    ],
    "faq": [
      { "question": "CDB ou LCI: qual rende mais?", "answer": "Depende da taxa oferecida. Compare sempre pelo rendimento líquido. LCI é isenta de IR, mas um CDB com taxa suficientemente alta pode superar a LCI." },
      { "question": "Qual a principal diferença entre CDB e LCI?", "answer": "IR e liquidez. CDB tem IR de 15% a 22,5%, LCI é isenta para PF. CDB pode ter liquidez diária, LCI tem carência mínima de 90 dias." },
      { "question": "Como calcular o ponto de equivalência entre CDB e LCI?", "answer": "Taxa LCI equivalente = taxa CDB × (1 - alíquota IR). Exemplo: CDB a 100% do CDI com IR de 20% equivale a LCI de 80% do CDI." },
      { "question": "LCI é isenta de IR para pessoa jurídica?", "answer": "Não. A isenção se aplica apenas para pessoa física. Empresas pagam IR normalmente sobre rendimentos de LCI." },
      { "question": "LCI tem FGC?", "answer": "Sim. Até R$ 250.000 por CPF por instituição, com limite global de R$ 1.000.000 renovável a cada 4 anos." }
    ],
    "internalLinks": [
      { "anchor": "o que é CDB e como funciona", "slug": "o-que-e-cdb" },
      { "anchor": "o que é LCI e como funciona", "slug": "o-que-e-lci" },
      { "anchor": "guia completo de renda fixa", "slug": "guia-renda-fixa" },
      { "anchor": "compare Tesouro Selic e CDB", "slug": "tesouro-selic-ou-cdb" },
      { "anchor": "como começar a investir do zero", "slug": "como-comecar-a-investir" }
    ],
    "cta": {
      "primary": { "text": "Entenda o que é CDB", "url": "/o-que-e-cdb" },
      "secondary": { "text": "Entenda o que é LCI", "url": "/o-que-e-lci" }
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
          { "label": "Poupança", "rateLogic": "selic>8.5?0.0617:selic*0.70", "isTaxable": false },
          { "label": "Tesouro Selic", "rateLogic": "selic/100", "isTaxable": true },
          { "label": "CDB 100% CDI", "rateLogic": "cdi/100", "isTaxable": true },
          { "label": "LCI 90% CDI", "rateLogic": "cdi*0.90", "isTaxable": false },
          { "label": "LCI 95% CDI", "rateLogic": "cdi*0.95", "isTaxable": false },
          { "label": "CDB 110% CDI", "rateLogic": "cdi*1.10", "isTaxable": true }
        ]
      },
      {
        "type": "html",
        "content": "<p><em>Referência: Selic de {{selicRate}}% a.a. e CDI de {{cdiRate}}% a.a. (Bacen/SGS, {{dataAtualizacao}}). Sempre compare rendimento líquido.</em></p><h2>Por que a poupança não é recomendada</h2><p>A poupança rende apenas {{poupancaRate}}% ao ano com a Selic atual de {{selicRate}}% — menos da metade do Tesouro Selic ou CDB de liquidez diária. Existem alternativas com a mesma segurança (FGC) e rendimento muito superior.</p><h2>Como escolher o melhor para o seu caso</h2><p><strong>Tem reserva de emergência?</strong> Não → comece pelo Tesouro Selic ou CDB de liquidez diária.<br><strong>Prazo menor que 1 ano?</strong> → Tesouro Selic ou CDB diário.<br><strong>Prazo de 1 a 3 anos?</strong> → LCI/LCA ou CDB com prazo.<br><strong>Longo prazo?</strong> → Tesouro IPCA+ ou mix renda fixa e variável.</p><h2>Conclusão</h2><p>Para a maioria dos iniciantes: Tesouro Selic ou CDB para reserva de emergência, LCI/LCA para médio prazo e Tesouro IPCA+ para longo prazo.</p><p><a href='/como-comecar-a-investir'>Veja o guia completo de como começar a investir.</a></p><p><em>Referência: Selic {{selicRate}}% a.a., CDI {{cdiRate}}% a.a. (Bacen/SGS, {{dataAtualizacao}}).</em></p>"
      }
    ],
    "faq": [
      { "question": "Qual o melhor investimento para quem está começando?", "answer": "Tesouro Selic e CDB de liquidez diária são os melhores pontos de partida — seguros, acessíveis e com rendimento muito acima da poupança." },
      { "question": "Quanto preciso para começar a investir?", "answer": "Você pode começar com menos de R$ 100. O Tesouro Selic aceita a partir de R$ 30 e alguns CDBs aceitam R$ 1 em corretoras digitais." },
      { "question": "Poupança é boa para iniciantes?", "answer": "Não. Com a Selic a {{selicRate}}% ao ano, a poupança rende {{poupancaRate}}% ao ano — menos da metade do Tesouro Selic ou CDB." },
      { "question": "LCI é boa para iniciantes?", "answer": "Sim, para objetivos com prazo acima de 90 dias. Não é indicada para reserva de emergência pela carência mínima." },
      { "question": "Devo começar pela renda fixa ou variável?", "answer": "Renda fixa. Monte a reserva de emergência, entenda os produtos e só então explore renda variável com uma parcela pequena." }
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
  },
  {
    "slug": "quanto-rende-10000-no-tesouro-selic",
    "title": "Quanto rende R$ 10.000 no Tesouro Selic",
    "excerpt": "Veja quanto rende R$ 10.000 no Tesouro Selic em 1, 6, 12 e 24 meses. Simulação com rendimento líquido após IR, comparação com poupança e CDB.",
    "seoTitle": "Quanto rende R$ 10.000 no Tesouro Selic? Simulação 2026",
    "seoDescription": "Simule quanto rende R$ 10.000 no Tesouro Selic em 1, 6, 12 e 24 meses. Veja o rendimento líquido após IR, comparação com poupança e CDB atualizado.",
    "category": "renda-fixa",
    "subcategory": "tesouro-direto",
    "pillar": "pillar-2-renda-fixa",
    "cluster": "tesouro-direto",
    "readingTime": "8 min",
    "lastUpdated": "2026-03-20",
    "author": "Equipe Bigwall",
    "disclaimer": "Este conteúdo é educativo e não constitui recomendação de investimento. As simulações assumem taxa constante para fins ilustrativos — o rendimento real pode variar.",
    "content": [
      {
        "type": "html",
        "content": "<h1>Quanto rende R$ 10.000 no Tesouro Selic? Simulação com rendimento líquido</h1><div class='resumo-rapido'><ul><li>Com Selic a {{selicRate}}% ao ano, R$ 10.000 no Tesouro Selic rendem bem acima da poupança em todos os prazos</li><li>Para valores até R$ 10.000, a taxa de custódia da B3 é isenta</li><li>Tem IR regressivo — quanto mais tempo investido, menor a alíquota</li><li>Simulações assumem taxa constante para fins ilustrativos</li></ul></div><p>Esta simulação mostra o rendimento de R$ 10.000 no Tesouro Selic em diferentes prazos. Referência: Selic de {{selicRate}}% ao ano e CDI de {{cdiRate}}% ao ano (Bacen/SGS, {{dataAtualizacao}}).</p><h2>Simulação: quanto rende R$ 10.000 no Tesouro Selic</h2>"
      },
      {
        "type": "simulationTable",
        "initialInvestment": 10000,
        "terms": [1, 3, 6, 12, 24, 36],
        "scenarios": [
          { "label": "Tesouro Selic ({{selicRate}}% a.a.)", "rateLogic": "selic/100", "isTaxable": true }
        ]
      },
      {
        "type": "html",
        "content": "<h2>Tesouro Selic vs Poupança</h2>"
      },
      {
        "type": "simulationTable",
        "initialInvestment": 10000,
        "terms": [6, 12, 24, 36],
        "showDifference": true,
        "scenarios": [
          { "label": "Poupança ({{poupancaRate}}% a.a.)", "rateLogic": "selic>8.5?0.0617:selic*0.70", "isTaxable": false },
          { "label": "Tesouro Selic líquido", "rateLogic": "selic/100", "isTaxable": true }
        ]
      },
      {
        "type": "html",
        "content": "<h2>Tesouro Selic vs CDB</h2>"
      },
      {
        "type": "simulationTable",
        "initialInvestment": 10000,
        "terms": [6, 12, 24],
        "scenarios": [
          { "label": "Tesouro Selic líquido", "rateLogic": "selic/100", "isTaxable": true },
          { "label": "CDB 100% CDI líquido", "rateLogic": "cdi/100", "isTaxable": true },
          { "label": "CDB 110% CDI líquido", "rateLogic": "cdi*1.10", "isTaxable": true }
        ]
      },
      {
        "type": "html",
        "content": "<h2>Vale a pena investir R$ 10.000 no Tesouro Selic?</h2><p>Para reserva de emergência: sim. O Tesouro Selic é o produto mais indicado — liquidez diária, risco mínimo e rendimento muito acima da poupança ({{poupancaRate}}% a.a.).</p><p>Para médio e longo prazo: o Tesouro Selic é uma boa base, mas CDBs com taxas mais altas, LCI/LCA ou Tesouro IPCA+ podem oferecer rendimento maior.</p><h2>Conclusão</h2><p>R$ 10.000 no Tesouro Selic com a Selic a {{selicRate}}% ao ano rendem aproximadamente o dobro da poupança em qualquer prazo — mesmo após o IR.</p><p><a href='/o-que-e-tesouro-direto'>Leia o guia completo sobre o Tesouro Direto.</a> Ou <a href='/tesouro-selic-ou-cdb'>compare Tesouro Selic com CDB.</a></p><p><em>Referência: Selic de {{selicRate}}% a.a. (Bacen/SGS, {{dataAtualizacao}}).</em></p>"
      }
    ],
    "faq": [
      { "question": "Quanto rende R$ 10.000 no Tesouro Selic em 12 meses?", "answer": "Com a Selic a {{selicRate}}% ao ano, R$ 10.000 no Tesouro Selic rendem significativamente mais que a poupança em 12 meses, após IR de 20%." },
      { "question": "Tesouro Selic rende mais que a poupança?", "answer": "Sim, em todos os cenários com Selic acima de 8,5% ao ano. Com a Selic atual de {{selicRate}}%, o Tesouro Selic rende aproximadamente o dobro da poupança no líquido." },
      { "question": "Tesouro Selic tem taxa de custódia?", "answer": "Sim, 0,20% ao ano. Porém investimentos de até R$ 10.000 no Tesouro Selic são isentos dessa taxa." },
      { "question": "Posso perder dinheiro no Tesouro Selic?", "answer": "Praticamente não. O Tesouro Selic sobe todos os dias acompanhando a Selic. Mesmo em resgates antecipados, a chance de perda é extremamente baixa." },
      { "question": "Tesouro Selic ou CDB: qual é melhor?", "answer": "Os dois têm rendimento muito próximo. A diferença principal é a garantia: Tesouro é garantido pelo Governo Federal sem limite. CDB tem FGC até R$ 250.000 por instituição." }
    ],
    "internalLinks": [
      { "anchor": "veja o guia completo do Tesouro Direto", "slug": "o-que-e-tesouro-direto" },
      { "anchor": "compare Tesouro Selic e CDB", "slug": "tesouro-selic-ou-cdb" },
      { "anchor": "reserva de emergência: quanto guardar", "slug": "reserva-de-emergencia" },
      { "anchor": "guia completo de renda fixa", "slug": "guia-renda-fixa" }
    ],
    "cta": {
      "primary": { "text": "Veja o guia completo do Tesouro Direto", "url": "/o-que-e-tesouro-direto" },
      "secondary": { "text": "Compare Tesouro Selic com CDB", "url": "/tesouro-selic-ou-cdb" }
    }
  }
]

  

    
