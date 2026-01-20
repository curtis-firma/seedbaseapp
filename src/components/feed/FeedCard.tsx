import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Sprout, MessageCircle, Share2, Heart } from 'lucide-react';
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
import { AmplifyButton } from '@/components/social/AmplifyButton';
import seedbasePfp from '@/assets/seedbase-pfp.png';

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
  const getBadgeVariant = (): 'official' | 'trustee' | 'envoy' | 'activator' | 'recipient' => {
    if (item.roleBadge === 'Trustee') return 'trustee';
    if (item.roleBadge === 'Envoy') return 'envoy';
    if (item.roleBadge === 'Recipient') return 'recipient';
    if (item.roleBadge === 'Official') return 'official';
    return 'activator';
  };

  // Detect official account
  const isOfficial = item.author?.handle === 'seedfeedhq' || item.author?.handle === 'seedbase' || item.roleBadge === 'Official';

  // Prepare author for PostHeader
  const author = {
    name: item.author?.name || item.seedbase?.name || 'Seedbase Network',
    handle: item.author?.handle,
    isVerified: item.author?.isVerified || isOfficial,
    role: item.author?.role,
  };

  // Get avatar - use circular PFP for official accounts
  const getAvatarContent = () => {
    if (isOfficial) {
      return (
        <img
          src={seedbasePfp}
          alt="Seedbase"
          className="w-11 h-11 rounded-full object-cover ring-2 ring-primary"
        />
      );
    }
    
    const avatar = item.author?.avatar || '';
    
    if (avatar && avatar.startsWith('http')) {
      return (
        <img
          src={avatar}
          alt={author.name}
          className="w-11 h-11 rounded-full bg-muted object-cover ring-2 ring-border/50"
        />
      );
    }
    
    if (avatar && avatar.length <= 4) {
      return (
        <div className="w-11 h-11 rounded-full gradient-base flex items-center justify-center text-xl">
          {avatar}
        </div>
      );
    }
    
    return (
      <div className="w-11 h-11 rounded-full gradient-seed flex items-center justify-center">
        <Sprout className="h-5 w-5 text-white" />
      </div>
    );
  };

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
        {/* X-Style Two-Column Layout */}
        <div className="flex gap-3 p-4">
          {/* LEFT COLUMN: Avatar + Follow Button */}
          <div className="flex-shrink-0">
            <div className="relative">
              {getAvatarContent()}
              {/* Follow button overlay - hide for official */}
              {!isOfficial && (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleFollow}
                  className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-md"
                >
                  <Plus className="h-3 w-3 text-white" />
                </motion.button>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Header + Content */}
          <div className="flex-1 min-w-0">
            {/* Single-line PostHeader */}
            <PostHeader
              author={author}
              timestamp={item.timestamp}
              badge={item.roleBadge}
              badgeVariant={getBadgeVariant()}
            />

            {/* Content - Tweet style */}
            <p className="text-foreground leading-relaxed whitespace-pre-wrap mt-2 text-[15px]">
              {item.content}
            </p>
          </div>
        </div>

        {/* Embedded Card */}
        {item.embeddedCard && (
          <div className="px-4 pb-3">
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
            <CardImpactFooter
              totalAmount={item.totalRaised}
              yourSeed={item.yourSeed}
              yourPercentage={item.yourImpactPercentage}
              onYourSeedClick={() => setIsImpactDrawerOpen(true)}
            />
          </div>
        )}

        {/* Actions Bar - Using Shared PostActions */}
        <div className="px-4 pb-4 border-t border-border/30 mt-2">
          <div className="flex flex-col gap-3 pt-3">
            {/* Top row: icons + Give button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 md:gap-4">
                {/* Comment */}
                <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
                  <MessageCircle className="w-[18px] h-[18px]" />
                  <span className="text-sm">{item.comments}</span>
                </button>
                {/* Share */}
                <button onClick={handleShare} className="flex items-center text-muted-foreground hover:text-primary transition-colors">
                  <Share2 className="w-[18px] h-[18px]" />
                </button>
                {/* Like */}
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-1.5 transition-colors ${
                    isLiked ? 'text-rose-500' : 'text-muted-foreground hover:text-rose-500'
                  }`}
                >
                  <Heart className={`w-[18px] h-[18px] ${isLiked ? 'fill-current' : ''}`} />
                  <span className="text-sm">{likeCount}</span>
                </button>
              </div>
              {/* Give Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleGive}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:bg-primary/90 transition-colors shadow-sm"
              >
                <Sprout className="w-4 h-4" />
                <span>Give</span>
              </motion.button>
            </div>
            {/* Bottom row: Amplify (full width on mobile) */}
            <div className="flex justify-end">
              <AmplifyButton
                variant="inline"
                content={`${item.author?.name || 'Someone'} just made an impact! ${item.content?.slice(0, 80)}...\n\n#Seedbase`}
                impactSummary={`Impact from ${item.author?.name || 'the network'}`}
              />
            </div>
          </div>
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