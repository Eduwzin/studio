'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useAuth, useUser } from '@/firebase';
import { Briefcase, Loader2, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FirebaseError } from 'firebase/app';
import { useToast } from '@/hooks/use-toast';
import { initiateEmailSignIn } from '@/firebase/non-blocking-login';
import { cn } from '@/lib/utils';


const formSchema = z.object({
  email: z.string().email({ message: 'Por favor, insira um e-mail válido.' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
});

export default function LoginPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError(null);
    try {
        await initiateEmailSignIn(auth, values.email, values.password);
        // The onAuthStateChanged listener in the provider will handle redirection
    } catch (e) {
      setLoading(false);
      let errorMessage = "Ocorreu um erro desconhecido.";
      if (e instanceof FirebaseError) {
        switch (e.code) {
          case 'auth/user-not-found':
            errorMessage = 'Nenhum usuário encontrado com este e-mail.';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Senha incorreta. Por favor, tente novamente.';
            break;
          case 'auth/invalid-credential':
            errorMessage = 'Credenciais inválidas. Verifique seu e-mail e senha.';
            break;
          default:
            errorMessage = 'Falha no login. Por favor, tente novamente mais tarde.';
            break;
        }
      }
       toast({
        variant: "destructive",
        title: "Erro de Login",
        description: errorMessage,
      });
    }
  }

  if (isUserLoading || user) {
     return (
       <div className="flex h-screen w-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
       </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
            <div className="mx-auto mb-4">
                <Link href="/" className={cn("flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity")}>
                    <Briefcase className="h-8 w-8 text-primary" />
                    <h1 className={cn(
                        "text-2xl font-bold font-headline text-foreground"
                        )}>SafeStart Invest</h1>
                </Link>
            </div>
          <CardTitle>Bem-vindo de Volta!</CardTitle>
          <CardDescription>Faça login para acessar seu painel de investimentos.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="seu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                 {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
                Entrar
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Não tem uma conta?{' '}
            <Link href="/signup" className="underline text-primary">
              Cadastre-se
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
