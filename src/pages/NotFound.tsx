import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="text-8xl mb-6">🌱</div>
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">
          This seed hasn't been planted yet. Let's get you back on track.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-muted rounded-xl font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 px-6 py-3 gradient-base rounded-xl text-white font-medium"
          >
            <Home className="h-4 w-4" />
            Home
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
