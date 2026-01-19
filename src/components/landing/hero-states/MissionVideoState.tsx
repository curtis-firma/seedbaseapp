import { useState } from 'react';
import { motion } from 'framer-motion';
import missionVideo from '@/assets/mission-video.mp4';

const MissionVideoState = () => {
  const [videoError, setVideoError] = useState(false);

  const fallbackImage = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&q=80";

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
          <source src={missionVideo} type="video/mp4" />
        </video>
      ) : (
        <img
          src={fallbackImage}
          alt="Mission impact"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Centered impact statistics */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="mb-2"
          >
            <span className="text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg">
              4,217
            </span>
            <span className="text-xl md:text-2xl lg:text-3xl font-medium text-white/90 ml-2 drop-shadow-lg">
              lives
            </span>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="text-base md:text-lg lg:text-xl text-white/80 font-medium drop-shadow-md"
          >
            impacted across 12 countries
          </motion.p>
        </div>
      </motion.div>

      {/* Centered bottom tagline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 md:bottom-10 lg:bottom-12 left-0 right-0 text-center"
      >
        <p className="text-white/70 font-medium text-xs md:text-sm tracking-wide drop-shadow-lg">
          Real impact. Real people. Real change.
        </p>
      </motion.div>
    </div>
  );
};

export default MissionVideoState;
