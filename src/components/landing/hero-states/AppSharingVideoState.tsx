import { useState, useRef, useEffect } from 'react';
import appSharingVideo from '@/assets/app-sharing-video.mp4';

type AppSharingVideoStateProps = { 
  active?: boolean;
  onEnded?: () => void;
};

const AppSharingVideoState = ({ active = true, onEnded }: AppSharingVideoStateProps) => {
  const [videoError, setVideoError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const fallbackImage = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80";

  // Preload video on mount
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const handleCanPlay = () => setIsLoaded(true);
    const handleError = () => setVideoError(true);

    el.addEventListener('canplaythrough', handleCanPlay);
    el.addEventListener('error', handleError);

    el.load();

    return () => {
      el.removeEventListener('canplaythrough', handleCanPlay);
      el.removeEventListener('error', handleError);
    };
  }, []);

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
          <source src={appSharingVideo} type="video/mp4" />
        </video>
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
