import { useUser } from '@/contexts/UserContext';
import { getSessionPhone, loadUserByPhone, listUsers } from '@/lib/demoAuth';
import { truncateHexId } from '@/lib/demoAuth';
import { useEffect, useState } from 'react';
import { Bug, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Dev-only debug panel for verifying demo user persistence.
 * Shows current session state and localStorage data.
 */
export function DebugPanel() {
  const { 
    isAuthenticated, 
    phoneNumber, 
    username, 
    displayName,
    activeRole, 
    walletDisplayId, 
    keyType, 
    keyDisplayId,
    demoMode 
  } = useUser();
  
  const [isOpen, setIsOpen] = useState(false);
  const [sessionPhone, setSessionPhone] = useState<string | null>(null);
  const [usersIndex, setUsersIndex] = useState<string[]>([]);
  const [storedUser, setStoredUser] = useState<any>(null);

  useEffect(() => {
    // Log persistence state on mount
    const phone = getSessionPhone();
    const index = listUsers();
    
    console.log('=== DEMO AUTH DEBUG ===');
    console.log('Session phone:', localStorage.getItem('seedbase:session:phone'));
    console.log('Users index:', localStorage.getItem('seedbase:users:index'));
    
    setSessionPhone(phone);
    setUsersIndex(index);
    
    if (phone) {
      const user = loadUserByPhone(phone);
      console.log('Loaded user from storage:', user);
      setStoredUser(user);
      
      if (user) {
        console.log('User storage key:', `seedbase:user:${phone}`);
        console.log('onboardingComplete:', user.onboardingComplete);
      }
    }
    console.log('=======================');
  }, [isAuthenticated, phoneNumber]);

  // Only show in development
  if (import.meta.env.PROD) return null;

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-24 right-4 z-50 bg-yellow-500/20 border-yellow-500 hover:bg-yellow-500/30"
        onClick={() => setIsOpen(true)}
      >
        <Bug className="h-4 w-4 text-yellow-500" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-24 right-4 z-50 w-80 bg-card border border-border rounded-lg shadow-xl p-4 text-xs font-mono">
      <div className="flex items-center justify-between mb-3">
        <span className="font-bold text-yellow-500 flex items-center gap-2">
          <Bug className="h-4 w-4" />
          Debug Panel
        </span>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsOpen(false)}>
          <X className="h-3 w-3" />
        </Button>
      </div>
      
      <div className="space-y-2">
        <div className="border-b border-border pb-2">
          <p className="text-muted-foreground">Context State:</p>
          <p>isAuthenticated: <span className={isAuthenticated ? 'text-green-500' : 'text-red-500'}>{String(isAuthenticated)}</span></p>
          <p>demoMode: <span className={demoMode ? 'text-yellow-500' : 'text-muted-foreground'}>{String(demoMode)}</span></p>
        </div>
        
        <div className="border-b border-border pb-2">
          <p className="text-muted-foreground">Session:</p>
          <p>Phone: {sessionPhone || '(none)'}</p>
          <p>Username: {username || '(none)'}</p>
          <p>Display: {displayName || '(none)'}</p>
        </div>
        
        <div className="border-b border-border pb-2">
          <p className="text-muted-foreground">Role & Keys:</p>
          <p>Role: <span className="text-primary">{activeRole}</span></p>
          <p>Key Type: {keyType || '(none)'}</p>
          <p>Key ID: {keyDisplayId ? truncateHexId(keyDisplayId) : '(none)'}</p>
        </div>
        
        <div className="border-b border-border pb-2">
          <p className="text-muted-foreground">Wallet:</p>
          <p>ID: {walletDisplayId ? truncateHexId(walletDisplayId) : '(none)'}</p>
        </div>
        
        <div>
          <p className="text-muted-foreground">localStorage:</p>
          <p>Users: {usersIndex.length} registered</p>
          {storedUser && (
            <p>onboardingComplete: <span className={storedUser.onboardingComplete ? 'text-green-500' : 'text-red-500'}>{String(storedUser.onboardingComplete)}</span></p>
          )}
        </div>
      </div>
    </div>
  );
}
