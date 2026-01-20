import { useState, useRef, useEffect } from 'react';

const SocialVideoState = () => {
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const fallbackImage = "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80";

  useEffect(() => {
    const timer = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(console.error);
      }
    }, 100);
    return () => clearTimeout(timer);
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
          <source src="/src/assets/social-connection-video.mp4" type="video/mp4" />
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
