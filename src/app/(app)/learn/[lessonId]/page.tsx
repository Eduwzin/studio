'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import { generateLesson, GenerateLessonOutput } from '@/lib/actions';
import gameConfig from '@/lib/game-config.json';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import QuizClient from '@/components/learn/quiz-client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.lessonId as string;

  const [lessonContent, setLessonContent] = useState<GenerateLessonOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const lessonInfo = gameConfig.progression.levels
    .flatMap(level => level.lessons)
    .find(lesson => lesson.id === lessonId);

  useEffect(() => {
    if (!lessonInfo) {
      notFound();
      return;
    }

    const fetchLessonContent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const content = await generateLesson({
          lessonId: lessonInfo.id,
          lessonTitle: lessonInfo.title,
        });
        setLessonContent(content);
      } catch (err) {
        console.error("Failed to generate lesson content:", err);
        setError('Não foi possível carregar o conteúdo da lição. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLessonContent();
  }, [lessonId, lessonInfo]);

  if (!lessonInfo) {
    // notFound() will be called in the effect, but this is a safeguard
    return null;
  }
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <h3 className="text-xl font-semibold">O Beagle está preparando sua aula...</h3>
        <p className="text-muted-foreground">Aguarde, o conteúdo já está a caminho!</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-xl mx-auto">
        <AlertTitle>Erro ao Carregar</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
         <div className="mt-4">
            <Button asChild variant="secondary">
                <Link href="/learn">Voltar para a Trilha</Link>
            </Button>
        </div>
      </Alert>
    );
  }

  if (!lessonContent) {
    return null; // Should be handled by loading/error states
  }


  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header className="space-y-2">
        <Badge>Lição</Badge>
        <h1 className="text-3xl font-bold font-headline">{lessonInfo.title}</h1>
      </header>

      <div className="prose prose-lg max-w-none prose-h3:font-headline prose-h3:text-foreground">
        <p className="lead italic text-muted-foreground">
            "{lessonContent.beagleIntro}"
        </p>
        <div dangerouslySetInnerHTML={{ __html: lessonContent.explanation.replace(/\n/g, '<br />') }} />
      </div>
      
      {lessonContent.quiz && lessonContent.quiz.length > 0 && (
        <QuizClient quiz={lessonContent.quiz} />
      )}
      
      <div className="text-center pt-4">
         <Button onClick={() => router.push('/learn')}>Concluir Lição (Simulado)</Button>
      </div>
    </div>
  );
}
