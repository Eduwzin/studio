import DailyNewsClient from './daily-news-client';

export default async function DailyNewsPage() {
  // A busca de dados agora é tratada no lado do cliente para permitir a personalização
  // com base no perfil do usuário, que só está disponível no cliente.
  return <DailyNewsClient initialNews={[]} />;
}
