import { useState, useRef, useEffect } from 'react';

type AppSharingVideoStateProps = { 
  active?: boolean;
  onEnded?: () => void;
};

const AppSharingVideoState = ({ active = true, onEnded }: AppSharingVideoStateProps) => {
  const [videoError, setVideoError] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const fallbackImage = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80";

  // Lazy load video source only when active
  useEffect(() => {
    if (active && !videoSrc) {
      import('@/assets/app-sharing-video.mp4').then((module) => {
        setVideoSrc(module.default);
      });
    }
  }, [active, videoSrc]);

  useEffect(() => {
    if (!videoSrc) return;
    
    const el = videoRef.current;
    if (!el) return;

    if (active) {
      el.currentTime = 0;
      const p = el.play();
      if (p) p.catch(() => {});
    } else {
      el.pause();
    }
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
          alt="App sharing"
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
};

export default AppSharingVideoState;
