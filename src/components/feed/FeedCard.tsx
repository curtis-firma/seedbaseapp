import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Sprout } from 'lucide-react';
import { FeedItem } from '@/types/seedbase';
import { cn } from '@/lib/utils';
import { EmbeddedCard } from './EmbeddedCard';
import { ImpactDrawer } from './ImpactDrawer';
import { SendModal } from '@/components/wallet/SendModal';
import { ComingSoonModal, useComingSoon } from '@/components/shared/ComingSoonModal';
import { toast } from 'sonner';
import { triggerHaptic } from '@/hooks/useHaptic';
import { useInView } from '@/hooks/useInView';
import { getRandomImage, getCategoryFromName } from '@/lib/curatedImages';
import { PostHeader } from '@/components/seedfeed/shared/PostHeader';
import { PostActions } from '@/components/seedfeed/shared/PostActions';
import { CardImpactFooter } from '@/components/seedfeed/shared/CardImpactFooter';

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

export function FeedCard({ item, index }: FeedCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(item.likes);
  const [isImpactDrawerOpen, setIsImpactDrawerOpen] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const { isOpen: isComingSoonOpen, featureName, showComingSoon, hideComingSoon } = useComingSoon();
  const { ref: cardRef, isInView } = useInView<HTMLElement>({
    threshold: 0.15,
    rootMargin: '50px',
    triggerOnce: true,
  });

  // Get a consistent random image for this card based on its content
  const mediaImageUrl = useMemo(() => {
    if (item.media?.url) return item.media.url;
    const category = getCategoryFromName(item.seedbase?.name || item.mission?.name || item.content);
    return getRandomImage(category);
  }, [item.id, item.seedbase?.name, item.mission?.name, item.content, item.media?.url]);

  const handleLike = () => {
    triggerHaptic(isLiked ? 'light' : 'medium');
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleShare = async () => {
    triggerHaptic('light');
    const shareData = {
      title: `${item.author?.name || 'Seedbase'} post`,
      text: item.content,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        triggerHaptic('success');
      } catch (err) {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleComment = () => {
    triggerHaptic('light');
    showComingSoon('Comments');
  };

  const handleFollow = () => {
    triggerHaptic('light');
    showComingSoon('Follow');
  };

  const handleGive = () => {
    triggerHaptic('medium');
    setShowSendModal(true);
  };

  const hasYourSeed = item.yourSeed !== undefined && item.yourSeed > 0;

  // Map role badge to variant
  const getBadgeVariant = (): 'official' | 'steward' | 'envoy' | 'activator' | 'recipient' => {
    if (item.roleBadge === 'Steward') return 'steward';
    if (item.roleBadge === 'Envoy') return 'envoy';
    if (item.roleBadge === 'Recipient') return 'recipient';
    if (item.roleBadge === 'Official') return 'official';
    return 'activator';
  };

  // Prepare author for PostHeader
  const author = {
    name: item.author?.name || item.seedbase?.name || 'Seedbase Network',
    avatar: item.author?.avatar || '',
    handle: item.author?.handle,
    isVerified: item.author?.isVerified,
    role: item.author?.role,
  };

  const isOfficial = author.handle === 'seedfeedhq' || author.handle === 'seedfeed';

  // Default impact categories if not provided
  const defaultImpactCategories = [
    { name: 'Students', description: 'Educational support', amount: Math.round((item.yourSeed || 0) * 0.4), percentage: 40, icon: 'students' },
    { name: 'Classrooms', description: 'Facility improvements', amount: Math.round((item.yourSeed || 0) * 0.35), percentage: 35, icon: 'classrooms' },
    { name: 'Teachers', description: 'Training & salaries', amount: Math.round((item.yourSeed || 0) * 0.25), percentage: 25, icon: 'teachers' },
  ];

  return (
    <>
      <motion.article
        ref={cardRef}
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={isInView 
          ? { opacity: 1, y: 0, scale: 1 } 
          : { opacity: 0, y: 30, scale: 0.98 }
        }
        transition={{ 
          duration: 0.4, 
          ease: [0.25, 0.46, 0.45, 0.94],
          delay: Math.min(index * 0.05, 0.2)
        }}
        className={cn(
          "bg-card rounded-2xl border border-border/50 shadow-card overflow-hidden",
          "border-l-4",
          typeStyles[item.type] || typeStyles[item.postType || 'milestone']
        )}
      >
        {/* Header - Using Shared PostHeader */}
        <div className="p-4 pb-0">
          <div className="flex items-start gap-3">
            {/* Avatar with Follow Button */}
            <div className="relative flex-shrink-0">
              {author.avatar ? (
                author.avatar.startsWith('http') ? (
                  <img
                    src={author.avatar}
                    alt={author.name}
                    className="w-11 h-11 rounded-full bg-muted object-cover ring-2 ring-border/50"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full gradient-base flex items-center justify-center text-xl">
                    {author.avatar}
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

            {/* Use PostHeader for rest */}
            <div className="flex-1 min-w-0">
              <PostHeader
                author={author}
                timestamp={item.timestamp}
                badge={item.roleBadge}
                badgeVariant={getBadgeVariant()}
                isOfficial={isOfficial}
                className="[&>*:first-child]:hidden" // Hide avatar from PostHeader since we render custom one
              />
            </div>
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
            <div className="aspect-video rounded-xl overflow-hidden bg-muted">
              <img 
                src={mediaImageUrl}
                alt="Impact"
                className="w-full h-full object-cover"
                loading="lazy"
              />
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

        {/* Your Seed Footer - Using Shared CardImpactFooter */}
        {hasYourSeed && item.totalRaised && (
          <div className="px-4 py-3">
            <motion.div
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsImpactDrawerOpen(true)}
              className="cursor-pointer"
            >
              <CardImpactFooter
                totalAmount={item.totalRaised}
                yourSeed={item.yourSeed}
                yourPercentage={item.yourImpactPercentage}
              />
            </motion.div>
          </div>
        )}

        {/* Actions Bar - Using Shared PostActions */}
        <div className="px-4 pb-4 border-t border-border/30 mt-2">
          <PostActions
            commentCount={item.comments}
            likeCount={likeCount}
            impactAmount={item.impactFlow?.amount ? item.impactFlow.amount / 1000 : undefined}
            isLiked={isLiked}
            onComment={handleComment}
            onShare={handleShare}
            onLike={handleLike}
            onGive={handleGive}
            showGiveButton={true}
          />
        </div>
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
