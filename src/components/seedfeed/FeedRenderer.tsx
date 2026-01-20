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
import { TransparencyCard } from '@/components/feed/TransparencyCard';
import { useNavigate } from 'react-router-dom';

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

type CardVariant = 'current' | 'v2-announcement' | 'v2-deployment' | 'v2-impact' | 'v2-milestone' | 'v2-vote' | 'v2-tithing' | 'v2-recipient' | 'v2-transparency';

function getCardVariant(item: FeedItem): CardVariant {
  const hash = hashCode(item.id);
  
  // Transparency cards always use transparency variant
  if (item.postType === 'transparency' || item.type === 'transparency') return 'v2-transparency';
  
  // Use V2 cards for ~40% of items for variety
  if (hash % 5 > 1) return 'current';
  
  // Map post types to V2 variants
  if (item.postType === 'announcement') return 'v2-announcement';
  if (item.postType === 'deployment' || item.postType === 'surplus') return hash % 2 === 0 ? 'v2-deployment' : 'v2-impact';
  if (item.postType === 'milestone' || item.type === 'milestone') return 'v2-milestone';
  if (item.type === 'testimony') return 'v2-recipient';
  // Vote cards - check content for vote-related keywords
  if (item.content?.toLowerCase().includes('vote') || item.title?.toLowerCase().includes('vote')) return 'v2-vote';
  
  return 'current';
}

interface FeedRendererProps {
  items: FeedItem[];
}

export function FeedRenderer({ items }: FeedRendererProps) {
  const navigate = useNavigate();
  
  return (
    <>
      {items.map((item, index) => {
        const variant = getCardVariant(item);
        
        // Current card - use existing FeedCard
        if (variant === 'current') {
          return <FeedCard key={item.id} item={item} index={index} />;
        }

        // V2 cards wrapped in PostCard
        // Fallback avatar using DiceBear for consistent generation
        const getFallbackAvatar = (name: string) => 
          `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=0000ff`;
        
        const author = item.author || {
          name: item.seedbase?.name || 'SeedfeedHQ',
          avatar: getFallbackAvatar(item.seedbase?.name || 'SeedfeedHQ'),
          handle: 'seedfeedhq',
          isVerified: true,
          role: 'trustee',
        };
        
        // Fix emoji avatars - replace with real profile photos
        if (author.avatar && (author.avatar.length <= 4 || !author.avatar.startsWith('http'))) {
          author.avatar = getFallbackAvatar(author.name);
        }

        const isOfficial = author.handle === 'seedfeedhq' || author.name === 'SeedfeedHQ';

        return (
          <PostCard
            key={item.id}
            author={author}
            timestamp={item.timestamp}
            badge={item.roleBadge}
            badgeVariant={item.roleBadge === 'Trustee' ? 'trustee' : item.roleBadge === 'Envoy' ? 'envoy' : 'activator'}
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
            {variant === 'v2-transparency' && (
              <TransparencyCard
                seedbaseName={item.seedbase?.name || 'Seedbase'}
                reportType="quarterly"
                metrics={item.embeddedCard?.stats?.map(s => ({
                  label: String(s.label),
                  value: String(s.value),
                })) || []}
                onView={() => navigate('/app/seedbase')}
              />
            )}
          </PostCard>
        );
      })}
    </>
  );
}

export default FeedRenderer;
