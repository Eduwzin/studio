'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { GenerateLessonOutput } from '@/ai/flows/generate-lesson-content';
import { CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import gameConfig from '@/lib/game-config.json';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

type QuizClientProps = {
  quiz: GenerateLessonOutput['quiz'];
  onQuizCompleted: () => void;
};

export default function QuizClient({ quiz, onQuizCompleted }: QuizClientProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const getRandomFeedback = (type: 'correct' | 'wrong') => {
    const phrases = type === 'correct' ? gameConfig.character.catchPhrases.correctAnswer : gameConfig.character.catchPhrases.wrongAnswer;
    return phrases[Math.floor(Math.random() * phrases.length)];
  };

  // This check prevents the error. If the quiz is done, we show the summary.
  if (currentQuestionIndex >= quiz.length) {
    return (
       <Card className="text-center bg-primary/10 border-primary">
        <CardHeader>
          <CardTitle>Quiz Concluído!</CardTitle>
          <CardDescription>Você acertou {correctAnswers} de {quiz.length} perguntas.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <p className="font-semibold text-lg">{getRandomFeedback('correct')}</p>
            <Button onClick={onQuizCompleted}>
                Finalizar e ver Progresso
            </Button>
        </CardContent>
      </Card>
    );
  }
  
  // This code now only runs if the quiz is NOT finished.
  const currentQuestion = quiz[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswerIndex;
  
  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;
    if (isCorrect) {
        setCorrectAnswers(correctAnswers + 1);
    }
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    setShowResult(false);
    setSelectedAnswer(null);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Desafio do Beagle!</CardTitle>
        <CardDescription>
          Pergunta {currentQuestionIndex + 1} de {quiz.length}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="font-semibold text-lg">{currentQuestion.questionText}</p>

        <RadioGroup
          value={selectedAnswer !== null ? String(selectedAnswer) : ''}
          onValueChange={(value) => setSelectedAnswer(Number(value))}
          disabled={showResult}
        >
          {currentQuestion.options.map((option, index) => (
            <div key={index} className={cn(
                "flex items-center space-x-3 space-y-0 p-3 rounded-md border transition-all",
                showResult && currentQuestion.correctAnswerIndex === index && 'bg-green-100 border-green-300 dark:bg-green-900/50 dark:border-green-700',
                showResult && selectedAnswer === index && !isCorrect && 'bg-red-100 border-red-300 dark:bg-red-900/50 dark:border-red-700'
            )}>
              <RadioGroupItem value={String(index)} id={`q${currentQuestionIndex}-opt${index}`} />
              <Label htmlFor={`q${currentQuestionIndex}-opt${index}`} className="flex-1 cursor-pointer">
                {option}
              </Label>
               {showResult && currentQuestion.correctAnswerIndex === index && <CheckCircle2 className="h-5 w-5 text-green-600" />}
               {showResult && selectedAnswer === index && !isCorrect && <XCircle className="h-5 w-5 text-red-600" />}
            </div>
          ))}
        </RadioGroup>

        {showResult && (
            <Alert variant={isCorrect ? "default" : "destructive"} className={cn(
                isCorrect && "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
            )}>
                <AlertTitle className="flex items-center gap-2">
                    {isCorrect ? <CheckCircle2 className="h-5 w-5"/> : <XCircle className="h-5 w-5"/>}
                    {isCorrect ? 'Resposta Correta!' : 'Resposta Incorreta!'}
                </AlertTitle>
                <AlertDescription>
                    <p className="font-bold mb-2">{getRandomFeedback(isCorrect ? 'correct' : 'wrong')}</p>
                    {currentQuestion.explanation}
                </AlertDescription>
            </Alert>
        )}
        
        <div className="text-center">
            {showResult ? (
                <Button onClick={handleNextQuestion}>
                    {currentQuestionIndex < quiz.length - 1 ? 'Próxima Pergunta' : 'Finalizar Quiz'}
                </Button>
            ) : (
                <Button onClick={handleCheckAnswer} disabled={selectedAnswer === null}>
                    Verificar Resposta
                </Button>
            )}
        </div>

      </CardContent>
    </Card>
  );
}
