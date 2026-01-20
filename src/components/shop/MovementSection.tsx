import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Play, Globe, Sprout, Maximize, Minimize } from "lucide-react";
import seededHypeVideo from "@/assets/seeded-hype-full.mp4";
import seededLogoWhite from "@/assets/seeded-logo-white.png";
import seedbaseWordmarkWhite from "@/assets/seedbase-wordmark-white.png";

type Phase = "playing" | "holding" | "logo";

export function MovementSection() {
  const [phase, setPhase] = useState<Phase>("playing");
  const [isMuted, setIsMuted] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Live stats animation
  const [seedCount, setSeedCount] = useState(12847);
  const [countryCount, setCountryCount] = useState(47);

  // Intersection Observer for autoplay
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            setIsInView(true);
          } else {
            setIsInView(false);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Autoplay when in view
  useEffect(() => {
    if (isInView && !hasStarted && videoRef.current) {
      setHasStarted(true);
      videoRef.current.play().catch(console.error);
    }
  }, [isInView, hasStarted]);

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

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const handleVideoEnd = () => {
    setPhase("holding");
    setTimeout(() => {
      setPhase("logo");
    }, 8000);
  };

  const handlePlayClick = () => {
    setHasStarted(true);
    if (videoRef.current) {
      videoRef.current.play().catch(console.error);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  };

  const restartVideo = () => {
    setHasStarted(true);
    setPhase("playing");
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(console.error);
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full rounded-2xl overflow-hidden bg-black ${
        isFullscreen ? "aspect-video" : "aspect-video md:aspect-[21/9]"
      }`}
    >
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
              src={seededHypeVideo}
              className="w-full h-full object-cover"
              muted={isMuted}
              playsInline
              preload="auto"
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

            {/* Controls Row */}
            {hasStarted && phase === "playing" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute bottom-4 right-4 flex items-center gap-2 z-10"
              >
                {/* Mute Toggle */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleMute}
                  className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-white" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-white" />
                  )}
                </motion.button>

                {/* Fullscreen Toggle */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleFullscreen}
                  className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center"
                >
                  {isFullscreen ? (
                    <Minimize className="w-5 h-5 text-white" />
                  ) : (
                    <Maximize className="w-5 h-5 text-white" />
                  )}
                </motion.button>
              </motion.div>
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

                <motion.div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/60 backdrop-blur-sm">
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-bold text-sm md:text-base">
                    {countryCount}
                  </span>
                  <span className="text-white/70 text-xs md:text-sm">countries reached</span>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logo Reveal Layer - Black Background */}
      <AnimatePresence>
        {phase === "logo" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 bg-black flex flex-col items-center justify-center px-6"
          >
            <motion.img
              src={seededLogoWhite}
              alt="SEEDED"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="h-12 md:h-16 lg:h-20 object-contain mb-4"
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-base md:text-xl text-white/70 text-center mb-12 font-medium"
            >
              A Global Movement of Radical Generosity
            </motion.p>

            <motion.img
              src={seedbaseWordmarkWhite}
              alt="Seedbase"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
              className="h-8 md:h-10 lg:h-12 object-contain"
            />

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
