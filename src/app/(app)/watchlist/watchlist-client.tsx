'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { getWatchlistDetailsAction } from '@/lib/actions';
import type { StockInfo } from '@/services/brapi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2, Star, TrendingUp, TrendingDown, Info } from 'lucide-react';
import WatchlistButton from '@/components/watchlist/WatchlistButton';
import { cn } from '@/lib/utils';

function WatchlistItemCard({ asset }: { asset: StockInfo }) {
  const isPositive = (asset.regularMarketChangePercent ?? 0) >= 0;
  return (
    <Card className="flex flex-col h-full transition-all hover:shadow-lg">
        <CardHeader>
             <div className="flex items-start justify-between gap-4">
                <Link href="/ativos" className="flex items-center gap-3 flex-1 overflow-hidden group">
                    <Image
                        src={asset.logourl}
                        alt={`Logo de ${asset.longName}`}
                        width={40}
                        height={40}
                        className="rounded-full object-contain bg-white border"
                        unoptimized
                    />
                    <div className="flex-1 overflow-hidden">
                        <CardTitle className="truncate group-hover:text-primary">{asset.symbol}</CardTitle>
                        <CardDescription className="pt-1 truncate">{asset.longName}</CardDescription>
                    </div>
                </Link>
                <WatchlistButton ticker={asset.symbol} />
            </div>
        </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-end">
        <div className="flex justify-between items-center">
            <p className="text-2xl font-bold">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(asset.regularMarketPrice)}
            </p>
            <div className={cn('text-right', isPositive ? 'text-green-600' : 'text-red-600')}>
                <p className="font-semibold text-lg flex items-center gap-1">
                    {isPositive ? <TrendingUp size={20}/> : <TrendingDown size={20}/>}
                    {(asset.regularMarketChangePercent ?? 0).toFixed(2)}%
                </p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function WatchlistClient() {
  const { user } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, `users/${user.uid}/userProfiles/${user.uid}`);
  }, [user, firestore]);
  const { data: userProfile, isLoading: isLoadingProfile } = useDoc<any>(userProfileRef);

  const [assets, setAssets] = useState<StockInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWatchlistAssets = async () => {
      if (userProfile && userProfile.watchlist && userProfile.watchlist.length > 0) {
        const watchlistAssets = await getWatchlistDetailsAction(userProfile.watchlist);
        
        // Mantém a ordem da watchlist do usuário
        const sortedAssets = userProfile.watchlist
            .map((ticker: string) => watchlistAssets.find(asset => asset.symbol === ticker))
            .filter((asset: StockInfo | undefined): asset is StockInfo => asset !== undefined);

        setAssets(sortedAssets);
      } else {
        setAssets([]);
      }
      setIsLoading(false);
    };

    if (!isLoadingProfile) {
        setIsLoading(true);
        fetchWatchlistAssets();
    }
  }, [userProfile, isLoadingProfile]);
  
  const isLoadingAnything = isLoading || isLoadingProfile;

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline mb-2 flex items-center gap-3">
          <Star className="text-primary" />
          Minha Watchlist
        </h1>
        <p className="text-muted-foreground">
          Acompanhe de perto seus ativos favoritos. Adicione ou remova ativos na página de "Ativos".
        </p>
      </header>
      
      {isLoadingAnything && (
         <div className="flex h-64 items-center justify-center text-center">
            <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Carregando sua watchlist...</p>
            </div>
        </div>
      )}

      {!isLoadingAnything && assets.length > 0 && (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {assets.map(asset => (
                <WatchlistItemCard key={asset.symbol} asset={asset} />
            ))}
        </div>
      )}

      {!isLoadingAnything && assets.length === 0 && (
        <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Sua watchlist está vazia</AlertTitle>
            <AlertDescription>
                Para adicionar um ativo, vá para a página <Link href="/ativos" className="font-semibold underline">Ativos</Link>, clique em um item para ver seus detalhes e use o botão de estrela para adicioná-lo aqui.
            </AlertDescription>
        </Alert>
      )}

    </div>
  );
}

    