import { Briefcase } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 text-primary hover:opacity-80 transition-opacity", className)}>
      <Briefcase className="h-6 w-6" />
      <h1 className="text-xl font-bold font-headline">SafeStart Invest</h1>
    </Link>
  );
}
