import { useState, useRef, useEffect } from 'react';
import missionVideo from '@/assets/mission-video.mp4';

type MissionVideoStateProps = { 
  active?: boolean;
  onEnded?: () => void;
};

const MissionVideoState = ({ active = true, onEnded }: MissionVideoStateProps) => {
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const fallbackImage = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&q=80";

  // Play/pause based on active state (prevents hidden videos from consuming resources)
  useEffect(() => {
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
