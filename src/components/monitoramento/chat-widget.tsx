
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MessageSquare, X, Sparkles } from 'lucide-react';
import ChatAssistant from './chat-assistant';
import { cn } from '@/lib/utils';

type ChatWidgetProps = {
  userProfileContext: string;
  marketContext: string;
};

export default function ChatWidget({ userProfileContext, marketContext }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className={cn(
        "fixed bottom-6 right-6 z-50 transition-all duration-300",
        isOpen && "opacity-0 pointer-events-none"
      )}>
        <Button
          size="lg"
          className="rounded-full shadow-lg h-16 w-16"
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare className="h-8 w-8" />
          <span className="sr-only">Abrir Chat</span>
        </Button>
      </div>

      <div
        className={cn(
          "fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] max-w-md h-[70vh] max-h-[600px] transition-all duration-300 ease-in-out",
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        )}
      >
        <Card className="h-full w-full flex flex-col shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <div className="flex items-center gap-3">
              <Sparkles className="text-primary h-6 w-6"/>
              <div>
                <CardTitle>Assistente de Análise</CardTitle>
                <CardDescription className="text-xs">Converse com a IA</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Fechar Chat</span>
            </Button>
          </CardHeader>
          <ChatAssistant
            userProfileContext={userProfileContext}
            marketContext={marketContext}
          />
        </Card>
      </div>
    </>
  );
}
