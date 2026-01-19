import { useState } from 'react';
import { motion } from 'framer-motion';
import socialVideo from '@/assets/social-connection-video.mp4';

const SocialVideoState = () => {
  const [videoError, setVideoError] = useState(false);

  // Fallback image if video fails
  const fallbackImage = "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80";

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Video or fallback image - crisp edges, no overlay */}
      {!videoError ? (
        <motion.video
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          onError={() => setVideoError(true)}
        >
          <source src={socialVideo} type="video/mp4" />
        </motion.video>
      ) : (
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          src={fallbackImage}
          alt="Social connection"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Minimal text overlay */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="absolute bottom-8 md:bottom-10 lg:bottom-12 left-0 right-0 text-center"
      >
        <p className="text-white font-semibold text-lg md:text-xl lg:text-2xl drop-shadow-lg">
          Connect. Share. Grow.
        </p>
      </motion.div>
    </div>
  );
};

export default SocialVideoState;
