import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Play } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import seededHypeVideo from "@/assets/seeded-hype-1.mp4";

type Phase = "playing" | "holding" | "logo";

export function MovementSection() {
  const [phase, setPhase] = useState<Phase>("playing");
  const [isMuted, setIsMuted] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoEnd = () => {
    setPhase("holding");
    // Hold for 8 seconds then fade to logo
    setTimeout(() => {
      setPhase("logo");
    }, 8000);
  };

  const handlePlayClick = () => {
    setHasStarted(true);
    videoRef.current?.play();
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const restartVideo = () => {
    if (videoRef.current) {
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
            animate={{ opacity: phase === "holding" ? 1 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <video
              ref={videoRef}
              src={seededHypeVideo}
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
                className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-white" />
                ) : (
                  <Volume2 className="w-5 h-5 text-white" />
                )}
              </motion.button>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
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

      {/* Stats Overlay (during playing) */}
      {hasStarted && phase === "playing" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-4 left-4 md:bottom-6 md:left-6"
        >
          <p className="text-white/90 text-xs md:text-sm font-medium">
            12,000+ seeds planted • 47 countries
          </p>
        </motion.div>
      )}
    </div>
  );
}
