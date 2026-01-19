import { useState } from 'react';
import { motion } from 'framer-motion';
import socialVideo from '@/assets/social-connection-video.mp4';

const SocialVideoState = () => {
  const [videoError, setVideoError] = useState(false);

  const fallbackImage = "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80";

  return (
    <div className="relative w-full h-full overflow-hidden">
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

      {/* Overlay text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="text-center px-4">
          <motion.p
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg"
          >
            Connect & Share
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.4 }}
            className="text-sm md:text-base lg:text-lg text-white/80 font-medium mt-2 drop-shadow-md"
          >
            Generosity goes further together
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default SocialVideoState;
