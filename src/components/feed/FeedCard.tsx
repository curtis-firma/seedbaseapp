import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, MoreHorizontal, TrendingUp, Users, Droplets, CheckCircle2 } from 'lucide-react';
import { FeedItem } from '@/types/seedbase';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface FeedCardProps {
  item: FeedItem;
  index: number;
}

const typeStyles = {
  milestone: 'border-l-seed',
  commitment: 'border-l-base',
  distribution: 'border-l-trust',
  transparency: 'border-l-primary',
  harvest: 'border-l-envoy',
  testimony: 'border-l-seed',
  mission_update: 'border-l-base',
};

const typeIcons = {
  milestone: CheckCircle2,
  commitment: TrendingUp,
  distribution: Droplets,
  transparency: TrendingUp,
  harvest: CheckCircle2,
  testimony: MessageCircle,
  mission_update: Users,
};

export function FeedCard({ item, index }: FeedCardProps) {
  const TypeIcon = typeIcons[item.type] || TrendingUp;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={cn(
        "bg-card rounded-2xl border border-border/50 shadow-card overflow-hidden",
        "border-l-4",
        typeStyles[item.type]
      )}
    >
      {/* Header */}
      <div className="p-4 pb-0">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {item.author ? (
              <img
                src={item.author.avatar}
                alt={item.author.name}
                className="w-10 h-10 rounded-full bg-muted"
              />
            ) : (
              <div className="w-10 h-10 rounded-full gradient-base flex items-center justify-center">
                <TypeIcon className="h-5 w-5 text-white" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">
                  {item.author?.name || item.seedbase?.name || 'Seedbase Network'}
                </span>
                {item.author?.role && (
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full font-medium",
                    item.author.role === 'envoy' && "bg-envoy/10 text-envoy",
                    item.author.role === 'trustee' && "bg-trust/10 text-trust",
                    item.author.role === 'activator' && "bg-seed/10 text-seed",
                  )}>
                    {item.author.role}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(item.timestamp, { addSuffix: true })}
              </p>
            </div>
          </div>
          <button className="p-2 hover:bg-muted rounded-full transition-colors">
            <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-3">
        <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
        <p className="text-muted-foreground leading-relaxed">{item.content}</p>
      </div>

      {/* Metrics */}
      {item.metrics && item.metrics.length > 0 && (
        <div className="px-4 py-3">
          <div className="flex flex-wrap gap-3">
            {item.metrics.map((metric, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-xl"
              >
                <span className="text-muted-foreground text-sm">{metric.label}</span>
                <span className="font-semibold">{metric.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Media Placeholder */}
      {item.media?.type === 'image' && (
        <div className="px-4 py-2">
          <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-xl flex items-center justify-center">
            <span className="text-muted-foreground">📸 Impact Photo</span>
          </div>
        </div>
      )}

      {item.media?.type === 'chart' && (
        <div className="px-4 py-2">
          <div className="h-32 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl flex items-center justify-center">
            <div className="flex items-end gap-1 h-20">
              {[40, 65, 45, 80, 60, 90, 70].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="w-6 bg-primary/60 rounded-t"
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mission/Seedbase Tag */}
      {(item.mission || item.seedbase) && (
        <div className="px-4 py-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/5 rounded-full">
            {item.seedbase && (
              <span className="text-sm font-medium text-primary">
                {item.seedbase.name}
              </span>
            )}
            {item.mission && item.seedbase && <span className="text-muted-foreground">•</span>}
            {item.mission && (
              <span className="text-sm text-muted-foreground">
                {item.mission.name}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="px-4 py-3 flex items-center gap-1 border-t border-border/50 mt-2">
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="flex items-center gap-2 px-4 py-2 hover:bg-muted rounded-xl transition-colors"
        >
          <Heart className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{item.likes}</span>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="flex items-center gap-2 px-4 py-2 hover:bg-muted rounded-xl transition-colors"
        >
          <MessageCircle className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{item.comments}</span>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="flex items-center gap-2 px-4 py-2 hover:bg-muted rounded-xl transition-colors ml-auto"
        >
          <Share2 className="h-5 w-5 text-muted-foreground" />
        </motion.button>
      </div>
    </motion.article>
  );
}
