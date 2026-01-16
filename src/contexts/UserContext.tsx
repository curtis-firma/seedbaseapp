import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, KeyType } from '@/types/seedbase';
import { mockUser } from '@/data/mockData';
import { 
  DemoUser, loadUserByPhone, getSessionPhone, clearSession, 
  setSessionPhone, getKeyTypeFromRole 
} from '@/lib/demoAuth';

interface UserContextType {
  user: User;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  hasKey: (keyType: KeyType) => boolean;
  isKeyActive: (keyType: KeyType) => boolean;
  walkthroughMode: boolean;
  setWalkthroughMode: (enabled: boolean) => void;
  isAuthenticated: boolean;
  phoneNumber: string | null;
  username: string | null;
  displayName: string | null;
  walletDisplayId: string | null;
  keyDisplayId: string | null;
  keyType: KeyType | null;
  demoMode: boolean;
  login: (phone: string, username: string) => void;
  loginWithUser: (demoUser: DemoUser) => void;
  logout: () => void;
  startDemo: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(mockUser);
  const [activeRole, setActiveRole] = useState<UserRole>(mockUser.activeRole);
  const [walkthroughMode, setWalkthroughMode] = useState(false);
  
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [walletDisplayId, setWalletDisplayId] = useState<string | null>(null);
  const [keyDisplayId, setKeyDisplayId] = useState<string | null>(null);
  const [keyType, setKeyType] = useState<KeyType | null>(null);
  const [demoMode, setDemoMode] = useState(false);

  // Restore session on mount
  useEffect(() => {
    const sessionPhone = getSessionPhone();
    if (sessionPhone) {
      const existingUser = loadUserByPhone(sessionPhone);
      if (existingUser?.onboardingComplete) {
        loginWithUser(existingUser);
      }
    }
  }, []);

  const hasKey = (keyType: KeyType) => {
    return user.keys.some(k => k.type === keyType);
  };

  const isKeyActive = (keyType: KeyType) => {
    const key = user.keys.find(k => k.type === keyType);
    return key?.isActive ?? false;
  };

  const handleSetActiveRole = (role: UserRole) => {
    setActiveRole(role);
    setUser(prev => ({ ...prev, activeRole: role }));
  };

  // Simple login (legacy, for backwards compatibility)
  const login = (phone: string, name: string) => {
    setPhoneNumber(phone);
    setUsername(name);
    setDisplayName(name);
    setIsAuthenticated(true);
    setUser(prev => ({ ...prev, name }));
  };

  // Full login with DemoUser data
  const loginWithUser = (demoUser: DemoUser) => {
    setPhoneNumber(demoUser.phone);
    setUsername(demoUser.username);
    setDisplayName(demoUser.displayName);
    setWalletDisplayId(demoUser.walletDisplayId);
    setKeyDisplayId(demoUser.keyDisplayId);
    setKeyType(demoUser.keyType);
    setIsAuthenticated(true);
    setDemoMode(demoUser.phone.startsWith('demo:'));
    
    // Update user object with new data
    setUser(prev => ({
      ...prev,
      name: demoUser.displayName || demoUser.username,
      activeRole: demoUser.role,
      keys: prev.keys.map(k => ({
        ...k,
        isActive: k.type === demoUser.keyType
      }))
    }));
    
    setActiveRole(demoUser.role);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setPhoneNumber(null);
    setUsername(null);
    setDisplayName(null);
    setWalletDisplayId(null);
    setKeyDisplayId(null);
    setKeyType(null);
    setDemoMode(false);
    clearSession();
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
      hasKey,
      isKeyActive,
      walkthroughMode,
      setWalkthroughMode,
      isAuthenticated,
      phoneNumber,
      username,
      displayName,
      walletDisplayId,
      keyDisplayId,
      keyType,
      demoMode,
      login,
      loginWithUser,
      logout,
      startDemo,
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
