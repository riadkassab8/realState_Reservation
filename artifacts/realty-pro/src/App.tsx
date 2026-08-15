import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/auth/auth.context";
import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RoleGuard } from "@/components/auth/RoleGuard";
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
import Login from "@/pages/login";
import AccessDenied from "@/pages/access-denied";
import AdminDashboard from "@/pages/dashboard-admin";
import SupervisorDashboard from "@/pages/dashboard-supervisor";
import UserDashboard from "@/pages/dashboard-user";
import MerchantDashboard from "@/pages/dashboard-merchant";
import AdminPropertyNew from "@/pages/admin-property-new";
import AdminProperties from "@/pages/admin-properties";
import AdminUsers from "@/pages/admin-users";
import AdminUserNew from "@/pages/admin-user-new";
import AdminUserEdit from "@/pages/admin-user-edit";
import AdminSupervisors from "@/pages/admin-supervisors";
import AdminSupervisorNew from "@/pages/admin-supervisor-new";
import AdminSupervisorEdit from "@/pages/admin-supervisor-edit";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <ScrollToTop />
      <Switch>
        {/* Public routes */}
        <Route path="/" component={Home} />
        <Route path="/properties" component={Properties} />
        <Route path="/properties/:id" component={PropertyDetail} />
        <Route path="/favorites" component={Favorites} />
        <Route path="/sell-property" component={SellProperty} />
        <Route path="/about" component={About} />
        
        {/* Auth routes */}
        <Route path="/login" component={Login} />
        <Route path="/access-denied" component={AccessDenied} />
        
        {/* Protected routes */}
        <Route path="/admin">
          <ProtectedRoute>
            <RoleGuard allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </RoleGuard>
          </ProtectedRoute>
        </Route>
        
        <Route path="/admin/properties/new">
          <ProtectedRoute>
            <RoleGuard allowedRoles={["ADMIN"]}>
              <AdminPropertyNew />
            </RoleGuard>
          </ProtectedRoute>
        </Route>
        
        <Route path="/admin/properties">
          <ProtectedRoute>
            <RoleGuard allowedRoles={["ADMIN"]}>
              <AdminProperties />
            </RoleGuard>
          </ProtectedRoute>
        </Route>
        
        <Route path="/admin/users">
          <ProtectedRoute>
            <RoleGuard allowedRoles={["ADMIN"]}>
              <AdminUsers />
            </RoleGuard>
          </ProtectedRoute>
        </Route>
        
        <Route path="/admin/users/new">
          <ProtectedRoute>
            <RoleGuard allowedRoles={["ADMIN"]}>
              <AdminUserNew />
            </RoleGuard>
          </ProtectedRoute>
        </Route>
        
        <Route path="/admin/users/:id/edit">
          <ProtectedRoute>
            <RoleGuard allowedRoles={["ADMIN"]}>
              <AdminUserEdit />
            </RoleGuard>
          </ProtectedRoute>
        </Route>
        
        <Route path="/admin/supervisors">
          <ProtectedRoute>
            <RoleGuard allowedRoles={["ADMIN"]}>
              <AdminSupervisors />
            </RoleGuard>
          </ProtectedRoute>
        </Route>
        
        <Route path="/admin/supervisors/new">
          <ProtectedRoute>
            <RoleGuard allowedRoles={["ADMIN"]}>
              <AdminSupervisorNew />
            </RoleGuard>
          </ProtectedRoute>
        </Route>
        
        <Route path="/admin/supervisors/:id/edit">
          <ProtectedRoute>
            <RoleGuard allowedRoles={["ADMIN"]}>
              <AdminSupervisorEdit />
            </RoleGuard>
          </ProtectedRoute>
        </Route>
        
        <Route path="/supervisor">
          <ProtectedRoute>
            <RoleGuard allowedRoles={["ADMIN", "SUPERVISOR"]}>
              <SupervisorDashboard />
            </RoleGuard>
          </ProtectedRoute>
        </Route>
        
        <Route path="/dashboard">
          <ProtectedRoute>
            <RoleGuard allowedRoles={["ADMIN", "SUPERVISOR", "USER", "MERCHANT"]}>
              <UserDashboard />
            </RoleGuard>
          </ProtectedRoute>
        </Route>
        
        <Route path="/merchant">
          <ProtectedRoute>
            <RoleGuard allowedRoles={["ADMIN", "SUPERVISOR", "MERCHANT"]}>
              <MerchantDashboard />
            </RoleGuard>
          </ProtectedRoute>
        </Route>
        
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LanguageProvider>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                <Router />
              </WouterRouter>
              <Toaster />
            </TooltipProvider>
          </QueryClientProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
