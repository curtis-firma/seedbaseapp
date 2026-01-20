import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
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
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 1.08 }}
        transition={{ duration: 7, ease: "linear" }}
        className="absolute inset-0"
      >
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
      </motion.div>
    </div>
  );
};

export default SocialVideoState;
