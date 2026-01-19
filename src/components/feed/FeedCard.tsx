import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, MoreHorizontal, TrendingUp, CheckCircle, Plus, DollarSign, Sprout } from 'lucide-react';
import { FeedItem } from '@/types/seedbase';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { EmbeddedCard } from './EmbeddedCard';
import { ImpactDrawer } from './ImpactDrawer';
import { SendModal } from '@/components/wallet/SendModal';
import { ComingSoonModal, useComingSoon } from '@/components/shared/ComingSoonModal';
import { toast } from 'sonner';
import seedbaseLeaf from '@/assets/seedbase-leaf-blue.png';

interface FeedCardProps {
  item: FeedItem;
  index: number;
}

const typeStyles: Record<string, string> = {
  milestone: 'border-l-base',
  commitment: 'border-l-seed',
  distribution: 'border-l-trust',
  transparency: 'border-l-primary',
  harvest: 'border-l-envoy',
  testimony: 'border-l-seed',
  mission_update: 'border-l-base',
};

const roleBadgeStyles: Record<string, string> = {
  Steward: 'bg-trust/10 text-trust',
  Recipient: 'bg-envoy/10 text-envoy',
  Official: 'bg-base/10 text-base',
  Envoy: 'bg-envoy/10 text-envoy',
  Activator: 'bg-seed/10 text-seed',
};

export function FeedCard({ item, index }: FeedCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(item.likes);
  const [isImpactDrawerOpen, setIsImpactDrawerOpen] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const { isOpen: isComingSoonOpen, featureName, showComingSoon, hideComingSoon } = useComingSoon();

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleShare = async () => {
    const shareData = {
      title: `${item.author?.name || 'Seedbase'} post`,
      text: item.content,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or share failed
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleComment = () => {
    showComingSoon('Comments');
  };

  const handleFollow = () => {
    showComingSoon('Follow');
  };

  const hasYourSeed = item.yourSeed !== undefined && item.yourSeed > 0;

  // Default impact categories if not provided
  const defaultImpactCategories = [
    { name: 'Students', description: 'Educational support', amount: Math.round((item.yourSeed || 0) * 0.4), percentage: 40, icon: 'students' },
    { name: 'Classrooms', description: 'Facility improvements', amount: Math.round((item.yourSeed || 0) * 0.35), percentage: 35, icon: 'classrooms' },
    { name: 'Teachers', description: 'Training & salaries', amount: Math.round((item.yourSeed || 0) * 0.25), percentage: 25, icon: 'teachers' },
  ];

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.3 }}
        className={cn(
          "bg-card rounded-2xl border border-border/50 shadow-card overflow-hidden",
          "border-l-4",
          typeStyles[item.type] || typeStyles[item.postType || 'milestone']
        )}
      >
        {/* Header - X/Twitter Style */}
        <div className="p-4 pb-0">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start gap-3">
              {/* Avatar with Follow Button */}
              <div className="relative">
                {item.author?.avatar === 'official' || item.author?.handle === 'seedfeed' ? (
                  <img
                    src={seedbaseLeaf}
                    alt="SeedFeed"
                    className="w-11 h-11 rounded-full object-cover"
                  />
                ) : item.author?.avatar ? (
                  item.author.avatar.startsWith('http') ? (
                    <img
                      src={item.author.avatar}
                      alt={item.author.name}
                      className="w-11 h-11 rounded-full bg-muted object-cover"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full gradient-base flex items-center justify-center text-xl">
                      {item.author.avatar}
                    </div>
                  )
                ) : (
                  <div className="w-11 h-11 rounded-full gradient-seed flex items-center justify-center">
                    <Sprout className="h-5 w-5 text-white" />
                  </div>
                )}
                {/* Follow button overlay */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleFollow}
                  className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-base flex items-center justify-center shadow-md"
                >
                  <Plus className="h-3 w-3 text-white" />
                </motion.button>
              </div>

              {/* Name, Badge, Handle, Timestamp */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-foreground truncate">
                    {item.author?.name || item.seedbase?.name || 'Seedbase Network'}
                  </span>
                  {item.author?.isVerified && (
                    <CheckCircle className="h-4 w-4 text-base fill-base stroke-white" />
                  )}
                  {item.roleBadge && (
                    <span className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wide",
                      roleBadgeStyles[item.roleBadge] || 'bg-muted text-muted-foreground'
                    )}>
                      {item.roleBadge}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  {item.author?.handle && (
                    <>
                      <span>@{item.author.handle}</span>
                      <span>·</span>
                    </>
                  )}
                  <span>{formatDistanceToNow(item.timestamp, { addSuffix: false })}</span>
                </div>
              </div>
            </div>

            {/* More menu */}
            <button className="p-2 hover:bg-muted rounded-full transition-colors -mt-1">
              <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Content - Tweet style */}
        <div className="px-4 py-2">
          <p className="text-foreground leading-relaxed whitespace-pre-wrap">{item.content}</p>
        </div>

        {/* Embedded Card */}
        {item.embeddedCard && (
          <div className="px-4">
            <EmbeddedCard card={item.embeddedCard} />
          </div>
        )}

        {/* Metrics (for legacy cards without embedded card) */}
        {!item.embeddedCard && item.metrics && item.metrics.length > 0 && (
          <div className="px-4 py-3">
            <div className="flex flex-wrap gap-2">
              {item.metrics.map((metric, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/50 rounded-lg"
                >
                  {metric.icon && <span className="text-sm">{metric.icon}</span>}
                  <span className="text-xs text-muted-foreground">{metric.label}</span>
                  <span className="font-semibold text-sm">{metric.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Media Placeholder */}
        {item.media?.type === 'image' && !item.embeddedCard && (
          <div className="px-4 py-2">
            <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-xl flex items-center justify-center">
              <span className="text-muted-foreground">📸 Impact Photo</span>
            </div>
          </div>
        )}

        {item.media?.type === 'chart' && !item.embeddedCard && (
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

        {/* Actions Bar */}
        <div className="px-4 py-3 flex items-center justify-between border-t border-border/50 mt-2">
          <div className="flex items-center gap-1">
            {/* Comments */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleComment}
              className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-muted rounded-full transition-colors"
            >
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{item.comments}</span>
            </motion.button>

            {/* Impact Amount */}
            {item.impactFlow?.amount && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-muted rounded-full transition-colors"
              >
                <TrendingUp className="h-4 w-4 text-seed" />
                <span className="text-sm font-medium text-seed">
                  ${(item.impactFlow.amount / 1000).toFixed(1)}K
                </span>
              </motion.button>
            )}

            {/* Share */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-muted rounded-full transition-colors"
            >
              <Share2 className="h-4 w-4 text-muted-foreground" />
            </motion.button>

            {/* Like */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-muted rounded-full transition-colors"
            >
              <Heart className={cn(
                "h-4 w-4 transition-colors",
                isLiked ? "fill-destructive text-destructive" : "text-muted-foreground"
              )} />
              <span className={cn(
                "text-sm",
                isLiked ? "text-destructive" : "text-muted-foreground"
              )}>{likeCount}</span>
            </motion.button>
          </div>

          {/* Give Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSendModal(true)}
            className="w-9 h-9 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center shadow-lg"
          >
            <DollarSign className="h-4 w-4 text-white" />
          </motion.button>
        </div>

        {/* Your Seed Pill - Bottom Section */}
        {hasYourSeed && (
          <div className="px-4 py-3 bg-muted/30 border-t border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium">TOTAL</span>
              <span className="font-bold text-foreground">${item.totalRaised?.toLocaleString() || '0'}</span>
            </div>
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsImpactDrawerOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-seed/10 hover:bg-seed/20 rounded-full transition-colors"
            >
              <Sprout className="h-4 w-4 text-seed" />
              <span className="text-sm font-semibold text-seed">
                Your Seed: ${item.yourSeed?.toLocaleString()}
              </span>
            </motion.button>
          </div>
        )}
      </motion.article>

      {/* Impact Drawer */}
      {hasYourSeed && (
        <ImpactDrawer
          isOpen={isImpactDrawerOpen}
          onClose={() => setIsImpactDrawerOpen(false)}
          missionName={item.mission?.name || item.seedbase?.name || 'This Mission'}
          yourSeed={item.yourSeed || 0}
          totalRaised={item.totalRaised || 0}
          yourImpactPercentage={item.yourImpactPercentage || 0}
          impactCategories={item.embeddedCard?.impactCategories || defaultImpactCategories}
        />
      )}

      {/* Send Modal */}
      <SendModal
        isOpen={showSendModal}
        onClose={() => setShowSendModal(false)}
      />

      {/* Coming Soon Modal */}
      <ComingSoonModal
        isOpen={isComingSoonOpen}
        onClose={hideComingSoon}
        featureName={featureName}
      />
    </>
  );
}