import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole, KeyType } from '@/types/seedbase';
import { mockUser } from '@/data/mockData';

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
  login: (phone: string, username: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(mockUser);
  const [activeRole, setActiveRole] = useState<UserRole>(mockUser.activeRole);
  const [walkthroughMode, setWalkthroughMode] = useState(false);
  
  // Auth state - check localStorage for existing session
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('seedbase-authenticated') === 'true';
  });
  const [phoneNumber, setPhoneNumber] = useState<string | null>(() => {
    return localStorage.getItem('seedbase-phone');
  });
  const [username, setUsername] = useState<string | null>(() => {
    return localStorage.getItem('seedbase-username');
  });

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

  const login = (phone: string, name: string) => {
    setPhoneNumber(phone);
    setUsername(name);
    setIsAuthenticated(true);
    localStorage.setItem('seedbase-authenticated', 'true');
    localStorage.setItem('seedbase-phone', phone);
    localStorage.setItem('seedbase-username', name);
    // Update user with the new username
    setUser(prev => ({ ...prev, name }));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setPhoneNumber(null);
    setUsername(null);
    localStorage.removeItem('seedbase-authenticated');
    localStorage.removeItem('seedbase-phone');
    localStorage.removeItem('seedbase-username');
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
      login,
      logout,
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
