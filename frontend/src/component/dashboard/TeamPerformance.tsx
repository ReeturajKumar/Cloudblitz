/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

interface TeamPerformanceProps {
  refreshTrigger?: number;
}

export const TeamPerformance = ({
  refreshTrigger = 0,
}: TeamPerformanceProps) => {
  const [team, setTeam] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopPerformers = async () => {
      try {
        const res = await api.get("/analytics/top-performers");
        setTeam(res.data.data || []);
      } catch (err) {
        console.error("Failed to load team performance:", err);
      }
    };
    fetchTopPerformers();
  }, [refreshTrigger]); // 🔁 Refresh when trigger changes

  return (
    <div className="bg-white p-5 rounded-xl shadow mt-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Team Performance
          </h3>
          <p className="text-sm text-gray-500">Top performers this week</p>
        </div>
        <button
          onClick={() => navigate("/users")}
          className="text-blue-600 text-sm font-medium hover:underline cursor-pointer"
        >
          View Team
        </button>
      </div>

      {team.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-4">
          No performance data available yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {team.map((member, i) => (
            <div
              key={i}
              className="bg-blue-50 border border-blue-100 p-4 rounded-lg hover:bg-blue-100/50 transition"
            >
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-semibold">
                  {member.name?.slice(0, 2).toUpperCase()}
                </div>
              </div>
              <div className="mt-3 border-t border-blue-100 pt-2">
                <p className="text-xs text-gray-500">Resolved This Week</p>
                <p className="text-2xl font-bold text-blue-600">
                  {member.closedCount}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
