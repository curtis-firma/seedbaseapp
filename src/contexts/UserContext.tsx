import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole, KeyType } from '@/types/seedbase';
import { mockUser } from '@/data/mockData';

interface UserContextType {
  user: User;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  hasKey: (keyType: KeyType) => boolean;
  isKeyActive: (keyType: KeyType) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(mockUser);
  const [activeRole, setActiveRole] = useState<UserRole>(mockUser.activeRole);

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

  return (
    <UserContext.Provider value={{
      user,
      activeRole,
      setActiveRole: handleSetActiveRole,
      hasKey,
      isKeyActive,
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
