/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import api from "../../services/api";

interface ChartData {
  day: string;
  enquiries: number;
  closed: number;
}

interface WeeklyTrendChartProps {
  refreshTrigger?: number;
}

export const WeeklyTrendChart = ({
  refreshTrigger = 0,
}: WeeklyTrendChartProps) => {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWeeklyData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/enquiries?limit=10000&page=1");
      const all = res.data.data || [];

      const active = all.filter((e: any) => !e.deleted);
      const last7Days = Array.from({ length: 7 }).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));

        const dayLabel = date.toLocaleDateString("en-US", {
          weekday: "short",
        });

        // Helper for date-only comparison
        const isSameDay = (d1: Date, d2: Date) =>
          d1.getDate() === d2.getDate() &&
          d1.getMonth() === d2.getMonth() &&
          d1.getFullYear() === d2.getFullYear();

        // Count created vs closed on that date
        const enquiries = active.filter((e: any) =>
          isSameDay(new Date(e.createdAt), date)
        ).length;

        const closed = active.filter(
          (e: any) =>
            isSameDay(new Date(e.updatedAt), date) && e.status === "closed"
        ).length;

        return { day: dayLabel, enquiries, closed };
      });

      setData(last7Days);
    } catch (err) {
      console.error("Failed to fetch weekly trend:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeeklyData();
  }, [refreshTrigger]);

  return (
    <div className="bg-white rounded-xl shadow p-5 w-full select-none">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Weekly Enquiries Trend
          </h3>
          <p className="text-sm text-gray-500">Enquiries received vs closed</p>
        </div>
        <select
          disabled
          className="border rounded-md px-2 py-1 text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
        >
          <option>Last 7 days</option>
        </select>
      </div>

      {loading ? (
        <p className="text-gray-500 animate-pulse text-center mt-8">
          Loading chart...
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart
            data={data}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                borderRadius: "10px",
                border: "1px solid #ddd",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Area
              type="monotone"
              dataKey="enquiries"
              stroke="#3b82f6"
              fill="#93c5fd"
              fillOpacity={0.35}
              strokeWidth={2}
              isAnimationActive
            />
            <Area
              type="monotone"
              dataKey="closed"
              stroke="#10b981"
              fill="#6ee7b7"
              fillOpacity={0.35}
              strokeWidth={2}
              isAnimationActive
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
