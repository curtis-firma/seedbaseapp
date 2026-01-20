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

  // Create stable grid of tokens
  const gridTokens = useMemo(() => {
    // Create a 4x6 grid (24 tiles)
    const grid: Token[] = [];
    for (let i = 0; i < 24; i++) {
      grid.push(tokens[i % tokens.length]);
    }
    return grid;
  }, [tokens]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-white">
      {/* Static grid of token tiles with subtle scroll effect */}
      <motion.div 
        className="absolute inset-0 flex flex-wrap gap-2 p-3 content-start"
        initial={{ y: 0 }}
        animate={{ y: [0, -20, 0] }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {gridTokens.map((token, i) => (
          <motion.div
            key={`${token.id}-${i}`}
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-2 flex flex-col items-center gap-1"
            style={{ 
              width: 'calc(25% - 6px)',
              minWidth: '60px',
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: i * 0.05, 
              duration: 0.4,
              ease: 'easeOut'
            }}
          >
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden bg-gray-50 flex items-center justify-center shadow-sm">
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
          </motion.div>
        ))}
      </motion.div>

      {/* Gradient overlays for smooth edges */}
      <div className="absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-white to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
    </div>
  );
};

export default TokenTilesState;
