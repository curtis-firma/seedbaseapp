import { useState, useRef, useEffect } from 'react';
import socialVideo from '@/assets/social-connection-video.mp4';

const SocialVideoState = () => {
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const fallbackImage = "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80";

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(console.error);
    }
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {!videoError ? (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          loop
          playsInline
          preload="auto"
          onError={() => setVideoError(true)}
        >
          <source src={socialVideo} type="video/mp4" />
        </video>
      ) : (
        <img
          src={fallbackImage}
          alt="Social connection"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
    </div>
  );
};

export default SocialVideoState;
