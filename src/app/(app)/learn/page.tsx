
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Lock, Star, Trophy } from "lucide-react";
import gameConfig from "@/lib/game-config.json";
import { cn } from "@/lib/utils";

// Mock user progress for demonstration purposes
const userXp = 100; 

export default function LearnPage() {
  const { progression } = gameConfig;

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-2">Trilha Educacional</h1>
      <p className="text-muted-foreground mb-8">
        Siga o caminho do conhecimento com o Beagle Investidor e desbloqueie novas lições a cada nível.
      </p>

      <div className="space-y-8">
        {progression.levels.map((level, index) => {
          const isUnlocked = userXp >= level.minXpToUnlock;
          return (
            <Card key={level.id} className={cn(
              "overflow-hidden transition-all",
              !isUnlocked && "bg-muted/50"
            )}>
              <CardHeader className={cn(
                "p-4 bg-muted/30 border-b",
                isUnlocked ? "bg-primary/10 text-primary" : "text-muted-foreground"
              )}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {isUnlocked ? (
                      <CheckCircle className="h-8 w-8" />
                    ) : (
                      <Lock className="h-8 w-8" />
                    )}
                    <div>
                      <CardTitle className="text-xl">{level.displayName}</CardTitle>
                      <CardDescription className={cn(isUnlocked ? "text-primary/80" : "text-muted-foreground")}>
                        {level.description}
                      </CardDescription>
                    </div>
                  </div>
                   {!isUnlocked && (
                     <div className="text-right">
                       <p className="text-sm font-bold">{level.minXpToUnlock} XP</p>
                       <p className="text-xs">para desbloquear</p>
                     </div>
                   )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="divide-y">
                  {level.lessons.map((lesson, lessonIndex) => {
                    const isQuiz = lesson.type === 'quiz';
                    const Icon = isQuiz ? Trophy : Star;
                    return (
                      <li key={lesson.id}>
                        <Button
                          variant="ghost"
                          className="w-full h-auto justify-start text-left p-4 rounded-none"
                          disabled={!isUnlocked}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-4">
                              <Icon className={cn("h-6 w-6", isQuiz ? "text-yellow-500" : "text-blue-500")} />
                              <div>
                                <p className="font-semibold">{lesson.title}</p>
                                <p className="text-xs text-muted-foreground">{lesson.estimatedMinutes} min</p>
                              </div>
                            </div>
                            <div className="text-right font-semibold text-primary/80">
                              <p>+{lesson.xpReward} XP</p>
                            </div>
                          </div>
                        </Button>
                      </li>
                    )
                  })}
                </ul>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  );
}

    