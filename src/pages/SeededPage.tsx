import { motion } from 'framer-motion';
import { Radio, Play, ShoppingBag, Users, ExternalLink, Headphones } from 'lucide-react';

export default function SeededPage() {
  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <header className="glass-strong border-b border-border/50">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-seed flex items-center justify-center">
              <Radio className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Seeded</h1>
              <p className="text-sm text-muted-foreground">Community & Culture</p>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 py-4 space-y-4">
        {/* Podcast Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border border-border/50 overflow-hidden"
        >
          <div className="aspect-video bg-gradient-to-br from-seed to-seed-glow flex items-center justify-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
            >
              <Play className="h-8 w-8 text-white ml-1" />
            </motion.button>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <Headphones className="h-4 w-4 text-seed" />
              <span className="text-sm font-medium text-seed">Latest Episode</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">The Economics of Generosity</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Exploring how commitment creates capacity and why locked value generates living impact.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Episode 42</span>
              <span>•</span>
              <span>45 min</span>
              <span>•</span>
              <span>2 days ago</span>
            </div>
          </div>
        </motion.div>

        {/* Community Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3"
        >
          {[
            { label: 'Members', value: '2.4K', icon: Users },
            { label: 'Episodes', value: '42', icon: Headphones },
            { label: 'Products', value: '8', icon: ShoppingBag },
          ].map((stat, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border/50 p-4 text-center">
              <stat.icon className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
              <p className="text-xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Shop Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="font-semibold text-lg mb-3">Shop</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'Seed Tee', price: 35, emoji: '👕' },
              { name: 'Impact Cap', price: 28, emoji: '🧢' },
              { name: 'Grow Hoodie', price: 65, emoji: '🧥' },
              { name: 'Seed Mug', price: 18, emoji: '☕' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="bg-card rounded-2xl border border-border/50 p-4"
              >
                <div className="text-4xl mb-3">{item.emoji}</div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">${item.price}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Join Community */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-primary to-base-glow rounded-2xl p-5 text-white"
        >
          <h3 className="font-semibold text-lg mb-2">Join the Community</h3>
          <p className="text-white/80 text-sm mb-4">
            Connect with other Activators, Trustees, and Envoys building a better world.
          </p>
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-3 bg-white/20 backdrop-blur-sm rounded-xl font-medium"
          >
            <ExternalLink className="h-4 w-4" />
            Join Discord
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
