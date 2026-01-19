import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, User, Bell, Shield, Palette, 
  HelpCircle, FileText, LogOut, ChevronRight, Moon, Sun, Play,
  Trash2, Bug, ChevronDown, Camera, Check
} from 'lucide-react';
import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext';
import { clearAllDemoData, getSessionPhone, loadUserByPhone, listUsers, truncateHexId, saveUser, DemoUser } from '@/lib/demoAuth';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [isDark, setIsDark] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { logout, startDemo, isAuthenticated, username, displayName, activeRole, walletDisplayId, keyType, keyDisplayId, demoMode, phoneNumber, avatarUrl, refreshUserData } = useUser();

  const handleResetDemo = () => {
    clearAllDemoData();
    logout();
    toast.success('All demo data cleared. Refresh to start fresh.');
  };

  // Get current user avatar - prioritize avatarUrl from context, then localStorage, then DiceBear
  const getCurrentAvatarUrl = () => {
    if (avatarUrl) return avatarUrl;
    if (phoneNumber) {
      const user = loadUserByPhone(phoneNumber);
      return user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username || 'default'}`;
    }
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${username || 'default'}`;
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image too large. Max 5MB.');
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAvatar = async () => {
    if (!avatarPreview || !phoneNumber) return;
    
    setIsUploadingAvatar(true);
    try {
      // For demo, we store the data URL directly in localStorage
      const user = loadUserByPhone(phoneNumber);
      if (user) {
        user.avatarUrl = avatarPreview;
        saveUser(user);
        // Refresh user data in context to sync avatar everywhere
        refreshUserData();
        toast.success('Profile photo updated!');
        setAvatarFile(null);
        // Keep preview showing new avatar
      }
    } catch (err) {
      toast.error('Failed to update photo');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleCancelAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
      title: 'Demo',
      items: [
        { icon: Play, label: 'Demo Mode', description: 'Replay onboarding experience', isDemoButton: true },
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
        {/* Profile Photo Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border border-border/50 p-6"
        >
          <div className="flex items-center gap-4">
            {/* Avatar Preview with Camera Overlay */}
            <div className="relative">
              <img 
                src={avatarPreview || getCurrentAvatarUrl()} 
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-border"
              />
              <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-primary/90 transition-colors">
                <Camera className="w-4 h-4 text-white" />
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/*" 
                  onChange={handleAvatarChange} 
                  className="hidden" 
                />
              </label>
            </div>
            
            {/* User Info + Save/Cancel */}
            <div className="flex-1">
              <p className="font-semibold text-lg">{displayName || username || 'User'}</p>
              <p className="text-sm text-muted-foreground">@{username || 'username'}</p>
              
              {avatarFile && (
                <div className="flex gap-2 mt-3">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSaveAvatar}
                    disabled={isUploadingAvatar}
                    className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-medium flex items-center gap-2"
                  >
                    {isUploadingAvatar ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    {isUploadingAvatar ? 'Saving...' : 'Save Photo'}
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCancelAvatar}
                    className="px-4 py-2 rounded-xl bg-muted text-sm font-medium"
                  >
                    Cancel
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
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
              {group.items.map((item) => (
                <motion.button
                  key={item.label}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => {
                    if ((item as any).isDemoButton) {
                      startDemo();
                    }
                  }}
                  className="w-full p-4 flex items-center gap-4 text-left"
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    (item as any).isDemoButton ? "bg-primary/10" : "bg-muted"
                  )}>
                    <item.icon className={cn(
                      "h-5 w-5",
                      (item as any).isDemoButton ? "text-primary" : "text-foreground"
                    )} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  {(item as any).hasToggle ? (
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
                  ) : (item as any).isDemoButton ? (
                    <div className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium">
                      Start
                    </div>
                  ) : (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Developer Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-sm font-medium text-muted-foreground mb-2 px-1">
            Developer
          </h3>
          <div className="bg-card rounded-2xl border border-border/50 divide-y divide-border/50">
            {/* Reset Demo Data */}
            <motion.button
              whileTap={{ scale: 0.99 }}
              onClick={handleResetDemo}
              className="w-full p-4 flex items-center gap-4 text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-destructive" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-destructive">Reset Demo Data</p>
                <p className="text-sm text-muted-foreground">Clear all users & transfers</p>
              </div>
            </motion.button>

            {/* Debug Panel Toggle */}
            <motion.button
              whileTap={{ scale: 0.99 }}
              onClick={() => setShowDebug(!showDebug)}
              className="w-full p-4 flex items-center gap-4 text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                <Bug className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Debug Panel</p>
                <p className="text-sm text-muted-foreground">View session & storage state</p>
              </div>
              <ChevronDown className={cn(
                "h-5 w-5 text-muted-foreground transition-transform",
                showDebug && "rotate-180"
              )} />
            </motion.button>

            {/* Debug Panel Content */}
            {showDebug && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 bg-muted/50 font-mono text-xs space-y-2"
              >
                <div className="flex justify-between">
                  <span className="text-muted-foreground">isAuthenticated:</span>
                  <span className={isAuthenticated ? 'text-green-500' : 'text-red-500'}>
                    {String(isAuthenticated)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">demoMode:</span>
                  <span className={demoMode ? 'text-yellow-500' : 'text-muted-foreground'}>
                    {String(demoMode)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span>{phoneNumber || '(none)'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Username:</span>
                  <span>{username ? `@${username}` : '(none)'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Display:</span>
                  <span>{displayName || '(none)'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Role:</span>
                  <span className="text-primary">{activeRole}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Key Type:</span>
                  <span>{keyType || '(none)'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Key ID:</span>
                  <span>{keyDisplayId ? truncateHexId(keyDisplayId) : '(none)'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Wallet ID:</span>
                  <span>{walletDisplayId ? truncateHexId(walletDisplayId) : '(none)'}</span>
                </div>
                <div className="border-t border-border pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">localStorage users:</span>
                    <span>{listUsers().length} registered</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Session phone:</span>
                    <span className="truncate max-w-[150px]">{getSessionPhone() || '(none)'}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Logout */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileTap={{ scale: 0.99 }}
          onClick={logout}
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
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-muted-foreground py-4"
        >
          Seedbase v2.0.0 • Built with 💚
        </motion.p>
      </div>
    </div>
  );
}
