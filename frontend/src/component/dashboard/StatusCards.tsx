/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState, useCallback, type JSX } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import {
  CheckCircle,
  MessageSquare,
  Activity,
  ClipboardList,
} from "lucide-react";

interface Stat {
  title: string;
  value: number;
  change: number;
  color: string;
  icon: JSX.Element;
}

export function StatusOverview({ refreshTrigger }: { refreshTrigger: number }) {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get("/enquiries?limit=10000&page=1");

      const all = res.data.data || [];
      const active = all.filter((e: any) => !e.deleted);

      const inProgressCount = active.filter(
        (e: any) => e.status === "in_progress"
      ).length;

      const closedCount = active.filter(
        (e: { status: string }) => e.status === "closed"
      ).length;

      const total = active.length;

      // Date logic
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      const todayDate = today.toDateString();
      const yesterdayDate = yesterday.toDateString();

      const newToday = active.filter(
        (e: any) => new Date(e.createdAt).toDateString() === todayDate
      ).length;

      const newYesterday = active.filter(
        (e: any) => new Date(e.createdAt).toDateString() === yesterdayDate
      ).length;

      const calcChange = (today: number, yesterday: number) => {
        if (yesterday === 0) return today > 0 ? 100 : 0;
        return ((today - yesterday) / yesterday) * 100;
      };

      const updatedStats: Stat[] = [
        {
          title: "Total Enquiries",
          value: total,
          change: calcChange(total, 0),
          color: "from-blue-500 to-indigo-500",
          icon: <ClipboardList size={20} />,
        },
        {
          title: "New Today",
          value: newToday,
          change: calcChange(newToday, newYesterday),
          color: "from-pink-500 to-fuchsia-500",
          icon: <MessageSquare size={20} />,
        },
        {
          title: "In Progress",
          value: inProgressCount,
          change: calcChange(inProgressCount, 0),
          color: "from-orange-400 to-yellow-500",
          icon: <Activity size={20} />,
        },
        {
          title: "Closed Enquiries",
          value: closedCount,
          change: calcChange(closedCount, 0),
          color: "from-green-500 to-emerald-600",
          icon: <CheckCircle size={20} />,
        },
      ];

      setStats(updatedStats);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch stats");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [refreshTrigger, fetchStats]);

  if (loading) {
    return <p className="text-gray-500 animate-pulse">Loading statistics...</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((card) => (
        <div
          key={card.title}
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">{card.title}</p>
              <h3 className="text-3xl font-bold">{card.value}</h3>
            </div>
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full text-white bg-gradient-to-r ${card.color}`}
            >
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
