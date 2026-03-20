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
};

export const blogArticles: Article[] = [
  {
    slug: 'navigating-market-trends-in-2024',
    title: 'Navegando pelas Tendências de Mercado em 2024',
    description: 'Uma análise das tendências de mercado atuais e o que elas significam para investidores iniciantes. Cobrimos os principais setores a serem observados e como interpretar os sinais do mercado.',
    date: '15 de Julho de 2024',
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
  },
  {
    slug: 'a-beginners-guide-to-investing',
    title: 'Guia de Investimentos para Iniciantes',
    description: 'Novo no mundo dos investimentos? Este guia explica o básico, desde o entendimento de ações e títulos até a configuração de sua primeira conta de investimento.',
    date: '10 de Julho de 2024',
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
  },
  {
    slug: 'how-ai-is-changing-investment-strategies',
    title: 'Como a IA Está Mudando as Estratégias de Investimento',
    description: 'Explore o papel da Inteligência Artificial nos investimentos modernos e como plataformas como a SafeStart Invest utilizam a IA para capacitar os usuários.',
    date: '5 de Julho de 2024',
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
  },
  {
    slug: 'tesouro-selic-ou-cdb',
    title: 'Tesouro Selic ou CDB: qual é melhor para investir?',
    description: 'Compare Tesouro Selic e CDB e descubra qual rende mais, qual é mais seguro e qual vale mais a pena para iniciantes.',
    date: '19 de Março de 2026',
    imageId: 'blog-tesouro-cdb',
    content: `<p>Se você está começando a investir, provavelmente já se perguntou: <strong>Tesouro Selic ou CDB, qual é melhor para iniciantes?</strong></p><p>A resposta direta é: <strong>depende do seu objetivo</strong>. Mas para a maioria dos iniciantes, ambos são ótimas opções de renda fixa — e muito melhores que a poupança.</p><h2>Resumo rápido: Tesouro Selic ou CDB</h2><ul><li><strong>Segurança:</strong> Tesouro Selic é mais seguro</li><li><strong>Rentabilidade:</strong> CDB pode render mais</li><li><strong>Liquidez:</strong> ambos podem ter liquidez diária</li><li><strong>Indicado para iniciantes:</strong> os dois</li></ul><h2>Comparação direta: Tesouro Selic vs CDB</h2><ul><li><strong>Mais seguro:</strong> Tesouro Selic (governo)</li><li><strong>Maior rentabilidade:</strong> CDB (acima de 100% CDI)</li><li><strong>Liquidez diária:</strong> ambos podem ter</li><li><strong>Melhor para iniciantes:</strong> ambos são indicados</li></ul><h2>O que é Tesouro Selic?</h2><p>O Tesouro Selic é um título público emitido pelo governo. Ele acompanha a taxa Selic, que é a taxa básica de juros da economia, hoje em <strong>{{selicRate}}% ao ano</strong>.</p><p>Na prática, ele é considerado o investimento <strong>mais seguro do Brasil</strong>, já que é garantido pelo próprio governo.</p><h2>O que é CDB?</h2><p>O CDB (Certificado de Depósito Bancário) é um investimento emitido por bancos. Quando você investe em um CDB, está basicamente emprestando dinheiro para o banco.</p><p>Em troca, o banco te paga juros — geralmente atrelados ao CDI.</p><h2>Tesouro Selic ou CDB: qual rende mais?</h2><p>Depende do CDB. Com a Selic em {{selicRate}}%, um CDB que pague <strong>110% do CDI</strong>, por exemplo, terá uma rentabilidade bruta superior.</p><ul><li>Tesouro Selic: rende aproximadamente <strong>{{selicRate}}% ao ano</strong>.</li><li>CDB (ex: 110% do CDI): pode render em torno de <strong>{{cdbExampleRate}}% ao ano</strong>.</li></ul><p>Ou seja: <strong>CDB pode render mais, mas nem sempre</strong>.</p><h2>Comparação completa</h2><ul><li><strong>Segurança:</strong> Tesouro Selic (governo) vs CDB (FGC até R$250 mil)</li><li><strong>Rentabilidade:</strong> CDB pode ganhar</li><li><strong>Liquidez:</strong> depende do produto</li><li><strong>Facilidade:</strong> ambos são simples</li></ul><h2>Qual escolher?</h2><p>Se você quer <strong>máxima segurança</strong>: Tesouro Selic, rendendo hoje <strong>{{selicRate}}% a.a.</strong></p><p>Se você quer <strong>mais rentabilidade</strong>: um bom CDB (acima de 100% do CDI).</p><p>Se você está começando: pode usar os dois</p><h2>Erros comuns</h2><ul><li>Escolher CDB com liquidez ruim</li><li>Não olhar o percentual do CDI</li><li>Achar que só um é “melhor”</li></ul><h2>Conclusão</h2><p>Tanto Tesouro Selic quanto CDB são excelentes investimentos para iniciantes. A melhor escolha depende do seu objetivo: segurança ou rentabilidade.</p><p>Se estiver em dúvida, comece com os dois e vá ajustando conforme aprende mais sobre investimentos.</p><p>Quer entender melhor quanto você pode ganhar? Veja também nosso conteúdo sobre <a href=\"/blog/quanto-rende-1000-no-cdb\">quanto rende 1000 no CDB</a>.</p><h2>Perguntas frequentes</h2><h3>CDB é mais seguro que Tesouro Selic?</h3><p>Não. O Tesouro Selic é garantido pelo governo, enquanto o CDB tem garantia do FGC até R$250 mil.</p><h3>Qual rende mais?</h3><p>CDB pode render mais, principalmente acima de 100% do CDI.</p>`,
  },
  {
    slug: 'quanto-rende-1000-no-cdb',
    title: 'Quanto rende 1000 reais no CDB? Veja simulação atualizada',
    description: 'Descubra quanto rende R$1000 no CDB, com simulações reais e comparações com outros investimentos.',
    date: '19 de Março de 2026',
    imageId: 'blog-cdb-rendimento',
    content: `<p>Se você está começando a investir, uma das dúvidas mais comuns é: <strong>quanto rende 1000 reais no CDB?</strong></p><p>A resposta depende da taxa do CDB, mas já adianto: pode render bem mais que a poupança.</p><h2>Resumo rápido: quanto rende 1000 no CDB</h2><ul><li><strong>CDB 100% CDI:</strong> cerca de R$110 a R$130 por ano</li><li><strong>CDB 110% CDI:</strong> pode render mais</li><li><strong>Liquidez diária:</strong> ideal para iniciantes</li></ul><h2>O que é CDB?</h2><p>O CDB (Certificado de Depósito Bancário) é um investimento de renda fixa emitido por bancos. Ao investir, você empresta dinheiro ao banco e recebe juros em troca.</p><h2>Quanto rende 1000 reais no CDB na prática?</h2><p>Vamos considerar um cenário comum:</p><ul><li>CDB com 100% do CDI</li><li>CDI em torno de 10% ao ano</li></ul><p>Nesse caso, R$1000 investidos podem render aproximadamente:</p><ul><li><strong>Após 1 ano:</strong> cerca de R$110 a R$130</li></ul><p>Isso já descontando impostos, dependendo do prazo.</p><h2>CDB rende mais que a poupança?</h2><p>Sim. A poupança rende menos que a maioria dos CDBs. Por isso, o CDB é uma opção mais interessante para quem quer começar a investir.</p><h2>Qual CDB escolher?</h2><ul><li><strong>Acima de 100% do CDI:</strong> melhor rentabilidade</li><li><strong>Liquidez diária:</strong> mais flexibilidade</li><li><strong>Bancos confiáveis:</strong> mais segurança</li></ul><h2>CDB ou Tesouro Selic: qual vale mais a pena?</h2><p>Se você está em dúvida entre esses dois investimentos, vale a pena entender as diferenças.</p><p>Veja nosso comparativo completo: <a href="/blog/tesouro-selic-ou-cdb">Tesouro Selic ou CDB: qual é melhor?</a></p><h2>Erros comuns ao investir em CDB</h2><ul><li>Escolher CDB com liquidez ruim</li><li>Não comparar taxas</li><li>Ignorar o prazo</li></ul><h2>Conclusão</h2><p>Investir R$1000 em CDB já pode trazer bons resultados e é um excelente começo para quem quer sair da poupança.</p><p>O mais importante é escolher boas taxas e manter consistência nos investimentos.</p><h2>Perguntas frequentes</h2><h3>Vale a pena investir pouco em CDB?</h3><p>Sim. Mesmo com pouco dinheiro, já é possível começar e ter bons rendimentos.</p><h3>CDB tem risco?</h3><p>O risco é baixo e conta com garantia do FGC até R$250 mil por instituição.</p>`,
  },
  {
    slug: 'cdb-ou-poupanca',
    title: 'CDB ou poupança: qual rende mais e qual vale a pena?',
    description: 'Compare CDB e poupança e descubra qual rende mais, qual é mais seguro e qual vale a pena para iniciantes.',
    date: '19 de Março de 2026',
    imageId: 'blog-cdb-poupanca',
    content: `<p>Se você está começando a investir, provavelmente já se perguntou: <strong>CDB ou poupança, qual rende mais?</strong></p><p>A resposta direta é simples: <strong>o CDB quase sempre rende mais que a poupança</strong>.</p><h2>Resumo rápido: CDB ou poupança</h2><ul><li><strong>Rentabilidade:</strong> CDB rende mais</li><li><strong>Segurança:</strong> ambos são seguros</li><li><strong>Liquidez:</strong> ambos podem ter liquidez diária</li><li><strong>Facilidade:</strong> poupança é mais simples</li></ul><h2>O que é poupança?</h2><p>A poupança é o investimento mais tradicional do Brasil. Ela é simples, automática e isenta de imposto de renda.</p><p>Mas tem um problema: <strong>rende pouco</strong>.</p><h2>O que é CDB?</h2><p>O CDB (Certificado de Depósito Bancário) é um investimento de renda fixa emitido por bancos. Ele costuma render mais que a poupança e também é considerado seguro.</p><h2>CDB ou poupança: qual rende mais?</h2><p>Na maioria dos casos, o CDB vence com facilidade.</p><ul><li>Poupança: cerca de 70% da Selic (quando Selic está baixa)</li><li>CDB: pode pagar 100%, 110% ou mais do CDI</li></ul><p>Ou seja: <strong>CDB pode render quase o dobro da poupança</strong> em alguns cenários.</p><h2>Exemplo prático</h2><p>Se você investir R$1000:</p><ul><li>Poupança: rendimento menor</li><li>CDB: rendimento maior</li></ul><p>Veja uma simulação detalhada aqui: <a href=\"/blog/quanto-rende-1000-no-cdb\">quanto rende 1000 no CDB</a></p><h2>Segurança: CDB ou poupança</h2><p>Os dois são considerados seguros:</p><ul><li>Poupança: garantida pelo banco</li><li>CDB: garantido pelo FGC até R$250 mil</li></ul><p>Na prática, ambos têm baixo risco para iniciantes.</p><h2>Liquidez: qual é melhor?</h2><p>A poupança tem liquidez imediata. Já o CDB pode ter:</p><ul><li>Liquidez diária</li><li>Prazo definido</li></ul><p>Para iniciantes, o ideal é escolher CDB com liquidez diária.</p><h2>CDB, poupança ou Tesouro Selic?</h2><p>Além dessas opções, existe o Tesouro Selic, que também é muito usado por iniciantes.</p><p>Veja o comparativo completo aqui: <a href=\"/blog/tesouro-selic-ou-cdb\">Tesouro Selic ou CDB: qual escolher</a></p><h2>Erros comuns</h2><ul><li>Deixar dinheiro parado na poupança</li><li>Não comparar rendimentos</li><li>Achar que poupança é “mais segura”</li></ul><h2>Conclusão</h2><p>Entre CDB ou poupança, o CDB é quase sempre a melhor escolha.</p><p>Ele oferece mais rentabilidade sem aumentar significativamente o risco.</p><p>Se você quer começar a investir de verdade, sair da poupança é um ótimo primeiro passo.</p><h2>Perguntas frequentes</h2><h3>Poupança ainda vale a pena?</h3><p>Hoje, na maioria dos casos, não. Existem opções melhores como o CDB.</p><h3>CDB tem risco?</h3><p>Sim, mas é baixo e protegido pelo FGC até R$250 mil.</p>`,
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

    