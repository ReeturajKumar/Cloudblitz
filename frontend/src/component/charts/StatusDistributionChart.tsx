/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import api from "../../services/api";

interface StatusDistributionChartProps {
  refreshTrigger?: number;
}

export const StatusDistributionChart = ({
  refreshTrigger = 0,
}: StatusDistributionChartProps) => {
  const [data, setData] = useState<any[]>([]);

  const COLORS = ["#3b82f6", "#f59e0b", "#10b981"]; // new, in_progress, closed

  useEffect(() => {
    const fetchStatusData = async () => {
      try {
        const res = await api.get("/enquiries?limit=10000&page=1");
        const all = res.data.data || [];

        const active = all.filter((e: any) => !e.deleted);

        const newCount = active.filter((e: any) => e.status === "new").length;
        const progressCount = active.filter(
          (e: any) => e.status === "in_progress"
        ).length;
        const closedCount = active.filter(
          (e: any) => e.status === "closed"
        ).length;

        const total = newCount + progressCount + closedCount;

        const calcPercent = (count: number) =>
          total > 0 ? ((count / total) * 100).toFixed(0) : "0";

        const chartData = [
          {
            label: "New",
            value: newCount,
            color: COLORS[0],
            percent: calcPercent(newCount),
          },
          {
            label: "In Progress",
            value: progressCount,
            color: COLORS[1],
            percent: calcPercent(progressCount),
          },
          {
            label: "Closed",
            value: closedCount,
            color: COLORS[2],
            percent: calcPercent(closedCount),
          },
        ];

        setData(chartData);
      } catch (err) {
        console.error("Failed to fetch status distribution", err);
      }
    };

    fetchStatusData();
  }, [refreshTrigger]);

  return (
    <div
      className="bg-white rounded-xl shadow p-5 w-full select-none"
      style={{ userSelect: "none" }}
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-6">
        Status Distribution
      </h3>

      <div className="flex flex-col items-center justify-center">
        <div
          className="w-full flex justify-center"
          style={{ pointerEvents: "none" }}
        >
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                innerRadius={60}
                outerRadius={90}
                stroke="none"
                isAnimationActive={false}
                labelLine={false}
                labelStyle={{
                  fill: "#475569",
                  fontSize: 12,
                  fontWeight: 500,
                }}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string, props: any) => [
                  `${value} (${props.payload.percent}%)`,
                  props.payload.label,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* ✅ Clean inline legend */}
        <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm">
          {data.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-gray-700 font-medium">
                {item.label}:{" "}
                <span className="text-gray-500">{item.percent}%</span>
              </span>
            </div>
          ))}
        </div>

        {/* ✅ Empty state */}
        {data.every((d) => d.value === 0) && (
          <p className="text-center text-sm text-gray-500 mt-4">
            No enquiries available to display.
          </p>
        )}
      </div>
    </div>
  );
};
