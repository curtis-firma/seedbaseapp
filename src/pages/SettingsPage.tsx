import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, User, Bell, Shield, Palette, 
  HelpCircle, FileText, LogOut, ChevronRight, Moon, Sun, Play,
  Trash2, Bug, ChevronDown, Camera, Check, Edit, X
} from 'lucide-react';
import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext';
import { clearAllDemoData, getSessionPhone, listUsers, truncateHexId } from '@/lib/demoAuth';
import { uploadAvatar, updateUser, findUserByPhone, isUsernameTaken } from '@/lib/supabase/demoApi';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';

export default function SettingsPage() {
  const [isDark, setIsDark] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { logout, startDemo, isAuthenticated, username, displayName, activeRole, walletDisplayId, keyType, keyDisplayId, demoMode, phoneNumber, avatarUrl, refreshUserData } = useUser();
  
  // Profile editing state
  const [editingProfile, setEditingProfile] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);

  const handleResetDemo = () => {
    clearAllDemoData();
    logout();
    toast.success('All demo data cleared. Refresh to start fresh.');
  };

  // Get current user avatar - prioritize avatarUrl from context, then DiceBear
  const getCurrentAvatarUrl = () => {
    if (avatarUrl) return avatarUrl;
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
    if (!avatarFile || !phoneNumber) return;
    
    setIsUploadingAvatar(true);
    try {
      // Find the user in the database
      const user = await findUserByPhone(phoneNumber);
      if (!user) {
        toast.error('User not found');
        return;
      }
      
      // Upload to Supabase Storage
      const publicUrl = await uploadAvatar(user.id, avatarFile);
      if (!publicUrl) {
        toast.error('Failed to upload photo');
        return;
      }
      
      // Update user's avatar_url in database
      const updated = await updateUser(user.id, { avatar_url: publicUrl });
      if (updated) {
        // Refresh user data in context to sync avatar everywhere
        refreshUserData();
        toast.success('Profile photo updated!');
        setAvatarFile(null);
        setAvatarPreview(null);
      } else {
        toast.error('Failed to update profile');
      }
    } catch (err) {
      console.error('Avatar upload error:', err);
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

  // Profile editing handlers
  const handleEditProfile = () => {
    setNewDisplayName(displayName || '');
    setNewUsername(username || '');
    setUsernameError(null);
    setEditingProfile(true);
  };

  const handleCancelEdit = () => {
    setEditingProfile(false);
    setNewDisplayName('');
    setNewUsername('');
    setUsernameError(null);
  };

  const handleSaveProfile = async () => {
    if (!phoneNumber) return;
    
    // Validate username
    const trimmedUsername = newUsername.trim().toLowerCase();
    if (trimmedUsername.length < 3 || trimmedUsername.length > 20) {
      setUsernameError('Username must be 3-20 characters');
      return;
    }
    if (!/^[a-z0-9_]+$/.test(trimmedUsername)) {
      setUsernameError('Only letters, numbers, and underscores allowed');
      return;
    }
    
    setIsSavingProfile(true);
    setUsernameError(null);
    
    try {
      const user = await findUserByPhone(phoneNumber);
      if (!user) {
        toast.error('User not found');
        return;
      }
      
      // Check if username is taken (if changed)
      if (trimmedUsername !== username?.toLowerCase()) {
        const taken = await isUsernameTaken(trimmedUsername, user.id);
        if (taken) {
          setUsernameError('Username already taken');
          setIsSavingProfile(false);
          return;
        }
      }
      
      // Update user
      const updated = await updateUser(user.id, {
        username: trimmedUsername,
        display_name: newDisplayName.trim() || trimmedUsername,
      });
      
      if (updated) {
        refreshUserData();
        toast.success('Profile updated!');
        setEditingProfile(false);
      } else {
        toast.error('Failed to update profile');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      toast.error('Failed to update profile');
    } finally {
      setIsSavingProfile(false);
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
            
            {/* User Info + Edit/Save/Cancel */}
            <div className="flex-1">
              {editingProfile ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Display Name</label>
                    <Input
                      value={newDisplayName}
                      onChange={(e) => setNewDisplayName(e.target.value)}
                      placeholder="Display name"
                      className="h-9"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Username</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                      <Input
                        value={newUsername}
                        onChange={(e) => {
                          setNewUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''));
                          setUsernameError(null);
                        }}
                        placeholder="username"
                        className="h-9 pl-7"
                      />
                    </div>
                    {usernameError && (
                      <p className="text-xs text-destructive mt-1">{usernameError}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSaveProfile}
                      disabled={isSavingProfile}
                      className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-medium flex items-center gap-2"
                    >
                      {isSavingProfile ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      {isSavingProfile ? 'Saving...' : 'Save'}
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCancelEdit}
                      className="px-4 py-2 rounded-xl bg-muted text-sm font-medium flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </motion.button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-lg">{displayName || username || 'User'}</p>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleEditProfile}
                      className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                    >
                      <Edit className="w-4 h-4 text-muted-foreground" />
                    </motion.button>
                  </div>
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
                </>
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
