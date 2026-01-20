import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

interface Token {
  id: string;
  symbol: string;
  name: string;
  logoUrl: string;
}

// Static fallback tokens for Base ecosystem
const FALLBACK_TOKENS: Token[] = [
  { id: 'eth', symbol: 'ETH', name: 'Ethereum', logoUrl: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
  { id: 'base', symbol: 'BASE', name: 'Base', logoUrl: 'https://assets.coingecko.com/coins/images/31164/small/base.png' },
  { id: 'degen', symbol: 'DEGEN', name: 'Degen', logoUrl: 'https://assets.coingecko.com/coins/images/34515/small/degen.png' },
  { id: 'brett', symbol: 'BRETT', name: 'Brett', logoUrl: 'https://assets.coingecko.com/coins/images/35529/small/brett.png' },
  { id: 'toshi', symbol: 'TOSHI', name: 'Toshi', logoUrl: 'https://assets.coingecko.com/coins/images/31126/small/toshi.png' },
  { id: 'higher', symbol: 'HIGHER', name: 'Higher', logoUrl: 'https://assets.coingecko.com/coins/images/36084/small/higher.png' },
  { id: 'aero', symbol: 'AERO', name: 'Aerodrome', logoUrl: 'https://assets.coingecko.com/coins/images/31745/small/aero.png' },
  { id: 'well', symbol: 'WELL', name: 'Moonwell', logoUrl: 'https://assets.coingecko.com/coins/images/26133/small/well.png' },
  { id: 'mfer', symbol: '$mfer', name: 'mfer', logoUrl: 'https://assets.coingecko.com/coins/images/30256/small/mfer.png' },
  { id: 'normie', symbol: 'NORMIE', name: 'Normie', logoUrl: 'https://assets.coingecko.com/coins/images/35701/small/normie.png' },
  { id: 'cbbtc', symbol: 'cbBTC', name: 'Coinbase BTC', logoUrl: 'https://assets.coingecko.com/coins/images/40143/small/cbbtc.png' },
  { id: 'virtual', symbol: 'VIRTUAL', name: 'Virtual', logoUrl: 'https://assets.coingecko.com/coins/images/36167/small/virtual.png' },
];

// Deterministic random for consistent layout
const mulberry32 = (seed: number) => {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const TokenTilesState = () => {
  const [tokens, setTokens] = useState<Token[]>(FALLBACK_TOKENS);

  // Fetch tokens dynamically
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('fetch-base-tokens');
        if (!error && data?.tokens?.length > 0) {
          setTokens(data.tokens);
        }
      } catch {
        // Use fallback tokens on error
      }
    };
    fetchTokens();
  }, []);

  // Create 4 columns of tiles
  const columns = useMemo(() => {
    const cols: { token: Token; delay: number; speed: number }[][] = [[], [], [], []];
    const r = mulberry32(42);
    
    // Fill each column with repeated tokens
    for (let col = 0; col < 4; col++) {
      const colTokens = [...tokens].sort(() => r() - 0.5);
      // Repeat tokens to fill scrolling space
      const repeated = [...colTokens, ...colTokens, ...colTokens];
      cols[col] = repeated.map((token, i) => ({
        token,
        delay: r() * 0.5,
        speed: 18 + r() * 8, // 18-26s per cycle
      }));
    }
    return cols;
  }, [tokens]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-white">
      {/* 4 scrolling columns */}
      <div className="absolute inset-0 flex gap-3 px-3 py-2">
        {columns.map((col, colIndex) => (
          <div key={colIndex} className="flex-1 relative overflow-hidden">
            <motion.div
              className="flex flex-col gap-3"
              animate={{ y: ['-33.33%', '0%'] }}
              transition={{
                duration: col[0]?.speed || 20,
                repeat: Infinity,
                ease: 'linear',
                delay: colIndex * 0.5,
              }}
            >
              {col.map((item, i) => (
                <motion.div
                  key={`${item.token.id}-${i}`}
                  className="bg-white rounded-xl shadow-lg border border-gray-100 p-2 flex flex-col items-center gap-1"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: item.delay, duration: 0.3 }}
                >
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img
                      src={item.token.logoUrl}
                      alt={item.token.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40?text=' + item.token.symbol[0];
                      }}
                    />
                  </div>
                  <span className="text-[10px] md:text-xs font-medium text-gray-700 truncate max-w-full">
                    {item.token.symbol}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        ))}
      </div>

      {/* Gradient overlays for smooth edges */}
      <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-white to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
    </div>
  );
};

export default TokenTilesState;
