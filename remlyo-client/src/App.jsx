// src/App.jsx
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import HomePage from "./pages/HomePage";
import AilmentsPage from "./pages/AilmentsPage";
import AilmentDetailPage from "./pages/AilmentDetailPage";
import AboutUsPage from "./pages/AboutUsPage";
import RemediesPage from "./pages/RemediesPage";
import CommunityRemedyDetail from "./pages/CommunityRemedyDetail";
import PharmaceuticalRemedyDetail from "./pages/PharmaceuticalRemedyDetail";
import AlternativeRemedyDetail from "./pages/AlternativeRemedyDetail";
import AIRemedyDetail from "./pages/AIRemedyDetail";
import AIInsightPage from "./pages/AIInsightPage";
import PricingPage from "./pages/PricingPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsConditionsPage from "./pages/TermsConditionsPage";
import ContactPage from "./pages/ContactPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import UserDashboardPage from "./pages/UserDashboardPage";
import PremiumDashboardPage from "./pages/PremiumDashboardPage";
import HelpPage from "./pages/HelpPage";
import SavedRemediesPage from "./pages/SavedRemediesPage";
import ManagePlanPage from "./pages/ManagePlanPage";
import SettingsPage from "./pages/SettingsPage";
import HealthProfilePage from "./pages/HealthProfilePage";
import ExtendedHealthProfile from "./pages/ExtendedHealthProfile";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminRoute from "./components/routing/AdminRoute";
import ReportsPage from "./pages/admin/ReportsPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import AddRemedyPage from "./pages/admin/AddRemedyPage";
import RemedyManagementPage from "./pages/admin/RemedyManagementPage";
import UsersManagementPage from "./pages/admin/UsersManagementPage";
import CheckoutPage from "./components/checkout/CheckoutPage";
import RefundPolicyPage from "./pages/RefundPolicyPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import SendEmailVerificationPage from "./pages/SendEmailVerificationPage";
import { UserFlowProvider } from "./contexts/UserFlowContext";
import FlowGuard from "./components/guards/FlowGuard";
import GuestRoute from "./components/routing/GuestRoute";
import AddUserPage from "./pages/admin/AddUserPage";
import ModeratorRoute from "./components/routing/ModeratorRoute";
import ModeratorDashboardPage from "./pages/moderator/ModeratorDashboardPage";
import ModeratorRemedyManagementPage from "./pages/moderator/ModeratorRemedyManagementPage";
import ModeratorCommentPage from "./pages/moderator/ModeratorCommentPage";
import ModeratorFlagPage from "./pages/moderator/ModeratorFlagPage";
import ModeratorUserManagement from "./pages/moderator/ModeratorUserManagement";
import WriterRoutes from "./components/routing/WriterRoutes";
import WriterDashboardPage from "./pages/writer/WriterDashboardPage";
import WriterRemedyManagementPage from "./pages/writer/WriterRemedyMAnagementPage";
import WriterRemedyAddPage from "./pages/writer/WriterAddRemedyPage";
import EditRemedyPage from "./pages/admin/EditRemedyPage";
function App() {
  return (
    <AuthProvider>
      <UserFlowProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/ailments" element={<AilmentsPage />} />
          <Route path="/ailments/:ailmentId" element={<AilmentDetailPage />} />
          <Route path="/remedies" element={<RemediesPage />} />

          {/* Checkout Routes */}
          <Route path="/checkout/:planType" element={<CheckoutPage />} />
          <Route path="/refund-policy" element={<RefundPolicyPage />} />
          {/* Moderator routes */}
          <Route
            path="/moderator/dashboard"
            element={
              <ModeratorRoute>
                <ModeratorDashboardPage />
              </ModeratorRoute>
            }
          />

          <Route
            path="/moderator/remedies"
            element={
              <ModeratorRoute>
                <ModeratorRemedyManagementPage />
              </ModeratorRoute>
            }
          />
          <Route
            path="/moderator/comments"
            element={
              <ModeratorRoute>
                <ModeratorCommentPage />
              </ModeratorRoute>
            }
          />
          <Route
            path="/moderator/flags"
            element={
              <ModeratorRoute>
                <ModeratorFlagPage />
              </ModeratorRoute>
            }
          />
          {/* <Route
            path="/moderator/users"
            element={
              <ModeratorRoute>
                <ModeratorUserManagement />
              </ModeratorRoute>
            }
          /> */}

          {/* Writer Routes */}

          <Route
            path="/writer/dashboard"
            element={
              <WriterRoutes>
                <WriterDashboardPage />
              </WriterRoutes>
            }
          />
          <Route
            path="/writer/remedies"
            element={
              <WriterRoutes>
                <WriterRemedyManagementPage />
              </WriterRoutes>
            }
          />
          <Route
            path="/writer/remedies/add"
            element={
              <WriterRoutes>
                <WriterRemedyAddPage />
              </WriterRoutes>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/remedies/add"
            element={
              <AdminRoute>
                <AddRemedyPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/remedies/:remedyId/edit"
            element={
              <AdminRoute>
                <EditRemedyPage />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/remedies"
            element={
              <AdminRoute>
                <RemedyManagementPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <UsersManagementPage />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/users/add"
            element={
              <AdminRoute>
                <AddUserPage />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/reports"
            element={
              <AdminRoute>
                <ReportsPage />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/settings"
            element={
              <AdminRoute>
                <AdminSettingsPage />
              </AdminRoute>
            }
          />

          {/* Remedy Detail Routes - Type based */}
          <Route
            path="/remedies/community/:remedyId"
            element={<CommunityRemedyDetail />}
          />
          <Route
            path="/remedies/alternative/:remedyId"
            element={<AlternativeRemedyDetail />}
          />
          <Route
            path="/remedies/pharmaceutical/:remedyId"
            element={<PharmaceuticalRemedyDetail />}
          />
          <Route path="/remedies/ai/:remedyId" element={<AIRemedyDetail />} />

          {/* Generic remedy route that will dispatch to the correct type */}
          <Route
            path="/remedies/:remedyId"
            element={<CommunityRemedyDetail />}
          />

          {/* AI Insight Route */}
          <Route path="/ai-insight/:remedyId" element={<AIInsightPage />} />

          {/* Other Public Routes */}
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsConditionsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/health-profile" element={<HealthProfilePage />} />
          <Route
            path="/extended-health-profile"
            element={<ExtendedHealthProfile />}
          />

          {/* User Settings Routes */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute requiredSubscription="free">
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notification-settings"
            element={
              <ProtectedRoute requiredSubscription="free">
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/privacy-settings"
            element={
              <ProtectedRoute requiredSubscription="free">
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/remedies/community/:remedyId"
            element={
              <CommunityRemedyDetail
                sourceType="ailment"
                ailmentId="migraine"
              />
            }
          />

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredSubscription="free">
                <FlowGuard>
                  <UserDashboardPage />
                </FlowGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/premium-dashboard"
            element={
              <ProtectedRoute requiredSubscription="premium">
                <PremiumDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved-remedies"
            element={
              <ProtectedRoute requiredSubscription="free">
                <SavedRemediesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-plan"
            element={
              <ProtectedRoute requiredSubscription="free">
                <ManagePlanPage />
              </ProtectedRoute>
            }
          />

          {/* Auth routes */}
          <Route
            path="/signin"
            element={
              <GuestRoute>
                <SignInPage />
              </GuestRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <GuestRoute>
                <SignUpPage />
              </GuestRoute>
            }
          />

          <Route
            path="/verify-email/:token"
            element={
              // <GuestRoute>
              // <FlowGuard>
                <VerifyEmailPage />
              // </FlowGuard>
              // </GuestRoute>
            }
          />
          <Route
            path="/verify-email"
            element={
              // <GuestRoute>
              // <FlowGuard>
                <SendEmailVerificationPage />
              // </FlowGuard>
              // </GuestRoute>
            }
          />
          {/* Fallback for 404 */}
          <Route
            path="*"
            element={<div className="p-10 text-center">Page not found</div>}
          />
        </Routes>
      </UserFlowProvider>
    </AuthProvider>
  );
}

export default App;
