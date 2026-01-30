import { ReactNode, useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { BottomNav } from './BottomNav';
import { Sidebar } from './Sidebar';
import { MobileDrawer } from './MobileDrawer';
import { PageTransition } from './PageTransition';
import { QuickActionButton } from '@/components/shared/QuickActionButton';
import { ProfileMenuTrigger } from '@/components/shared/ProfileMenuTrigger';
import { PhoneAuthFlow } from '@/components/onboarding/PhoneAuthFlow';
import { WelcomeWalkthrough } from '@/components/onboarding/WelcomeWalkthrough';
import { OnboardingModal } from '@/components/shared/OnboardingModal';
import { TutorialOverlay, useShouldShowTutorial } from '@/components/shared/TutorialOverlay';
import { ViewingAsBadge } from '@/components/shared/ViewRoleBadge';
import { Logo } from '@/components/shared/Logo';
import { useUser } from '@/contexts/UserContext';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { cn } from '@/lib/utils';

const TUTORIAL_FIRST_LOGIN_KEY = 'seedbase-first-login-tutorial-pending';

interface AppLayoutProps {
  children: ReactNode;
  onShowWalkthrough?: () => void;
}

export function AppLayout({ children, onShowWalkthrough }: AppLayoutProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [forceDemo, setForceDemo] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const shouldShowTutorial = useShouldShowTutorial();
  const { isAuthenticated, demoMode } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Scroll to top on route change
  useScrollToTop();

  // Redirect to landing page if not authenticated (remove floating auth popup)
  useEffect(() => {
    if (!isAuthenticated && !demoMode) {
      navigate('/');
    }
  }, [isAuthenticated, demoMode, navigate]);

  // Listen for walkthrough trigger from other components (e.g., HomePage HelpCircle)
  useEffect(() => {
    const handleShowWalkthroughEvent = () => {
      setShowWalkthrough(true);
    };
    
    window.addEventListener('show-walkthrough', handleShowWalkthroughEvent);
    return () => window.removeEventListener('show-walkthrough', handleShowWalkthroughEvent);
  }, []);

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

  const handleAuthComplete = (isNewUser?: boolean) => {
    setShowAuth(false);
    setForceDemo(false);
    
    // Auto-show welcome walkthrough for NEW users who haven't seen it
    if (isNewUser && !localStorage.getItem('seedbase-welcome-seen')) {
      setShowWelcome(true);
      // Mark tutorial as pending for after welcome completes
      localStorage.setItem(TUTORIAL_FIRST_LOGIN_KEY, 'true');
    }
    
    // User is already at /app/* route - no navigation needed
    // They stay on the current page after auth
  };

  const handleWelcomeComplete = (showFull?: boolean) => {
    localStorage.setItem('seedbase-welcome-seen', 'true');
    setShowWelcome(false);
    
    // If user clicked "Learn More", show full walkthrough
    if (showFull) {
      setShowWalkthrough(true);
    } else {
      // Check if tutorial should show (first login only)
      const isPendingTutorial = localStorage.getItem(TUTORIAL_FIRST_LOGIN_KEY);
      if (isPendingTutorial && shouldShowTutorial) {
        // Small delay for smooth transition
        setTimeout(() => setShowTutorial(true), 300);
      }
    }
  };

  const handleShowWalkthrough = () => {
    setShowWalkthrough(true);
  };

  const handleCloseWalkthrough = () => {
    setShowWalkthrough(false);
    
    // Check if tutorial should show after walkthrough closes (first login only)
    const isPendingTutorial = localStorage.getItem(TUTORIAL_FIRST_LOGIN_KEY);
    if (isPendingTutorial && shouldShowTutorial) {
      setTimeout(() => setShowTutorial(true), 300);
    }
  };

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    // Clear the pending flag so tutorial never shows again
    localStorage.removeItem(TUTORIAL_FIRST_LOGIN_KEY);
  };

  return (
    <div {...swipeHandlers} className="min-h-screen bg-background">
      <Sidebar />
      <MobileDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        onShowWalkthrough={handleShowWalkthrough}
      />
      
      {/* View Role Badge */}
      <ViewingAsBadge />
      
      {/* Mobile Header with Profile Menu Trigger */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-xl border-b border-border/50">
        <div className="px-4 py-3 flex items-center justify-between">
          {/* Left: Profile pill */}
          <ProfileMenuTrigger onOpen={() => setIsDrawerOpen(true)} />
          
          {/* Right: Logo + Message icon */}
          <div className="flex items-center gap-3">
            <Logo variant="combined" size="sm" />
            <motion.button
              onClick={() => navigate('/app/oneaccord')}
              className={cn(
                "relative p-2 rounded-xl transition-colors",
                location.pathname === '/app/oneaccord' 
                  ? "bg-primary/10" 
                  : "bg-gradient-to-r from-primary/10 to-purple-500/10"
              )}
              whileTap={{ scale: 0.95 }}
            >
              <MessageCircle 
                className={cn(
                  "h-5 w-5",
                  location.pathname === '/app/oneaccord' ? "text-primary" : "text-primary"
                )} 
              />
              {location.pathname !== '/app/oneaccord' && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full" />
              )}
            </motion.button>
          </div>
        </div>
      </div>
      
      <main className="md:ml-[260px] pt-16 md:pt-0 pb-24 md:pb-0">
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            {children}
          </PageTransition>
        </AnimatePresence>
      </main>
      <BottomNav />
      <QuickActionButton />
      
      {/* Phone Auth Flow */}
      <PhoneAuthFlow isOpen={showAuth} onComplete={handleAuthComplete} forceDemo={forceDemo} />
      
      {/* Welcome Walkthrough (first login - auto) */}
      <WelcomeWalkthrough isOpen={showWelcome} onComplete={handleWelcomeComplete} />
      
      {/* Full Onboarding Modal (manual / help mode) */}
      <OnboardingModal isOpen={showWalkthrough} onClose={handleCloseWalkthrough} />
      
      {/* Tutorial Overlay (first login only) */}
      <TutorialOverlay isOpen={showTutorial} onComplete={handleTutorialComplete} />
    </div>
  );
}
