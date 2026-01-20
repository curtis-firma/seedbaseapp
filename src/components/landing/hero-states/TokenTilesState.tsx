import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import cikMemeImage from '@/assets/products/cik-meme-hoodie.png';

interface Token {
  id: string;
  symbol: string;
  name: string;
  logoUrl: string;
}

// Static fallback tokens for Base ecosystem - includes CIK meme scattered throughout
const FALLBACK_TOKENS: Token[] = [
  { id: 'eth', symbol: 'ETH', name: 'Ethereum', logoUrl: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
  { id: 'cik1', symbol: 'CIK', name: 'Christ is King', logoUrl: cikMemeImage },
  { id: 'base', symbol: 'BASE', name: 'Base', logoUrl: 'https://assets.coingecko.com/coins/images/31164/small/base.png' },
  { id: 'degen', symbol: 'DEGEN', name: 'Degen', logoUrl: 'https://assets.coingecko.com/coins/images/34515/small/degen.png' },
  { id: 'brett', symbol: 'BRETT', name: 'Brett', logoUrl: 'https://assets.coingecko.com/coins/images/35529/small/brett.png' },
  { id: 'cik2', symbol: 'CIK', name: 'Christ is King', logoUrl: cikMemeImage },
  { id: 'toshi', symbol: 'TOSHI', name: 'Toshi', logoUrl: 'https://assets.coingecko.com/coins/images/31126/small/toshi.png' },
  { id: 'higher', symbol: 'HIGHER', name: 'Higher', logoUrl: 'https://assets.coingecko.com/coins/images/36084/small/higher.png' },
  { id: 'aero', symbol: 'AERO', name: 'Aerodrome', logoUrl: 'https://assets.coingecko.com/coins/images/31745/small/aero.png' },
  { id: 'cik3', symbol: 'CIK', name: 'Christ is King', logoUrl: cikMemeImage },
  { id: 'well', symbol: 'WELL', name: 'Moonwell', logoUrl: 'https://assets.coingecko.com/coins/images/26133/small/well.png' },
  { id: 'mfer', symbol: '$mfer', name: 'mfer', logoUrl: 'https://assets.coingecko.com/coins/images/30256/small/mfer.png' },
];

// Column fall speeds in seconds - varied for waterfall effect
const COLUMN_SPEEDS = [14, 18, 16, 20];

// Fisher-Yates shuffle with seed for consistency
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const TokenTilesState = () => {
  const [tokens, setTokens] = useState<Token[]>(FALLBACK_TOKENS);

  // Fetch tokens dynamically
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('fetch-base-tokens');
        if (!error && data?.tokens?.length > 0) {
          // Keep CIK tokens and merge with fetched ones
          const cikTokens = FALLBACK_TOKENS.filter(t => t.id.startsWith('cik'));
          const otherTokens = data.tokens.slice(0, 9);
          // Interleave CIK tokens with others
          const merged = shuffleArray([...cikTokens, ...otherTokens]);
          setTokens(merged);
        }
      } catch {
        // Use fallback tokens on error
      }
    };
    fetchTokens();
  }, []);

  // Shuffle and split tokens into 4 columns with duplicates for seamless loop
  const columns = useMemo(() => {
    const shuffled = shuffleArray(tokens);
    const cols: Token[][] = [[], [], [], []];
    shuffled.forEach((token, i) => {
      cols[i % 4].push(token);
    });
    // Duplicate for seamless infinite scroll
    return cols.map(col => [...col, ...col, ...col]);
  }, [tokens]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-white">
      {/* 4 falling columns at different speeds */}
      <div className="flex gap-3 h-full justify-center items-start pt-4 px-3">
        {columns.map((columnTokens, colIndex) => (
          <motion.div
            key={colIndex}
            className="flex flex-col gap-3 flex-1 max-w-[80px]"
            animate={{ y: ['0%', '-66.66%'] }}
            transition={{
              duration: COLUMN_SPEEDS[colIndex],
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {columnTokens.map((token, i) => (
              <div
                key={`${token.id}-${i}`}
                className="bg-white rounded-xl shadow-lg border border-gray-100 p-2 flex flex-col items-center gap-1"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden bg-gray-50 flex items-center justify-center shadow-sm">
                  <img
                    src={token.logoUrl}
                    alt={token.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40?text=' + token.symbol[0];
                    }}
                  />
                </div>
                <span className="text-[9px] md:text-[10px] font-medium text-gray-600 truncate max-w-full">
                  {token.symbol}
                </span>
              </div>
            ))}
          </motion.div>
        ))}
      </div>

      {/* Gradient overlays for smooth edges */}
      <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-white to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
    </div>
  );
};

export default TokenTilesState;
