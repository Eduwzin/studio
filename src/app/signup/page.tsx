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
import { useAuth, useUser, useFirestore, setDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Briefcase, Loader2, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FirebaseError } from 'firebase/app';
import { updateProfile } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { initiateEmailSignUp } from '@/firebase/non-blocking-login';
import { cn } from '@/lib/utils';


const formSchema = z.object({
  fullName: z.string().min(3, { message: 'O nome completo deve ter pelo menos 3 caracteres.' }),
  email: z.string().email({ message: 'Por favor, insira um e-mail válido.' }),
  phone: z.string().min(10, { message: 'Por favor, insira um número de celular com DDD válido.' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
  confirmPassword: z.string().min(6, { message: 'A confirmação de senha é necessária.' }),
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas não coincidem.",
  path: ["confirmPassword"],
});


export default function SignupPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/onboarding');
    }
  }, [user, isUserLoading, router]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    initiateEmailSignUp(auth, values.email, values.password)
        .then(async (userCredential) => {
            const user = userCredential.user;
            
            // 1. Update Auth display name
            if (auth.currentUser) {
                await updateProfile(auth.currentUser, {
                    displayName: values.fullName,
                });
            }

            // 2. Create user document in Firestore
            const userProfileRef = doc(firestore, `users/${user.uid}/userProfiles/${user.uid}`);
            
            const nameParts = values.fullName.trim().split(' ');
            const firstName = nameParts.shift() || '';
            const lastName = nameParts.join(' ') || '';

            const initialProfileData = {
              id: user.uid,
              plan: 'starter',
              accountType: 'user',
              informacoesPessoais: {
                email: values.email,
                nome: firstName,
                sobrenome: lastName,
                celular: values.phone,
              },
              perfilDeInvestimento: {
                 // Preenche com valores vazios para evitar erros em componentes
                avaliacaoDeRisco: '',
                estrategiaDeInvestimento: '',
                alocacaoDeAtivos: '',
              },
              createdAt: new Date().toISOString(),
            };
            
            // Salva os dados iniciais sem bloquear a interface. A próxima página (onboarding) irá mesclar os dados do perfil.
            setDocumentNonBlocking(userProfileRef, initialProfileData, { merge: true });
            
            // The onAuthStateChanged listener in the layout will handle redirection to /onboarding
        })
        .catch((e) => {
            setLoading(false);
            let errorMessage = "Ocorreu um erro desconhecido.";
            if (e instanceof FirebaseError) {
                switch (e.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'Este e-mail já está em uso por outra conta.';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'O formato do e-mail é inválido.';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'A senha é muito fraca. Tente uma mais forte.';
                    break;
                default:
                    errorMessage = 'Falha no cadastro. Por favor, tente novamente mais tarde.';
                    break;
                }
            }
            toast({
                variant: "destructive",
                title: "Erro de Cadastro",
                description: errorMessage,
            });
        });
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
          <CardTitle>Crie sua Conta</CardTitle>
          <CardDescription>Comece sua jornada de investimentos hoje mesmo.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu Nome Completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Celular</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="(XX) XXXXX-XXXX" {...field} />
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
               <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                 {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                Criar Conta
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Já tem uma conta?{' '}
            <Link href="/login" className="underline text-primary">
              Faça login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
