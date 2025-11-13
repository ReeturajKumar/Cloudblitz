import { useState, useCallback } from "react";
import { NewEnquiryDialog } from "../../component/enquiry/NewEnquiryDialog";
import { useAuth } from "../../context/useAuth";

import { WeeklyTrendChart } from "../../component/charts/WeeklyTrendChart";
import { StatusDistributionChart } from "../../component/charts/StatusDistributionChart";
import { RecentEnquiries } from "../../component/dashboard/RecentEnquiries";
import { RecentActivity } from "../../component/dashboard/RecentActivity";
import { TeamPerformance } from "../../component/dashboard/TeamPerformance";
import { StatusOverview } from "../../component/dashboard/StatusCards";

const Dashboard = () => {
  const { user } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshAll = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">
            Welcome back, {user?.name || "User"}
          </h2>
          <p className="text-gray-600">
            Here’s what’s happening with your enquiries today.
          </p>
        </div>

        {user?.role === "admin" && <NewEnquiryDialog onCreated={refreshAll} />}
      </div>

      <StatusOverview refreshTrigger={refreshTrigger} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
        <div className="lg:col-span-3">
          <WeeklyTrendChart refreshTrigger={refreshTrigger} />
        </div>
        <div className="lg:col-span-1">
          <StatusDistributionChart refreshTrigger={refreshTrigger} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <RecentEnquiries
            onUpdated={refreshAll}
            refreshTrigger={refreshTrigger}
          />
        </div>

        <div className="lg:col-span-1">
          <RecentActivity refreshTrigger={refreshTrigger} />
        </div>
      </div>

      {user?.role === "admin" && (
        <TeamPerformance refreshTrigger={refreshTrigger} />
      )}
    </div>
  );
};

export default Dashboard;
