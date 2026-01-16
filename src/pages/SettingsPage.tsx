import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, User, Bell, Shield, Palette, 
  HelpCircle, FileText, LogOut, ChevronRight, Moon, Sun
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const settingsGroups = [
  {
    title: 'Account',
    items: [
      { icon: User, label: 'Profile', description: 'Manage your identity' },
      { icon: Bell, label: 'Notifications', description: 'Alerts & updates' },
      { icon: Shield, label: 'Security', description: 'Keys & authentication' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { icon: Palette, label: 'Appearance', description: 'Theme & display', hasToggle: true },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: HelpCircle, label: 'Help Center', description: 'FAQs & guides' },
      { icon: FileText, label: 'Terms & Privacy', description: 'Legal documents' },
    ],
  },
];

export default function SettingsPage() {
  const [isDark, setIsDark] = useState(false);

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <header className="glass-strong border-b border-border/50">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <SettingsIcon className="h-5 w-5 text-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Settings</h1>
              <p className="text-sm text-muted-foreground">Preferences & Account</p>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 py-4 space-y-6">
        {settingsGroups.map((group, groupIndex) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: groupIndex * 0.1 }}
          >
            <h3 className="text-sm font-medium text-muted-foreground mb-2 px-1">
              {group.title}
            </h3>
            <div className="bg-card rounded-2xl border border-border/50 divide-y divide-border/50">
              {group.items.map((item, i) => (
                <motion.button
                  key={item.label}
                  whileTap={{ scale: 0.99 }}
                  className="w-full p-4 flex items-center gap-4 text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  {item.hasToggle ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDark(!isDark);
                        document.documentElement.classList.toggle('dark');
                      }}
                      className={cn(
                        "w-12 h-7 rounded-full p-1 transition-colors",
                        isDark ? "bg-primary" : "bg-muted"
                      )}
                    >
                      <motion.div
                        animate={{ x: isDark ? 20 : 0 }}
                        className="w-5 h-5 rounded-full bg-white shadow-sm flex items-center justify-center"
                      >
                        {isDark ? (
                          <Moon className="h-3 w-3 text-primary" />
                        ) : (
                          <Sun className="h-3 w-3 text-muted-foreground" />
                        )}
                      </motion.div>
                    </button>
                  ) : (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Logout */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileTap={{ scale: 0.99 }}
          className="w-full bg-card rounded-2xl border border-destructive/30 p-4 flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
            <LogOut className="h-5 w-5 text-destructive" />
          </div>
          <span className="font-medium text-destructive">Sign Out</span>
        </motion.button>

        {/* Version */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-muted-foreground py-4"
        >
          Seedbase v2.0.0 • Built with 💚
        </motion.p>
      </div>
    </div>
  );
}
