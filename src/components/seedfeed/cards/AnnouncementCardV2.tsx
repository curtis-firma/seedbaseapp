import { motion } from 'framer-motion';
import { Megaphone, Bell, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import seedbaseIcon from '@/assets/seeddroplogo_lightmode.png';

interface AnnouncementCardV2Props {
  title: string;
  body: string;
  isNew?: boolean;
  ctaText?: string;
  ctaLink?: string;
  variant?: 'launch' | 'update' | 'feature';
  seedbaseName?: string;
  className?: string;
}

export function AnnouncementCardV2({
  title,
  body,
  isNew = true,
  ctaText = 'Learn More',
  ctaLink,
  variant = 'update',
  seedbaseName,
  className = '',
}: AnnouncementCardV2Props) {
  const navigate = useNavigate();

  const iconMap = {
    launch: <Sparkles className="w-5 h-5 text-primary" />,
    update: <Megaphone className="w-5 h-5 text-primary" />,
    feature: <Bell className="w-5 h-5 text-primary" />,
  };

  const handleCta = () => {
    if (ctaLink) {
      if (ctaLink.startsWith('http')) {
        window.open(ctaLink, '_blank');
      } else {
        navigate(ctaLink);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        rounded-xl border border-primary/20 bg-primary/5
        overflow-hidden
        ${className}
      `}
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-primary/10">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          {iconMap[variant]}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">{title}</span>
            {isNew && (
              <span className="px-1.5 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded">
                NEW
              </span>
            )}
          </div>
          {seedbaseName && (
            <span className="text-xs text-muted-foreground">{seedbaseName}</span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
      </div>

      {/* CTA */}
      {ctaLink && (
        <div className="px-4 pb-4">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleCta}
            className="
              w-full flex items-center justify-center gap-2
              py-2.5 px-4 rounded-xl
              bg-primary text-primary-foreground
              font-medium text-sm
              hover:bg-primary/90 transition-colors
            "
          >
            {ctaText}
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}

export default AnnouncementCardV2;
