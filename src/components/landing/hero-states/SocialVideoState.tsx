import { useState } from 'react';
import { motion } from 'framer-motion';
import socialVideo from '@/assets/social-connection-video.mp4';

const SocialVideoState = () => {
  const [videoError, setVideoError] = useState(false);

  const fallbackImage = "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80";

  return (
    <div className="relative w-full h-full overflow-hidden">
      {!videoError ? (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
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
