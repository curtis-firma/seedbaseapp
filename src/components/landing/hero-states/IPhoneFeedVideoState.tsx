import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Smartphone } from 'lucide-react';

/**
 * IPhoneFeedVideoState - Placeholder for real iPhone feed recording
 * Once you upload the video, update the import path below
 */

// TODO: Replace this with the actual video import once uploaded
// import iphoneFeedVideo from '@/assets/iphone-feed-video.mp4';
const iphoneFeedVideo: string | null = null;

const IPhoneFeedVideoState = () => {
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!iphoneFeedVideo || !videoRef.current) return;
    
    const timer = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(console.error);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Placeholder UI until video is uploaded
  if (!iphoneFeedVideo || videoError) {
    return (
      <div className="relative w-full h-full overflow-hidden bg-black flex items-center justify-center">
        {/* Animated placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Smartphone className="w-16 h-16 text-white/40" />
          </motion.div>
          <p className="text-white/50 text-sm font-medium">iPhone Feed Video</p>
          <p className="text-white/30 text-xs">Upload video to enable</p>
        </motion.div>
        
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <svg className="w-full h-full">
            <pattern id="iphone-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1" fill="white" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#iphone-grid)" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        muted
        loop
        playsInline
        preload="auto"
        onError={() => setVideoError(true)}
      >
        <source src={iphoneFeedVideo} type="video/mp4" />
      </video>
    </div>
  );
};

export default IPhoneFeedVideoState;
