import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Layout } from "@/components/layout/Layout";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);
  return null;
}

// Import pages
import Home from "@/pages/home";
import Properties from "@/pages/properties";
import PropertyDetail from "@/pages/property-detail";
import Favorites from "@/pages/favorites";
import About from "@/pages/about";
import SellProperty from "@/pages/sell-property";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/properties" component={Properties} />
        <Route path="/properties/:id" component={PropertyDetail} />
        <Route path="/favorites" component={Favorites} />
        <Route path="/sell-property" component={SellProperty} />
        <Route path="/about" component={About} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LanguageProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </QueryClientProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
