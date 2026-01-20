import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { YourShareBadge } from '../shared/YourShareBadge';

interface DeploymentCardV2Props {
  missionName: string;
  amount: number;
  yourShare?: number;
  yourPercentage?: number;
  imageUrl?: string;
  description?: string;
  className?: string;
}

export function DeploymentCardV2({
  missionName,
  amount,
  yourShare,
  yourPercentage,
  imageUrl,
  description,
  className = '',
}: DeploymentCardV2Props) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        rounded-xl border border-border bg-card overflow-hidden
        ${className}
      `}
    >
      {/* Image */}
      {imageUrl && (
        <div className="relative aspect-video">
          <img
            src={imageUrl}
            alt={missionName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Amount Badge Overlay */}
          <div className="absolute bottom-3 left-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-card/90 backdrop-blur-sm rounded-lg">
              <TrendingUp className="w-4 h-4 text-seed" />
              <span className="font-bold text-foreground">
                ${amount.toLocaleString()}
              </span>
              <span className="text-xs text-muted-foreground">deployed</span>
            </div>
          </div>

          {/* Your Share Badge */}
          {yourShare !== undefined && (
            <YourShareBadge
              amount={yourShare}
              percentage={yourPercentage}
              variant="overlay"
            />
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h4 className="font-semibold text-foreground mb-1">{missionName}</h4>
            {description && (
              <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
            )}
          </div>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/app/seedbase')}
            className="
              flex items-center gap-1.5 px-4 py-2
              text-sm font-medium text-white
              bg-primary hover:bg-primary/90 rounded-xl transition-colors
              shadow-sm
            "
          >
            View Mission
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>

        {/* No image fallback - show amount inline */}
        {!imageUrl && (
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-seed" />
              <span className="font-bold text-foreground">
                ${amount.toLocaleString()}
              </span>
              <span className="text-xs text-muted-foreground">deployed</span>
            </div>
            {yourShare !== undefined && (
              <YourShareBadge amount={yourShare} variant="compact" />
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default DeploymentCardV2;
