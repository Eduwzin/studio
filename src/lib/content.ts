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
    content: `<p>Se você está começando a investir, provavelmente já se perguntou: <strong>Tesouro Selic ou CDB, qual é melhor?</strong></p><p>A resposta direta é: <strong>depende do seu objetivo</strong>. Mas para a maioria dos iniciantes, ambos são ótimas opções de renda fixa — e muito melhores que a poupança.</p><h2>Resumo rápido: Tesouro Selic ou CDB</h2><ul><li><strong>Segurança:</strong> Tesouro Selic é mais seguro</li><li><strong>Rentabilidade:</strong> CDB pode render mais</li><li><strong>Liquidez:</strong> ambos podem ter liquidez diária</li><li><strong>Indicado para iniciantes:</strong> os dois</li></ul><h2>O que é Tesouro Selic?</h2><p>O Tesouro Selic é um título público emitido pelo governo. Ele acompanha a taxa Selic, que é a taxa básica de juros da economia, hoje em <strong>{{selicRate}}% ao ano</strong>.</p><p>Na prática, ele é considerado o investimento <strong>mais seguro do Brasil</strong>, já que é garantido pelo próprio governo.</p><h2>O que é CDB?</h2><p>O CDB (Certificado de Depósito Bancário) é um investimento emitido por bancos. Quando você investe em um CDB, está basicamente emprestando dinheiro para o banco.</p><p>Em troca, o banco te paga juros — geralmente atrelados ao CDI, que por sua vez, acompanha de perto a Selic.</p><h2>Tesouro Selic ou CDB: qual rende mais?</h2><p>Depende do CDB. Com a Selic em {{selicRate}}%, um CDB que pague <strong>110% do CDI</strong>, por exemplo, terá uma rentabilidade bruta superior.</p><ul><li>Tesouro Selic: rende aproximadamente <strong>{{selicRate}}% ao ano</strong>.</li><li>CDB (ex: 110% do CDI): pode render em torno de <strong>{{cdbExampleRate}}% ao ano</strong>.</li></ul><p>Ou seja: <strong>um bom CDB tende a render mais</strong>.</p><h2>Comparação completa</h2><ul><li><strong>Segurança:</strong> Tesouro Selic (governo) vs CDB (FGC até R$250 mil)</li><li><strong>Rentabilidade:</strong> CDB pode ganhar</li><li><strong>Liquidez:</strong> depende do produto</li><li><strong>Facilidade:</strong> ambos são simples</li></ul><h2>Qual escolher?</h2><p>Se você quer <strong>máxima segurança</strong>: Tesouro Selic, rendendo hoje <strong>{{selicRate}}% a.a.</strong></p><p>Se você quer <strong>mais rentabilidade</strong>: um bom CDB (acima de 100% do CDI).</p><p>Se você está começando: pode usar os dois para formar sua reserva.</p><h2>Erros comuns</h2><ul><li>Escolher CDB com liquidez ruim</li><li>Não olhar o percentual do CDI</li><li>Achar que só um é “melhor”</li></ul><h2>Conclusão</h2><p>Tanto Tesouro Selic quanto CDB são excelentes investimentos para iniciantes. A melhor escolha depende do seu objetivo: segurança ou rentabilidade.</p><p>Se estiver em dúvida, começar com os dois é uma estratégia inteligente.</p><h2>Perguntas frequentes</h2><h3>CDB é mais seguro que Tesouro Selic?</h3><p>Não. O Tesouro Selic é garantido pelo governo, enquanto o CDB tem garantia do FGC até R$250 mil por CPF e por instituição.</p><h3>Qual rende mais?</h3><p>Um bom CDB (geralmente acima de 100% do CDI) tende a render mais que o Tesouro Selic, que acompanha a taxa básica de juros.</p>`,
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

    