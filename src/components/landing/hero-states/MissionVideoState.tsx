import { useState, useRef, useEffect } from 'react';
import missionVideo from '@/assets/mission-video.mp4';

type MissionVideoStateProps = { 
  active?: boolean;
  onEnded?: () => void;
};

const MissionVideoState = ({ active = true, onEnded }: MissionVideoStateProps) => {
  const [videoError, setVideoError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const fallbackImage = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&q=80";

  // Preload video on mount
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const handleCanPlay = () => setIsLoaded(true);
    const handleError = () => setVideoError(true);

    el.addEventListener('canplaythrough', handleCanPlay);
    el.addEventListener('error', handleError);

    // Force load on mobile
    el.load();

    return () => {
      el.removeEventListener('canplaythrough', handleCanPlay);
      el.removeEventListener('error', handleError);
    };
  }, []);

  // Play/pause based on active state
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    if (active && isLoaded) {
      el.currentTime = 0;
      const p = el.play();
      if (p) p.catch(() => {});
    } else if (!active) {
      el.pause();
    }
  }, [active, isLoaded]);

  const handleEnded = () => {
    onEnded?.();
  };

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-black">
      {/* Loading spinner - show while video loads */}
      {!isLoaded && !videoError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
      
      {!videoError ? (
        <video
          ref={videoRef}
          className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          muted
          playsInline
          preload="auto"
          onError={() => setVideoError(true)}
          onEnded={handleEnded}
          onCanPlayThrough={() => setIsLoaded(true)}
        >
          <source src={missionVideo} type="video/mp4" />
        </video>
      ) : (
        <img
          src={fallbackImage}
          alt="Mission impact"
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
};

export default MissionVideoState;
