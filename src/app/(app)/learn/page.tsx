'use client';

import { Button } from "@/components/ui/button";
import { CheckCircle, Lock, Star, Trophy } from "lucide-react";
import gameConfig from "@/lib/game-config.json";
import { cn } from "@/lib/utils";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from 'firebase/firestore';
import { Loader2 } from "lucide-react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CardDescription, CardTitle } from "@/components/ui/card";

export default function LearnPage() {
  const { progression } = gameConfig;
  const { user } = useUser();
  const firestore = useFirestore();

  const userProgressRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, `users/${user.uid}/trilha/progress`);
  }, [user, firestore]);

  const { data: userProgress, isLoading: isLoadingProgress } = useDoc(userProgressRef);

  if (isLoadingProgress) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Carregando seu progresso...</p>
      </div>
    );
  }

  const userXp = userProgress?.xp ?? 0;

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline mb-2">Trilha Educacional</h1>
        <p className="text-muted-foreground">
          Siga o caminho do conhecimento com o Beagle Investidor e desbloqueie novas lições a cada nível.
        </p>
        <div className="mt-4 flex items-center gap-6">
            <div className="flex items-center gap-2 font-semibold">
                <Star className="h-5 w-5 text-yellow-500"/>
                <span>{userXp} XP</span>
            </div>
            <div className="flex items-center gap-2 font-semibold">
                <Trophy className="h-5 w-5 text-orange-500"/>
                <span>{userProgress?.coins ?? 0} B-Coins</span>
            </div>
             <div className="flex items-center gap-2 font-semibold">
                <CheckCircle className="h-5 w-5 text-green-500"/>
                <span>{userProgress?.streakDays ?? 0} dias de streak</span>
            </div>
        </div>
      </header>

      <Accordion
        type="multiple"
        className="w-full space-y-4"
        defaultValue={progression.levels.map(level => level.id)}
      >
        {progression.levels.map((level) => {
          const isUnlocked = userXp >= level.minXpToUnlock;
          const isCompleted = level.lessons.every(lesson => userProgress?.completedLessons?.includes(lesson.id));

          return (
            <AccordionItem 
                value={level.id} 
                key={level.id} 
                className={cn(
                    "rounded-lg border overflow-hidden transition-all",
                    !isUnlocked && "bg-muted/50"
                )}
            >
                <AccordionTrigger 
                    className={cn(
                        "p-4 hover:no-underline",
                        isUnlocked ? "bg-primary/10 " : "bg-muted/30"
                    )}
                >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-4">
                        {isUnlocked ? (
                          <div className={cn("flex h-10 w-10 items-center justify-center rounded-full", isCompleted ? "bg-green-500 text-white" : "bg-primary text-primary-foreground")}>
                            <CheckCircle className="h-6 w-6" />
                          </div>
                        ) : (
                           <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted-foreground/20 text-muted-foreground">
                            <Lock className="h-6 w-6" />
                          </div>
                        )}
                        <div className="text-left">
                          <CardTitle className={cn("text-xl", isUnlocked ? "text-foreground" : "text-muted-foreground")}>{level.displayName}</CardTitle>
                          <CardDescription className={cn("mt-1", isUnlocked ? "text-muted-foreground" : "text-muted-foreground/80")}>
                            {level.description}
                          </CardDescription>
                        </div>
                      </div>
                       {!isUnlocked && (
                         <div className="text-right mr-4">
                           <p className="text-sm font-bold text-muted-foreground">{level.minXpToUnlock} XP</p>
                           <p className="text-xs text-muted-foreground">para desbloquear</p>
                         </div>
                       )}
                    </div>
                </AccordionTrigger>
                <AccordionContent className="p-0">
                    <ul className="divide-y">
                      {level.lessons.map((lesson) => {
                         const isLessonCompleted = userProgress?.completedLessons?.includes(lesson.id);
                         const isCurrentLesson = userProgress?.currentLessonId === lesson.id;
                         const isQuiz = lesson.type === 'quiz';
                         const Icon = isQuiz ? Trophy : Star;
                        return (
                          <li key={lesson.id} className={cn(!isUnlocked && "opacity-50 pointer-events-none")}>
                            <Link href={isUnlocked ? `/learn/${lesson.id}` : '#'} passHref>
                                <Button
                                asChild={!isUnlocked}
                                variant="ghost"
                                className="w-full h-auto justify-start text-left p-4 rounded-none disabled:opacity-100"
                                disabled={!isUnlocked}
                                >
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-4">
                                    <div className={cn("flex h-8 w-8 items-center justify-center rounded-full",
                                        isLessonCompleted ? "bg-green-100 text-green-600" : "bg-primary/10 text-primary"
                                    )}>
                                        <Icon className={cn("h-5 w-5")} />
                                    </div>
                                    <div>
                                        <p className={cn("font-semibold", isCurrentLesson && "text-primary")}>{lesson.title}</p>
                                        <p className="text-xs text-muted-foreground">{lesson.estimatedMinutes} min</p>
                                    </div>
                                    </div>
                                    <div className="text-right font-semibold text-primary/80">
                                    <p>+{lesson.xpReward} XP</p>
                                    </div>
                                </div>
                                </Button>
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  );
}
