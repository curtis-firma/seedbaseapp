import { ReactNode, useState, useEffect } from 'react';
import { BottomNav } from './BottomNav';
import { Sidebar } from './Sidebar';
import { MobileDrawer } from './MobileDrawer';
import { QuickActionButton } from '@/components/shared/QuickActionButton';
import { OnboardingModal } from '@/components/shared/OnboardingModal';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Show onboarding on first visit
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('seedbase-onboarding-seen');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('seedbase-onboarding-seen', 'true');
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      <main className="md:ml-[260px] pb-24 md:pb-0">
        {children}
      </main>
      <BottomNav onMenuClick={() => setIsDrawerOpen(true)} />
      <QuickActionButton />
      <OnboardingModal isOpen={showOnboarding} onClose={handleCloseOnboarding} />
    </div>
  );
}
