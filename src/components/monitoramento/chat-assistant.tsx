
'use client';

import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Loader2, Send } from 'lucide-react';
import { chatWithMarketAnalyst } from '@/lib/actions';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '../ui/alert';

type Message = {
  role: 'user' | 'model';
  content: string;
};

type ChatAssistantProps = {
  userProfileContext: string;
  marketContext: string;
};

export default function ChatAssistant({ userProfileContext, marketContext }: ChatAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
        role: 'model',
        content: "Olá! Eu sou seu assistente de análise. Como posso ajudar a esclarecer os dados de mercado ou as recomendações de hoje?",
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const chatHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await chatWithMarketAnalyst({
        userProfile: userProfileContext,
        marketContext: marketContext,
        history: chatHistory,
        question: input,
      });

      const modelMessage: Message = { role: 'model', content: response.answer };
      setMessages(prev => [...prev, modelMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      setError("Desculpe, não consegui processar sua pergunta. Tente novamente em alguns instantes.");
      // Optional: remove the user's message if the API call fails
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
        <ScrollArea className="flex-grow p-4">
            <div className="space-y-4" ref={scrollAreaRef}>
            {messages.map((message, index) => (
                <div
                key={index}
                className={cn(
                    'flex items-start gap-3',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
                >
                {message.role === 'model' && (
                    <Avatar className="h-8 w-8 bg-primary text-primary-foreground flex-shrink-0">
                        <AvatarFallback><Bot size={18}/></AvatarFallback>
                    </Avatar>
                )}
                <div
                    className={cn(
                    'rounded-lg p-3 max-w-sm text-sm',
                    message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                >
                    {message.content}
                </div>
                </div>
            ))}
            {isLoading && (
                 <div className='flex items-start gap-3 justify-start'>
                    <Avatar className="h-8 w-8 bg-primary text-primary-foreground flex-shrink-0">
                        <AvatarFallback><Bot size={18}/></AvatarFallback>
                    </Avatar>
                    <div className='rounded-lg p-3 max-w-sm text-sm bg-muted flex items-center'>
                       <Loader2 className="h-5 w-5 animate-spin"/>
                    </div>
                </div>
            )}
            </div>
        </ScrollArea>
        {error && (
            <div className="p-4 pt-0">
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        )}
        <form onSubmit={handleSendMessage} className="flex items-center gap-2 p-4 border-t">
            <Textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ex: Por que a renda fixa está atrativa?"
            className="flex-grow resize-none"
            rows={1}
            disabled={isLoading}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                }
            }}
            />
            <Button type="submit" disabled={isLoading || !input.trim()} size="icon">
                <Send className="h-4 w-4" />
                <span className="sr-only">Enviar</span>
            </Button>
        </form>
    </div>
  );
}
