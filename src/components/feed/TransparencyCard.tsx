import { motion } from 'framer-motion';
import { FileText, TrendingUp, PieChart, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TransparencyCardProps {
  seedbaseName: string;
  reportType: 'weekly' | 'monthly' | 'quarterly';
  metrics: {
    label: string;
    value: string;
    change?: number;
  }[];
  onView?: () => void;
}

export function TransparencyCard({
  seedbaseName,
  reportType,
  metrics,
  onView,
}: TransparencyCardProps) {
  const reportLabels = {
    weekly: 'Weekly Report',
    monthly: 'Monthly Report',
    quarterly: 'Quarterly Report',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-primary/30 bg-primary/5 p-4"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-primary font-medium">{reportLabels[reportType]}</p>
            <p className="font-semibold text-sm">{seedbaseName}</p>
          </div>
        </div>
        <PieChart className="h-5 w-5 text-primary" />
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-3">
        {metrics.map((metric, i) => (
          <div key={i} className="bg-card rounded-lg p-2 text-center">
            <p className="text-lg font-bold">{metric.value}</p>
            <p className="text-xs text-muted-foreground">{metric.label}</p>
            {metric.change !== undefined && (
              <div className={cn(
                "flex items-center justify-center gap-0.5 text-xs mt-1",
                metric.change >= 0 ? "text-seed" : "text-destructive"
              )}>
                <TrendingUp className="h-3 w-3" />
                <span>{metric.change >= 0 ? '+' : ''}{metric.change}%</span>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onView}
        className="w-full py-2 rounded-lg border border-primary/30 text-primary font-medium text-sm flex items-center justify-center gap-2"
      >
        <span>View Full Report</span>
        <ExternalLink className="h-4 w-4" />
      </motion.button>
    </motion.div>
  );
}
