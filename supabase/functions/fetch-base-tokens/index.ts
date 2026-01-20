import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Token {
  id: string;
  symbol: string;
  name: string;
  logoUrl: string;
}

// Fallback tokens if API fails
const FALLBACK_TOKENS: Token[] = [
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', logoUrl: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
  { id: 'base', symbol: 'BASE', name: 'Base', logoUrl: 'https://assets.coingecko.com/coins/images/31164/small/base.png' },
  { id: 'degen-base', symbol: 'DEGEN', name: 'Degen', logoUrl: 'https://assets.coingecko.com/coins/images/34515/small/degen.png' },
  { id: 'brett', symbol: 'BRETT', name: 'Brett', logoUrl: 'https://assets.coingecko.com/coins/images/35529/small/brett.png' },
  { id: 'toshi-base', symbol: 'TOSHI', name: 'Toshi', logoUrl: 'https://assets.coingecko.com/coins/images/31126/small/toshi.png' },
  { id: 'higher', symbol: 'HIGHER', name: 'Higher', logoUrl: 'https://assets.coingecko.com/coins/images/36084/small/higher.png' },
  { id: 'aerodrome-finance', symbol: 'AERO', name: 'Aerodrome', logoUrl: 'https://assets.coingecko.com/coins/images/31745/small/aero.png' },
  { id: 'moonwell', symbol: 'WELL', name: 'Moonwell', logoUrl: 'https://assets.coingecko.com/coins/images/26133/small/well.png' },
  { id: 'normie-base', symbol: 'NORMIE', name: 'Normie', logoUrl: 'https://assets.coingecko.com/coins/images/35701/small/normie.png' },
  { id: 'virtual-protocol', symbol: 'VIRTUAL', name: 'Virtual', logoUrl: 'https://assets.coingecko.com/coins/images/36167/small/virtual.png' },
];

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Fetch top tokens on Base from CoinGecko
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=base-ecosystem&order=market_cap_desc&per_page=15&page=1",
      {
        headers: {
          "Accept": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.log("CoinGecko API failed, using fallback tokens");
      return new Response(
        JSON.stringify({ tokens: FALLBACK_TOKENS }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    
    const tokens: Token[] = data.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      logoUrl: coin.image,
    }));

    // Add ETH if not in list
    if (!tokens.find(t => t.symbol === 'ETH')) {
      tokens.unshift({
        id: 'ethereum',
        symbol: 'ETH',
        name: 'Ethereum',
        logoUrl: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
      });
    }

    return new Response(
      JSON.stringify({ tokens }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching tokens:", error);
    return new Response(
      JSON.stringify({ tokens: FALLBACK_TOKENS }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
