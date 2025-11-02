import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TitleScreen from "./pages/TitleScreen";
import StoryPage from "./pages/StoryPage";
import DetectiveName from "./pages/DetectiveName";
import IntroPage from "./pages/IntroPage";
import LevelPage from "./pages/LevelPage";
import FinalPage from "./pages/FinalPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TitleScreen />} />
          <Route path="/story" element={<StoryPage />} />
          <Route path="/detective-name" element={<DetectiveName />} />
          <Route path="/intro" element={<IntroPage />} />
          <Route path="/level/:levelNum" element={<LevelPage />} />
          <Route path="/final" element={<FinalPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
