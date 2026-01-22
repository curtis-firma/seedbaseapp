import { useState, useRef, useEffect } from 'react';

type MissionVideoStateProps = { 
  active?: boolean;
  onEnded?: () => void;
};

const MissionVideoState = ({ active = true, onEnded }: MissionVideoStateProps) => {
  const [videoError, setVideoError] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const fallbackImage = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&q=80";

  // Lazy load video source only when active
  useEffect(() => {
    if (active && !videoSrc) {
      import('@/assets/mission-video.mp4').then((module) => {
        setVideoSrc(module.default);
      });
    }
  }, [active, videoSrc]);

  // Play/pause based on active state (prevents hidden videos from consuming resources)
  useEffect(() => {
    if (!videoSrc) return;
    
    const timer = setTimeout(() => {
      const el = videoRef.current;
      if (!el) return;

      if (active) {
        el.currentTime = 0;
        const p = el.play();
        if (p) p.catch(() => {});
      } else {
        el.pause();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [active, videoSrc]);

  const handleEnded = () => {
    onEnded?.();
  };

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-black">
      {!videoError && videoSrc ? (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          playsInline
          preload="metadata"
          onError={() => setVideoError(true)}
          onEnded={handleEnded}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : !videoSrc && active ? (
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
