'use client';

import { useMemo } from 'react';
import { useUser, useFirestore, useDoc, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { doc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Star, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type WatchlistButtonProps = {
  ticker: string;
  className?: string;
};

export default function WatchlistButton({ ticker, className }: WatchlistButtonProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const userProfileRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, `users/${user.uid}/userProfiles/${user.uid}`);
  }, [user, firestore]);

  const { data: userProfile, isLoading: isLoadingProfile } = useDoc<any>(userProfileRef);

  const isInWatchlist = useMemo(() => {
    return userProfile?.watchlist?.includes(ticker) ?? false;
  }, [userProfile, ticker]);

  const handleToggleWatchlist = async () => {
    if (!userProfileRef) return;

    const updateData = {
      watchlist: isInWatchlist ? arrayRemove(ticker) : arrayUnion(ticker),
    };

    updateDocumentNonBlocking(userProfileRef, updateData);

    toast({
      title: isInWatchlist ? 'Removido da Watchlist' : 'Adicionado à Watchlist',
      description: `${ticker} foi ${isInWatchlist ? 'removido da' : 'adicionado à'} sua lista.`,
    });
  };

  if (isLoadingProfile) {
    return (
      <Button variant="outline" size="icon" disabled className={className}>
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggleWatchlist}
      className={className}
      title={isInWatchlist ? 'Remover da Watchlist' : 'Adicionar à Watchlist'}
    >
      <Star className={cn('h-4 w-4', isInWatchlist ? 'fill-yellow-400 text-yellow-500' : 'text-muted-foreground')} />
    </Button>
  );
}

    