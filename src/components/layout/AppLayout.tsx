import { ReactNode, useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { BottomNav } from './BottomNav';
import { Sidebar } from './Sidebar';
import { MobileDrawer } from './MobileDrawer';
import { QuickActionButton } from '@/components/shared/QuickActionButton';
import { ProfileMenuTrigger } from '@/components/shared/ProfileMenuTrigger';
import { PhoneAuthFlow } from '@/components/onboarding/PhoneAuthFlow';
import { useUser } from '@/contexts/UserContext';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const { isAuthenticated } = useUser();

  // Show auth on first visit if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setShowAuth(true);
    }
  }, [isAuthenticated]);

  // Swipe handlers for opening drawer
  const swipeHandlers = useSwipeable({
    onSwipedRight: (eventData) => {
      // Only open drawer on left edge swipe
      if (eventData.initial[0] < 50) {
        setIsDrawerOpen(true);
      }
    },
    trackMouse: false,
    trackTouch: true,
  });

  const handleAuthComplete = () => {
    setShowAuth(false);
  };

  return (
    <div {...swipeHandlers} className="min-h-screen bg-background">
      <Sidebar />
      <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      
      {/* Mobile Header with Profile Menu Trigger */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 glass-strong border-b border-border/50">
        <div className="px-4 py-3 flex items-center justify-between">
          <ProfileMenuTrigger onOpen={() => setIsDrawerOpen(true)} />
          <span className="font-bold text-lg">Seedbase</span>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </div>
      
      <main className="md:ml-[260px] pt-16 md:pt-0 pb-24 md:pb-0">
        {children}
      </main>
      <BottomNav />
      <QuickActionButton />
      
      {/* Phone Auth Flow */}
      <PhoneAuthFlow isOpen={showAuth} onComplete={handleAuthComplete} />
    </div>
  );
}
