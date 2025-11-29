"use client";

import { Briefcase } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useSidebar } from './ui/sidebar';

export function Logo({ className }: { className?: string }) {
  const { state } = useSidebar();
  
  return (
    <Link href="/" className={cn("flex items-center gap-2 text-sidebar-primary hover:opacity-80 transition-opacity", className)}>
      <Briefcase className="h-6 w-6" />
      <h1 className={cn(
          "text-xl font-bold font-headline text-sidebar-primary-foreground transition-opacity duration-200",
           state === "collapsed" && "opacity-0 hidden"
        )}>SafeStart Invest</h1>
    </Link>
  );
}