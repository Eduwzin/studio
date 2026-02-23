import type { ImagePlaceholder } from './placeholder-images';
import data from './placeholder-images.json';
import type { NewsStory as GenkitNewsStory } from '@/ai/flows/generate-daily-news-stories';

export const placeholderImages: ImagePlaceholder[] = data.placeholderImages;

export type NewsStory = GenkitNewsStory;

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
