import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoCardV2Props {
  videoUrl: string;
  title?: string;
  description?: string;
  posterUrl?: string;
  missionName?: string;
  className?: string;
}

export function VideoCardV2({
  videoUrl,
  title,
  description,
  posterUrl,
  missionName,
  className,
}: VideoCardV2Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const handleTogglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className={cn("rounded-xl overflow-hidden bg-muted/30", className)}>
      {/* Video Container */}
      <div className="relative aspect-video bg-black/10">
        <video
          ref={videoRef}
          src={videoUrl}
          poster={posterUrl}
          muted={isMuted}
          playsInline
          loop
          onClick={handleTogglePlay}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="w-full h-full object-cover cursor-pointer"
        />
        
        {/* Play Overlay */}
        {!isPlaying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-black/30"
            onClick={handleTogglePlay}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg cursor-pointer"
            >
              <Play className="h-8 w-8 text-primary ml-1" />
            </motion.div>
          </motion.div>
        )}
        
        {/* Mute/Unmute Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleToggleMute}
          className="absolute bottom-3 right-3 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        >
          {isMuted ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </motion.button>
        
        {/* Mission Tag */}
        {missionName && (
          <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-primary/90 text-white text-xs font-medium">
            {missionName}
          </div>
        )}
      </div>
      
      {/* Title & Description */}
      {(title || description) && (
        <div className="p-3">
          {title && (
            <h4 className="font-semibold text-sm mb-1">{title}</h4>
          )}
          {description && (
            <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default VideoCardV2;
