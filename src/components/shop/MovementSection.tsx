import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Maximize, Minimize } from "lucide-react";
import seededHype1 from "@/assets/seeded-hype-1.mp4";
import seededHype2 from "@/assets/seeded-hype-2.mp4";
import parachuteVideo from "@/assets/parachute-video.mp4";
import seededLogoWhite from "@/assets/seeded-logo-white.png";
import seedbaseWordmarkWhite from "@/assets/seedbase-wordmark-white.png";

type Scene = 
  | "intro-text"
  | "hype2-energy"
  | "parachute"
  | "hype1-action"
  | "call-to-action"
  | "brand-lockup"
  | "power-cut";

const SCENE_ORDER: Scene[] = [
  "intro-text",
  "hype2-energy", 
  "parachute",
  "hype1-action",
  "call-to-action",
  "brand-lockup",
  "power-cut"
];

const SCENE_TIMINGS: Record<Scene, number> = {
  "intro-text": 3000,      // Longer intro build-up
  "hype2-energy": 4500,    // Extended video hold
  "parachute": 3500,       // Longer parachute moment
  "hype1-action": 6000,    // Extended action clip
  "call-to-action": 2500,  // Slightly longer CTA
  "brand-lockup": 5000,    // Much longer brand hold
  "power-cut": 3000        // Longer ending fade
};

const INTRO_WORDS = ["DO", "YOU", "WANT", "TO", "LIVE?"];

export function MovementSection() {
  const [scene, setScene] = useState<Scene>("intro-text");
  const [hasStarted, setHasStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [showRestart, setShowRestart] = useState(false);
  const [videosLoading, setVideosLoading] = useState({ hype1: true, hype2: true, parachute: true });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const hype1Ref = useRef<HTMLVideoElement>(null);
  const hype2Ref = useRef<HTMLVideoElement>(null);
  const parachuteRef = useRef<HTMLVideoElement>(null);

  // Intersection Observer for autoplay
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            setIsInView(true);
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

  // Auto-start when in view
  useEffect(() => {
    if (isInView && !hasStarted) {
      setHasStarted(true);
    }
  }, [isInView, hasStarted]);

  // Scene timing engine
  useEffect(() => {
    if (!hasStarted) return;

    const currentIndex = SCENE_ORDER.indexOf(scene);
    const duration = SCENE_TIMINGS[scene];

    const timeout = setTimeout(() => {
      if (currentIndex < SCENE_ORDER.length - 1) {
        setScene(SCENE_ORDER[currentIndex + 1]);
      } else {
        // Sequence complete
        setShowRestart(true);
      }
    }, duration);

    return () => clearTimeout(timeout);
  }, [scene, hasStarted]);

  // Control videos based on scene - with longer delay for DOM mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (scene === "hype2-energy" && hype2Ref.current) {
        hype2Ref.current.currentTime = 0;
        hype2Ref.current.muted = isMuted;
        hype2Ref.current.play().catch(console.error);
      }

      if (scene === "hype1-action" && hype1Ref.current) {
        hype1Ref.current.currentTime = 0;
        hype1Ref.current.muted = isMuted;
        hype1Ref.current.play().catch(console.error);
      }

      if (scene === "parachute" && parachuteRef.current) {
        parachuteRef.current.currentTime = 0;
        parachuteRef.current.muted = isMuted;
        // Removed slow-motion playbackRate as it causes glitches in some browsers
        parachuteRef.current.play().catch(console.error);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [scene, isMuted]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (hype1Ref.current) hype1Ref.current.muted = newMuted;
    if (hype2Ref.current) hype2Ref.current.muted = newMuted;
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

  const restartSequence = () => {
    setScene("intro-text");
    setShowRestart(false);
    setHasStarted(true);
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full rounded-2xl overflow-hidden bg-black ${
        isFullscreen ? "aspect-video" : "aspect-video md:aspect-[21/9]"
      }`}
    >
      {/* Always-mounted videos - hidden when not active */}
      <div className={`absolute inset-0 ${scene === "hype2-energy" ? "block" : "hidden"}`}>
        {/* Loading skeleton for hype2 */}
        {videosLoading.hype2 && (
          <div className="absolute inset-0 bg-black flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span className="text-white/50 text-sm">Loading...</span>
            </div>
          </div>
        )}
        <video
          ref={hype2Ref}
          src={seededHype2}
          className="w-full h-full object-cover"
          muted={isMuted}
          playsInline
          loop
          onCanPlay={() => setVideosLoading(prev => ({ ...prev, hype2: false }))}
        />
        <div className="absolute inset-0 bg-black/30" />
        <motion.div 
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.span 
            className="text-white text-3xl md:text-5xl font-black tracking-tight"
            animate={{ opacity: [0, 1, 0.4, 1, 0.4, 1] }}
            transition={{ duration: 3, times: [0, 0.15, 0.35, 0.55, 0.75, 1] }}
          >
            A LIFESTYLE
          </motion.span>
          <motion.span 
            className="text-white text-2xl md:text-4xl font-bold tracking-tight mt-2"
            animate={{ opacity: [0, 1, 0.4, 1, 0.4, 1] }}
            transition={{ duration: 3, delay: 0.4, times: [0, 0.15, 0.35, 0.55, 0.75, 1] }}
          >
            OF RADICAL GENEROSITY
          </motion.span>
        </motion.div>
      </div>

      <div className={`absolute inset-0 ${scene === "hype1-action" ? "block" : "hidden"}`}>
        {/* Loading skeleton for hype1 */}
        {videosLoading.hype1 && (
          <div className="absolute inset-0 bg-black flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span className="text-white/50 text-sm">Loading...</span>
            </div>
          </div>
        )}
        <video
          ref={hype1Ref}
          src={seededHype1}
          className="w-full h-full object-cover"
          muted={isMuted}
          playsInline
          onCanPlay={() => setVideosLoading(prev => ({ ...prev, hype1: false }))}
        />
        <div className="absolute inset-0 bg-black/20" />
        <motion.div 
          className="absolute bottom-8 left-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2.5 }}
        >
          <span className="text-white text-xl md:text-2xl font-bold tracking-wide opacity-90">
            THIS IS REAL
          </span>
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {/* SCENE 1: Intro Text - "DO YOU WANT TO LIVE?" */}
        {scene === "intro-text" && hasStarted && (
          <motion.div
            key="intro-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="absolute inset-0 bg-black flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-1">
              {INTRO_WORDS.map((word, index) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    delay: index * 0.35,
                    duration: 0.15,
                    ease: "easeOut"
                  }}
                  className="text-white text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter"
                >
                  {word}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        {/* SCENE 3: Parachute Video */}
        {scene === "parachute" && (
          <motion.div
            key="parachute"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
          >
            {/* Loading skeleton for parachute */}
            {videosLoading.parachute && (
              <div className="absolute inset-0 bg-black flex items-center justify-center z-10">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span className="text-white/50 text-sm">Loading...</span>
                </div>
              </div>
            )}
            <video
              ref={parachuteRef}
              src={parachuteVideo}
              className="w-full h-full object-cover"
              muted={isMuted}
              playsInline
              onCanPlay={() => setVideosLoading(prev => ({ ...prev, parachute: false }))}
            />
            <div className="absolute inset-0 bg-black/40" />
            {/* Seeded logo descending like a parachute from top */}
            <motion.div 
              className="absolute inset-0 flex flex-col items-center justify-center"
              initial={{ y: -200, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ 
                delay: 0.3,
                duration: 1.5,
                ease: [0.25, 0.46, 0.45, 0.94] // Smooth easing like floating down
              }}
            >
              <motion.img
                src={seededLogoWhite}
                alt="SEEDED"
                className="h-20 md:h-32 lg:h-40 object-contain drop-shadow-2xl"
                animate={{ y: [0, -8, 0] }}
                transition={{ 
                  delay: 1.8,
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </motion.div>
        )}

        {/* SCENE 5: Call to Action */}
        {scene === "call-to-action" && (
          <motion.div
            key="cta"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black flex items-center justify-center"
          >
            <motion.span 
              className="text-white text-4xl md:text-6xl font-bold tracking-tight"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              JOIN US
            </motion.span>
          </motion.div>
        )}

        {/* SCENE 6: Brand Lockup - Extended */}
        {scene === "brand-lockup" && (
          <motion.div
            key="brand"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-black flex flex-col items-center justify-center px-6"
          >
            <motion.img
              src={seededLogoWhite}
              alt="SEEDED"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
              className="h-14 md:h-20 lg:h-24 object-contain mb-6"
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="text-xl md:text-3xl text-white/90 text-center font-medium tracking-wide"
            >
              RADICAL GENEROSITY
            </motion.p>
            <motion.img
              src={seedbaseWordmarkWhite}
              alt="Seedbase"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.7, y: 0 }}
              transition={{ delay: 1.5, duration: 1.2 }}
              className="h-6 md:h-10 object-contain mt-10"
            />
          </motion.div>
        )}

        {/* SCENE 7: Power Cut - Graceful Ending */}
        {scene === "power-cut" && (
          <motion.div
            key="power-cut"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-black"
          >
            {showRestart && (
              <motion.div 
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={restartSequence}
                  className="px-8 py-3 rounded-full border border-white/30 text-white/80 text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  Watch Again
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Pre-start state */}
        {!hasStarted && (
          <motion.div
            key="prestart"
            className="absolute inset-0 bg-black flex items-center justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setHasStarted(true)}
              className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30"
            >
              <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-1" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls - show during video scenes */}
      {hasStarted && (scene === "hype1-action" || scene === "hype2-energy") && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-4 right-4 flex items-center gap-2 z-10"
        >
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
    </div>
  );
}
