import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Maximize, Minimize } from "lucide-react";
import seededHype1 from "@/assets/seeded-hype-1.mp4";
import seededHype2 from "@/assets/seeded-hype-2.mp4";
import parachuteImage from "@/assets/parachute-seeded.jpg";
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
  "intro-text": 2500,
  "hype2-energy": 2500,
  "parachute": 3000,
  "hype1-action": 4000,
  "call-to-action": 2000,
  "brand-lockup": 3000,
  "power-cut": 1500
};

const INTRO_WORDS = ["DO", "YOU", "WANT", "TO", "LIVE?"];

export function MovementSection() {
  const [scene, setScene] = useState<Scene>("intro-text");
  const [hasStarted, setHasStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [showRestart, setShowRestart] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const hype1Ref = useRef<HTMLVideoElement>(null);
  const hype2Ref = useRef<HTMLVideoElement>(null);

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
        <video
          ref={hype2Ref}
          src={seededHype2}
          className="w-full h-full object-cover"
          muted={isMuted}
          playsInline
          loop
        />
        <div className="absolute inset-0 bg-black/30" />
        <motion.div 
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.span 
            className="text-white text-3xl md:text-5xl font-black tracking-tight"
            animate={{ opacity: [0, 1, 0.3, 1, 0.3, 1] }}
            transition={{ duration: 2, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }}
          >
            A LIFESTYLE
          </motion.span>
          <motion.span 
            className="text-white text-2xl md:text-4xl font-bold tracking-tight mt-2"
            animate={{ opacity: [0, 1, 0.3, 1, 0.3, 1] }}
            transition={{ duration: 2, delay: 0.3, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }}
          >
            OF RADICAL GENEROSITY
          </motion.span>
        </motion.div>
      </div>

      <div className={`absolute inset-0 ${scene === "hype1-action" ? "block" : "hidden"}`}>
        <video
          ref={hype1Ref}
          src={seededHype1}
          className="w-full h-full object-cover"
          muted={isMuted}
          playsInline
        />
        <div className="absolute inset-0 bg-black/20" />
        <motion.div 
          className="absolute bottom-8 left-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2 }}
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

        {/* SCENE 3: Parachute Shot */}
        {scene === "parachute" && (
          <motion.div
            key="parachute"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="absolute inset-0"
          >
            <img 
              src={parachuteImage} 
              alt="Parachute"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                delay: 0.3,
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
            >
              <span className="text-white text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter drop-shadow-2xl">
                SEEDED
              </span>
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
            transition={{ duration: 0.1 }}
            className="absolute inset-0 bg-black flex items-center justify-center"
          >
            <motion.span 
              className="text-white text-4xl md:text-6xl font-bold tracking-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
            >
              JOIN US
            </motion.span>
          </motion.div>
        )}

        {/* SCENE 6: Brand Lockup */}
        {scene === "brand-lockup" && (
          <motion.div
            key="brand"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
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
              className="text-xl md:text-2xl text-white/80 text-center font-medium tracking-wide"
            >
              RADICAL GENEROSITY
            </motion.p>
            <motion.img
              src={seedbaseWordmarkWhite}
              alt="Seedbase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 1, duration: 1 }}
              className="h-6 md:h-8 object-contain mt-8"
            />
          </motion.div>
        )}

        {/* SCENE 7: Power Cut */}
        {scene === "power-cut" && (
          <motion.div
            key="power-cut"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black"
          >
            {showRestart && (
              <motion.div 
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={restartSequence}
                  className="px-6 py-2 rounded-full border border-white/20 text-white/60 text-sm hover:bg-white/10 transition-colors"
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
