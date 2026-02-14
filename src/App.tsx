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
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
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
              
              {/* Demo App - Persistent AppLayout via Outlet */}
              <Route path="/app" element={<AppLayout />}>
                <Route index element={<HomePage />} />
                <Route path="seedbase" element={<SeedbasePage />} />
                <Route path="wallet" element={<WalletPage />} />
                <Route path="wallet/history" element={<TransactionHistoryPage />} />
                <Route path="oneaccord" element={<OneAccordPage />} />
                <Route path="vault" element={<VaultPage />} />
                <Route path="seeded" element={<SeededPage />} />
                <Route path="launcher" element={<LauncherPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="governance" element={<GovernancePage />} />
              </Route>
              
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
