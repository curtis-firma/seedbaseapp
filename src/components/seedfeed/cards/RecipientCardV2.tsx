import { motion } from 'framer-motion';
import { Heart, Quote, MapPin } from 'lucide-react';

interface RecipientCardV2Props {
  name: string;
  location?: string;
  message: string;
  imageUrl?: string;
  missionName?: string;
  className?: string;
}

export function RecipientCardV2({
  name,
  location,
  message,
  imageUrl,
  missionName,
  className = '',
}: RecipientCardV2Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        rounded-xl border border-seed/30 bg-gradient-to-br from-seed/5 to-transparent
        overflow-hidden
        ${className}
      `}
    >
      {/* Image */}
      {imageUrl && (
        <div className="relative aspect-[4/3]">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          
          {/* Quote overlay on image */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <Quote className="w-6 h-6 text-white/80 mb-2" />
            <p className="text-white text-sm italic line-clamp-3">{message}</p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* No image - show quote inline */}
        {!imageUrl && (
          <div className="mb-3">
            <Quote className="w-5 h-5 text-seed mb-2" />
            <p className="text-foreground text-sm italic">{message}</p>
          </div>
        )}

        {/* Attribution */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-seed/20 flex items-center justify-center">
            <Heart className="w-5 h-5 text-seed" />
          </div>
          <div className="flex-1">
            <span className="font-semibold text-foreground block">— {name}</span>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {location}
                </span>
              )}
              {missionName && (
                <span>via {missionName}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default RecipientCardV2;
