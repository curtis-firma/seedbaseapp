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

  // Video duration trimming constants
  const START_TIME = 2.5; // Skip helicopter intro
  const END_TIME_BUFFER = 3; // Cut helicopter at end

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    if (active) {
      el.currentTime = START_TIME;
      const p = el.play();
      if (p) p.catch(() => {});
    } else {
      el.pause();
    }
  }, [active]);

  // Monitor time to cut off before end
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !active) return;

    const handleTimeUpdate = () => {
      if (el.duration && el.currentTime >= el.duration - END_TIME_BUFFER) {
        el.pause();
        onEnded?.();
      }
    };

    el.addEventListener('timeupdate', handleTimeUpdate);
    return () => el.removeEventListener('timeupdate', handleTimeUpdate);
  }, [active, onEnded]);

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
