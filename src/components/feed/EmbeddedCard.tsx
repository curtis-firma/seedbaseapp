import { motion } from 'framer-motion';
import { Quote, Sparkles, Heart, Trophy, Rocket, ArrowRight, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EmbeddedCard as EmbeddedCardType } from '@/types/seedbase';
import { cn } from '@/lib/utils';

interface EmbeddedCardProps {
  card: EmbeddedCardType;
}

export function EmbeddedCard({ card }: EmbeddedCardProps) {
  const navigate = useNavigate();

  switch (card.type) {
    case 'testimony':
      return (
        <div className="mt-3 p-4 bg-seed/5 border border-seed/20 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Quote className="h-4 w-4 text-seed" />
            <span className="text-xs font-semibold text-seed uppercase tracking-wide">Testimony</span>
            {card.missionName && (
              <>
                <span className="text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">{card.missionName}</span>
              </>
            )}
          </div>
          <p className="text-foreground italic leading-relaxed">"{card.content}"</p>
          {card.imageUrl && (
            <div className="mt-3 aspect-video rounded-lg overflow-hidden">
              <img 
                src={card.imageUrl}
                alt="Impact"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}
        </div>
      );

    case 'surplus':
      return (
        <div className="mt-3 p-4 bg-seed/5 border border-seed/20 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-seed" />
            <span className="text-xs font-semibold text-seed uppercase tracking-wide">
              Surplus from your SeedBase
            </span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl font-bold text-seed">+${card.amount?.toLocaleString()}</span>
          </div>
          {card.fromEntity && card.toEntity && (
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-1 bg-seed/10 text-seed rounded-lg font-medium text-xs">
                {card.fromEntity}
              </span>
              <ArrowRight className="h-3 w-3 text-muted-foreground" />
              <span className="px-2 py-1 bg-trust/10 text-trust rounded-lg font-medium text-xs">
                {card.toEntity}
              </span>
            </div>
          )}
        </div>
      );

    case 'recipient':
      return (
        <div className="mt-3 p-4 bg-envoy/5 border border-envoy/20 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="h-4 w-4 text-envoy" />
            <span className="text-xs font-semibold text-envoy uppercase tracking-wide">
              From {card.missionName}
            </span>
          </div>
          <p className="text-foreground leading-relaxed">{card.content}</p>
          {card.imageUrl && (
            <div className="mt-3 aspect-video rounded-lg overflow-hidden">
              <img 
                src={card.imageUrl}
                alt="Recipient"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}
        </div>
      );

    case 'milestone':
      return (
        <div className="mt-3 overflow-hidden rounded-xl border border-base/20">
          {/* Blue banner header */}
          <div className="p-3 gradient-base flex items-center gap-2">
            <Trophy className="h-4 w-4 text-white" />
            <span className="text-sm font-semibold text-white">Milestone Reached!</span>
          </div>
          
          {/* Stats grid */}
          {card.stats && card.stats.length > 0 && (
            <div className="p-4 bg-base/5 grid grid-cols-2 gap-3">
              {card.stats.map((stat, i) => (
                <div key={i} className="text-center p-3 bg-card rounded-lg">
                  <p className="text-lg font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          )}
          
          {/* CTA */}
          <div className="p-3 bg-card border-t border-border/50">
            <button 
              onClick={() => navigate('/app/vault')}
              className="w-full text-sm text-base font-medium hover:underline"
            >
              See dashboard →
            </button>
          </div>
        </div>
      );

    case 'deployment':
      return (
        <div className="mt-3 p-4 bg-trust/5 border border-trust/20 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Rocket className="h-4 w-4 text-trust" />
              <span className="font-semibold">{card.missionName}</span>
            </div>
            {card.badge && (
              <span className="text-xs px-2 py-1 bg-trust/10 text-trust rounded-full font-medium">
                {card.badge}
              </span>
            )}
          </div>
          
          {card.amount && (
            <p className="text-2xl font-bold text-foreground mb-3">
              ${card.amount.toLocaleString()}
            </p>
          )}
          
          {/* Funding progress */}
          {card.fundingProgress !== undefined && (
            <div className="mb-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>{card.fundingProgress}% funded</span>
                {card.fundingGoal && <span>Goal: ${card.fundingGoal.toLocaleString()}</span>}
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${card.fundingProgress}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full gradient-trust rounded-full"
                />
              </div>
            </div>
          )}
          
          {/* Impact metrics */}
          {card.stats && card.stats.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {card.stats.map((stat, i) => (
                <div key={i} className="flex items-center gap-1 px-2 py-1 bg-muted/50 rounded-lg">
                  {stat.icon && <span className="text-sm">{stat.icon}</span>}
                  <span className="text-sm font-medium">{stat.value}</span>
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* View mission button */}
          <div className="mt-3 pt-3 border-t border-border/50">
            <button 
              onClick={() => navigate('/app/seedbase')}
              className="w-full text-sm text-trust font-medium hover:underline"
            >
              View mission →
            </button>
          </div>
        </div>
      );

    case 'stats':
      return (
        <div className="mt-3 p-4 bg-muted/30 rounded-xl border border-border/50">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {card.title || 'Stats'}
            </span>
          </div>
          {card.stats && card.stats.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {card.stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-lg font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      );

    default:
      return null;
  }
}
