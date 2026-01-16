import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { UserProvider } from "@/contexts/UserContext";
import { AppLayout } from "@/components/layout/AppLayout";
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
          <AppLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/seedbase" element={<SeedbasePage />} />
              <Route path="/wallet" element={<WalletPage />} />
              <Route path="/oneaccord" element={<OneAccordPage />} />
              <Route path="/vault" element={<VaultPage />} />
              <Route path="/seeded" element={<SeededPage />} />
              <Route path="/launcher" element={<LauncherPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
