import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, Suspense, lazy } from "react";
import { UserProvider } from "@/contexts/UserContext";
import { seedDemoDataIfEmpty } from "@/lib/supabase/seedDemoData";
import { AppLayout } from "@/components/layout/AppLayout";
import { SeedbaseLoader } from "@/components/shared/SeedbaseLoader";

// Lazy load all pages for code splitting
const ScrollingLandingPage = lazy(() => import("./components/sections/ScrollingLandingPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const SeedbasePage = lazy(() => import("./pages/SeedbasePage"));
const WalletPage = lazy(() => import("./pages/WalletPage"));
const TransactionHistoryPage = lazy(() => import("./pages/TransactionHistoryPage"));
const OneAccordPage = lazy(() => import("./pages/OneAccordPage"));
const VaultPage = lazy(() => import("./pages/VaultPage"));
const SeededPage = lazy(() => import("./pages/SeededPage"));
const LauncherPage = lazy(() => import("./pages/LauncherPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const GovernancePage = lazy(() => import("./pages/GovernancePage"));

const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Seed demo data on first load
seedDemoDataIfEmpty();

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    // Scroll both window and document for maximum compatibility
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Also reset any scrollable main content area
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.scrollTop = 0;
    }
  }, [pathname]);
  return null;
}

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <SeedbaseLoader message="Loading..." />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Landing Page - NO AppLayout */}
              <Route path="/" element={<ScrollingLandingPage />} />
              
              {/* Demo App - WITH AppLayout */}
              <Route path="/app" element={<AppLayout><HomePage /></AppLayout>} />
              <Route path="/app/seedbase" element={<AppLayout><SeedbasePage /></AppLayout>} />
              <Route path="/app/wallet" element={<AppLayout><WalletPage /></AppLayout>} />
              <Route path="/app/wallet/history" element={<AppLayout><TransactionHistoryPage /></AppLayout>} />
              <Route path="/app/oneaccord" element={<AppLayout><OneAccordPage /></AppLayout>} />
              <Route path="/app/vault" element={<AppLayout><VaultPage /></AppLayout>} />
              <Route path="/app/seeded" element={<AppLayout><SeededPage /></AppLayout>} />
              <Route path="/app/launcher" element={<AppLayout><LauncherPage /></AppLayout>} />
              <Route path="/app/settings" element={<AppLayout><SettingsPage /></AppLayout>} />
              <Route path="/app/governance" element={<AppLayout><GovernancePage /></AppLayout>} />
              
              
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
