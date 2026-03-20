
import type { ImagePlaceholder } from './placeholder-images';
import data from './placeholder-images.json';

export const placeholderImages: ImagePlaceholder[] = data.placeholderImages;

export type Article = {
  slug: string;
  title: string;
  description: string;
  date: string;
  imageId: string;
  content: string;
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
    slug: 'o-que-e-lci',
    title: 'O que é LCI? Como funciona e se vale a pena',
    description: 'LCI é um título de renda fixa isento de Imposto de Renda para pessoa física. Entenda como funciona, quando compensa em relação ao CDB e como escolher a melhor opção.',
    seoTitle: 'O que é LCI? Como funciona e se vale a pena',
    seoDescription: 'LCI é um título de renda fixa isento de IR para pessoa física. Veja como funciona, quais os tipos, quando compensa mais que CDB e como investir.',
    date: '2026-03-20',
    imageId: 'blog-o-que-e-lci',
    content: "<h1>O que é LCI: como funciona, vantagens e quando vale a pena</h1><div class='resumo-rapido'><ul><li>LCI é um título de renda fixa emitido por bancos, lastreado em crédito imobiliário</li><li>É isento de Imposto de Renda para pessoa física — essa é a principal vantagem</li><li>Tem cobertura do FGC até R$ 250.000 por CPF por instituição</li><li>Geralmente tem carência mínima — não permite resgate imediato como o CDB de liquidez diária</li><li>Para saber se compensa, sempre compare o rendimento líquido com outras opções</li></ul></div><p>LCI é um dos investimentos de renda fixa mais procurados por quem quer pagar menos imposto. A isenção de IR para pessoa física é o principal atrativo — mas nem sempre isso significa que a LCI rende mais que um CDB ou o Tesouro Direto.</p><p>Este guia explica o que é, como funciona, quais os tipos disponíveis e como calcular se a isenção realmente compensa no seu caso.</p><h2>O que é LCI</h2><p>LCI significa Letra de Crédito Imobiliário. É um título de renda fixa emitido por bancos e instituições financeiras para captar recursos destinados ao financiamento do setor imobiliário.</p><p>Na prática: você empresta dinheiro ao banco, que usa esses recursos para financiar imóveis. Em troca, o banco te paga juros — e o governo isenta esse rendimento de Imposto de Renda para pessoa física, como incentivo ao setor imobiliário.</p><p>É regulamentada pelo Banco Central do Brasil e tem cobertura do Fundo Garantidor de Créditos (FGC).</p><h2>Como funciona a LCI na prática</h2><h3>A isenção de IR é a grande vantagem</h3><p>Em investimentos como CDB e Tesouro Direto, o Imposto de Renda come parte do rendimento — de 22,5% para resgates curtos até 15% para prazos acima de 720 dias.</p><p>Na LCI, o rendimento é totalmente isento de IR para pessoa física. Isso significa que 100% dos juros ficam com você no resgate.</p><p>Mas atenção: a isenção não garante automaticamente que a LCI rende mais. Uma LCI a 85% do CDI pode render menos no líquido do que um CDB a 110% do CDI — dependendo do prazo. Sempre compare o rendimento líquido.</p><h3>Carência mínima obrigatória</h3><p>Por regulamentação do Banco Central, a LCI tem prazo mínimo de 90 dias. Isso significa que você não pode resgatar o dinheiro antes desse período.</p><p>Na prática, a maioria das LCIs disponíveis no mercado tem carência de 90 dias a 1 ano — algumas só permitem resgate no vencimento. Verifique sempre as condições antes de aplicar.</p><p>Regra prática: LCI não é indicada para reserva de emergência por causa da carência. Use para objetivos com prazo definido e dinheiro que você não vai precisar antes do vencimento.</p><h2>Tipos de LCI: pré-fixada, pós-fixada e IPCA+</h2><h3>LCI pós-fixada (% do CDI)</h3><p>A mais comum no mercado. Rende um percentual do CDI — geralmente entre 85% e 97% do CDI. A taxa acompanha o CDI durante todo o período.</p><p>Exemplo: LCI a 92% do CDI. Se o CDI for 10,65% ao ano, a LCI rende 9,80% ao ano — isento de IR.</p><h3>LCI pré-fixada</h3><p>A taxa é definida no momento da aplicação e não muda. Você sabe exatamente quanto vai receber no vencimento.</p><p>Exemplo: LCI pré-fixada a 11% ao ano. Independente do que acontecer com a Selic, você recebe 11% ao ano — isento de IR.</p><h3>LCI IPCA+</h3><p>Rende a inflação (IPCA) mais uma taxa fixa, com isenção de IR. Menos comum que as anteriores, mas oferece proteção real contra a inflação.</p><table><thead><tr><th>Tipo</th><th>Como rende</th><th>IR</th><th>Melhor para</th></tr></thead><tbody><tr><td>Pós-fixada (% CDI)</td><td>Acompanha o CDI</td><td>Isento (PF)</td><td>Médio prazo com juros altos</td></tr><tr><td>Pré-fixada</td><td>Taxa fixa definida na compra</td><td>Isento (PF)</td><td>Quem acredita na queda dos juros</td></tr><tr><td>IPCA+</td><td>Inflação + taxa fixa</td><td>Isento (PF)</td><td>Longo prazo com proteção inflacionária</td></tr></tbody></table><h2>LCI tem garantia do FGC?</h2><p>Sim. A LCI tem cobertura do Fundo Garantidor de Créditos (FGC) com os mesmos limites do CDB:</p><ul><li><strong>Até R$ 250.000 por CPF por instituição financeira</strong></li><li><strong>Limite global de R$ 1.000.000 por CPF</strong>, renovável a cada 4 anos</li></ul><p>Fonte: FGC (fgc.org.br), março de 2026.</p><p>Isso significa que, dentro desse limite, o risco de perda é muito baixo mesmo em bancos menores — que costumam oferecer as melhores taxas de LCI.</p><h2>LCI tem Imposto de Renda ou IOF?</h2><p><strong>IR: isento para pessoa física.</strong> Essa é a principal vantagem da LCI. Você não paga nada de IR sobre o rendimento — seja qual for o prazo.</p><p><strong>IOF: não se aplica</strong> para LCIs com prazo mínimo de 90 dias, que é o padrão do mercado.</p><p><strong>Pessoa jurídica:</strong> a isenção de IR se aplica apenas para pessoa física. Empresas pagam IR normalmente sobre rendimentos de LCI.</p><h2>Como calcular se a LCI compensa mais que o CDB</h2><p>A comparação correta é sempre pelo rendimento líquido — depois de impostos.</p><p>Fórmula para equivalência entre LCI e CDB pós-fixado:</p><p><strong>Taxa LCI equivalente = Taxa CDB × (1 — alíquota IR)</strong></p><p>Exemplos práticos com CDI a 10,65% ao ano e IR de 15% (prazo acima de 720 dias):</p><table><thead><tr><th>Produto</th><th>Taxa bruta</th><th>IR</th><th>Rendimento líquido</th></tr></thead><tbody><tr><td>CDB 100% CDI</td><td>10,65% a.a.</td><td>15%</td><td>9,05% a.a.</td></tr><tr><td>CDB 110% CDI</td><td>11,72% a.a.</td><td>15%</td><td>9,96% a.a.</td></tr><tr><td>LCI 90% CDI</td><td>9,59% a.a.</td><td>Isento</td><td>9,59% a.a.</td></tr><tr><td>LCI 95% CDI</td><td>10,12% a.a.</td><td>Isento</td><td>10,12% a.a.</td></tr></tbody></table><p><em>Cálculos com CDI de 10,65% a.a. (Bacen/SGS, março de 2026) e IR de 15% (prazo acima de 720 dias). Para prazos menores, a alíquota de IR é maior e a LCI se torna ainda mais competitiva.</em></p><p>Neste exemplo, uma LCI a 90% do CDI rende mais no líquido do que um CDB a 100% do CDI no mesmo prazo. Mas perde para um CDB a 110% do CDI. A comparação depende das taxas disponíveis no mercado no momento da aplicação.</p><p>Para <a href='/cdb-ou-lci'>ver a comparação completa entre CDB e LCI</a>, acesse o comparativo detalhado.</p><h2>Liquidez da LCI: quando posso resgatar?</h2><p>A LCI tem carência mínima de 90 dias por regulamentação. Após esse prazo, a liquidez depende do produto:</p><ul><li><strong>Liquidez no vencimento:</strong> o mais comum. Você só resgata na data final.</li><li><strong>Liquidez após carência:</strong> algumas LCIs permitem resgate após o período mínimo, com liquidez diária ou em datas específicas.</li></ul><p>Sempre verifique a data de vencimento e as condições de resgate antes de aplicar. Dinheiro que você pode precisar antes do prazo não deve ficar em LCI.</p><h2>Como investir em LCI</h2><p><strong>Passo 1:</strong> abra conta em corretora ou banco digital habilitado.</p><p><strong>Passo 2:</strong> acesse a área de renda fixa e filtre por LCI.</p><p><strong>Passo 3:</strong> compare as opções disponíveis pelo rendimento líquido — não pela taxa bruta.</p><p><strong>Passo 4:</strong> verifique prazo, carência, emissor e cobertura do FGC.</p><p><strong>Passo 5:</strong> confirme a aplicação e acompanhe pelo extrato.</p><p>O valor mínimo varia por instituição — geralmente a partir de R$ 1.000, mas algumas plataformas digitais oferecem valores menores.</p><h2>LCI vale a pena? Comparação rápida</h2><table><thead><tr><th>Produto</th><th>Taxa bruta (mar/2026)</th><th>IR</th><th>FGC</th><th>Liquidez mínima</th></tr></thead><tbody><tr><td>Poupança</td><td>~6,17% a.a. + TR</td><td>Isento</td><td>Sim</td><td>Diária</td></tr><tr><td>CDB 100% CDI</td><td>~10,65% a.a.</td><td>15% a 22,5%</td><td>Sim</td><td>Varia</td></tr><tr><td>LCI 90% CDI</td><td>~9,59% a.a.</td><td>Isento (PF)</td><td>Sim</td><td>90 dias</td></tr><tr><td>LCI 95% CDI</td><td>~10,12% a.a.</td><td>Isento (PF)</td><td>Sim</td><td>90 dias</td></tr><tr><td>Tesouro Selic</td><td>~10,65% a.a.</td><td>15% a 22,5%</td><td>Gov. Federal</td><td>Diária</td></tr></tbody></table><p><em>Rendimentos com base no CDI de 10,65% a.a. (Bacen/SGS, março de 2026). Sempre compare rendimento líquido.</em></p>",
    conclusion: "<h2>Conclusão</h2><p>LCI é uma excelente opção de renda fixa para quem tem um objetivo com prazo definido e pode abrir mão da liquidez imediata. A isenção de IR é uma vantagem real — mas só faz sentido quando a taxa oferecida é competitiva o suficiente para superar o rendimento líquido de outras opções.</p><p>A regra de ouro: sempre compare rendimento líquido, não taxa bruta. Uma LCI a 88% do CDI pode render menos que um CDB a 105% do CDI no mesmo prazo.</p><p>Quer entender melhor essa comparação? <a href='/cdb-ou-lci'>Veja o comparativo completo entre CDB e LCI.</a></p>",
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
        question: "Qual a diferença entre LCI e CDB?",
        answer: "A principal diferença é o IR: LCI é isenta para pessoa física, CDB tem IR de 15% a 22,5%. LCI também tem carência mínima de 90 dias — não permite resgate imediato. Para saber qual rende mais, compare sempre o rendimento líquido."
      },
      {
        question: "LCI tem carência? Quando posso resgatar?",
        answer: "Sim. Por regulamentação do Banco Central, a LCI tem prazo mínimo de 90 dias. A maioria das LCIs disponíveis tem liquidez apenas no vencimento. Verifique as condições antes de aplicar."
      },
      {
        question: "LCI rende mais que CDB?",
        answer: "Depende das taxas. Uma LCI a 90% do CDI pode render mais no líquido que um CDB a 100% do CDI, por conta da isenção de IR. Mas um CDB a 110% do CDI pode superar uma LCI a 90% do CDI. Compare sempre pelo rendimento líquido."
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
    disclaimer: "Este conteúdo é educativo e não constitui recomendação de investimento. Rentabilidades são referências e variam conforme o produto e o emissor. Consulte um profissional certificado para orientação personalizada.",
    },
    {
    slug: 'o-que-e-tesouro-direto',
    title: 'O que é Tesouro Direto? Como funciona e como investir',
    description: 'Tesouro Direto é o programa do governo federal para venda de títulos públicos a pessoas físicas. Entenda como funciona, quais os tipos e como começar a investir.',
    seoTitle: 'O que é Tesouro Direto? Como funciona e como investir',
    seoDescription: 'Tesouro Direto é o investimento garantido pelo governo federal. Veja como funciona, quais os tipos de título, custos, IR e se vale mais que CDB e poupança.',
    date: '2026-03-20',
    imageId: 'blog-o-que-e-tesouro-direto',
    content: "<h1>O que é Tesouro Direto: como funciona, tipos de título e como investir</h1><div class='resumo-rapido'><ul><li>Tesouro Direto é um programa do governo federal para venda de títulos públicos a pessoas físicas</li><li>É considerado o investimento de menor risco do Brasil — garantido pelo Governo Federal</li><li>Tem três tipos principais: Tesouro Selic, Tesouro Prefixado e Tesouro IPCA+</li><li>Tem Imposto de Renda com tabela regressiva (de 22,5% a 15%) e taxa de custódia da B3</li><li>Aplicações a partir de R$ 30 — uma das opções mais acessíveis do mercado</li></ul></div><p>Tesouro Direto é um dos investimentos mais seguros e acessíveis do Brasil — e ainda assim pouco compreendido por quem está começando. Muita gente conhece o nome mas não sabe exatamente o que está comprando nem como escolher entre os tipos disponíveis.</p><p>Este guia explica o que é, como funciona, quais os títulos disponíveis, quais os custos e como começar a investir.</p><h2>O que é Tesouro Direto</h2><p>Tesouro Direto é um programa criado em 2002 pelo Tesouro Nacional em parceria com a B3 para permitir que pessoas físicas comprem títulos públicos federais diretamente — sem precisar de fundos ou intermediários complexos.</p><p>Quando você investe no Tesouro Direto, você está emprestando dinheiro ao Governo Federal. Em troca, o governo paga juros sobre esse valor por um prazo determinado.</p><p>Por ser garantido pelo Governo Federal — que é o emissor da moeda e tem o menor risco de crédito do país — o Tesouro Direto é considerado o investimento de menor risco disponível para o investidor brasileiro.</p><h2>Como funciona o Tesouro Direto na prática</h2><h3>Você compra um título, o governo te paga juros</h3><p>Cada título do Tesouro Direto é uma promessa de pagamento do Governo Federal. Você compra hoje por um valor, e no vencimento — ou quando decidir vender — recebe o valor investido mais os juros acumulados.</p><p>Os títulos são custodiados pela B3 (a bolsa de valores brasileira), o que garante segurança e transparência na operação. Você pode acompanhar seu saldo pelo site do Tesouro Direto ou pela plataforma da sua corretora.</p><h3>Liquidez diária: como funciona</h3><p>O Tesouro Nacional garante a recompra de todos os títulos em qualquer dia útil — ou seja, você pode vender antes do vencimento a qualquer momento.</p><p>Mas atenção: vender antes do vencimento significa receber o preço de mercado do título naquele dia, que pode ser maior ou menor que o valor que você pagou. Isso se chama marcação a mercado.</p><p>Para o Tesouro Selic, essa variação é mínima. Para o Tesouro Prefixado e o Tesouro IPCA+, a variação pode ser maior — por isso esses títulos são mais indicados para quem pode carregar até o vencimento.</p><h2>Tipos de título do Tesouro Direto</h2><h3>Tesouro Selic</h3><p>Rende de acordo com a taxa Selic — a taxa básica de juros da economia brasileira, definida pelo Banco Central a cada 45 dias.</p><p>É o título mais indicado para reserva de emergência e objetivos de curto prazo, pois tem baixíssima volatilidade e liquidez diária sem risco de perda.</p><p><strong>Quando faz sentido:</strong> reserva de emergência, dinheiro que você pode precisar a qualquer momento, objetivos de curto prazo.</p><p><strong>Risco de mercado:</strong> praticamente zero. O preço do título sobe todo dia, acompanhando a Selic.</p><h3>Tesouro Prefixado</h3><p>A taxa é definida no momento da compra e não muda até o vencimento. Exemplo: Tesouro Prefixado a 13% ao ano. Você sabe exatamente quanto vai receber se carregar até o vencimento.</p><p><strong>Quando faz sentido:</strong> quando você acredita que a Selic vai cair. Se os juros caírem depois da sua compra, seu título prefixado passa a valer mais no mercado.</p><p><strong>Risco:</strong> se os juros subirem, o preço do seu título cai no mercado (marcação a mercado). Quem vender antes do vencimento pode ter prejuízo. Quem carregar até o fim recebe exatamente o combinado.</p><h3>Tesouro IPCA+</h3><p>Rende a inflação (IPCA) mais uma taxa fixa. Exemplo: Tesouro IPCA+ 6% ao ano — você recebe a inflação do período mais 6% ao ano, garantindo crescimento real do patrimônio.</p><p><strong>Quando faz sentido:</strong> objetivos de longo prazo — aposentadoria, patrimônio de 10, 15, 20 anos. Protege o poder de compra independente da inflação futura.</p><p><strong>Risco:</strong> assim como o prefixado, tem marcação a mercado. Vender antes do vencimento pode resultar em valor diferente do esperado.</p><table><thead><tr><th>Título</th><th>Como rende</th><th>Liquidez</th><th>Melhor para</th><th>Risco de mercado</th></tr></thead><tbody><tr><td>Tesouro Selic</td><td>Taxa Selic diária</td><td>Diária sem perda</td><td>Reserva de emergência e curto prazo</td><td>Mínimo</td></tr><tr><td>Tesouro Prefixado</td><td>Taxa fixa definida na compra</td><td>Diária com marcação</td><td>Médio prazo com cenário de queda de juros</td><td>Médio</td></tr><tr><td>Tesouro IPCA+</td><td>IPCA + taxa fixa</td><td>Diária com marcação</td><td>Longo prazo e aposentadoria</td><td>Médio</td></tr></tbody></table><h2>Custos do Tesouro Direto</h2><p>O Tesouro Direto tem dois custos principais que você precisa conhecer antes de investir:</p><h3>Taxa de custódia da B3</h3><p>A B3 cobra uma taxa anual de 0,20% ao ano sobre o valor investido para custodiar os títulos. Essa taxa é cobrada semestralmente (em janeiro e julho) ou no resgate, o que ocorrer primeiro.</p><p>Existe isenção desta taxa para investidores com até R$ 10.000 investidos no Tesouro Selic. Acima disso, a taxa de 0,20% ao ano se aplica ao valor total.</p><p>Fonte: Tesouro Direto (tesourodireto.com.br), março de 2026.</p><h3>Taxa da corretora</h3><p>A maioria das corretoras e bancos digitais cobra taxa zero para operar no Tesouro Direto. Verifique as condições da sua instituição antes de investir.</p><h2>Imposto de Renda no Tesouro Direto</h2><p>Assim como o CDB, o Tesouro Direto tem IR sobre o rendimento (não sobre o principal), seguindo a tabela regressiva da Receita Federal:</p><table><thead><tr><th>Prazo do investimento</th><th>Alíquota de IR</th></tr></thead><tbody><tr><td>Até 180 dias</td><td>22,5%</td></tr><tr><td>De 181 a 360 dias</td><td>20%</td></tr><tr><td>De 361 a 720 dias</td><td>17,5%</td></tr><tr><td>Acima de 720 dias</td><td>15%</td></tr></tbody></table><p>Fonte: Receita Federal do Brasil.</p><p>O IR é retido automaticamente na fonte no momento do resgate. Não há cobrança de IOF para aplicações mantidas por mais de 30 dias.</p><h2>Tesouro Direto tem garantia do FGC?</h2><p>Não — e não precisa. O Tesouro Direto não tem cobertura do FGC porque é garantido diretamente pelo Governo Federal, que é o emissor dos títulos e tem risco de crédito menor que qualquer banco privado.</p><p>Em termos práticos, o Tesouro Direto é considerado o investimento de menor risco do Brasil — acima inclusive dos CDBs de grandes bancos com FGC.</p><h2>Como começar a investir no Tesouro Direto</h2><p><strong>Passo 1 — Abra conta em uma corretora ou banco digital</strong><br>Escolha uma instituição habilitada pelo Tesouro Nacional. A maioria das corretoras digitais cobra taxa zero e tem processo de abertura 100% online.</p><p><strong>Passo 2 — Acesse a área de renda fixa ou Tesouro Direto</strong><br>Na plataforma da corretora, procure a seção de Tesouro Direto. Você vai ver todos os títulos disponíveis com seus rendimentos e vencimentos.</p><p><strong>Passo 3 — Escolha o título adequado ao seu objetivo</strong><br>Reserva de emergência → Tesouro Selic. Médio prazo → Tesouro Prefixado. Longo prazo → Tesouro IPCA+.</p><p><strong>Passo 4 — Defina o valor e confirme a compra</strong><br>O valor mínimo é de aproximadamente R$ 30 (equivalente a 1% do título de menor valor). Confirme a operação e o título aparece na sua carteira.</p><p><strong>Passo 5 — Acompanhe pelo extrato</strong><br>Você pode acompanhar o saldo e o rendimento acumulado diretamente na plataforma da corretora ou no site oficial do Tesouro Direto (tesourodireto.com.br).</p><h2>Tesouro Direto vale a pena? Comparação rápida</h2><table><thead><tr><th>Produto</th><th>Rendimento bruto (mar/2026)</th><th>IR</th><th>Garantia</th><th>Liquidez</th></tr></thead><tbody><tr><td>Poupança</td><td>~6,17% a.a. + TR</td><td>Isento</td><td>FGC</td><td>Diária</td></tr><tr><td>Tesouro Selic</td><td>~10,65% a.a.</td><td>15% a 22,5%</td><td>Governo Federal</td><td>Diária</td></tr><tr><td>CDB 100% CDI</td><td>~10,65% a.a.</td><td>15% a 22,5%</td><td>FGC</td><td>Varia</td></tr><tr><td>LCI/LCA 90% CDI</td><td>~9,59% a.a.</td><td>Isento (PF)</td><td>FGC</td><td>Varia</td></tr></tbody></table><p><em>Rendimentos com base no CDI/Selic de 10,65% a.a. (Bacen/SGS, março de 2026). Sempre compare rendimento líquido.</em></p><p>O Tesouro Selic compete diretamente com CDBs de liquidez diária a 100% do CDI. A diferença prática é mínima — a escolha geralmente depende da corretora e das condições disponíveis. Para <a href='/tesouro-selic-ou-cdb'>entender melhor essa comparação, veja CDB vs Tesouro Selic</a>.</p>",
    conclusion: "<h2>Conclusão</h2><p>Tesouro Direto é o ponto de partida mais seguro para qualquer investidor brasileiro. A combinação de garantia do Governo Federal, liquidez diária e acessibilidade (a partir de R$ 30) faz dele uma referência obrigatória na carteira de quem está começando.</p><p>O Tesouro Selic é o mais indicado para reserva de emergência e curto prazo. Para objetivos mais longos, o Tesouro IPCA+ oferece proteção real contra a inflação.</p><p>Quer <a href='/como-comecar-a-investir'>saber como começar a investir do zero?</a> Ou <a href='/quanto-rende-10000-no-tesouro-selic'>simule quanto rende R$ 10.000 no Tesouro Selic.</a></p>",
    faq: [
      {
        question: "O que é Tesouro Direto e como funciona?",
        answer: "Tesouro Direto é um programa do Governo Federal que permite a pessoas físicas comprar títulos públicos federais. Ao investir, você empresta dinheiro ao governo e recebe juros em troca. É considerado o investimento de menor risco do Brasil."
      },
      {
        question: "Tesouro Direto tem garantia do FGC?",
        answer: "Não — e não precisa. O Tesouro Direto é garantido pelo Governo Federal, que tem risco de crédito menor que qualquer banco privado. É considerado mais seguro que os investimentos cobertos pelo FGC."
      },
      {
        question: "Qual a diferença entre Tesouro Selic, Prefixado e IPCA+?",
        answer: "Tesouro Selic acompanha a taxa básica de juros — ideal para reserva de emergência. Tesouro Prefixado tem taxa fixa definida na compra — indicado para médio prazo. Tesouro IPCA+ rende inflação mais taxa fixa — ideal para longo prazo e aposentadoria."
      },
      {
        question: "Tesouro Direto tem Imposto de Renda?",
        answer: "Sim. O IR incide sobre o rendimento com alíquota regressiva: 22,5% para resgates em até 180 dias, chegando a 15% para resgates após 720 dias. O imposto é retido automaticamente na fonte."
      },
      {
        question: "Qual o valor mínimo para investir no Tesouro Direto?",
        answer: "A partir de aproximadamente R$ 30, equivalente a 1% do valor do título mais barato disponível. É um dos investimentos mais acessíveis do mercado."
      },
      {
        question: "Posso perder dinheiro no Tesouro Direto?",
        answer: "Se carregar o título até o vencimento, não. O governo garante o pagamento do valor combinado. Se vender antes do vencimento, pode receber mais ou menos dependendo do preço de mercado — isso se chama marcação a mercado. Para o Tesouro Selic esse risco é mínimo."
      },
      {
        question: "Tesouro Direto ou CDB: qual é melhor?",
        answer: "Depende do objetivo. O Tesouro Selic e um CDB de liquidez diária a 100% do CDI têm rendimentos muito próximos. A principal diferença é a garantia: Tesouro é garantido pelo Governo Federal, CDB pelo FGC até R$ 250.000. Para valores acima desse limite, o Tesouro pode ser mais seguro."
      }
    ],
    category: 'renda-fixa',
    subcategory: 'tesouro-direto',
    pillar: 'pillar-2-renda-fixa',
    cluster: 'tesouro-direto',
    tags: ["o que é Tesouro Direto", "Tesouro Direto", "renda fixa", "Tesouro Selic", "títulos públicos"],
    disclaimer: defaultDisclaimer,
  },
    {
    slug: 'o-que-e-cdb',
    title: 'O que é CDB? Como funciona e se vale a pena',
    description: 'CDB é um título de renda fixa emitido por bancos. Entenda como funciona, quais os tipos (pré, pós e IPCA+), como é o IR e se vale mais que a poupança.',
    seoTitle: 'O que é CDB? Como funciona e se vale a pena',
    seoDescription: 'CDB é um título emitido por bancos que paga juros ao investidor. Entenda como funciona, quais os tipos, como é o IR e se vale mais que a poupança.',
    date: '2026-03-20',
    imageId: 'blog-o-que-e-cdb',
    content: "<h1>O que é CDB: como funciona, tipos e o que avaliar antes de investir</h1><div class='resumo-rapido'><ul><li>CDB é um título emitido por bancos: você empresta dinheiro e recebe juros no resgate</li><li>Tem cobertura do FGC até R$ 250.000 por CPF por instituição</li><li>Rende mais que a poupança na maioria dos cenários</li><li>Tem Imposto de Renda com alíquota regressiva (de 22,5% a 15%)</li><li>Liquidez varia: alguns permitem resgate diário, outros só no vencimento</li></ul></div><p>CDB é um dos investimentos de renda fixa mais populares do Brasil — e também um dos mais mal compreendidos. Muita gente aplica sem entender exatamente o que está comprando ou como comparar duas opções diferentes.</p><p>Este guia explica o que é, como funciona, quais os tipos disponíveis e o que você precisa avaliar antes de investir.</p><h2>O que é CDB (definição direta)</h2><p>CDB significa Certificado de Depósito Bancário. É um título de renda fixa emitido por bancos e financeiras para captar dinheiro dos investidores.</p><p>Na prática: você empresta dinheiro ao banco por um período determinado, e o banco te paga juros por isso. No vencimento — ou na data de resgate, se o produto tiver liquidez diária — você recebe o valor investido mais os juros acumulados.</p><p>É regulamentado pelo Banco Central do Brasil e pela CVM, e tem cobertura do Fundo Garantidor de Créditos (FGC).</p><h2>Como funciona o CDB na prática</h2><h3>O banco capta, você empresta</h3><p>Bancos precisam de dinheiro para financiar suas operações — empréstimos, financiamentos, capital de giro. Uma das formas de captar esse dinheiro é emitindo CDBs para investidores.</p><p>Quando você compra um CDB, você está essencialmente emprestando dinheiro ao banco. Em troca, o banco se compromete a devolver esse valor acrescido de juros em uma data futura.</p><p>Quanto maior o risco do banco emissor (bancos menores ou menos conhecidos), maior tende a ser a taxa oferecida. Esse é o prêmio pelo risco de crédito.</p><h3>O que é CDI e por que aparece no CDB</h3><p>CDI significa Certificado de Depósito Interbancário. É a taxa de juros que os bancos usam entre si para empréstimos de curtíssimo prazo — e serve como referência para a remuneração de grande parte dos CDBs.</p><p>Quando um CDB oferece 100% do CDI, significa que ele vai render exatamente o equivalente à taxa CDI do período. Se o CDI está em 10,65% ao ano (referência de março de 2026, Bacen/SGS), um CDB a 100% do CDI rende 10,65% ao ano — antes de impostos.</p><p>CDBs acima de 100% do CDI (como 110% ou 120%) rendem mais, mas geralmente exigem prazo mais longo ou valor mínimo maior.</p><h2>Tipos de CDB: pré-fixado, pós-fixado e IPCA+</h2><h3>CDB pré-fixado</h3><p>A taxa é definida no momento da aplicação e não muda até o vencimento.</p><p>Exemplo: CDB pré-fixado a 12% ao ano. Se você investir R$ 10.000, sabe exatamente quanto vai receber no vencimento — independente do que acontecer com a Selic ou o CDI.</p><p><strong>Quando faz sentido:</strong> quando você acredita que os juros vão cair. Se a Selic cair depois que você aplicou, seu CDB pré-fixado passa a render relativamente mais que os novos produtos do mercado.</p><p><strong>Risco:</strong> se os juros subirem, você fica preso em uma taxa menor que a do mercado até o vencimento.</p><h3>CDB pós-fixado (% do CDI)</h3><p>A taxa acompanha o CDI durante todo o período. O rendimento final só é conhecido no resgate.</p><p>Exemplo: CDB a 110% do CDI. Se o CDI médio do período for 10,65% ao ano, o CDB vai render 11,72% ao ano bruto.</p><p><strong>Quando faz sentido:</strong> para reserva de emergência e objetivos de curto e médio prazo, especialmente em períodos de juros altos ou incertos. É o tipo mais comum no mercado.</p><h3>CDB IPCA+</h3><p>Rende a inflação (medida pelo IPCA) mais uma taxa fixa. Exemplo: IPCA + 6% ao ano.</p><p>Garante que seu dinheiro vai crescer acima da inflação, independente de qual for o índice no período.</p><p><strong>Quando faz sentido:</strong> para objetivos de longo prazo, como aposentadoria ou patrimônio de longo prazo. Protege o poder de compra ao longo do tempo.</p><p><strong>Atenção:</strong> a marcação a mercado pode fazer o valor do título oscilar antes do vencimento. Para quem vai carregar até o final, isso não é problema.</p><table><thead><tr><th>Tipo</th><th>Como rende</th><th>Previsibilidade</th><th>Melhor para</th></tr></thead><tbody><tr><td>Pré-fixado</td><td>Taxa fixa definida na aplicação</td><td>Alta — você sabe o valor final</td><td>Quem acredita na queda dos juros</td></tr><tr><td>Pós-fixado (% CDI)</td><td>Acompanha o CDI diariamente</td><td>Média — depende do CDI futuro</td><td>Reserva de emergência e curto prazo</td></tr><tr><td>IPCA+</td><td>Inflação + taxa fixa</td><td>Média — inflação varia</td><td>Preservação de poder de compra no longo prazo</td></tr></tbody></table><h2>CDB tem garantia? O que é o FGC</h2><p>Sim. O CDB tem cobertura do Fundo Garantidor de Créditos (FGC).</p><p>O FGC é uma entidade privada que garante o ressarcimento de investidores em caso de falência do banco emissor. Os limites de cobertura (referência: FGC, março de 2026):</p><ul><li><strong>Até R$ 250.000 por CPF por instituição financeira</strong></li><li><strong>Limite global de R$ 1.000.000 por CPF</strong>, renovável a cada 4 anos</li></ul><p>O que isso significa na prática: se o banco emissor do seu CDB falir, o FGC garante a devolução de até R$ 250.000 do valor investido (principal + juros) por instituição.</p><p><strong>Atenção:</strong> o Tesouro Direto não tem FGC — mas também não precisa, pois é garantido pelo Governo Federal, que tem risco de crédito ainda menor que qualquer banco.</p><h2>Imposto de Renda e IOF no CDB</h2><p>O CDB tem incidência de Imposto de Renda sobre o rendimento (não sobre o principal). A alíquota segue a tabela regressiva da Receita Federal:</p><table><thead><tr><th>Prazo do investimento</th><th>Alíquota de IR</th></tr></thead><tbody><tr><td>Até 180 dias</td><td>22,5%</td></tr><tr><td>De 181 a 360 dias</td><td>20%</td></tr><tr><td>De 361 a 720 dias</td><td>17,5%</td></tr><tr><td>Acima de 720 dias</td><td>15%</td></tr></tbody></table><p>Fonte: Receita Federal do Brasil.</p><p>O imposto é retido na fonte automaticamente no momento do resgate — você não precisa calcular nem pagar separadamente.</p><p><strong>IOF:</strong> incide sobre resgates realizados em menos de 30 dias da aplicação. A partir do 30º dia, o IOF é zero.</p><p><strong>Rendimento bruto vs. líquido:</strong> sempre compare o rendimento líquido (após IR) ao avaliar CDBs. Um CDB a 110% do CDI com prazo curto pode render menos que um a 100% do CDI com prazo acima de 720 dias, por conta da diferença de alíquota.</p><h2>Liquidez no CDB: quando posso resgatar?</h2><p>A liquidez varia por produto. Existem três situações principais:</p><p><strong>Liquidez diária (D+0 ou D+1):</strong> você pode resgatar a qualquer momento, e o dinheiro cai na conta no mesmo dia ou no dia útil seguinte. Ideal para reserva de emergência.</p><p><strong>Liquidez no vencimento:</strong> o resgate só acontece na data de vencimento do título. Resgatar antes pode ter penalidade ou não ser possível. Mais comum em CDBs com taxas mais altas.</p><p><strong>Carência + liquidez:</strong> alguns CDBs têm um período de carência seguido de liquidez diária. Verifique sempre as condições antes de aplicar.</p><p>Regra prática: dinheiro que você pode precisar antes do vencimento deve estar em CDB de liquidez diária — mesmo que a taxa seja um pouco menor.</p><h2>Como escolher um bom CDB: 5 pontos para avaliar</h2><p><strong>1. Taxa (% do CDI ou taxa fixa)</strong><br>Quanto maior, melhor — mas sempre compare rendimento líquido. Um CDB a 100% do CDI com prazo longo pode superar um a 110% de prazo curto por conta do IR.</p><p><strong>2. Liquidez</strong><br>Defina se você pode ou não abrir mão do dinheiro até o vencimento. Se não pode, escolha liquidez diária — mesmo com taxa um pouco menor.</p><p><strong>3. Prazo</strong><br>Combine o prazo do CDB com o seu objetivo. Dinheiro para daqui a 6 meses: CDB de curto prazo. Patrimônio de longo prazo: CDB com vencimento mais longo para pagar menos IR.</p><p><strong>4. Emissor</strong><br>Verifique se o banco emissor está regulamentado pelo Bacen. Bancos menores oferecem taxas maiores, mas o risco de crédito é maior — por isso o FGC existe. Dentro do limite de R$ 250.000, o risco é mitigado.</p><p><strong>5. Rendimento líquido</strong><br>Calcule sempre o rendimento após IR. É o único número que importa para comparação real.</p><h2>CDB vale a pena? Comparação rápida</h2><table><thead><tr><th>Produto</th><th>Rendimento bruto (mar/2026)</th><th>IR</th><th>FGC</th><th>Liquidez</th></tr></thead><tbody><tr><td>Poupança</td><td>~6,17% a.a. + TR</td><td>Isento</td><td>Sim</td><td>Diária</td></tr><tr><td>CDB 100% CDI</td><td>~10,65% a.a.</td><td>15% a 22,5%</td><td>Sim</td><td>Varia</td></tr><tr><td>CDB 110% CDI</td><td>~11,72% a.a.</td><td>15% a 22,5%</td><td>Sim</td><td>Varia</td></tr><tr><td>Tesouro Selic</td><td>~10,65% a.a.</td><td>15% a 22,5%</td><td>Não (gov. federal)</td><td>Diária</td></tr><tr><td>LCI/LCA 90% CDI</td><td>~9,59% a.a.</td><td>Isento (PF)</td><td>Sim</td><td>Varia</td></tr></tbody></table><p><em>Rendimentos brutos com base no CDI de 10,65% a.a. (Bacen/SGS, março de 2026). Taxas variam por produto e emissor. Sempre compare rendimento líquido.</em></p><p>Na maioria dos cenários, o CDB rende mais que a poupança — mesmo após o IR. A comparação com LCI/LCA depende da taxa oferecida e do prazo: a isenção de IR pode compensar uma taxa bruta menor. <a href='/cdb-ou-lci'>Compare CDB e LCI lado a lado</a> para entender quando cada um compensa.</p>",
    conclusion: "<h2>Conclusão</h2><p>CDB é um dos investimentos de renda fixa mais acessíveis e versáteis do mercado brasileiro. Ele combina segurança (FGC), variedade de prazos e tipos e rentabilidade acima da poupança na maioria dos cenários.</p><p>A chave para escolher bem é comparar sempre o rendimento líquido — depois do IR — e alinhar liquidez e prazo ao seu objetivo.</p>",
    faq: [
      {
        question: "O que é CDB e como funciona?",
        answer: "CDB (Certificado de Depósito Bancário) é um título de renda fixa emitido por bancos. Você empresta dinheiro ao banco por um período e recebe o valor de volta com juros no resgate. É regulamentado pelo Banco Central e tem cobertura do FGC até R$ 250.000 por CPF por instituição."
      },
      {
        question: "CDB tem garantia do FGC?",
        answer: "Sim. O FGC garante até R$ 250.000 por CPF por instituição financeira em caso de falência do banco emissor. O limite global é de R$ 1.000.000 por CPF, renovável a cada 4 anos."
      },
      {
        question: "Qual a diferença entre CDB e poupança?",
        answer: "O CDB rende mais que a poupança na maioria dos cenários. A poupança é isenta de IR, mas rende menos. O CDB tem IR com alíquota regressiva, mas a rentabilidade líquida costuma ser maior, especialmente em prazos acima de 720 dias."
      },
      {
        question: "O que significa CDB a 100% do CDI?",
        answer: "Significa que o CDB vai render exatamente o equivalente à taxa CDI do período. Se o CDI for 10,65% ao ano, um CDB a 100% do CDI rende 10,65% ao ano bruto."
      },
      {
        question: "CDB tem Imposto de Renda?",
        answer: "Sim. O IR incide sobre o rendimento com alíquota regressiva: 22,5% para resgates em até 180 dias, chegando a 15% para resgates após 720 dias. O imposto é retido automaticamente na fonte."
      },
      {
        question: "Posso perder dinheiro investindo em CDB?",
        answer: "Em condições normais, não. O único risco é a falência do banco emissor, e nesse caso o FGC cobre até R$ 250.000 por CPF por instituição."
      },
      {
        question: "Qual o valor mínimo para investir em CDB?",
        answer: "Varia por instituição. Em algumas corretoras digitais é possível investir a partir de R$ 1. Em bancos tradicionais o mínimo pode ser R$ 1.000 ou mais."
      }
    ],
    category: 'renda-fixa',
    subcategory: 'cdb',
    pillar: 'pillar-2-renda-fixa',
    cluster: 'cdb',
    tags: ["o que é CDB", "CDB", "renda fixa", "certificado de depósito bancário", "CDI", "FGC"],
    disclaimer: defaultDisclaimer,
  },
  {
    slug: 'como-comecar-a-investir',
    title: 'Como começar a investir do zero (mesmo sem experiência)',
    description: 'Aprenda a investir do zero com 7 passos práticos: da reserva de emergência à escolha dos primeiros produtos. Guia completo para iniciantes.',
    seoTitle: 'Como Começar a Investir do Zero: Guia Passo a Passo',
    seoDescription: 'Aprenda como começar a investir do zero em 7 passos práticos. Reserva de emergência, perfil de risco, renda fixa e como escolher seus primeiros investimentos.',
    date: '2026-03-20',
    imageId: 'blog-comecar-investir',
    content: `<h1>Como começar a investir do zero (mesmo sem experiência)</h1><div class='resumo-rapido'><ul><li>Comece organizando suas finanças e quitando dívidas caras.</li><li>Monte uma reserva de emergência antes de tudo (6 a 12 meses de despesas).</li><li>Abra conta em uma corretora para ter acesso a mais produtos.</li><li>Comece pela Renda Fixa: Tesouro Selic ou CDBs com liquidez diária.</li><li>Seja consistente: invista um pouco todo mês.</li></ul></div><div class="my-8 not-prose text-center"><a href="/simulador" class="inline-flex items-center justify-center rounded-md text-base font-medium h-11 px-8 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-transform hover:-translate-y-0.5">Simule quanto o seu dinheiro pode render</a></div><h2>Por que a maioria das pessoas trava antes de começar</h2><p>Dar o primeiro passo no mundo dos investimentos pode parecer um desafio gigante, mas é mais simples do que você imagina. O medo do desconhecido, a crença de que é preciso muito dinheiro ou a complexidade do mercado financeiro são barreiras comuns. Com um bom plano e as informações certas, você transforma o "bicho de sete cabeças" em um grande aliado para o seu futuro.</p><h2>Antes de investir: o que você precisa organizar</h2><h3>Monte sua reserva de emergência primeiro</h3><p>A reserva de emergência é o seu colchão de segurança financeiro. É um dinheiro guardado para imprevistos, como um problema de saúde ou a perda do emprego. O ideal é ter o equivalente a 6 a 12 meses do seu custo de vida mensal. E <a href="/blog/reserva-de-emergencia">onde colocar a reserva de emergência</a>? Em um lugar seguro e com liquidez diária, ou seja, que você possa resgatar a qualquer momento. Boas opções são o <strong>Tesouro Selic</strong> ou um <strong>CDB de liquidez diária</strong> que pague pelo menos 100% do CDI.</p><h3>Entenda seu perfil de investidor</h3><p>Você é conservador, moderado ou arrojado? Seu perfil de investidor define sua tolerância ao risco. Corretoras e plataformas de investimento oferecem questionários para te ajudar a descobrir. Não pule essa etapa! Investir em algo que não te deixa dormir à noite é a receita para o fracasso.</p><h3>Defina um objetivo claro</h3><p>Por que você está investindo? Comprar uma casa, fazer uma viagem, garantir a aposentadoria? Cada objetivo tem um prazo e um risco associado. Separe-os em curto (até 2 anos), médio (2 a 5 anos) e longo prazo (acima de 5 anos). Isso será crucial para escolher os investimentos certos.</p><h2>Os 7 passos para começar a investir</h2><h3>Passo 1 — Organize suas finanças antes de investir</h3><p>Antes de investir, você precisa saber para onde seu dinheiro está indo. Anote todas as suas receitas e despesas por um ou dois meses. Use um aplicativo, uma planilha ou um caderno. O objetivo é ter clareza e garantir que sobre dinheiro no final do mês para começar a investir. Se estiver no vermelho, o primeiro passo é cortar gastos e quitar dívidas caras, como as do cartão de crédito.</p><h3>Passo 2 — Monte sua reserva de emergência</h3><p>Repetindo, porque é fundamental: tenha de 6 a 12 meses de suas despesas em um investimento seguro e de resgate rápido. O Tesouro Selic e CDBs de liquidez diária são seus melhores amigos aqui. Esta é a fundação da sua casa financeira.</p><h3>Passo 3 — Descubra seu perfil de investidor</h3><p>Responda com sinceridade ao questionário da sua corretora. O resultado (conservador, moderado ou arrojado) guiará suas escolhas e evitará que você entre em investimentos que não se alinham com sua tolerância a riscos.</p><h3>Passo 4 — Escolha uma corretora</h3><p>Enquanto bancos tradicionais oferecem poucos produtos, as corretoras de valores (como XP, Rico, NuInvest) são como um shopping center de investimentos. Elas dão acesso a uma variedade imensa de produtos de diferentes instituições. A abertura de conta é gratuita, rápida e 100% online.</p><h3>Passo 5 — Comece pela renda fixa</h3><p>Para quem está começando, o caminho mais seguro é a Renda Fixa. Considere estas duas opções: <strong>Tesouro Selic</strong>, o investimento mais seguro do país, ideal para a reserva de emergência; e <strong>CDB de Liquidez Diária</strong>, que pague no mínimo 100% do CDI. Entenda <a href="/blog/o-que-e-cdb">o que é CDB e como funciona</a> e também <a href="/blog/o-que-e-tesouro-direto">como funciona o Tesouro Direto</a>.</p><h3>Passo 6 — Aumente o aporte com o tempo</h3><p>O segredo dos juros compostos é a consistência. Defina um valor mensal para investir, mesmo que seja pouco, e cumpra essa meta. Com o tempo, conforme sua renda aumenta ou seus gastos diminuem, aumente o valor do aporte.</p><h3>Passo 7 — Aprenda enquanto investe</h3><p>Começar pequeno te dá a tranquilidade para aprender. Acompanhe seus investimentos, leia notícias, entenda por que eles sobem ou descem. O conhecimento adquirido é um ativo tão valioso quanto o próprio dinheiro investido.</p><h2>Quanto dinheiro preciso para começar a investir?</h2><p>Mito: você precisa ser rico para investir. Realidade: <a href="/blog/investir-com-pouco-dinheiro">investir com pouco dinheiro é possível</a>. Hoje, com menos de R$ 100, você já pode comprar frações de títulos do Tesouro Direto ou em CDBs. O mais importante é criar o hábito.</p><h2>Renda fixa ou renda variável: por onde começar?</h2><p>Para 99% dos iniciantes, a resposta é: <strong>comece pela renda fixa</strong>. Ela é mais segura, mais previsível e serve como uma excelente escola. Depois que você tiver sua reserva de emergência e se sentir confortável com o processo, pode começar a estudar a renda variável. No nosso blog, você pode <a href="/blog/renda-fixa-ou-renda-variavel">entender a diferença entre renda fixa e variável</a> em detalhes.</p><h2>Os erros mais comuns de quem está começando</h2><p>Fique atento para não cair nessas armadilhas: não ter reserva de emergência, investir sem objetivo, seguir "dicas quentes" de amigos, não diversificar e vender na primeira queda. Conheça os <a href="/blog/principais-erros-de-quem-comeca-a-investir">principais erros de quem começa a investir</a> para evitá-los.</p>`,
    conclusion: `<h2>Conclusão</h2><p>Começar a investir é um processo de aprendizado contínuo. Não tenha medo de errar e não se compare com os outros. Estude os <a href="/blog/melhores-investimentos-para-iniciantes">melhores investimentos para iniciantes</a> e, acima de tudo, seja consistente. Seu "eu" do futuro agradecerá.</p><div class="my-8 not-prose text-center"><a href="/blog/melhores-investimentos-para-iniciantes" class="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm transition-transform hover:-translate-y-0.5">Veja os melhores investimentos para iniciantes</a></div>`,
    faq: [
      {
        question: "Quanto preciso ter para começar a investir?",
        answer: "Você pode começar com menos de R$ 100. O Tesouro Selic aceita aplicações a partir de R$ 30 e alguns CDBs aceitam a partir de R$ 1 em corretoras digitais. O mais importante é começar com consistência, não com um valor alto."
      },
      {
        question: "Qual é o investimento mais seguro para iniciantes?",
        answer: "O Tesouro Selic é considerado o investimento de menor risco no Brasil, pois é garantido pelo Governo Federal. CDBs de bancos grandes cobertos pelo FGC (até R$ 250.000 por CPF por instituição) também têm alto nível de segurança."
      },
      {
        question: "Preciso abrir conta em corretora ou posso investir pelo banco?",
        answer: "Você pode investir pelo banco, mas corretoras independentes costumam oferecer mais variedade de produtos e melhores condições. Abrir conta em corretora é gratuito e rápido — geralmente 100% digital."
      },
       {
        question: "Renda fixa ou poupança: o que rende mais?",
        answer: "Na maioria dos cenários, a renda fixa rende mais que a poupança. Quando a Selic está acima de 8,5% ao ano, a poupança rende 6,17% ao ano mais TR — bem abaixo do Tesouro Selic ou de um CDB de 100% do CDI."
      },
      {
        question: "Quanto tempo leva para ver resultado nos investimentos?",
        answer: "Em poucos meses você já vê o rendimento aparecer no extrato. Para construir patrimônio relevante, o horizonte ideal é de anos — os juros compostos funcionam melhor no longo prazo."
      },
       {
        question: "Preciso declarar investimentos no Imposto de Renda?",
        answer: "Sim. Se você investir em CDB, Tesouro Direto, ações ou outros produtos, precisa declarar no IR anual — mesmo que não haja imposto a pagar. LCI e LCA são isentos de IR mas ainda precisam ser declarados."
      },
      {
        question: "Como investir sendo autônomo ou MEI?",
        answer: "Da mesma forma que uma pessoa física assalariada — com CPF e conta em corretora. O cuidado extra é manter uma reserva de emergência maior (6 a 12 meses de despesas), já que a renda pode ser mais variável."
      }
    ],
      category: "investimentos",
      subcategory: "para-iniciantes",
      pillar: "pillar-1-investimentos",
      cluster: "comecar-a-investir",
      tags: ["como começar a investir", "iniciantes", "renda fixa", "reserva de emergência", "tesouro direto", "CDB"],
      disclaimer: defaultDisclaimer,
  },
  {
    slug: 'cdb-liquidez-diaria-vale-a-pena',
    title: 'CDB com liquidez diária vale a pena?',
    description: 'Entenda se CDB com liquidez diária vale a pena para iniciantes.',
    date: '2026-03-19',
    imageId: 'blog-cdb-liquidez',
    content: `<p>O CDB com liquidez diária é ideal para quem quer flexibilidade.</p><h2>Vantagens</h2><ul><li>Resgate a qualquer momento</li></ul><h2>Veja também</h2><p><a href="/blog/tesouro-selic-ou-cdb">Tesouro Selic ou CDB</a></p>`,
    conclusion: '',
    disclaimer: defaultDisclaimer,
  },
  {
    slug: 'melhor-cdb-hoje',
    title: 'Melhor CDB hoje: como escolher o ideal para investir',
    description: 'Veja como escolher o melhor CDB hoje e aumentar seus rendimentos.',
    date: '2026-03-19',
    imageId: 'blog-melhor-cdb',
    content: `<p>Se você quer investir, pode se perguntar: <strong>qual é o melhor CDB hoje?</strong></p><h2>O que analisar</h2><ul><li>Percentual do CDI</li><li>Liquidez</li></ul><h2>Dica</h2><p>Prefira acima de 100% CDI.</p><h2>Veja também</h2><p><a href="/blog/cdb-ou-poupanca">CDB ou poupança</a></p>`,
    conclusion: '',
    disclaimer: defaultDisclaimer,
  },
  {
    slug: 'quanto-rende-10000-no-tesouro-selic',
    title: 'Quanto rende R$ 10.000 no Tesouro Selic? Simulação atualizada',
    description: 'Veja quanto rende R$ 10.000 no Tesouro Selic em 1, 6, 12 e 24 meses. Simulação com rendimento bruto e líquido, comparação com poupança e CDB.',
    date: '2026-03-20',
    imageId: 'blog-tesouro-10000',
    content: `<h1>Quanto rende R$ 10.000 no Tesouro Selic? Simulação com rendimento líquido</h1><div class='resumo-rapido'><ul><li>Com Selic a 13,75% a.a. (março de 2026), R$ 10.000 rendem aproximadamente R$ 112 líquidos em 1 mês</li><li>Em 12 meses, o rendimento líquido é de aproximadamente R$ 1.093</li><li>O Tesouro Selic rende mais que a poupança em todos os cenários com Selic acima de 8,5% a.a.</li><li>A simulação abaixo considera IR, taxa de custódia da B3 e CDI como referência</li><li>Taxas variam — use este conteúdo como referência, não como promessa de retorno</li></ul></div><p>Antes de investir, é natural querer saber exatamente quanto o dinheiro vai render. Com o Tesouro Selic, o cálculo é mais simples do que parece — mas tem alguns detalhes importantes sobre IR e taxa de custódia que fazem diferença no resultado final.</p><p>Esta simulação mostra o rendimento de R$ 10.000 no Tesouro Selic em diferentes prazos, com os descontos reais aplicados.</p><h2>Premissas da simulação</h2><p>Para os cálculos abaixo, foram usadas as seguintes referências:</p><ul><li><strong>Taxa Selic:</strong> 13,75% ao ano (Bacen/SGS, março de 2026)</li><li><strong>CDI:</strong> 13,65% ao ano (próximo à Selic, como de costume)</li><li><strong>Taxa de custódia B3:</strong> 0,20% ao ano (isenta para até R$ 10.000 no Tesouro Selic — neste caso, sem cobrança)</li><li><strong>IR:</strong> tabela regressiva da Receita Federal (22,5% até 180 dias; 20% de 181 a 360 dias; 17,5% de 361 a 720 dias; 15% acima de 720 dias)</li><li><strong>IOF:</strong> zero (aplicações mantidas por mais de 30 dias)</li></ul><p><strong>Importante:</strong> estas simulações assumem taxa Selic constante ao longo do período, apenas para fins ilustrativos. Na prática, a Selic pode mudar a cada reunião do Copom (a cada 45 dias aproximadamente). O rendimento real pode ser diferente.</p><h2>Simulação: quanto rende R$ 10.000 no Tesouro Selic</h2><table><thead><tr><th>Prazo</th><th>Rendimento bruto</th><th>IR</th><th>Rendimento líquido</th><th>Saldo final líquido</th></tr></thead><tbody><tr><td>1 mês</td><td>R$ 107,90</td><td>22,5% = R$ 24,28</td><td>R$ 83,62</td><td>R$ 10.083,62</td></tr><tr><td>3 meses</td><td>R$ 328,50</td><td>22,5% = R$ 73,91</td><td>R$ 254,59</td><td>R$ 10.254,59</td></tr><tr><td>6 meses</td><td>R$ 668,20</td><td>22,5% = R$ 150,35</td><td>R$ 517,85</td><td>R$ 10.517,85</td></tr><tr><td>12 meses</td><td>R$ 1.375,00</td><td>20% = R$ 275,00</td><td>R$ 1.100,00</td><td>R$ 11.100,00</td></tr><tr><td>24 meses</td><td>R$ 2.932,50</td><td>17,5% = R$ 513,19</td><td>R$ 2.419,31</td><td>R$ 12.419,31</td></tr><tr><td>36 meses</td><td>R$ 4.706,25</td><td>15% = R$ 705,94</td><td>R$ 4.000,31</td><td>R$ 14.000,31</td></tr></tbody></table><p><em>Simulação com Selic de 13,75% a.a. (Bacen/SGS, março de 2026), taxa constante para fins ilustrativos. IR calculado sobre o rendimento bruto conforme tabela regressiva da Receita Federal. Taxa de custódia da B3 isenta para até R$ 10.000 no Tesouro Selic. Valores arredondados.</em></p><h2>Como o IR afeta o rendimento do Tesouro Selic</h2><p>O Imposto de Renda é o principal fator que reduz o rendimento líquido — especialmente em prazos curtos.</p><p>Nos primeiros 180 dias, a alíquota é de 22,5% sobre o rendimento. Isso significa que quase um quarto dos seus juros vai para o governo. Quanto mais tempo você mantém o investimento, menor a alíquota — chegando a 15% após 720 dias.</p><p>Por isso, para objetivos de longo prazo, o Tesouro Selic fica mais eficiente com o tempo — mas continua sendo o melhor produto para reserva de emergência mesmo no curto prazo, pela segurança e liquidez.</p><h2>Quanto rende a poupança no mesmo período?</h2><p>Com a Selic acima de 8,5% ao ano, a poupança rende 0,5% ao mês mais TR (Taxa Referencial). Na prática, isso equivale a aproximadamente 6,17% ao ano — sem IR.</p><table><thead><tr><th>Prazo</th><th>Tesouro Selic líquido</th><th>Poupança (est.)</th><th>Diferença</th></tr></thead><tbody><tr><td>6 meses</td><td>R$ 517,85</td><td>R$ 305,00</td><td>+R$ 212,85</td></tr><tr><td>12 meses</td><td>R$ 1.100,00</td><td>R$ 617,00</td><td>+R$ 483,00</td></tr><tr><td>24 meses</td><td>R$ 2.419,31</td><td>R$ 1.270,00</td><td>+R$ 1.149,31</td></tr><tr><td>36 meses</td><td>R$ 4.000,31</td><td>R$ 1.963,00</td><td>+R$ 2.037,31</td></tr></tbody></table><p><em>Poupança estimada com rendimento de 6,17% a.a., sem IR. Tesouro Selic com Selic de 13,75% a.a. após IR. Valores aproximados para fins comparativos.</em></p><p>Em todos os prazos, o Tesouro Selic supera a poupança com folga — mesmo após o desconto do IR. Em 36 meses, a diferença é de mais de R$ 2.000 para cada R$ 10.000 investidos.</p><h2>Tesouro Selic vs CDB de liquidez diária: qual rende mais?</h2><p>O Tesouro Selic e um CDB de liquidez diária a 100% do CDI têm rendimentos muito próximos — o CDI acompanha a Selic com uma pequena diferença.</p><table><thead><tr><th>Prazo</th><th>Tesouro Selic líquido</th><th>CDB 100% CDI líquido</th><th>CDB 110% CDI líquido</th></tr></thead><tbody><tr><td>6 meses</td><td>R$ 517,85</td><td>R$ 513,20</td><td>R$ 564,52</td></tr><tr><td>12 meses</td><td>R$ 1.100,00</td><td>R$ 1.092,00</td><td>R$ 1.201,20</td></tr><tr><td>24 meses</td><td>R$ 2.419,31</td><td>R$ 2.401,50</td><td>R$ 2.641,65</td></tr></tbody></table><p><em>CDB calculado com CDI de 13,65% a.a. após IR (tabela regressiva). Valores aproximados para fins comparativos.</em></p><p>A diferença entre Tesouro Selic e CDB 100% CDI é pequena em qualquer prazo. Para R$ 10.000, a diferença em 12 meses é de apenas R$ 8. A escolha entre os dois geralmente depende da corretora e das condições disponíveis.</p><p>Para CDB acima de 100% do CDI, o rendimento é maior — mas pode exigir prazo mínimo ou valor mínimo mais alto. <a href='/tesouro-selic-ou-cdb'>Veja a comparação completa entre Tesouro Selic e CDB.</a></p><h2>Vale a pena investir R$ 10.000 no Tesouro Selic?</h2><p>Depende do objetivo.</p><p><strong>Para reserva de emergência:</strong> sim, com segurança. O Tesouro Selic é o produto mais indicado para guardar dinheiro que você pode precisar a qualquer momento. Tem liquidez diária, risco mínimo e rendimento acima da poupança.</p><p><strong>Para objetivos de médio e longo prazo:</strong> o Tesouro Selic é uma boa base, mas outros produtos podem oferecer rendimento maior — como CDBs de prazo mais longo, LCI/LCA ou Tesouro IPCA+. Depende do seu perfil e do momento do mercado.</p><p><strong>Para quem está começando:</strong> o Tesouro Selic é ideal como primeiro investimento. Seguro, simples, acessível a partir de R$ 30 e com rendimento muito superior à poupança.</p><h2>Como investir R$ 10.000 no Tesouro Selic agora</h2><p><strong>Passo 1:</strong> abra conta em corretora ou banco digital habilitado pelo Tesouro Nacional.</p><p><strong>Passo 2:</strong> acesse a área de Tesouro Direto e selecione o Tesouro Selic disponível.</p><p><strong>Passo 3:</strong> informe o valor (R$ 10.000) e confirme a compra.</p><p><strong>Passo 4:</strong> o título aparece na sua carteira em até 1 dia útil.</p>`,
    conclusion: `<h2>Conclusão</h2><p>R$ 10.000 no Tesouro Selic rendem aproximadamente R$ 1.100 líquidos em 12 meses com a Selic a 13,75% ao ano — quase o dobro do que a poupança pagaria no mesmo período.</p><p>Para reserva de emergência e objetivos de curto prazo, o Tesouro Selic segue sendo a referência de segurança e liquidez no mercado brasileiro.</p><p>Quer entender melhor como funciona? <a href='/o-que-e-tesouro-direto'>Leia o guia completo sobre o Tesouro Direto.</a></p>`,
    seoTitle: "Quanto rende R$ 10.000 no Tesouro Selic? Simulação 2026",
    seoDescription: "Simule quanto rende R$ 10.000 no Tesouro Selic em 1, 6, 12 e 24 meses. Veja o rendimento líquido após IR, comparação com poupança e CDB atualizado.",
    faq: [
      {
        question: "Quanto rende R$ 10.000 no Tesouro Selic em 12 meses?",
        answer: "Com a Selic a 13,75% ao ano (março de 2026), R$ 10.000 no Tesouro Selic rendem aproximadamente R$ 1.100 líquidos em 12 meses, após o desconto do IR de 20%. O saldo final seria de cerca de R$ 11.100."
      },
      {
        question: "Quanto rende R$ 10.000 no Tesouro Selic por mês?",
        answer: "Com a Selic a 13,75% ao ano, R$ 10.000 rendem aproximadamente R$ 84 líquidos por mês (após IR de 22,5% nos primeiros 180 dias). O rendimento mensal aumenta conforme a alíquota de IR diminui com o tempo."
      },
      {
        question: "Tesouro Selic rende mais que a poupança?",
        answer: "Sim, em todos os cenários com Selic acima de 8,5% ao ano. Com a Selic atual, o Tesouro Selic rende aproximadamente o dobro da poupança no líquido — mesmo após o desconto do IR."
      },
      {
        question: "Tesouro Selic tem Imposto de Renda?",
        answer: "Sim. O IR incide sobre o rendimento com alíquota regressiva: 22,5% para resgates em até 180 dias, chegando a 15% para resgates após 720 dias. O imposto é retido automaticamente na fonte."
      },
      {
        question: "Tesouro Selic tem taxa de custódia?",
        answer: "Sim. A B3 cobra 0,20% ao ano sobre o valor investido. Porém, investimentos de até R$ 10.000 no Tesouro Selic são isentos dessa taxa. Acima de R$ 10.000, a taxa se aplica ao valor total."
      },
      {
        question: "Qual a diferença entre Tesouro Selic e CDB de liquidez diária?",
        answer: "O rendimento é muito próximo — a diferença em 12 meses para R$ 10.000 é de aproximadamente R$ 8. A principal diferença é a garantia: Tesouro é garantido pelo Governo Federal, CDB pelo FGC até R$ 250.000."
      },
      {
        question: "Posso perder dinheiro no Tesouro Selic?",
        answer: "Praticamente não. O Tesouro Selic tem variação de preço mínima — o título sobe todos os dias acompanhando a Selic. Mesmo em resgates antecipados, a chance de perda é extremamente baixa."
      }
    ],
    category: 'renda-fixa',
    subcategory: 'tesouro-direto',
    pillar: 'pillar-2-renda-fixa',
    cluster: 'tesouro-direto',
    tags: ["quanto rende Tesouro Selic", "simulação Tesouro Selic", "rendimento Tesouro Selic", "Tesouro Selic 10000", "renda fixa"],
    disclaimer: "Este conteúdo é educativo e não constitui recomendação de investimento. As simulações assumem taxa Selic constante para fins ilustrativos — o rendimento real pode variar. Consulte um profissional certificado para orientação personalizada.",
  },
  {
    slug: 'quanto-rende-5000-no-cdb',
    title: 'Quanto rende 5000 reais no CDB? Veja simulação atualizada',
    description: 'Veja quanto rende R$5000 no CDB com simulações reais e descubra quanto você pode ganhar.',
    date: '2026-03-19',
    imageId: 'blog-cdb-5000',
    content: `<p>Se você quer investir mais dinheiro, é natural se perguntar: <strong>quanto rende 5000 reais no CDB?</strong></p><p>A resposta depende da taxa, mas pode render muito mais que a poupança.</p><h2>Resumo rápido</h2><ul><li>CDB 100% CDI: cerca de R$550 a R$650 por ano</li><li>CDB 110% CDI: rendimento maior</li></ul><h2>Simulação prática</h2><p>Considerando CDI em torno de 10% ao ano:</p><ul><li>R$5000 → rendimento aproximado de R$550+</li></ul><h2>Comparação com outros valores</h2><p>Veja também: <a href="/blog/quanto-rende-1000-no-cdb">quanto rende 1000 no CDB</a></p><h2>CDB ou Tesouro Selic?</h2><p>Entenda a diferença aqui: <a href="/blog/tesouro-selic-ou-cdb">Tesouro Selic ou CDB</a></p><h2>Conclusão</h2><p>Quanto maior o valor investido, maior o ganho — e o CDB continua sendo uma ótima opção.</p>`,
    conclusion: '',
    disclaimer: defaultDisclaimer,
  },
  {
    slug: 'cdb-ou-poupanca',
    title: 'CDB ou poupança: qual rende mais e qual vale a pena?',
    description: 'Compare CDB e poupança e descubra qual rende mais, qual é mais seguro e qual vale a pena para iniciantes.',
    date: '2026-03-19',
    imageId: 'blog-cdb-poupanca',
    content: `<p>Se você está começando a investir, provavelmente já se perguntou: <strong>CDB ou poupança, qual rende mais?</strong></p><p>A resposta direta é simples: <strong>o CDB quase sempre rende mais que a poupança</strong>.</p><h2>Resumo rápido: CDB ou poupança</h2><ul><li><strong>Rentabilidade:</strong> CDB rende mais</li><li><strong>Segurança:</strong> ambos são seguros</li><li><strong>Liquidez:</strong> ambos podem ter liquidez diária</li><li><strong>Facilidade:</strong> poupança é mais simples</li></ul><h2>O que é poupança?</h2><p>A poupança é o investimento mais tradicional do Brasil. Ela é simples, automática e isenta de imposto de renda.</p><p>Mas tem um problema: <strong>rende pouco</strong>.</p><h2>O que é CDB?</h2><p>O CDB (Certificado de Depósito Bancário) é um investimento de renda fixa emitido por bancos. Ele costuma render mais que a poupança e também é considerado seguro.</p><h2>CDB ou poupança: qual rende mais?</h2><p>Na maioria dos casos, o CDB vence com facilidade.</p><ul><li>Poupança: cerca de 70% da Selic (quando Selic está baixa)</li><li>CDB: pode pagar 100%, 110% ou mais do CDI</li></ul><p>Ou seja: <strong>CDB pode render quase o dobro da poupança</strong> em alguns cenários.</p><h2>Exemplo prático</h2><p>Se você investir R$1000:</p><ul><li>Poupança: rendimento menor</li><li>CDB: rendimento maior</li></ul><p>Veja uma simulação detalhada aqui: <a href="/blog/quanto-rende-1000-no-cdb">quanto rende 1000 no CDB</a></p><h2>Segurança: CDB ou poupança</h2><p>Os dois são considerados seguros:</p><ul><li>Poupança: garantida pelo banco</li><li>CDB: garantido pelo FGC até R$250 mil</li></ul><p>Na prática, ambos têm baixo risco para iniciantes.</p><h2>Liquidez: qual é melhor?</h2><p>A poupança tem liquidez imediata. Já o CDB pode ter:</p><ul><li>Liquidez diária</li><li>Prazo definido</li></ul><p>Para iniciantes, o ideal é escolher CDB com liquidez diária.</p><h2>CDB, poupança ou Tesouro Selic?</h2><p>Além dessas opções, existe o Tesouro Selic, que também é muito usado por iniciantes.</p><p>Veja nosso comparativo completo aqui: <a href="/blog/tesouro-selic-ou-cdb">Tesouro Selic ou CDB: qual escolher</a></p><h2>Quando escolher cada um?</h2><ul><li><strong>Poupança:</strong> apenas pela simplicidade</li><li><strong>CDB:</strong> para quem quer mais rendimento</li></ul><h2>Erros comuns</h2><ul><li>Deixar dinheiro parado na poupança</li><li>Não comparar rendimentos</li><li>Achar que poupança é “mais segura”</li></ul>`,
    conclusion: `<h2>Conclusão</h2><p>Entre CDB ou poupança, o CDB é quase sempre a melhor escolha.</p><p>Ele oferece mais rentabilidade sem aumentar significativamente o risco.</p><p>Se você quer começar a investir de verdade, sair da poupança é um ótimo primeiro passo.</p><h2>Perguntas frequentes</h2><h3>Poupança ainda vale a pena?</h3><p>Hoje, na maioria dos casos, não. Existem opções melhores como o CDB.</p><h3>CDB tem risco?</h3><p>Sim, mas é baixo e protegido pelo FGC até R$250 mil.</p>`,
    disclaimer: defaultDisclaimer,
  },
  {
    slug: 'quanto-rende-1000-no-cdb',
    title: 'Quanto rende 1000 reais no CDB? Veja simulação atualizada',
    description: 'Descubra quanto rende R$1000 no CDB, com simulações reais e comparações com outros investimentos.',
    date: '2026-03-19',
    imageId: 'blog-cdb-rendimento',
    content: `<p>Se você está começando a investir, uma das dúvidas mais comuns é: <strong>quanto rende 1000 reais no CDB?</strong></p><p>A resposta depende da taxa do CDB, mas já adianto: pode render bem mais que a poupança.</p><h2>Resumo rápido: quanto rende 1000 no CDB</h2><ul><li><strong>CDB 100% CDI:</strong> cerca de R$110 a R$130 por ano</li><li><strong>CDB 110% CDI:</strong> pode render mais</li><li><strong>Liquidez diária:</strong> ideal para iniciantes</li></ul><h2>O que é CDB?</h2><p>O CDB (Certificado de Depósito Bancário) é um investimento de renda fixa emitido por bancos. Ao investir, você empresta dinheiro ao banco e recebe juros em troca.</p><h2>Quanto rende 1000 reais no CDB na prática?</h2><p>Vamos considerar um cenário comum:</p><ul><li>CDB com 100% do CDI</li><li>CDI em torno de 10% ao ano</li></ul><p>Nesse caso, R$1000 investidos podem render aproximadamente:</p><ul><li><strong>Após 1 ano:</strong> cerca de R$110 a R$130</li></ul><p>Isso já descontando impostos, dependendo do prazo.</p><h2>CDB rende mais que a poupança?</h2><p>Sim. A poupança rende menos que a maioria dos CDBs. Por isso, o CDB é uma opção mais interessante para quem quer começar a investir.</p><h2>Qual CDB escolher?</h2><ul><li><strong>Acima de 100% do CDI:</strong> melhor rentabilidade</li><li><strong>Liquidez diária:</strong> mais flexibilidade</li><li><strong>Bancos confiáveis:</strong> mais segurança</li></ul><h2>CDB ou Tesouro Selic: qual vale mais a pena?</h2><p>Se você está em dúvida entre esses dois investimentos, vale a pena entender as diferenças.</p><p>Veja nosso comparativo completo: <a href="/blog/tesouro-selic-ou-cdb">Tesouro Selic ou CDB: qual é melhor?</a></p><h2>Erros comuns ao investir em CDB</h2><ul><li>Escolher CDB com liquidez ruim</li><li>Não comparar taxas</li><li>Ignorar o prazo</li></ul>`,
    conclusion: `<h2>Conclusão</h2><p>Investir R$1000 em CDB já pode trazer bons resultados e é um excelente começo para quem quer sair da poupança.</p><p>O mais importante é escolher boas taxas e manter consistência nos investimentos.</p><h2>Perguntas frequentes</h2><h3>Vale a pena investir pouco em CDB?</h3><p>Sim. Mesmo com pouco dinheiro, já é possível começar e ter bons rendimentos.</p><h3>CDB tem risco?</h3><p>O risco é baixo e conta com garantia do FGC até R$250 mil por instituição.</p>`,
    disclaimer: defaultDisclaimer,
  },
  {
    slug: 'tesouro-selic-ou-cdb',
    title: 'Tesouro Selic ou CDB: qual é melhor para investir?',
    description: 'Compare Tesouro Selic e CDB e descubra qual rende mais, qual é mais seguro e qual vale mais a pena para iniciantes.',
    seoTitle: 'Tesouro Selic ou CDB: qual rende mais e qual escolher em 2026?',
    seoDescription: 'Descubra se Tesouro Selic ou CDB é melhor, qual rende mais e qual escolher para começar a investir com segurança.',
    date: '2026-03-19',
    imageId: 'blog-tesouro-cdb',
    content: `<p>Se você está começando a investir, provavelmente já se perguntou: <strong>Tesouro Selic ou CDB, qual é melhor para iniciantes?</strong></p><p>A resposta direta é: <strong>depende do seu objetivo</strong>. Mas para a maioria dos iniciantes, ambos são ótimas opções de renda fixa — e muito melhores que a poupança.</p><h2>Resumo rápido: Tesouro Selic ou CDB</h2><ul><li><strong>Segurança:</strong> Tesouro Selic é mais seguro</li><li><strong>Rentabilidade:</strong> CDB pode render mais</li><li><strong>Liquidez:</strong> ambos podem ter liquidez diária</li><li><strong>Indicado para iniciantes:</strong> os dois</li></ul><h2>O que é Tesouro Selic?</h2><p>O Tesouro Selic é um título público emitido pelo governo. Ele acompanha a taxa Selic, que é a taxa básica de juros da economia, hoje em <strong>{{selicRate}}% ao ano</strong>.</p><p>Na prática, ele é considerado o investimento <strong>mais seguro do Brasil</strong>, já que é garantido pelo próprio governo.</p><h2>O que é CDB?</h2><p>O CDB (Certificado de Depósito Bancário) é um investimento emitido por bancos. Quando você investe em um CDB, está basicamente emprestando dinheiro para o banco.</p><p>Em troca, o banco te paga juros — geralmente atrelados ao CDI.</p><h2>Tesouro Selic ou CDB: qual rende mais?</h2><p>Depende do CDB. Com a Selic em {{selicRate}}%, um CDB que pague <strong>110% do CDI</strong>, por exemplo, terá uma rentabilidade bruta superior.</p><ul><li>Tesouro Selic: rende aproximadamente <strong>{{selicRate}}% ao ano</strong>.</li><li>CDB (ex: 110% do CDI): pode render em torno de <strong>{{cdbExampleRate}}% ao ano</strong>.</li></ul><p>Ou seja: <strong>CDB pode render mais, mas nem sempre</strong>.</p><h2>Comparação completa</h2><ul><li><strong>Segurança:</strong> Tesouro Selic (governo) vs CDB (FGC até R$250 mil)</li><li><strong>Rentabilidade:</strong> CDB pode ganhar</li><li><strong>Liquidez:</strong> depende do produto</li><li><strong>Facilidade:</strong> ambos são simples</li></ul><h2>Qual escolher?</h2><p>Se você quer <strong>máxima segurança</strong>: Tesouro Selic</p><p>Se você quer <strong>mais rentabilidade</strong>: CDB (acima de 100% CDI)</p><p>Se você está começando: pode usar os dois</p><h2>Erros comuns</h2><ul><li>Escolher CDB com liquidez ruim</li><li>Não olhar o percentual do CDI</li><li>Achar que só um é “melhor”</li></ul>`,
    conclusion: `<h2>Conclusão</h2><p>Tanto Tesouro Selic quanto CDB são excelentes investimentos para iniciantes. A melhor escolha depende do seu objetivo: segurança ou rentabilidade.</p><p>Se estiver em dúvida, comece com os dois e vá ajustando conforme aprende mais sobre investimentos.</p><p>Quer entender melhor quanto você pode ganhar? Veja também nosso conteúdo sobre <a href="/blog/quanto-rende-1000-no-cdb">quanto rende 1000 no CDB</a>.</p><h2>Perguntas frequentes</h2><h3>CDB é mais seguro que Tesouro Selic?</h3><p>Não. O Tesouro Selic é garantido pelo governo, enquanto o CDB tem garantia do FGC até R$250 mil.</p><h3>Qual rende mais?</h3><p>CDB pode render mais, principalmente acima de 100% do CDI.</p>`,
    disclaimer: defaultDisclaimer,
  },
  {
    slug: 'navigating-market-trends-in-2024',
    title: 'Navegando pelas Tendências de Mercado em 2024',
    description: 'Uma análise das tendências de mercado atuais e o que elas significam para investidores iniciantes. Cobrimos os principais setores a serem observados e como interpretar os sinais do mercado.',
    date: '2024-07-15',
    imageId: 'blog-market-trends',
    content: `
      <p>O ano de 2024 apresentou um conjunto único de desafios e oportunidades para os investidores. Com a estabilização das taxas de inflação e o boom nos setores de tecnologia, é um momento crucial para entender o cenário. Para iniciantes, é essencial não se deixar levar pelo hype. Concentre-se nas tendências de longo prazo em vez das flutuações de curto prazo.</p>
      <h3 class="font-bold text-lg my-4">Principais Setores a Serem Observados</h3>
      <ul class="list-disc list-inside space-y-2 mb-4">
        <li><strong>Tecnologia:</strong> IA e aprendizado de máquina continuam a impulsionar a inovação e o crescimento. Empresas que investem pesadamente em P&D estão preparadas para o sucesso a longo prazo.</li>
        <li><strong>Energia Renovável:</strong> Com um impulso global em direção à sustentabilidade, as ações de energia renovável oferecem um potencial de crescimento significativo.</li>
        <li><strong>Saúde:</strong> O envelhecimento da população global e os avanços na tecnologia médica tornam a saúde um setor resiliente.</li>
      </ul>
      <p>Lembre-se, a diversificação é a chave. Não coloque todos os seus ovos na mesma cesta. Distribua seus investimentos por diferentes setores e classes de ativos para mitigar o risco.</p>
    `,
    conclusion: '',
    disclaimer: defaultDisclaimer,
  },
  {
    slug: 'a-beginners-guide-to-investing',
    title: 'Guia de Investimentos para Iniciantes',
    description: 'Novo no mundo dos investimentos? Este guia explica o básico, desde o entendimento de ações e títulos até a configuração de sua primeira conta de investimento.',
    date: '2024-07-10',
    imageId: 'blog-beginner-guide',
    content: `
      <p>Começar sua jornada de investimentos pode parecer assustador, mas é mais simples do que você pensa. O primeiro passo é definir suas metas financeiras. Você está economizando para a aposentadoria, uma entrada para uma casa ou outra coisa? Seus objetivos determinarão sua estratégia de investimento.</p>
      <h3 class="font-bold text-lg my-4">Conceitos Essenciais</h3>
      <ul class="list-disc list-inside space-y-2 mb-4">
        <li><strong>Ações:</strong> Uma parcela de propriedade em uma empresa. Elas oferecem alto potencial de crescimento, mas também vêm com maior risco.</li>
        <li><strong>Títulos:</strong> Um empréstimo feito a uma entidade (como um governo ou corporação). Geralmente são mais seguros que as ações, mas oferecem retornos mais baixos.</li>
        <li><strong>Fundos Mútuos e ETFs:</strong> Coleções de ações, títulos e outros ativos. São uma ótima maneira de diversificar seu portfólio facilmente.</li>
      </ul>
      <p>Antes de investir, certifique-se de ter um fundo de emergência cobrindo de 3 a 6 meses de despesas de subsistência. Quando estiver pronto, você pode abrir uma conta de investimento em uma corretora. Comece pequeno, seja consistente e deixe o poder dos juros compostos trabalhar para você.</p>
    `,
    conclusion: '',
    disclaimer: defaultDisclaimer,
  },
  {
    slug: 'how-ai-is-changing-investment-strategies',
    title: 'Como a IA Está Mudando as Estratégias de Investimento',
    description: 'Explore o papel da Inteligência Artificial nos investimentos modernos e como plataformas como a SafeStart Invest utilizam a IA para capacitar os usuários.',
    date: '2024-07-05',
    imageId: 'blog-ai-investing',
    content: `
      <p>A Inteligência Artificial (IA) não é mais um conceito futurista; é uma ferramenta poderosa que está transformando a indústria financeira. Para os investidores, a IA oferece capacidades sem precedentes de análise, personalização e gerenciamento de riscos.</p>
      <h3 class="font-bold text-lg my-4">O Papel da IA nos Investimentos</h3>
      <ul class="list-disc list-inside space-y-2 mb-4">
        <li><strong>Análise de Dados:</strong> A IA pode processar enormes quantidades de dados de mercado, notícias e sentimento de mídia social em tempo real para identificar tendências que analistas humanos poderiam perder.</li>
        <li><strong>Personalização:</strong> Algoritmos de IA podem analisar a situação financeira, metas e tolerância ao risco de um indivíduo para criar portfólios de investimento verdadeiramente personalizados, assim como fazemos na SafeStart Invest.</li>
        <li><strong>Gerenciamento de Riscos:</strong> Ao simular cenários de mercado e testar portfólios sob estresse, a IA ajuda a identificar riscos potenciais e a sugerir estratégias para mitigá-los.</li>
      </ul>
      <p>Na SafeStart Invest, aproveitamos o poder da IA para desmistificar o investimento para iniciantes. Nossa plataforma fornece insights baseados em dados e orientação personalizada, ajudando você a tomar decisões de investimento mais inteligentes e confiantes.</p>
    `,
    conclusion: '',
    disclaimer: defaultDisclaimer,
  },
];

export type EduTopic = {
  id: string;
  title: string;
  content: string;
  imageId: string;
}

export const educationalContent: EduTopic[] = [
    {
        id: 'what-are-stocks',
        title: 'O que são Ações?',
        imageId: 'learn-stocks',
        content: "Uma ação, também conhecida como equity, representa uma parte da propriedade de uma empresa. Quando você compra a ação de uma empresa, está comprando um pequeno pedaço dessa empresa. Se a empresa for bem, o valor da sua ação pode aumentar. Se for mal, o valor pode diminuir. Ações são um investimento popular para quem busca crescimento a longo prazo."
    },
    {
        id: 'understanding-bonds',
        title: 'Entendendo os Títulos',
        imageId: 'learn-bonds',
        content: "Um título é essencialmente um empréstimo de um investidor para um tomador. O tomador pode ser uma corporação ou um governo. O investidor recebe pagamentos de juros periódicos (chamados cupons) durante a vida do título, e o valor principal é devolvido no vencimento. Títulos são geralmente considerados um investimento mais seguro do que ações."
    },
    {
        id: 'diversification-101',
        title: 'Diversificação 101',
        imageId: 'learn-diversification',
        content: "Diversificação é a prática de distribuir seus investimentos por vários ativos para reduzir o risco. A ideia é que, se um investimento tiver um desempenho ruim, outros podem ter um bom desempenho, equilibrando seu portfólio geral. Uma frase comum que você ouvirá é 'Não coloque todos os seus ovos na mesma cesta'. Um portfólio bem diversificado pode incluir uma mistura de ações, títulos e outras classes de ativos."
    }
];

    
