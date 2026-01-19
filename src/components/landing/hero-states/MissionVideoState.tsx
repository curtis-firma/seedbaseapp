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
    </div>
  );
};

export default MissionVideoState;
