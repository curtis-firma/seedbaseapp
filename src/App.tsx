import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { UserProvider } from "@/contexts/UserContext";
import { seedDemoDataIfEmpty } from "@/lib/supabase/seedDemoData";
import { AppLayout } from "@/components/layout/AppLayout";
import ScrollingLandingPage from "./components/sections/ScrollingLandingPage";
import HomePage from "./pages/HomePage";
import SeedbasePage from "./pages/SeedbasePage";
import WalletPage from "./pages/WalletPage";
import OneAccordPage from "./pages/OneAccordPage";
import VaultPage from "./pages/VaultPage";
import SeededPage from "./pages/SeededPage";
import LauncherPage from "./pages/LauncherPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

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
            {/* Landing page without AppLayout */}
            <Route path="/" element={<ScrollingLandingPage />} />
            
            {/* Demo app routes with AppLayout */}
            <Route path="/app" element={<AppLayout><HomePage /></AppLayout>} />
            <Route path="/seedbase" element={<AppLayout><SeedbasePage /></AppLayout>} />
            <Route path="/wallet" element={<AppLayout><WalletPage /></AppLayout>} />
            <Route path="/oneaccord" element={<AppLayout><OneAccordPage /></AppLayout>} />
            <Route path="/vault" element={<AppLayout><VaultPage /></AppLayout>} />
            <Route path="/seeded" element={<AppLayout><SeededPage /></AppLayout>} />
            <Route path="/launcher" element={<AppLayout><LauncherPage /></AppLayout>} />
            <Route path="/settings" element={<AppLayout><SettingsPage /></AppLayout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
