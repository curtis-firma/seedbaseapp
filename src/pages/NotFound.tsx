import { motion } from "framer-motion";
import { Home, ArrowLeft, Compass, Wallet, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/shared/Logo";

const NotFound = () => {
  const navigate = useNavigate();

  const quickLinks = [
    { icon: Home, label: "Home", path: "/app" },
    { icon: Wallet, label: "Wallet", path: "/app/wallet" },
    { icon: Compass, label: "One Accord", path: "/app/oneaccord" },
    { icon: Users, label: "Seeded", path: "/app/seeded" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-background to-muted/30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        {/* Animated Logo */}
        <motion.div
          className="mb-8 flex justify-center"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Logo variant="icon" size="xl" />
        </motion.div>

        {/* 404 Text */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-7xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-foreground mb-3">
            Page Not Found
          </h2>
          <p className="text-muted-foreground mb-8">
            This seed hasn't been planted yet. Let's help you find your way back to the garden.
          </p>
        </motion.div>

        {/* Primary Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 justify-center mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-card border border-border rounded-xl font-medium hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/app")}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
          >
            <Home className="h-4 w-4" />
            Go Home
          </motion.button>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="pt-6 border-t border-border"
        >
          <p className="text-sm text-muted-foreground mb-4">Or jump to:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {quickLinks.map((link) => (
              <motion.button
                key={link.path}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(link.path)}
                className="flex items-center gap-2 px-4 py-2 bg-muted/50 hover:bg-muted rounded-lg text-sm font-medium transition-colors"
              >
                <link.icon className="h-4 w-4 text-primary" />
                {link.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Branding Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <Logo variant="wordmark" size="xs" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
