import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import UserSelectionPage from "../pages/UserSelectionPage";
import SubscriptionDashboardPage from "../pages/SubscriptionDashboardPage";
import OptimizationInsightsPage from "../pages/OptimizationInsightsPage";
import ReportsHistoryPage from "../pages/ReportsHistoryPage";
import RequireUser from "./RequireUser";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/users" element={<UserSelectionPage />} />
      <Route
        path="/dashboard"
        element={
          <RequireUser>
            <SubscriptionDashboardPage />
          </RequireUser>
        }
      />
      <Route
        path="/optimization"
        element={
          <RequireUser>
            <OptimizationInsightsPage />
          </RequireUser>
        }
      />
      <Route
        path="/reports"
        element={
          <RequireUser>
            <ReportsHistoryPage />
          </RequireUser>
        }
      />
    </Routes>
  );
}
