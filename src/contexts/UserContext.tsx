import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, KeyType } from '@/types/seedbase';
import { mockUser } from '@/data/mockData';
import { 
  findUserByPhone, 
  getWalletByUserId, 
  getKeyByUserId,
  type DemoUser,
  type DemoWallet,
  type DemoKey
} from '@/lib/supabase/demoApi';

interface UserContextType {
  user: User;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  viewRole: UserRole;
  setViewRole: (role: UserRole) => void;
  hasKey: (keyType: KeyType) => boolean;
  isKeyActive: (keyType: KeyType) => boolean;
  walkthroughMode: boolean;
  setWalkthroughMode: (enabled: boolean) => void;
  isAuthenticated: boolean;
  phoneNumber: string | null;
  username: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  walletDisplayId: string | null;
  keyDisplayId: string | null;
  keyType: KeyType | null;
  demoMode: boolean;
  login: (phone: string, username: string) => void;
  loginWithUser: (demoUser: DemoUser, wallet?: DemoWallet | null, key?: DemoKey | null) => void;
  loginWithSupabaseUser: (userId: string) => Promise<void>;
  logout: () => void;
  startDemo: () => void;
  refreshUserData: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Session storage key
const SESSION_KEY = 'seedbase-session';

interface SessionData {
  userId: string;
  phone: string;
}

function saveSession(data: SessionData) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(data));
}

function loadSession(): SessionData | null {
  const data = localStorage.getItem(SESSION_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

function clearSessionData() {
  localStorage.removeItem(SESSION_KEY);
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(mockUser);
  const [activeRole, setActiveRole] = useState<UserRole>(mockUser.activeRole);
  const [viewRole, setViewRole] = useState<UserRole>(mockUser.activeRole);
  const [walkthroughMode, setWalkthroughMode] = useState(false);
  
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [walletDisplayId, setWalletDisplayId] = useState<string | null>(null);
  const [keyDisplayId, setKeyDisplayId] = useState<string | null>(null);
  const [keyType, setKeyType] = useState<KeyType | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [isRestoring, setIsRestoring] = useState(true);

  // Restore session from Supabase on mount
  useEffect(() => {
    restoreSession();
  }, []);

  const restoreSession = async () => {
    const session = loadSession();
    
    if (session?.userId) {
      try {
        // Load user data from Supabase
        const dbUser = await findUserByPhone(session.phone);
        
        if (dbUser?.onboarding_complete) {
          const [wallet, key] = await Promise.all([
            getWalletByUserId(dbUser.id),
            getKeyByUserId(dbUser.id),
          ]);
          
          loginWithUser(dbUser, wallet, key);
        }
      } catch (err) {
        console.error('Error restoring session:', err);
        clearSessionData();
      }
    }
    
    setIsRestoring(false);
  };

  const hasKey = (keyType: KeyType) => {
    return user.keys.some(k => k.type === keyType);
  };

  const isKeyActive = (keyType: KeyType) => {
    const key = user.keys.find(k => k.type === keyType);
    return key?.isActive ?? false;
  };

  const handleSetActiveRole = (role: UserRole) => {
    setActiveRole(role);
    setViewRole(role); // Sync viewRole when activeRole changes
    setUser(prev => ({ ...prev, activeRole: role }));
  };

  const handleSetViewRole = (role: UserRole) => {
    setViewRole(role);
  };

  // Simple login (legacy, for backwards compatibility)
  const login = (phone: string, name: string) => {
    setPhoneNumber(phone);
    setUsername(name);
    setDisplayName(name);
    setIsAuthenticated(true);
    setUser(prev => ({ ...prev, name }));
  };

  // Full login with DemoUser data from Supabase
  const loginWithUser = (demoUser: DemoUser, wallet?: DemoWallet | null, key?: DemoKey | null) => {
    setPhoneNumber(demoUser.phone);
    setUsername(demoUser.username);
    setDisplayName(demoUser.display_name);
    setWalletDisplayId(wallet?.display_id || null);
    setKeyDisplayId(key?.display_id || null);
    setKeyType(key?.key_type || null);
    setIsAuthenticated(true);
    setDemoMode(demoUser.phone.startsWith('demo:'));
    
    // Avatar comes from database (Supabase storage URL)
    const avatar = demoUser.avatar_url || null;
    setAvatarUrl(avatar);
    
    // Save session
    saveSession({ userId: demoUser.id, phone: demoUser.phone });
    
    const userRole = demoUser.active_role || 'activator';
    
    // Update user object with new data
    setUser(prev => ({
      ...prev,
      name: demoUser.display_name || demoUser.username,
      avatar: avatar || prev.avatar,
      activeRole: userRole,
      walletBalance: wallet?.balance ?? 25.00,
      keys: prev.keys.map(k => ({
        ...k,
        isActive: k.type === key?.key_type
      }))
    }));
    
    setActiveRole(userRole);
    setViewRole(userRole);
  };

  // Refresh user data from database (after avatar/profile update)
  const refreshUserData = async () => {
    if (phoneNumber) {
      const dbUser = await findUserByPhone(phoneNumber);
      if (dbUser) {
        // Update all user fields from database
        if (dbUser.avatar_url) {
          setAvatarUrl(dbUser.avatar_url);
        }
        if (dbUser.display_name) {
          setDisplayName(dbUser.display_name);
        }
        if (dbUser.username) {
          setUsername(dbUser.username);
        }
        setUser(prev => ({
          ...prev,
          name: dbUser.display_name || dbUser.username || prev.name,
          avatar: dbUser.avatar_url || prev.avatar,
        }));
      }
    }
  };

  // Login with just a user ID (fetch from Supabase)
  const loginWithSupabaseUser = async (userId: string) => {
    try {
      const [wallet, key] = await Promise.all([
        getWalletByUserId(userId),
        getKeyByUserId(userId),
      ]);
      
      // We need to get the user data - this is typically passed from onboarding
      // For now, just set wallet and key info
      if (wallet) {
        setWalletDisplayId(wallet.display_id);
      }
      if (key) {
        setKeyDisplayId(key.display_id);
        setKeyType(key.key_type);
      }
      setIsAuthenticated(true);
    } catch (err) {
      console.error('Error logging in with Supabase user:', err);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setPhoneNumber(null);
    setUsername(null);
    setDisplayName(null);
    setAvatarUrl(null);
    setWalletDisplayId(null);
    setKeyDisplayId(null);
    setKeyType(null);
    setDemoMode(false);
    setViewRole('activator');
    clearSessionData();
  };

  const startDemo = () => {
    // Set demo mode - this will trigger the onboarding flow
    setDemoMode(true);
    setIsAuthenticated(false);
  };

  return (
    <UserContext.Provider value={{
      user,
      activeRole,
      setActiveRole: handleSetActiveRole,
      viewRole,
      setViewRole: handleSetViewRole,
      hasKey,
      isKeyActive,
      walkthroughMode,
      setWalkthroughMode,
      isAuthenticated,
      phoneNumber,
      username,
      displayName,
      avatarUrl,
      walletDisplayId,
      keyDisplayId,
      keyType,
      demoMode,
      login,
      loginWithUser,
      loginWithSupabaseUser,
      logout,
      startDemo,
      refreshUserData,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}