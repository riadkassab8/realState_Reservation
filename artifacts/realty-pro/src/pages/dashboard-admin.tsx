import { useLanguage } from "@/contexts/LanguageContext";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminStats } from "@/components/admin/AdminStats";
import { AdminPerformanceChart } from "@/components/admin/AdminPerformanceChart";
import { AdminPropertyOverview } from "@/components/admin/AdminPropertyOverview";
import { AdminUsersTable } from "@/components/admin/AdminUsersTable";
import { AdminMerchantOverview } from "@/components/admin/AdminMerchantOverview";
import { AdminReviewQueue } from "@/components/admin/AdminReviewQueue";
import { AdminActivity } from "@/components/admin/AdminActivity";
import { AdminQuickActions } from "@/components/admin/AdminQuickActions";
import { AdminSystemHealth } from "@/components/admin/AdminSystemHealth";

export default function AdminDashboard() {
  const { t, language } = useLanguage();
  const dir = language === "ar" ? "rtl" : "ltr";

  return (
    <div dir={dir} className="min-h-screen bg-background">
      {/* Header */}
      <AdminHeader />

      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* KPI Stats */}
            <AdminStats />

            {/* Performance Chart */}
            <AdminPerformanceChart />

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AdminPropertyOverview />
              <AdminReviewQueue />
            </div>

            {/* Users Table */}
            <AdminUsersTable />

            {/* Merchant Overview */}
            <AdminMerchantOverview />

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AdminActivity />
              <AdminQuickActions />
            </div>

            {/* System Health */}
            <AdminSystemHealth />
          </div>
        </main>
      </div>
    </div>
  );
}
