import { FeedItem } from '@/types/seedbase';
import { FeedCard } from '@/components/feed/FeedCard';
import { PostCard } from './PostCard';
import { AnnouncementCardV2 } from './cards/AnnouncementCardV2';
import { DeploymentCardV2 } from './cards/DeploymentCardV2';
import { ImpactCardV2 } from './cards/ImpactCardV2';
import { MilestoneCardV2 } from './cards/MilestoneCardV2';
import { VoteCardV2 } from './cards/VoteCardV2';
import { TithingCardV2 } from './cards/TithingCardV2';
import { RecipientCardV2 } from './cards/RecipientCardV2';

// Simple hash function for deterministic variant selection
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

type CardVariant = 'current' | 'v2-announcement' | 'v2-deployment' | 'v2-impact' | 'v2-milestone' | 'v2-vote' | 'v2-tithing' | 'v2-recipient';

function getCardVariant(item: FeedItem): CardVariant {
  const hash = hashCode(item.id);
  
  // Use V2 cards for ~40% of items for variety
  if (hash % 5 > 1) return 'current';
  
  // Map post types to V2 variants
  if (item.postType === 'announcement') return 'v2-announcement';
  if (item.postType === 'deployment' || item.postType === 'surplus') return hash % 2 === 0 ? 'v2-deployment' : 'v2-impact';
  if (item.postType === 'milestone') return 'v2-milestone';
  if (item.type === 'testimony') return 'v2-recipient';
  if (item.postType === 'vote') return 'v2-vote';
  
  return 'current';
}

interface FeedRendererProps {
  items: FeedItem[];
}

export function FeedRenderer({ items }: FeedRendererProps) {
  return (
    <>
      {items.map((item, index) => {
        const variant = getCardVariant(item);
        
        // Current card - use existing FeedCard
        if (variant === 'current') {
          return <FeedCard key={item.id} item={item} index={index} />;
        }

        // V2 cards wrapped in PostCard
        const author = item.author || {
          name: item.seedbase?.name || 'SeedfeedHQ',
          avatar: item.seedbase?.name ? '⛪' : '',
          handle: 'seedfeedhq',
          isVerified: true,
          role: 'trustee',
        };

        const isOfficial = author.handle === 'seedfeedhq' || author.name === 'SeedfeedHQ';

        return (
          <PostCard
            key={item.id}
            author={author}
            timestamp={item.timestamp}
            badge={item.roleBadge}
            badgeVariant={item.roleBadge === 'Steward' ? 'steward' : item.roleBadge === 'Envoy' ? 'envoy' : 'activator'}
            isOfficial={isOfficial}
            commentCount={item.comments}
            likeCount={item.likes}
            totalRaised={item.totalRaised}
            yourSeed={item.yourSeed}
            yourPercentage={item.yourImpactPercentage}
            showImpactFooter={!!item.totalRaised}
            index={index}
          >
            {variant === 'v2-announcement' && (
              <AnnouncementCardV2
                title={item.embeddedCard?.title || item.title || 'Announcement'}
                body={item.content}
                seedbaseName={item.seedbase?.name}
                ctaLink="/app/seedbase"
              />
            )}
            {(variant === 'v2-deployment' || variant === 'v2-impact') && item.embeddedCard && (
              <DeploymentCardV2
                missionName={item.embeddedCard.missionName || item.mission?.name || 'Mission'}
                amount={item.embeddedCard.amount || item.totalRaised || 0}
                yourShare={item.yourSeed}
                yourPercentage={item.yourImpactPercentage}
                imageUrl={item.embeddedCard.imageUrl}
                description={item.content.slice(0, 100)}
              />
            )}
            {variant === 'v2-milestone' && (
              <MilestoneCardV2
                title={item.embeddedCard?.title || 'Milestone Reached'}
                missionName={item.mission?.name || 'Mission'}
                heroValue={item.embeddedCard?.stats?.[0]?.value || '100%'}
                heroLabel={item.embeddedCard?.stats?.[0]?.label || 'Complete'}
                stats={item.embeddedCard?.stats?.slice(1)}
              />
            )}
            {variant === 'v2-vote' && (
              <VoteCardV2
                title={item.embeddedCard?.title || 'Community Vote'}
                description={item.content}
                seedbaseName={item.seedbase?.name || 'Seedbase'}
                yesCount={45}
                noCount={12}
                deadline="3 days left"
              />
            )}
            {variant === 'v2-recipient' && (
              <RecipientCardV2
                name={item.author?.name || 'Recipient'}
                message={item.embeddedCard?.content || item.content}
                imageUrl={item.embeddedCard?.imageUrl}
                missionName={item.mission?.name}
                location="Guatemala"
              />
            )}
          </PostCard>
        );
      })}
    </>
  );
}

export default FeedRenderer;
