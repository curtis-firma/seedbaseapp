import { useState, useRef, useEffect } from 'react';
import seededHypeClip from '@/assets/seeded-hype-clip.mp4';

type SeededHypeVideoStateProps = { 
  active?: boolean;
  onEnded?: () => void;
};

const SeededHypeVideoState = ({ active = true, onEnded }: SeededHypeVideoStateProps) => {
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const fallbackImage = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80";

  // Play/pause based on active state - video is pre-trimmed, no skip needed
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    if (active) {
      el.currentTime = 0;
      const p = el.play();
      if (p) p.catch(() => {});
    } else {
      el.pause();
    }
  }, [active]);

  const handleEnded = () => {
    onEnded?.();
  };

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-black">
      {!videoError ? (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          playsInline
          preload="auto"
          onError={() => setVideoError(true)}
          onEnded={handleEnded}
        >
          <source src={seededHypeClip} type="video/mp4" />
        </video>
      ) : (
        <img
          src={fallbackImage}
          alt="Seeded hype"
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
};

export default SeededHypeVideoState;
