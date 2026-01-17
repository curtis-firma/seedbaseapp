import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { UserProvider } from "@/contexts/UserContext";
import { seedDemoDataIfEmpty } from "@/lib/supabase/seedDemoData";
import { AppLayout } from "@/components/layout/AppLayout";

// Pages
import HomePage from "./pages/HomePage";
import SeedbasePage from "./pages/SeedbasePage";
import WalletPage from "./pages/WalletPage";
import TransactionHistoryPage from "./pages/TransactionHistoryPage";
import OneAccordPage from "./pages/OneAccordPage";
import VaultPage from "./pages/VaultPage";
import SeededPage from "./pages/SeededPage";
import LauncherPage from "./pages/LauncherPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

// Landing Page (outside AppLayout)
import ScrollingLandingPage from "./components/sections/ScrollingLandingPage";

const queryClient = new QueryClient();

// Seed demo data on first load
seedDemoDataIfEmpty();

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
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
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
