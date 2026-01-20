import { useState, useRef, useEffect } from 'react';

const AppSharingVideoState = () => {
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const fallbackImage = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80";

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
          <source src="/src/assets/app-sharing-video.mp4" type="video/mp4" />
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
