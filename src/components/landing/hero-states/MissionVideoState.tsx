import { useState } from 'react';
import { motion } from 'framer-motion';
import missionVideo from '@/assets/mission-video.mp4';

const MissionVideoState = () => {
  const [videoError, setVideoError] = useState(false);

  // Fallback image if video fails
  const fallbackImage = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&q=80";

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Video or fallback image */}
      {!videoError ? (
        <motion.video
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          onError={() => setVideoError(true)}
        >
          <source src={missionVideo} type="video/mp4" />
        </motion.video>
      ) : (
        <motion.img
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={fallbackImage}
          alt="Mission impact"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Soft gradient vignette overlay to blend with yellow background */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(to top, #FDDE02 0%, transparent 20%),
            linear-gradient(to bottom, #FDDE02 0%, transparent 20%),
            linear-gradient(to left, #FDDE02 0%, transparent 10%),
            linear-gradient(to right, #FDDE02 0%, transparent 10%)
          `
        }}
      />

      {/* Impact statistics overlays */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mb-2"
          >
            <span className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
              4,217
            </span>
            <span className="text-2xl md:text-3xl font-medium text-white/90 ml-2 drop-shadow-lg">
              lives
            </span>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="text-lg md:text-xl text-white/80 font-medium drop-shadow-md"
          >
            impacted across 12 countries
          </motion.p>
        </div>
      </motion.div>

      {/* Subtle bottom tagline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-12 left-0 right-0 text-center"
      >
        <p className="text-white/70 font-medium text-sm tracking-wide drop-shadow-lg">
          Real impact. Real people. Real change.
        </p>
      </motion.div>
    </div>
  );
};

export default MissionVideoState;
