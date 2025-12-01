'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams, useRouter } from 'next/navigation';
import { generateLesson } from '@/ai/flows/generate-lesson-content';
import { GenerateLessonOutput } from '@/ai/flows/generate-lesson-content';
import gameConfig from '@/lib/game-config.json';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import QuizClient from '@/components/learn/quiz-client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { calculateNextProgress } from '@/lib/game-logic';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';
import type { UserProgress } from '@/lib/user-progress';

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const lessonId = params.lessonId as string;

  const [lessonContent, setLessonContent] = useState<GenerateLessonOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const lessonInfo = gameConfig.progression.levels
    .flatMap(level => level.lessons)
    .find(lesson => lesson.id === lessonId);

  const userProgressRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, `users/${user.uid}/trilha/progress`);
  }, [user, firestore]);

  const { data: userProgress, isLoading: isLoadingProgress } = useDoc<UserProgress>(userProgressRef);

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

  const handleQuizCompleted = () => {
    if (!userProgress || !userProgressRef) return;
    
    // Calcula o próximo estado
    const newProgress = calculateNextProgress(lessonId, userProgress);
    
    // Salva o novo estado no Firestore (sem bloquear)
    setDocumentNonBlocking(userProgressRef, newProgress, { merge: false });

    toast({
      title: "Lição Concluída!",
      description: `Você ganhou ${newProgress.xp - userProgress.xp} XP e ${newProgress.coins - userProgress.coins} B-Coins!`,
    });

    // Redireciona para a página principal da trilha
    router.push('/learn');
  };


  if (!lessonInfo) {
    // notFound() will be called in the effect, but this is a safeguard
    return null;
  }
  
  if (isLoading || isLoadingProgress) {
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
        <QuizClient quiz={lessonContent.quiz} onQuizCompleted={handleQuizCompleted} />
      )}
      
      {!lessonContent.quiz || lessonContent.quiz.length === 0 && (
         <div className="text-center pt-4">
           <Button onClick={handleQuizCompleted}>Concluir Lição</Button>
        </div>
      )}
    </div>
  );
}
