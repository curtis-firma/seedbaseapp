import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Play, Globe, Sprout } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import seededHypeVideo1 from "@/assets/seeded-hype-1.mp4";
import seededHypeVideo2 from "@/assets/seeded-hype-2.mp4";

type Phase = "playing" | "holding" | "logo";

export function MovementSection() {
  const [phase, setPhase] = useState<Phase>("playing");
  const [isMuted, setIsMuted] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Live stats animation
  const [seedCount, setSeedCount] = useState(12847);
  const [countryCount, setCountryCount] = useState(47);

  const videos = [seededHypeVideo1, seededHypeVideo2];

  // Animate stats during playback
  useEffect(() => {
    if (hasStarted && phase === "playing") {
      const interval = setInterval(() => {
        setSeedCount(prev => prev + Math.floor(Math.random() * 3));
        if (Math.random() > 0.95) {
          setCountryCount(prev => Math.min(prev + 1, 52));
        }
      }, 800);
      return () => clearInterval(interval);
    }
  }, [hasStarted, phase]);

  const handleVideoEnd = () => {
    // If first video ended, play second
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(prev => prev + 1);
      if (videoRef.current) {
        videoRef.current.src = videos[currentVideoIndex + 1];
        videoRef.current.play();
      }
    } else {
      // All videos played, hold then show logo
      setPhase("holding");
      setTimeout(() => {
        setPhase("logo");
      }, 8000);
    }
  };

  const handlePlayClick = () => {
    setHasStarted(true);
    setCurrentVideoIndex(0);
    if (videoRef.current) {
      videoRef.current.src = videos[0];
      videoRef.current.play();
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const restartVideo = () => {
    if (videoRef.current) {
      setCurrentVideoIndex(0);
      videoRef.current.src = videos[0];
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setPhase("playing");
    }
  };

  return (
    <div className="relative w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden bg-black">
      {/* Video Layer */}
      <AnimatePresence>
        {phase !== "logo" && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <video
              ref={videoRef}
              src={videos[0]}
              className="w-full h-full object-cover"
              muted={isMuted}
              playsInline
              onEnded={handleVideoEnd}
            />

            {/* Play Button Overlay (before started) */}
            {!hasStarted && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/40 flex items-center justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePlayClick}
                  className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30"
                >
                  <Play className="w-10 h-10 text-white ml-1" fill="white" />
                </motion.button>
              </motion.div>
            )}

            {/* Mute Toggle */}
            {hasStarted && phase === "playing" && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleMute}
                className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center z-10"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-white" />
                ) : (
                  <Volume2 className="w-5 h-5 text-white" />
                )}
              </motion.button>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

            {/* Live Stats Overlay */}
            {hasStarted && phase === "playing" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-4 left-4 md:bottom-6 md:left-6 flex flex-col gap-2"
              >
                {/* Live Donation Counter */}
                <motion.div 
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/60 backdrop-blur-sm"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  <div className="relative">
                    <Sprout className="w-4 h-4 text-emerald-400" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                  </div>
                  <span className="text-white font-bold text-sm md:text-base">
                    {seedCount.toLocaleString()}
                  </span>
                  <span className="text-white/70 text-xs md:text-sm">seeds planted</span>
                </motion.div>

                {/* Countries Counter */}
                <motion.div 
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/60 backdrop-blur-sm"
                >
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-bold text-sm md:text-base">
                    {countryCount}
                  </span>
                  <span className="text-white/70 text-xs md:text-sm">countries reached</span>
                </motion.div>
              </motion.div>
            )}

            {/* Video Progress Indicator */}
            {hasStarted && phase === "playing" && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2">
                {videos.map((_, idx) => (
                  <div 
                    key={idx}
                    className={`w-8 h-1 rounded-full transition-colors ${
                      idx === currentVideoIndex ? 'bg-white' : 
                      idx < currentVideoIndex ? 'bg-white/60' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logo Reveal Layer */}
      <AnimatePresence>
        {phase === "logo" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#0a0a0a] flex flex-col items-center justify-center px-6"
          >
            {/* Main Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold text-white tracking-widest mb-4"
            >
              SEEDED
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-base md:text-xl text-white/70 text-center mb-12"
            >
              A Global Movement of Radical Generosity
            </motion.p>

            {/* Seedbase Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 blur-2xl bg-primary/30 rounded-full scale-150" />
              <Logo variant="icon" size="xl" forceDark />
            </motion.div>

            {/* Replay Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              whileTap={{ scale: 0.95 }}
              onClick={restartVideo}
              className="mt-8 px-6 py-2 rounded-full border border-white/20 text-white/60 text-sm hover:bg-white/10 transition-colors"
            >
              Watch Again
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
