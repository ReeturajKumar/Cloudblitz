/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import api from "../../services/api";
import { formatDistanceToNow } from "date-fns";

interface RecentActivityProps {
  refreshTrigger?: number;
}

export const RecentActivity = ({ refreshTrigger = 0 }: RecentActivityProps) => {
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await api.get("/enquiries");
        const all = res.data.data || [];
        const active = all.filter((e: any) => !e.deleted);

        const mapped = active
          .sort(
            (a: any, b: any) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )
          .slice(0, 5)
          .map((e: any) => ({
            user: e.assignedTo?.name || "System",
            action:
              e.status === "closed"
                ? "Closed enquiry"
                : e.status === "in_progress"
                ? "Updated status"
                : "New enquiry received",
            target: e.customerName,
            time: e.updatedAt || e.createdAt,
          }));

        setActivities(mapped);
      } catch (err) {
        console.error("Failed to fetch recent activity:", err);
      }
    };
    fetchActivity();
  }, [refreshTrigger]);

  return (
    <div className="bg-white rounded-xl shadow p-5 select-none">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Recent Activity
          </h3>
          <p className="text-sm text-gray-500">Latest system updates</p>
        </div>
      </div>

      {activities.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-6">
          No recent activity
        </p>
      ) : (
        <ul className="divide-y">
          {activities.map((a, i) => (
            <li key={i} className="py-3 flex items-start gap-3">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-medium ${
                  a.action.includes("Closed")
                    ? "bg-green-500"
                    : a.action.includes("Updated")
                    ? "bg-blue-500"
                    : "bg-orange-400"
                }`}
              >
                {a.user?.[0]?.toUpperCase() || "S"}
              </div>
              <div>
                <p className="text-sm text-gray-800">
                  <span className="font-medium">{a.user}</span> {a.action}
                </p>
                <p className="text-xs text-gray-500">from {a.target}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatDistanceToNow(new Date(a.time), { addSuffix: true })}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
