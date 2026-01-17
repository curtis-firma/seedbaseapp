import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollingLandingPage from "./components/sections/ScrollingLandingPage";

/**
 * Minimal app shell for standalone landing page deployment.
 * No Supabase, no auth, no QueryClient.
 */
const LandingApp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ScrollingLandingPage />} />
        {/* Catch-all redirects to landing */}
        <Route path="*" element={<ScrollingLandingPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default LandingApp;
