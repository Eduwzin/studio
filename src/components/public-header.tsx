import { Briefcase } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function PublicHeader({ className }: { className?: string }) {
  return (
    <header className={cn("container mx-auto px-4 sm:px-6 lg:px-8 py-4 bg-background border-b relative z-20", className)}>
        <Link href="/" className={cn("flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity")}>
            <Briefcase className="h-6 w-6 text-primary" />
            <h1 className={cn(
                "text-xl font-bold font-headline text-foreground transition-opacity duration-200"
                )}>SafeStart Invest</h1>
        </Link>
    </header>
  );
}
