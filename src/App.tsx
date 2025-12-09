import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Browse from "./pages/Browse";
import Organizations from "./pages/Organizations";
import HowItWorks from "./pages/HowItWorks";
import Auth from "./pages/Auth";
import ItemRequests from "./pages/ItemRequests";
import ImpactStories from "./pages/ImpactStories";
import Crowdfunding from "./pages/Crowdfunding";
import VolunteerEvents from "./pages/VolunteerEvents";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminOrganizations from "./pages/admin/Organizations";
import AdminCategories from "./pages/admin/Categories";
import AdminVerifications from "./pages/admin/Verifications";
import AdminItemRequestModeration from "./pages/admin/ItemRequestModeration";
import OrganizationDashboard from "./pages/organization/Dashboard";
import OrganizationProfile from "./pages/organization/Profile";
import OrganizationCategories from "./pages/organization/Categories";
import OrganizationCrowdfunding from "./pages/organization/Crowdfunding";
import OrganizationVolunteerEvents from "./pages/organization/VolunteerEvents";
import BeneficiaryItemRequests from "./pages/beneficiary/ItemRequests";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/organizations" element={<Organizations />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/item-requests" element={<ItemRequests />} />
            <Route path="/impact-stories" element={<ImpactStories />} />
            <Route path="/crowdfunding" element={<Crowdfunding />} />
            <Route path="/volunteer" element={<VolunteerEvents />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Beneficiary Routes */}
            <Route path="/beneficiary/requests" element={
              <ProtectedRoute allowedRoles={['beneficiary']}>
                <BeneficiaryItemRequests />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminUsers />
              </ProtectedRoute>
            } />
            <Route path="/admin/organizations" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminOrganizations />
              </ProtectedRoute>
            } />
            <Route path="/admin/categories" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminCategories />
              </ProtectedRoute>
            } />
            <Route path="/admin/verifications" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminVerifications />
              </ProtectedRoute>
            } />
            <Route path="/admin/item-requests" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminItemRequestModeration />
              </ProtectedRoute>
            } />

            {/* Organization Routes */}
            <Route path="/organization" element={
              <ProtectedRoute allowedRoles={['organization']}>
                <OrganizationDashboard />
              </ProtectedRoute>
            } />
            <Route path="/organization/profile" element={
              <ProtectedRoute allowedRoles={['organization']}>
                <OrganizationProfile />
              </ProtectedRoute>
            } />
            <Route path="/organization/categories" element={
              <ProtectedRoute allowedRoles={['organization']}>
                <OrganizationCategories />
              </ProtectedRoute>
            } />
            <Route path="/organization/crowdfunding" element={
              <ProtectedRoute allowedRoles={['organization']}>
                <OrganizationCrowdfunding />
              </ProtectedRoute>
            } />
            <Route path="/organization/volunteer-events" element={
              <ProtectedRoute allowedRoles={['organization']}>
                <OrganizationVolunteerEvents />
              </ProtectedRoute>
            } />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
