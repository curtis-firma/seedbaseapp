import { useState, useRef, useEffect } from 'react';
import appSharingVideo from '@/assets/app-sharing-video.mp4';

const AppSharingVideoState = () => {
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const fallbackImage = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80";

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
          <source src={appSharingVideo} type="video/mp4" />
        </video>
      ) : (
        <img
          src={fallbackImage}
          alt="App sharing"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
    </div>
  );
};

export default AppSharingVideoState;
