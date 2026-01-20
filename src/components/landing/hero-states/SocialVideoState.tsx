import { useState, useRef, useEffect } from 'react';
import socialVideo from '@/assets/social-connection-video.mp4';

type SocialVideoStateProps = { 
  active?: boolean;
  onEnded?: () => void;
};

const SocialVideoState = ({ active = true, onEnded }: SocialVideoStateProps) => {
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const fallbackImage = "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80";

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
          <source src={socialVideo} type="video/mp4" />
        </video>
      ) : (
        <img
          src={fallbackImage}
          alt="Social connection"
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
};

export default SocialVideoState;
