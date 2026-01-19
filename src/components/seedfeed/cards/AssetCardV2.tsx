import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface AssetCardV2Props {
  tokenName: string;
  tokenSymbol: string;
  price: string;
  pnlPercent: number;
  chartData: { value: number }[];
  holders?: { avatar: string }[];
  className?: string;
}

export function AssetCardV2({
  tokenName,
  tokenSymbol,
  price,
  pnlPercent,
  chartData,
  holders = [],
  className = '',
}: AssetCardV2Props) {
  const navigate = useNavigate();
  const isPositive = pnlPercent >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        rounded-xl border border-border bg-card p-4
        ${className}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-seed to-primary flex items-center justify-center text-white font-bold text-sm">
            {tokenSymbol.slice(0, 2)}
          </div>
          <div>
            <h4 className="font-semibold text-foreground">{tokenName}</h4>
            <span className="text-xs text-muted-foreground">${tokenSymbol}</span>
          </div>
        </div>
        <div className="text-right">
          <span className="font-bold text-foreground">{price}</span>
          <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-seed' : 'text-destructive'}`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{isPositive ? '+' : ''}{pnlPercent}%</span>
          </div>
        </div>
      </div>

      {/* Sparkline Chart */}
      <div className="h-16 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={isPositive ? 'hsl(var(--seed))' : 'hsl(var(--destructive))'}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Stacked Holders */}
        {holders.length > 0 && (
          <div className="flex -space-x-2">
            {holders.slice(0, 4).map((holder, i) => (
              <img
                key={i}
                src={holder.avatar}
                alt=""
                className="w-6 h-6 rounded-full border-2 border-card object-cover"
              />
            ))}
            {holders.length > 4 && (
              <div className="w-6 h-6 rounded-full border-2 border-card bg-muted flex items-center justify-center text-xs text-muted-foreground">
                +{holders.length - 4}
              </div>
            )}
          </div>
        )}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/app/vault?tab=assets')}
          className="
            flex items-center gap-1 px-3 py-1.5
            text-sm font-medium text-primary
            hover:bg-primary/10 rounded-lg transition-colors
            ml-auto
          "
        >
          View Token
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}

export default AssetCardV2;
