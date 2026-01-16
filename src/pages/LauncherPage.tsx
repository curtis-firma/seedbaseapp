import { motion } from 'framer-motion';
import { Rocket, Layers, DollarSign, ChevronRight, Plus, Target, Shield, Sprout } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { cn } from '@/lib/utils';

const launchOptions = [
  {
    id: 'mission',
    title: 'Launch a Mission',
    description: 'Create and fund a new impact mission',
    icon: Target,
    gradient: 'gradient-envoy',
    requiredKey: 'BaseKey' as const,
  },
  {
    id: 'seedbase',
    title: 'Start a Seedbase',
    description: 'Create a governed pool for impact',
    icon: Layers,
    gradient: 'gradient-trust',
    requiredKey: 'BaseKey' as const,
  },
  {
    id: 'commitment',
    title: 'Make a Commitment',
    description: 'Lock USDC to activate generosity',
    icon: DollarSign,
    gradient: 'gradient-seed',
    requiredKey: 'SeedKey' as const,
  },
];

export default function LauncherPage() {
  const { isKeyActive } = useUser();

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <header className="glass-strong border-b border-border/50">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-base flex items-center justify-center">
              <Rocket className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Launcher</h1>
              <p className="text-sm text-muted-foreground">Create & Deploy</p>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 py-4 space-y-4">
        {/* Launch Options */}
        {launchOptions.map((option, i) => {
          const hasKey = isKeyActive(option.requiredKey);
          const Icon = option.icon;

          return (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={cn(
                "w-full bg-card rounded-2xl border border-border/50 p-5 flex items-center gap-4 text-left",
                !hasKey && "opacity-60"
              )}
            >
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", option.gradient)}>
                <Icon className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{option.title}</h3>
                <p className="text-sm text-muted-foreground">{option.description}</p>
                {!hasKey && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Requires {option.requiredKey}
                  </p>
                )}
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </motion.button>
          );
        })}

        {/* Key Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-muted/30 rounded-2xl p-5"
        >
          <h3 className="font-semibold mb-4">Your Keys</h3>
          <div className="space-y-3">
            {([
              { type: 'SeedKey' as const, icon: Sprout, label: 'SeedKey' },
              { type: 'BaseKey' as const, icon: Shield, label: 'BaseKey' },
              { type: 'MissionKey' as const, icon: Rocket, label: 'MissionKey' },
            ]).map((key) => {
              const active = isKeyActive(key.type);
              return (
                <div key={key.type} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <key.icon className={cn(
                      "h-5 w-5",
                      active ? "text-seed" : "text-muted-foreground"
                    )} />
                    <span className="font-medium">{key.label}</span>
                  </div>
                  <span className={cn(
                    "text-sm font-medium",
                    active ? "text-seed" : "text-muted-foreground"
                  )}>
                    {active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-muted-foreground italic py-4"
        >
          "Activators commit. Trustees steward. Envoys execute."
        </motion.p>
      </div>
    </div>
  );
}
