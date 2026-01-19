import { useState } from 'react';
import { motion } from 'framer-motion';

const MissionVideoState = () => {
  const [videoError, setVideoError] = useState(false);

  // Bright, sunny stock video of community/missions
  const videoUrl = "https://videos.pexels.com/video-files/5532767/5532767-uhd_2560_1440_25fps.mp4";
  const fallbackImage = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&q=80";

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Video or fallback image */}
      {!videoError ? (
        <motion.video
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          onError={() => setVideoError(true)}
        >
          <source src={videoUrl} type="video/mp4" />
        </motion.video>
      ) : (
        <motion.img
          initial={{ opacity: 0, scale: 1.1 }}
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
            linear-gradient(to top, #FDDE02 0%, transparent 15%),
            linear-gradient(to bottom, #FDDE02 0%, transparent 15%),
            linear-gradient(to left, #FDDE02 0%, transparent 8%),
            linear-gradient(to right, #FDDE02 0%, transparent 8%)
          `
        }}
      />

      {/* Subtle text overlay */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="absolute bottom-8 left-8 right-8 text-center"
      >
        <p className="text-white/90 font-semibold text-lg drop-shadow-lg">
          Real impact. Real people. Real change.
        </p>
      </motion.div>
    </div>
  );
};

export default MissionVideoState;
